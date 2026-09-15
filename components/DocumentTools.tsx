'use client';import {useState,useRef,useEffect} from 'react';import {marked} from 'marked';import TurndownService from 'turndown';import ToolShell from './ToolShell';

export function DigitalSignatureCreator(){
 const canvasRef=useRef<HTMLCanvasElement>(null);
 const drawing=useRef(false);
 const[empty,setEmpty]=useState(true);

 const pos=(e:React.PointerEvent<HTMLCanvasElement>)=>{
  const rect=canvasRef.current!.getBoundingClientRect();
  return{x:e.clientX-rect.left,y:e.clientY-rect.top};
 };
 const start=(e:React.PointerEvent<HTMLCanvasElement>)=>{
  drawing.current=true;setEmpty(false);
  const ctx=canvasRef.current!.getContext('2d')!;const{x,y}=pos(e);
  ctx.beginPath();ctx.moveTo(x,y);
 };
 const move=(e:React.PointerEvent<HTMLCanvasElement>)=>{
  if(!drawing.current)return;
  const ctx=canvasRef.current!.getContext('2d')!;const{x,y}=pos(e);
  ctx.lineWidth=2.4;ctx.lineCap='round';ctx.strokeStyle='#10131a';ctx.lineTo(x,y);ctx.stroke();
 };
 const end=()=>{drawing.current=false};
 const clear=()=>{const c=canvasRef.current!;c.getContext('2d')!.clearRect(0,0,c.width,c.height);setEmpty(true)};
 const download=()=>{const a=document.createElement('a');a.href=canvasRef.current!.toDataURL('image/png');a.download='signature.png';a.click()};

 useEffect(()=>{
  const c=canvasRef.current;if(!c)return;
  const ratio=window.devicePixelRatio||1;
  c.width=c.clientWidth*ratio;c.height=c.clientHeight*ratio;
  c.getContext('2d')!.scale(ratio,ratio);
 },[]);

 return <ToolShell title="Digital signature creator" description="Draw your signature with a mouse, trackpad or finger and download it as a transparent PNG to sign documents." faq={[{q:'Is my signature uploaded anywhere?',a:'No, it is drawn and rendered entirely on a canvas in your browser.'}]}>
  <canvas ref={canvasRef} className="signaturePad" onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end}/>
  <div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}>
   <button className="btn btnPrimary" disabled={empty} onClick={download}>Download PNG</button>
   <button className="btn btnGhost" onClick={clear}>Clear</button>
  </div>
 </ToolShell>;
}

function diffLines(a:string,b:string){
 const A=a.split('\n'),B=b.split('\n');
 const n=A.length,m=B.length;
 const dp:number[][]=Array.from({length:n+1},()=>new Array(m+1).fill(0));
 for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)dp[i][j]=A[i]===B[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);
 const out:{type:'same'|'add'|'remove';text:string}[]=[];
 let i=0,j=0;
 while(i<n&&j<m){
  if(A[i]===B[j]){out.push({type:'same',text:A[i]});i++;j++}
  else if(dp[i+1][j]>=dp[i][j+1]){out.push({type:'remove',text:A[i]});i++}
  else{out.push({type:'add',text:B[j]});j++}
 }
 while(i<n){out.push({type:'remove',text:A[i]});i++}
 while(j<m){out.push({type:'add',text:B[j]});j++}
 return out;
}

export function TextDiffChecker(){
 const[a,setA]=useState('');const[b,setB]=useState('');
 const[diff,setDiff]=useState<ReturnType<typeof diffLines>|null>(null);
 const run=()=>setDiff(diffLines(a,b));
 return <ToolShell title="Text diff checker — compare two texts" description="Paste two versions of a text or document to see exactly which lines were added, removed or kept the same." faq={[{q:'Is the comparison line-by-line or character-by-character?',a:'This tool compares line by line, which works well for documents, code and paragraphs.'}]}>
  <div className="splitPanes">
   <div className="field"><label>Original text</label><textarea className="textArea" style={{minHeight:220}} value={a} onChange={e=>setA(e.target.value)}/></div>
   <div className="field"><label>Changed text</label><textarea className="textArea" style={{minHeight:220}} value={b} onChange={e=>setB(e.target.value)}/></div>
  </div>
  <div style={{marginTop:16}}><button className="btn btnPrimary" onClick={run}>Compare</button></div>
  {diff&&<pre className="codeBox">{diff.map((l,idx)=><div key={idx} style={{color:l.type==='add'?'#5eead4':l.type==='remove'?'#ff9aa6':'#d8e0ff',background:l.type==='add'?'rgba(94,234,212,.08)':l.type==='remove'?'rgba(255,154,166,.08)':'transparent'}}>{l.type==='add'?'+ ':l.type==='remove'?'- ':'  '}{l.text||' '}</div>)}</pre>}
 </ToolShell>;
}

export function MarkdownToHtmlConverter(){
 const[md,setMd]=useState('# Hello world\n\nThis is **bold** and this is *italic*.');
 const[html,setHtml]=useState('');
 const convert=()=>setHtml(marked.parse(md,{async:false}) as string);
 const copy=()=>navigator.clipboard?.writeText(html);
 return <ToolShell title="Markdown to HTML converter" description="Convert Markdown source into raw HTML markup you can copy into a CMS, email template or static site." faq={[{q:'Does this render the HTML too?',a:'No, this tool outputs the raw HTML source. Use the Markdown Previewer if you want a live rendered preview instead.'}]}>
  <textarea className="textArea" value={md} onChange={e=>setMd(e.target.value)}/>
  <div style={{marginTop:16}}><button className="btn btnPrimary" onClick={convert}>Convert to HTML</button></div>
  {html&&<><pre className="codeBox">{html}</pre><div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy HTML</button></div></>}
 </ToolShell>;
}

export function ResumeBuilder(){
 const[name,setName]=useState('Your Name');const[title,setTitle]=useState('Job Title');
 const[email,setEmail]=useState('you@example.com');const[phone,setPhone]=useState('+1 234 567 890');
 const[summary,setSummary]=useState('A short professional summary highlighting your experience and strengths.');
 const[experience,setExperience]=useState('Company Name — Role\n2022–Present\nDescribe your key achievements here.');
 const[skills,setSkills]=useState('Skill one, Skill two, Skill three');
 return <ToolShell title="Resume / CV builder" description="Fill in your details, preview a clean resume layout, and use your browser's print dialog to save it as a PDF." faq={[{q:'How do I save this as a PDF?',a:'Click Print resume, then choose "Save as PDF" as the destination in your browser\'s print dialog.'}]}>
  <div className="controls">
   <div className="field printHide"><label>Full name</label><input value={name} onChange={e=>setName(e.target.value)}/></div>
   <div className="field printHide"><label>Job title</label><input value={title} onChange={e=>setTitle(e.target.value)}/></div>
   <div className="field printHide"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)}/></div>
  </div>
  <div className="controls printHide">
   <div className="field"><label>Phone</label><input value={phone} onChange={e=>setPhone(e.target.value)}/></div>
  </div>
  <div className="field printHide" style={{marginTop:14}}><label>Summary</label><textarea className="textArea" style={{minHeight:80}} value={summary} onChange={e=>setSummary(e.target.value)}/></div>
  <div className="field printHide" style={{marginTop:14}}><label>Experience</label><textarea className="textArea" style={{minHeight:120}} value={experience} onChange={e=>setExperience(e.target.value)}/></div>
  <div className="field printHide" style={{marginTop:14}}><label>Skills (comma separated)</label><input value={skills} onChange={e=>setSkills(e.target.value)}/></div>
  <div className="printHide" style={{marginTop:16}}><button className="btn btnPrimary" onClick={()=>window.print()}>Print resume</button></div>

  <div className="printSheet" style={{marginTop:26}}>
   <h2>{name}</h2><p style={{color:'var(--muted)',margin:'0 0 4px'}}>{title}</p>
   <p style={{color:'var(--muted)',fontSize:13}}>{email} · {phone}</p>
   <h3 style={{marginTop:20}}>Summary</h3><p>{summary}</p>
   <h3 style={{marginTop:20}}>Experience</h3><p style={{whiteSpace:'pre-wrap'}}>{experience}</p>
   <h3 style={{marginTop:20}}>Skills</h3><p>{skills}</p>
  </div>
 </ToolShell>;
}

type InvoiceItem={desc:string;qty:number;price:number};
export function InvoiceGenerator(){
 const[from,setFrom]=useState('Your Business Name');const[to,setTo]=useState('Client Name');
 const[invoiceNo,setInvoiceNo]=useState('INV-001');const[date,setDate]=useState(()=>new Date().toISOString().slice(0,10));
 const[items,setItems]=useState<InvoiceItem[]>([{desc:'Service or product',qty:1,price:100}]);
 const total=items.reduce((s,it)=>s+it.qty*it.price,0);
 const update=(i:number,field:keyof InvoiceItem,value:string)=>setItems(items.map((it,idx)=>idx!==i?it:{...it,[field]:field==='desc'?value:Number(value)}));
 return <ToolShell title="Invoice generator" description="Create a simple, clean invoice with line items and totals, then print it or save it as a PDF." faq={[{q:'How do I save this as a PDF?',a:'Click Print invoice and choose "Save as PDF" in your browser\'s print dialog.'}]}>
  <div className="controls printHide">
   <div className="field"><label>From</label><input value={from} onChange={e=>setFrom(e.target.value)}/></div>
   <div className="field"><label>Bill to</label><input value={to} onChange={e=>setTo(e.target.value)}/></div>
   <div className="field"><label>Invoice #</label><input value={invoiceNo} onChange={e=>setInvoiceNo(e.target.value)}/></div>
  </div>
  <div className="controls printHide">
   <div className="field"><label>Date</label><input type="date" value={date} onChange={e=>setDate(e.target.value)}/></div>
  </div>
  <div className="printHide" style={{marginTop:16}}>
   {items.map((it,i)=><div className="lineItemsRow" key={i}>
    <div className="field"><label>Item {i+1}</label><input value={it.desc} onChange={e=>update(i,'desc',e.target.value)}/></div>
    <div className="field"><label>Qty</label><input type="number" value={it.qty} onChange={e=>update(i,'qty',e.target.value)}/></div>
    <div className="field"><label>Price</label><input type="number" value={it.price} onChange={e=>update(i,'price',e.target.value)}/></div>
   </div>)}
   <div className="heroActions" style={{justifyContent:'flex-start',marginTop:10}}>
    <button className="btn btnGhost" onClick={()=>setItems([...items,{desc:'',qty:1,price:0}])}>+ Add item</button>
    {items.length>1&&<button className="btn btnGhost" onClick={()=>setItems(items.slice(0,-1))}>Remove last</button>}
   </div>
  </div>
  <div className="printHide" style={{marginTop:16}}><button className="btn btnPrimary" onClick={()=>window.print()}>Print invoice</button></div>

  <div className="printSheet" style={{marginTop:26}}>
   <h2>Invoice {invoiceNo}</h2><p style={{color:'var(--muted)'}}>{date}</p>
   <p><b>From:</b> {from}<br/><b>Bill to:</b> {to}</p>
   <table><thead><tr><th>Description</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
    <tbody>{items.map((it,i)=><tr key={i}><td>{it.desc}</td><td>{it.qty}</td><td>{it.price.toFixed(2)}</td><td>{(it.qty*it.price).toFixed(2)}</td></tr>)}</tbody>
   </table>
   <div style={{textAlign:'right',marginTop:16,fontSize:18,fontWeight:800}}>Total: {total.toFixed(2)}</div>
  </div>
 </ToolShell>;
}

export function SrtSubtitleFormatter(){
 const[input,setInput]=useState('');const[offset,setOffset]=useState(0);const[output,setOutput]=useState('');const[error,setError]=useState('');
 const shiftTime=(t:string,ms:number)=>{
  const m=t.match(/(\d+):(\d+):(\d+)[,.](\d+)/);if(!m)return t;
  let total=(+m[1]*3600+ +m[2]*60+ +m[3])*1000+ +m[4]+ms;
  if(total<0)total=0;
  const h=Math.floor(total/3600000);total%=3600000;
  const mi=Math.floor(total/60000);total%=60000;
  const s=Math.floor(total/1000);const msec=total%1000;
  return `${String(h).padStart(2,'0')}:${String(mi).padStart(2,'0')}:${String(s).padStart(2,'0')},${String(msec).padStart(3,'0')}`;
 };
 const process=()=>{
  try{
   const blocks=input.trim().split(/\n\s*\n/);
   const out=blocks.map((block,i)=>{
    const lines=block.split('\n').filter(l=>l.trim()!=='');
    const timeLineIdx=lines.findIndex(l=>l.includes('-->'));
    if(timeLineIdx===-1)return null;
    const[start,end]=lines[timeLineIdx].split('-->').map(s=>s.trim());
    const text=lines.slice(timeLineIdx+1).join('\n');
    return `${i+1}\n${shiftTime(start,offset)} --> ${shiftTime(end,offset)}\n${text}`;
   }).filter(Boolean);
   if(out.length===0){setError('Could not find any valid subtitle blocks.');setOutput('');return}
   setOutput(out.join('\n\n'));setError('');
  }catch{setError('Could not parse this SRT file.');setOutput('')}
 };
 const copy=()=>navigator.clipboard?.writeText(output);
 return <ToolShell title="SRT subtitle formatter & time shifter" description="Renumber subtitle blocks and shift all timestamps by a fixed offset to resync an .srt subtitle file." faq={[{q:'How do I fix subtitles that are out of sync?',a:'Enter a positive offset (in milliseconds) to delay subtitles, or a negative offset to make them appear earlier.'}]}>
  <textarea className="textArea" value={input} onChange={e=>setInput(e.target.value)} placeholder={'1\n00:00:01,000 --> 00:00:03,000\nHello world'}/>
  <div className="controls">
   <div className="field"><label>Time offset (ms)</label><input type="number" value={offset} onChange={e=>setOffset(Number(e.target.value))}/></div>
  </div>
  <div style={{marginTop:16}}><button className="btn btnPrimary" onClick={process}>Format & shift</button></div>
  {error&&<div className="notice error">{error}</div>}
  {output&&<><pre className="codeBox">{output}</pre><div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy SRT</button></div></>}
 </ToolShell>;
}

export function HtmlToMarkdownConverter(){
 const[html,setHtml]=useState('<h1>Hello</h1>\n<p>This is <strong>bold</strong> text.</p>');
 const[md,setMd]=useState('');
 const convert=()=>{const service=new TurndownService();setMd(service.turndown(html))};
 const copy=()=>navigator.clipboard?.writeText(md);
 return <ToolShell title="HTML to Markdown converter" description="Convert HTML markup into clean Markdown source, useful when migrating content into a Markdown-based CMS or docs site." faq={[{q:'Does it handle tables and lists?',a:'Yes, common elements including headings, lists, links, images, tables and code blocks are converted.'}]}>
  <textarea className="textArea" value={html} onChange={e=>setHtml(e.target.value)}/>
  <div style={{marginTop:16}}><button className="btn btnPrimary" onClick={convert}>Convert to Markdown</button></div>
  {md&&<><pre className="codeBox">{md}</pre><div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy Markdown</button></div></>}
 </ToolShell>;
}

export function ReceiptMaker(){
 const[business,setBusiness]=useState('Your Business');const[customer,setCustomer]=useState('Walk-in Customer');
 const[receiptNo,setReceiptNo]=useState('R-1001');const[date,setDate]=useState(()=>new Date().toISOString().slice(0,10));
 const[items,setItems]=useState([{desc:'Item',qty:1,price:10}]);
 const total=items.reduce((s,it)=>s+it.qty*it.price,0);
 const update=(i:number,field:'desc'|'qty'|'price',value:string)=>setItems(items.map((it,idx)=>idx!==i?it:{...it,[field]:field==='desc'?value:Number(value)}));
 return <ToolShell title="Receipt maker" description="Create a simple sales receipt with line items and a total, then print it or save it as a PDF." faq={[{q:'How do I save this as a PDF?',a:'Click Print receipt and choose "Save as PDF" in your browser\'s print dialog.'}]}>
  <div className="controls printHide">
   <div className="field"><label>Business name</label><input value={business} onChange={e=>setBusiness(e.target.value)}/></div>
   <div className="field"><label>Customer</label><input value={customer} onChange={e=>setCustomer(e.target.value)}/></div>
   <div className="field"><label>Receipt #</label><input value={receiptNo} onChange={e=>setReceiptNo(e.target.value)}/></div>
  </div>
  <div className="controls printHide"><div className="field"><label>Date</label><input type="date" value={date} onChange={e=>setDate(e.target.value)}/></div></div>
  <div className="printHide" style={{marginTop:16}}>
   {items.map((it,i)=><div className="lineItemsRow" key={i}>
    <div className="field"><label>Item {i+1}</label><input value={it.desc} onChange={e=>update(i,'desc',e.target.value)}/></div>
    <div className="field"><label>Qty</label><input type="number" value={it.qty} onChange={e=>update(i,'qty',e.target.value)}/></div>
    <div className="field"><label>Price</label><input type="number" value={it.price} onChange={e=>update(i,'price',e.target.value)}/></div>
   </div>)}
   <div className="heroActions" style={{justifyContent:'flex-start',marginTop:10}}>
    <button className="btn btnGhost" onClick={()=>setItems([...items,{desc:'',qty:1,price:0}])}>+ Add item</button>
    {items.length>1&&<button className="btn btnGhost" onClick={()=>setItems(items.slice(0,-1))}>Remove last</button>}
   </div>
  </div>
  <div className="printHide" style={{marginTop:16}}><button className="btn btnPrimary" onClick={()=>window.print()}>Print receipt</button></div>
  <div className="printSheet" style={{marginTop:26,maxWidth:380,margin:'26px auto 0'}}>
   <h2 style={{textAlign:'center'}}>{business}</h2><p style={{textAlign:'center',color:'var(--muted)',fontSize:13}}>Receipt {receiptNo} · {date}</p>
   <p style={{fontSize:13}}>Customer: {customer}</p>
   <table><thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
    <tbody>{items.map((it,i)=><tr key={i}><td>{it.desc}</td><td>{it.qty}</td><td>{(it.qty*it.price).toFixed(2)}</td></tr>)}</tbody>
   </table>
   <div style={{textAlign:'right',marginTop:16,fontSize:18,fontWeight:800}}>Total: {total.toFixed(2)}</div>
  </div>
 </ToolShell>;
}
