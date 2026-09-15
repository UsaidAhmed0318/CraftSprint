'use client';import {useState,useMemo} from 'react';import ToolShell from './ToolShell';

export function UrlEncoderDecoder(){
 const[mode,setMode]=useState<'encode'|'decode'>('encode');
 const[input,setInput]=useState('');
 const{output,error}=useMemo(()=>{
  try{return{output:mode==='encode'?encodeURIComponent(input):decodeURIComponent(input),error:''}}
  catch{return{output:'',error:'This does not look like a valid URL-encoded string.'}}
 },[mode,input]);
 const copy=()=>navigator.clipboard?.writeText(output);
 return <ToolShell title="URL encoder / decoder" description="Encode text for safe use inside a URL, or decode a URL-encoded string back to plain text." faq={[{q:'When do I need URL encoding?',a:'Use it for query parameters, form values or any text containing spaces or special characters placed inside a URL.'}]}>
  <div className="toggleGroup">
   <button className={`toggleBtn ${mode==='encode'?'active':''}`} onClick={()=>setMode('encode')}>Encode</button>
   <button className={`toggleBtn ${mode==='decode'?'active':''}`} onClick={()=>setMode('decode')}>Decode</button>
  </div>
  <textarea className="textArea" style={{minHeight:140,marginTop:14}} value={input} onChange={e=>setInput(e.target.value)}/>
  {error&&<div className="notice error">{error}</div>}
  {output&&<><pre className="codeBox">{output}</pre><div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy result</button></div></>}
 </ToolShell>;
}

function minifyHtml(s:string){return s.replace(/<!--[\s\S]*?-->/g,'').replace(/>\s+</g,'><').replace(/\s{2,}/g,' ').trim()}
function minifyCss(s:string){return s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s*([{}:;,])\s*/g,'$1').replace(/;}/g,'}').replace(/\s{2,}/g,' ').trim()}
function minifyJs(s:string){return s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/(^|[^:])\/\/.*$/gm,'$1').replace(/\n\s*/g,'\n').replace(/\n{2,}/g,'\n').trim()}

function MinifierTool({title,description,fn,placeholder}:{title:string;description:string;fn:(s:string)=>string;placeholder:string}){
 const[input,setInput]=useState('');const[output,setOutput]=useState('');
 const run=()=>setOutput(fn(input));
 const copy=()=>navigator.clipboard?.writeText(output);
 const savedPct=input&&output?Math.round((1-output.length/input.length)*100):0;
 return <ToolShell title={title} description={description} faq={[{q:'Is this a full production-grade minifier?',a:'This performs safe whitespace and comment removal for quick cleanup. For production builds, a dedicated build-time minifier is recommended for maximum compression.'}]}>
  <textarea className="textArea" value={input} onChange={e=>setInput(e.target.value)} placeholder={placeholder}/>
  <div style={{marginTop:16}}><button className="btn btnPrimary" onClick={run}>Minify</button></div>
  {output&&<><pre className="codeBox">{output}</pre><div className="stats"><span>Before: {input.length} chars</span><span>After: {output.length} chars</span><span>Saved: {Math.max(0,savedPct)}%</span></div><div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy result</button></div></>}
 </ToolShell>;
}

export const HtmlMinifier=()=><MinifierTool title="HTML minifier" description="Strip comments and extra whitespace from HTML to shrink file size." fn={minifyHtml} placeholder="<div>\n  <!-- comment -->\n  <p>Hello</p>\n</div>"/>;
export const CssMinifier=()=><MinifierTool title="CSS minifier" description="Strip comments and extra whitespace from CSS to shrink file size." fn={minifyCss} placeholder=".box {\n  /* comment */\n  color: red;\n}"/>;
export const JsMinifier=()=><MinifierTool title="JavaScript minifier" description="Strip comments and collapse extra whitespace from JavaScript source." fn={minifyJs} placeholder="function greet() {\n  // say hello\n  console.log('hi');\n}"/>;

const OPERATORS=['=','!=','>','<','>=','<=','LIKE'];
export function SqlQueryBuilder(){
 const[table,setTable]=useState('users');const[columns,setColumns]=useState('id, name, email');
 const[where,setWhere]=useState([{field:'status',op:'=',value:'active'}]);
 const[orderBy,setOrderBy]=useState('created_at');const[direction,setDirection]=useState('DESC');const[limit,setLimit]=useState(50);
 const updateWhere=(i:number,key:'field'|'op'|'value',value:string)=>setWhere(where.map((w,idx)=>idx!==i?w:{...w,[key]:value}));
 const quote=(v:string)=>/^-?\d+(\.\d+)?$/.test(v)?v:`'${v.replace(/'/g,"''")}'`;
 const sql=`SELECT ${columns.trim()||'*'}\nFROM ${table}${where.length&&where[0].field?`\nWHERE ${where.map(w=>`${w.field} ${w.op} ${quote(w.value)}`).join('\n  AND ')}`:''}${orderBy?`\nORDER BY ${orderBy} ${direction}`:''}${limit?`\nLIMIT ${limit}`:''};`;
 const copy=()=>navigator.clipboard?.writeText(sql);
 return <ToolShell title="SQL query builder" description="Visually build a SELECT statement with columns, WHERE conditions, sorting and a limit, then copy the generated SQL." faq={[{q:'Does this run against a real database?',a:'No, this only generates the SQL text for you to copy and run in your own database tool.'}]}>
  <div className="controls">
   <div className="field"><label>Table</label><input value={table} onChange={e=>setTable(e.target.value)}/></div>
   <div className="field" style={{gridColumn:'span 2'}}><label>Columns (comma separated, or *)</label><input value={columns} onChange={e=>setColumns(e.target.value)}/></div>
  </div>
  <h3 style={{margin:'22px 0 10px'}}>WHERE conditions</h3>
  {where.map((w,i)=><div className="controls" key={i}>
   <div className="field"><label>Field</label><input value={w.field} onChange={e=>updateWhere(i,'field',e.target.value)}/></div>
   <div className="field"><label>Operator</label><select value={w.op} onChange={e=>updateWhere(i,'op',e.target.value)}>{OPERATORS.map(o=><option key={o}>{o}</option>)}</select></div>
   <div className="field"><label>Value</label><input value={w.value} onChange={e=>updateWhere(i,'value',e.target.value)}/></div>
  </div>)}
  <div className="heroActions" style={{justifyContent:'flex-start',marginTop:10}}>
   <button className="btn btnGhost" onClick={()=>setWhere([...where,{field:'',op:'=',value:''}])}>+ Add condition</button>
   {where.length>1&&<button className="btn btnGhost" onClick={()=>setWhere(where.slice(0,-1))}>Remove last</button>}
  </div>
  <div className="controls" style={{marginTop:20}}>
   <div className="field"><label>Order by</label><input value={orderBy} onChange={e=>setOrderBy(e.target.value)}/></div>
   <div className="field"><label>Direction</label><select value={direction} onChange={e=>setDirection(e.target.value)}><option>ASC</option><option>DESC</option></select></div>
   <div className="field"><label>Limit</label><input type="number" value={limit} onChange={e=>setLimit(Number(e.target.value))}/></div>
  </div>
  <pre className="codeBox">{sql}</pre>
  <div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy SQL</button></div>
 </ToolShell>;
}

export function ApiTester(){
 const[url,setUrl]=useState('');const[method,setMethod]=useState('GET');const[headers,setHeaders]=useState('Content-Type: application/json');const[body,setBody]=useState('');
 const[response,setResponse]=useState<{status:number;time:number;headers:string;body:string}|null>(null);
 const[error,setError]=useState('');const[busy,setBusy]=useState(false);
 const send=async()=>{
  if(!url.trim())return;setBusy(true);setError('');setResponse(null);
  try{
   const headerObj:Record<string,string>={};
   headers.split('\n').forEach(line=>{const idx=line.indexOf(':');if(idx>-1)headerObj[line.slice(0,idx).trim()]=line.slice(idx+1).trim()});
   const start=performance.now();
   const res=await fetch(url,{method,headers:headerObj,body:method!=='GET'&&method!=='HEAD'?body:undefined});
   const time=Math.round(performance.now()-start);
   const text=await res.text();
   const headerLines=[...res.headers.entries()].map(([k,v])=>`${k}: ${v}`).join('\n');
   setResponse({status:res.status,time,headers:headerLines,body:text});
  }catch{setError('Request failed. This may be a CORS restriction from the target server, or an invalid URL.')}
  finally{setBusy(false)}
 };
 return <ToolShell title="API testing tool (REST client)" description="Send a REST request with custom method, headers and body, and inspect the response status, headers and body." faq={[{q:'Why does my request fail?',a:'Browsers block cross-origin requests unless the target server explicitly allows it (CORS). This is a browser security restriction, not a bug in this tool.'}]}>
  <div className="methodUrlRow">
   <div className="field"><label>Method</label><select value={method} onChange={e=>setMethod(e.target.value)}><option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option></select></div>
   <div className="field"><label>URL</label><input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://api.example.com/users"/></div>
  </div>
  <div className="field" style={{marginTop:14}}><label>Headers (one per line, &quot;Key: Value&quot;)</label><textarea className="textArea" style={{minHeight:70}} value={headers} onChange={e=>setHeaders(e.target.value)}/></div>
  {method!=='GET'&&method!=='HEAD'&&<div className="field" style={{marginTop:14}}><label>Body</label><textarea className="textArea" style={{minHeight:100}} value={body} onChange={e=>setBody(e.target.value)}/></div>}
  <div style={{marginTop:16}}><button className="btn btnPrimary" disabled={busy} onClick={send}>{busy?'Sending…':'Send request'}</button></div>
  {error&&<div className="notice error">{error}</div>}
  {response&&<>
   <div className="result"><span>Status</span><b style={{color:response.status<400?'var(--success)':'var(--danger)'}}>{response.status}</b><span>{response.time}ms</span></div>
   <h3 style={{marginTop:20}}>Response headers</h3><pre className="codeBox">{response.headers}</pre>
   <h3 style={{marginTop:20}}>Response body</h3><pre className="codeBox" style={{maxHeight:300}}>{response.body}</pre>
  </>}
 </ToolShell>;
}

export function TailwindConfigGenerator(){
 const[primary,setPrimary]=useState('#2563eb');const[secondary,setSecondary]=useState('#3b82f6');
 const[heading,setHeading]=useState('Space Grotesk');const[body,setBody]=useState('DM Sans');
 const code=`/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        primary: '${primary}',\n        secondary: '${secondary}',\n      },\n      fontFamily: {\n        heading: ['${heading}', 'sans-serif'],\n        body: ['${body}', 'sans-serif'],\n      },\n    },\n  },\n};`;
 const copy=()=>navigator.clipboard?.writeText(code);
 return <ToolShell title="Tailwind CSS config generator" description="Enter your brand colors and fonts to generate a tailwind.config.js theme extension snippet." faq={[{q:'Where do I paste this?',a:'Merge the generated theme.extend object into your existing tailwind.config.js file.'}]}>
  <div className="controls">
   <div className="field"><label>Primary color</label><input type="color" value={primary} onChange={e=>setPrimary(e.target.value)} style={{height:46,padding:4}}/></div>
   <div className="field"><label>Secondary color</label><input type="color" value={secondary} onChange={e=>setSecondary(e.target.value)} style={{height:46,padding:4}}/></div>
  </div>
  <div className="controls">
   <div className="field"><label>Heading font</label><input value={heading} onChange={e=>setHeading(e.target.value)}/></div>
   <div className="field"><label>Body font</label><input value={body} onChange={e=>setBody(e.target.value)}/></div>
  </div>
  <pre className="codeBox">{code}</pre>
  <div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy config</button></div>
 </ToolShell>;
}

export function JsObfuscator(){
 const[input,setInput]=useState('function greet(name) {\n  return "Hello, " + name + "!";\n}');
 const[output,setOutput]=useState('');const[busy,setBusy]=useState(false);const[error,setError]=useState('');
 const[compact,setCompact]=useState(true);const[stringArray,setStringArray]=useState(true);const[controlFlow,setControlFlow]=useState(false);
 const run=async()=>{
  setBusy(true);setError('');
  try{
   const JavaScriptObfuscator=(await import('javascript-obfuscator')).default;
   const result=JavaScriptObfuscator.obfuscate(input,{compact,stringArray,stringArrayThreshold:stringArray?0.75:0,controlFlowFlattening:controlFlow,controlFlowFlatteningThreshold:controlFlow?0.75:0});
   setOutput(result.getObfuscatedCode());
  }catch{setError('Could not obfuscate this code — check that it is valid JavaScript.')}
  finally{setBusy(false)}
 };
 const copy=()=>navigator.clipboard?.writeText(output);
 return <ToolShell title="JavaScript obfuscator" description="Transform readable JavaScript into a functionally identical but hard-to-read version, using the widely used javascript-obfuscator engine, entirely in your browser." faq={[{q:'Will the obfuscated code still work?',a:'Yes, obfuscation preserves behavior — it renames variables, encodes strings and restructures code, but the logic stays the same.'},{q:'Is my code uploaded anywhere?',a:'No, obfuscation runs entirely in your browser using the open-source javascript-obfuscator library.'}]}>
  <textarea className="textArea" value={input} onChange={e=>setInput(e.target.value)}/>
  <div className="checkGrid">
   <label className="checkRow"><input type="checkbox" checked={compact} onChange={e=>setCompact(e.target.checked)}/>Compact output</label>
   <label className="checkRow"><input type="checkbox" checked={stringArray} onChange={e=>setStringArray(e.target.checked)}/>Encode strings</label>
   <label className="checkRow"><input type="checkbox" checked={controlFlow} onChange={e=>setControlFlow(e.target.checked)}/>Control flow flattening</label>
  </div>
  <div style={{marginTop:16}}><button className="btn btnPrimary" disabled={busy} onClick={run}>{busy?'Obfuscating…':'Obfuscate code'}</button></div>
  {error&&<div className="notice error">{error}</div>}
  {output&&<><pre className="codeBox">{output}</pre><div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy result</button></div></>}
 </ToolShell>;
}
