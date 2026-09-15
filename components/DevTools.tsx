'use client';import {useState} from 'react';import ToolShell from './ToolShell';

export function JsonFormatter(){
 const[input,setInput]=useState('');const[output,setOutput]=useState('');const[error,setError]=useState('');
 const format=(spacing:number)=>{
  try{const parsed=JSON.parse(input);setOutput(JSON.stringify(parsed,null,spacing));setError('')}
  catch(e){setError(e instanceof Error?e.message:'Invalid JSON');setOutput('')}
 };
 const copy=()=>navigator.clipboard?.writeText(output);
 return <ToolShell title="Format and validate JSON online" description="Paste JSON to instantly validate, pretty-print or minify it, with clear error messages when something is wrong." faq={[{q:'Is my JSON uploaded anywhere?',a:'No. Parsing and formatting run entirely in your browser using the built-in JSON parser.'},{q:'What happens if my JSON is invalid?',a:'The tool shows the exact parser error so you can find and fix the issue quickly.'}]}>
  <textarea className="textArea" value={input} onChange={e=>setInput(e.target.value)} placeholder='Paste JSON here, e.g. {"name":"CraftSprint"}'/>
  <div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}>
   <button className="btn btnPrimary" onClick={()=>format(2)}>Format</button>
   <button className="btn btnGhost" onClick={()=>format(0)}>Minify</button>
   <button className="btn btnGhost" onClick={()=>{setInput('');setOutput('');setError('')}}>Clear</button>
  </div>
  {error&&<div className="notice error">{error}</div>}
  {output&&<><pre className="codeBox">{output}</pre><div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy result</button></div></>}
 </ToolShell>;
}

export function Base64Tool(){
 const[mode,setMode]=useState<'encode'|'decode'>('encode');
 const[input,setInput]=useState('');const[output,setOutput]=useState('');const[error,setError]=useState('');
 const run=()=>{
  try{
   if(mode==='encode')setOutput(btoa(unescape(encodeURIComponent(input))));
   else setOutput(decodeURIComponent(escape(atob(input.trim()))));
   setError('');
  }catch{setError(mode==='decode'?'This does not look like valid Base64 text.':'Could not encode this text.');setOutput('')}
 };
 const copy=()=>navigator.clipboard?.writeText(output);
 return <ToolShell title="Base64 encode and decode text online" description="Convert plain text to Base64 or decode Base64 back to readable text, fully in your browser." faq={[{q:'Can I decode any Base64 string?',a:'Yes, as long as it is valid Base64. Invalid input shows a clear error message.'},{q:'Does this support unicode text?',a:'Yes, encoding and decoding correctly handle unicode characters such as emoji and accented letters.'}]}>
  <div className="toggleGroup">
   <button className={`toggleBtn ${mode==='encode'?'active':''}`} onClick={()=>setMode('encode')}>Encode</button>
   <button className={`toggleBtn ${mode==='decode'?'active':''}`} onClick={()=>setMode('decode')}>Decode</button>
  </div>
  <div style={{marginTop:16}}><textarea className="textArea" style={{minHeight:160}} value={input} onChange={e=>setInput(e.target.value)} placeholder={mode==='encode'?'Type or paste plain text…':'Paste Base64 text…'}/></div>
  <div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}>
   <button className="btn btnPrimary" onClick={run}>{mode==='encode'?'Encode to Base64':'Decode from Base64'}</button>
   <button className="btn btnGhost" onClick={()=>{setInput('');setOutput('');setError('')}}>Clear</button>
  </div>
  {error&&<div className="notice error">{error}</div>}
  {output&&<><pre className="codeBox">{output}</pre><div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy result</button></div></>}
 </ToolShell>;
}
