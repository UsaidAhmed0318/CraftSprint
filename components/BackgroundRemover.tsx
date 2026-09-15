'use client';import {useState,useRef} from 'react';import Dropzone from './Dropzone';import ToolShell from './ToolShell';

export function BackgroundRemover(){
 const[file,setFile]=useState<File|null>(null);const[imgUrl,setImgUrl]=useState('');
 const[imgReady,setImgReady]=useState(false);
 const[threshold,setThreshold]=useState(32);const[picked,setPicked]=useState<[number,number,number]|null>(null);
 const[out,setOut]=useState('');const[busy,setBusy]=useState(false);const[error,setError]=useState('');
 const imgRef=useRef<HTMLImageElement>(null);
 const previewCanvasRef=useRef<HTMLCanvasElement>(null);

 const onFile=(f:File)=>{setFile(f);setImgUrl(URL.createObjectURL(f));setImgReady(false);setOut('');setPicked(null);setError('')};

 const pickColor=(e:React.MouseEvent<HTMLImageElement>)=>{
  if(!imgReady)return;
  try{
   const img=e.currentTarget;
   const rect=img.getBoundingClientRect();
   const x=Math.min(img.naturalWidth-1,Math.max(0,Math.round((e.clientX-rect.left)/rect.width*img.naturalWidth)));
   const y=Math.min(img.naturalHeight-1,Math.max(0,Math.round((e.clientY-rect.top)/rect.height*img.naturalHeight)));
   const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
   const ctx=canvas.getContext('2d')!;ctx.drawImage(img,0,0);
   const[r,g,b]=ctx.getImageData(x,y,1,1).data;
   setPicked([r,g,b]);
  }catch{setError('Could not sample that pixel — try clicking again.')}
 };

 const detectCorners=(ctx:CanvasRenderingContext2D,w:number,h:number):[number,number,number]=>{
  const corners=[[0,0],[w-1,0],[0,h-1],[w-1,h-1]];
  let r=0,g=0,b=0;
  corners.forEach(([x,y])=>{const d=ctx.getImageData(x,y,1,1).data;r+=d[0];g+=d[1];b+=d[2]});
  return[Math.round(r/4),Math.round(g/4),Math.round(b/4)];
 };

 const process=()=>{
  if(!imgReady){setError('The image is still loading — wait a moment and try again.');return}
  setBusy(true);setError('');setOut('');
  setTimeout(()=>{
   try{
    const img=imgRef.current;
    if(!img||!img.naturalWidth||!img.naturalHeight)throw new Error('Image not ready');
    const canvas=previewCanvasRef.current||document.createElement('canvas');
    canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
    const ctx=canvas.getContext('2d');
    if(!ctx)throw new Error('Canvas not supported');
    ctx.drawImage(img,0,0);
    const bg=picked||detectCorners(ctx,canvas.width,canvas.height);
    const data=ctx.getImageData(0,0,canvas.width,canvas.height);
    const px=data.data;
    for(let i=0;i<px.length;i+=4){
     const dist=Math.sqrt((px[i]-bg[0])**2+(px[i+1]-bg[1])**2+(px[i+2]-bg[2])**2);
     if(dist<threshold)px[i+3]=0;
     else if(dist<threshold*1.6)px[i+3]=Math.round(255*((dist-threshold)/(threshold*0.6)));
    }
    ctx.putImageData(data,0,0);
    setOut(canvas.toDataURL('image/png'));
   }catch{
    setError('Could not process this image. Try a smaller image or a different file format (JPG or PNG).');
   }finally{
    setBusy(false);
   }
  },30);
 };

 return <ToolShell title="Background remover (solid color)" description="Remove a plain or near-solid background from a product photo, logo or graphic — click the background to sample its color, then export a transparent PNG." faq={[{q:'Does this work on any photo?',a:'This tool removes solid or near-solid backgrounds (like a white product photo backdrop). It is not an AI subject-cutout tool and will not cleanly separate a person from a complex, busy photo background.'},{q:'How do I improve the result?',a:'Click directly on the background in the preview to sample its exact color, then adjust the sensitivity slider until edges look clean.'},{q:'Nothing happens when I click Remove background — why?',a:'Wait a second for the image to finish loading (the sensitivity slider becomes active), then try again. Very large images can also take a few seconds to process.'}]}>
  <Dropzone onFile={onFile}/>
  {imgUrl&&<>
   <p style={{fontSize:13,color:'var(--muted)',marginTop:10}}>{imgReady?'Click on the background in the image below to sample its color (optional — otherwise the corners are used automatically).':'Loading image…'}</p>
   <img ref={imgRef} src={imgUrl} alt="source" onLoad={()=>setImgReady(true)} onClick={pickColor} className="previewImg" style={{cursor:imgReady?'crosshair':'default',opacity:imgReady?1:0.5}}/>
   {picked&&<div className="stats"><span>Sampled color: <span style={{display:'inline-block',width:14,height:14,borderRadius:4,background:`rgb(${picked.join(',')})`,verticalAlign:'middle',marginLeft:6}}/></span></div>}
   <div className="field" style={{marginTop:14}}><label>Sensitivity: {threshold}</label><input type="range" min="5" max="120" value={threshold} disabled={!imgReady} onChange={e=>setThreshold(Number(e.target.value))}/></div>
   <div style={{marginTop:16}}><button className="btn btnPrimary" disabled={!imgReady||busy} onClick={process}>{busy?'Processing…':'Remove background'}</button></div>
  </>}
  {error&&<div className="notice error">{error}</div>}
  <canvas ref={previewCanvasRef} className="hidden"/>
  {out&&<div className="result"><img src={out} alt="result" style={{maxWidth:200,borderRadius:10,background:'repeating-conic-gradient(#eee 0% 25%,#fff 0% 50%) 50% / 16px 16px'}}/><a className="btn btnDark" href={out} download="transparent.png">Download PNG</a></div>}
 </ToolShell>;
}
