'use client';import {useState,useRef} from 'react';import ToolShell from './ToolShell';

function encodeWav(buffer:AudioBuffer):Blob{
 const numCh=buffer.numberOfChannels,sampleRate=buffer.sampleRate,length=buffer.length*numCh*2+44;
 const arrBuf=new ArrayBuffer(length);const view=new DataView(arrBuf);
 const writeStr=(offset:number,s:string)=>{for(let i=0;i<s.length;i++)view.setUint8(offset+i,s.charCodeAt(i))};
 writeStr(0,'RIFF');view.setUint32(4,36+buffer.length*numCh*2,true);writeStr(8,'WAVE');
 writeStr(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,numCh,true);
 view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*numCh*2,true);view.setUint16(32,numCh*2,true);view.setUint16(34,16,true);
 writeStr(36,'data');view.setUint32(40,buffer.length*numCh*2,true);
 let offset=44;
 const channels=Array.from({length:numCh},(_,i)=>buffer.getChannelData(i));
 for(let i=0;i<buffer.length;i++){
  for(let ch=0;ch<numCh;ch++){
   const s=Math.max(-1,Math.min(1,channels[ch][i]));
   view.setInt16(offset,s<0?s*0x8000:s*0x7fff,true);offset+=2;
  }
 }
 return new Blob([arrBuf],{type:'audio/wav'});
}

export function VideoToGifConverter(){
 const[file,setFile]=useState<File|null>(null);const[url,setUrl]=useState('');
 const[start,setStart]=useState(0);const[end,setEnd]=useState(3);const[fps,setFps]=useState(8);const[scale,setScale]=useState(320);
 const[busy,setBusy]=useState(false);const[progress,setProgress]=useState(0);const[gifUrl,setGifUrl]=useState('');
 const videoRef=useRef<HTMLVideoElement>(null);

 const onFile=(f:File)=>{setFile(f);setUrl(URL.createObjectURL(f));setGifUrl('')};

 const generate=async()=>{
  const video=videoRef.current;if(!video)return;
  setBusy(true);setProgress(0);setGifUrl('');
  try{
   const GIF=(await import('gif.js.optimized')).default;
   const w=scale,h=Math.round(scale*(video.videoHeight/video.videoWidth||0.5625));
   const gif=new GIF({workers:2,quality:10,width:w,height:h,workerScript:'/gif.worker.js'});
   const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
   const ctx=canvas.getContext('2d')!;
   const frameCount=Math.max(1,Math.round((end-start)*fps));
   for(let i=0;i<frameCount;i++){
    const t=start+i/fps;
    await new Promise<void>(resolve=>{
     const onSeeked=()=>{video.removeEventListener('seeked',onSeeked);resolve()};
     video.addEventListener('seeked',onSeeked);
     video.currentTime=Math.min(t,video.duration-0.01);
    });
    ctx.drawImage(video,0,0,w,h);
    gif.addFrame(canvas,{copy:true,delay:1000/fps});
    setProgress(Math.round(((i+1)/frameCount)*60));
   }
   gif.on('progress',(p:unknown)=>setProgress(60+Math.round((p as number)*40)));
   gif.on('finished',(blob:Blob)=>{setGifUrl(URL.createObjectURL(blob));setBusy(false)});
   gif.render();
  }catch{alert('Could not create a GIF from this video.');setBusy(false)}
 };

 return <ToolShell title="Video to GIF converter" description="Trim a clip from a video and turn it into an animated GIF, sampled and encoded entirely in your browser." faq={[{q:'How long can the clip be?',a:'Short clips (a few seconds) work best — longer clips or higher frame rates take more time and memory to encode.'}]}>
  <input type="file" accept="video/*" onChange={e=>{const f=e.target.files?.[0];if(f)onFile(f)}}/>
  {url&&<video ref={videoRef} src={url} controls style={{width:'100%',borderRadius:14,marginTop:16}} onLoadedMetadata={e=>setEnd(Math.min(3,e.currentTarget.duration))}/>}
  {file&&<>
   <div className="controls">
    <div className="field"><label>Start (s)</label><input type="number" min="0" step="0.1" value={start} onChange={e=>setStart(Number(e.target.value))}/></div>
    <div className="field"><label>End (s)</label><input type="number" min="0" step="0.1" value={end} onChange={e=>setEnd(Number(e.target.value))}/></div>
    <div className="field"><label>FPS</label><input type="number" min="2" max="20" value={fps} onChange={e=>setFps(Number(e.target.value))}/></div>
   </div>
   <div className="field" style={{marginTop:14}}><label>Width (px)</label><input type="number" min="80" max="640" value={scale} onChange={e=>setScale(Number(e.target.value))}/></div>
   <div style={{marginTop:16}}><button className="btn btnPrimary" disabled={busy} onClick={generate}>{busy?`Encoding… ${progress}%`:'Convert to GIF'}</button></div>
  </>}
  {gifUrl&&<div className="result"><img src={gifUrl} alt="gif" style={{maxWidth:200,borderRadius:10}}/><a className="btn btnDark" href={gifUrl} download="clip.gif">Download GIF</a></div>}
 </ToolShell>;
}

export function AudioTrimmer(){
 const[file,setFile]=useState<File|null>(null);const[duration,setDuration]=useState(0);
 const[start,setStart]=useState(0);const[end,setEnd]=useState(0);const[out,setOut]=useState('');const[busy,setBusy]=useState(false);
 const bufferRef=useRef<AudioBuffer|null>(null);

 const onFile=async(f:File)=>{
  setFile(f);setOut('');
  const ctx=new AudioContext();
  const arr=await f.arrayBuffer();
  const buffer=await ctx.decodeAudioData(arr);
  bufferRef.current=buffer;setDuration(buffer.duration);setStart(0);setEnd(buffer.duration);
 };

 const trim=()=>{
  const buffer=bufferRef.current;if(!buffer)return;setBusy(true);
  try{
   const ctx=new AudioContext();
   const startSample=Math.floor(start*buffer.sampleRate);
   const endSample=Math.min(buffer.length,Math.floor(end*buffer.sampleRate));
   const length=Math.max(1,endSample-startSample);
   const out=ctx.createBuffer(buffer.numberOfChannels,length,buffer.sampleRate);
   for(let ch=0;ch<buffer.numberOfChannels;ch++)out.getChannelData(ch).set(buffer.getChannelData(ch).subarray(startSample,endSample));
   const blob=encodeWav(out);
   setOut(URL.createObjectURL(blob));
  }finally{setBusy(false)}
 };

 return <ToolShell title="Audio trimmer / cutter" description="Upload an audio file, set a start and end point, and download the trimmed clip as a WAV file." faq={[{q:'What formats can I upload?',a:'Most common formats your browser can decode, including MP3, WAV and M4A.'},{q:'Why is the output WAV instead of MP3?',a:'Browsers can decode MP3 but cannot encode it without an extra library; WAV export needs no extra dependencies and has no quality loss.'}]}>
  <input type="file" accept="audio/*" onChange={e=>{const f=e.target.files?.[0];if(f)onFile(f)}}/>
  {file&&duration>0&&<>
   <div className="controls">
    <div className="field"><label>Start (s)</label><input type="number" min="0" max={duration} step="0.1" value={start} onChange={e=>setStart(Number(e.target.value))}/></div>
    <div className="field"><label>End (s)</label><input type="number" min="0" max={duration} step="0.1" value={end} onChange={e=>setEnd(Number(e.target.value))}/></div>
   </div>
   <div className="stats"><span>Total duration: {duration.toFixed(1)}s</span></div>
   <div style={{marginTop:16}}><button className="btn btnPrimary" disabled={busy} onClick={trim}>{busy?'Trimming…':'Trim & export WAV'}</button></div>
  </>}
  {out&&<div className="result"><audio src={out} controls/><a className="btn btnDark" href={out} download="trimmed.wav">Download</a></div>}
 </ToolShell>;
}

export function AudioSpeedChanger(){
 const[file,setFile]=useState<File|null>(null);const[speed,setSpeed]=useState(1);const[out,setOut]=useState('');const[busy,setBusy]=useState(false);
 const bufferRef=useRef<AudioBuffer|null>(null);

 const onFile=async(f:File)=>{
  setFile(f);setOut('');
  const ctx=new AudioContext();
  const arr=await f.arrayBuffer();
  bufferRef.current=await ctx.decodeAudioData(arr);
 };

 const apply=async()=>{
  const buffer=bufferRef.current;if(!buffer)return;setBusy(true);
  try{
   const newLength=Math.max(1,Math.floor(buffer.length/speed));
   const offline=new OfflineAudioContext(buffer.numberOfChannels,newLength,buffer.sampleRate);
   const src=offline.createBufferSource();src.buffer=buffer;src.playbackRate.value=speed;
   src.connect(offline.destination);src.start();
   const rendered=await offline.startRendering();
   setOut(URL.createObjectURL(encodeWav(rendered)));
  }catch{alert('Could not process this audio file.')}
  finally{setBusy(false)}
 };

 return <ToolShell title="Audio speed changer" description="Speed up or slow down an audio file and download the result as a WAV file. Pitch changes naturally with speed, just like a variable-speed tape or turntable." faq={[{q:'Can I change pitch without changing speed?',a:'Not with this tool — it links speed and pitch together, matching how audio speed changes naturally work.'}]}>
  <input type="file" accept="audio/*" onChange={e=>{const f=e.target.files?.[0];if(f)onFile(f)}}/>
  {file&&<>
   <div className="field" style={{marginTop:14}}><label>Speed: {speed.toFixed(2)}×</label><input type="range" min="0.5" max="2" step="0.05" value={speed} onChange={e=>setSpeed(Number(e.target.value))}/></div>
   <div style={{marginTop:16}}><button className="btn btnPrimary" disabled={busy} onClick={apply}>{busy?'Processing…':'Apply & export WAV'}</button></div>
  </>}
  {out&&<div className="result"><audio src={out} controls/><a className="btn btnDark" href={out} download="speed-changed.wav">Download</a></div>}
 </ToolShell>;
}

export function GifOptimizer(){
 const[file,setFile]=useState<File|null>(null);const[scale,setScale]=useState(1);const[quality,setQuality]=useState(10);const[keepEvery,setKeepEvery]=useState(1);
 const[busy,setBusy]=useState(false);const[before,setBefore]=useState(0);const[after,setAfter]=useState(0);const[out,setOut]=useState('');

 const optimize=async()=>{
  if(!file)return;setBusy(true);setOut('');
  try{
   const {parseGIF,decompressFrames}=await import('gifuct-js');
   const GIF=(await import('gif.js.optimized')).default;
   const buf=await file.arrayBuffer();
   const parsed=parseGIF(buf);
   const frames=decompressFrames(parsed,true);
   const fullW=parsed.lsd.width,fullH=parsed.lsd.height;
   const compose=document.createElement('canvas');compose.width=fullW;compose.height=fullH;
   const composeCtx=compose.getContext('2d')!;
   const outW=Math.max(1,Math.round(fullW*scale)),outH=Math.max(1,Math.round(fullH*scale));
   const gif=new GIF({workers:2,quality,width:outW,height:outH,workerScript:'/gif.worker.js'});
   const outCanvas=document.createElement('canvas');outCanvas.width=outW;outCanvas.height=outH;
   const outCtx=outCanvas.getContext('2d')!;
   let prevDisposal=0,prevRect={left:0,top:0,width:fullW,height:fullH};
   frames.forEach((frame,i)=>{
    if(prevDisposal===2)composeCtx.clearRect(prevRect.left,prevRect.top,prevRect.width,prevRect.height);
    const imgData=new ImageData(new Uint8ClampedArray(frame.patch),frame.dims.width,frame.dims.height);
    const patchCanvas=document.createElement('canvas');patchCanvas.width=frame.dims.width;patchCanvas.height=frame.dims.height;
    patchCanvas.getContext('2d')!.putImageData(imgData,0,0);
    composeCtx.drawImage(patchCanvas,frame.dims.left,frame.dims.top);
    prevDisposal=frame.disposalType;prevRect=frame.dims;
    if(i%keepEvery===0){
     outCtx.clearRect(0,0,outW,outH);
     outCtx.drawImage(compose,0,0,outW,outH);
     gif.addFrame(outCanvas,{copy:true,delay:frame.delay*keepEvery});
    }
   });
   await new Promise<void>(resolve=>{
    gif.on('finished',(blob:Blob)=>{setBefore(file.size);setAfter(blob.size);setOut(URL.createObjectURL(blob));resolve()});
    gif.render();
   });
  }catch{alert('Could not optimize this GIF.')}
  finally{setBusy(false)}
 };

 return <ToolShell title="GIF optimizer" description="Shrink an animated GIF by reducing its resolution, quality or frame count, decoded and re-encoded entirely in your browser." faq={[{q:'How does this reduce file size?',a:'You can scale down the resolution, drop frames (lower frame rate) and reduce color quality — the three biggest levers for GIF file size.'}]}>
  <input type="file" accept="image/gif" onChange={e=>{const f=e.target.files?.[0];if(f)setFile(f)}}/>
  {file&&<>
   <div className="controls">
    <div className="field"><label>Scale: {Math.round(scale*100)}%</label><input type="range" min="0.2" max="1" step="0.1" value={scale} onChange={e=>setScale(Number(e.target.value))}/></div>
    <div className="field"><label>Quality (lower = smaller): {quality}</label><input type="range" min="1" max="30" value={quality} onChange={e=>setQuality(Number(e.target.value))}/></div>
    <div className="field"><label>Keep every Nth frame</label><input type="number" min="1" max="5" value={keepEvery} onChange={e=>setKeepEvery(Number(e.target.value))}/></div>
   </div>
   <div style={{marginTop:16}}><button className="btn btnPrimary" disabled={busy} onClick={optimize}>{busy?'Optimizing…':'Optimize GIF'}</button></div>
  </>}
  {out&&<div className="result"><div><b>Done</b><div className="stats"><span>Before: {(before/1024).toFixed(0)} KB</span><span>After: {(after/1024).toFixed(0)} KB</span><span>Saved: {Math.max(0,Math.round((1-after/before)*100))}%</span></div></div><a className="btn btnDark" href={out} download="optimized.gif">Download</a></div>}
 </ToolShell>;
}
