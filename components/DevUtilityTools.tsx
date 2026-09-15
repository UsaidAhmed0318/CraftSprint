'use client';import {useState,useMemo} from 'react';import ToolShell from './ToolShell';

export function RegexTester(){
 const[pattern,setPattern]=useState('');const[flags,setFlags]=useState('g');const[text,setText]=useState('');
 const[error,setError]=useState('');
 let matches:RegExpMatchArray[]=[];
 if(pattern){
  try{const re=new RegExp(pattern,flags);matches=[...text.matchAll(re.global?re:new RegExp(pattern,flags+'g'))];if(error)setError('')}
  catch(e){if(!error)setError(e instanceof Error?e.message:'Invalid regular expression')}
 }
 return <ToolShell title="Regex tester online" description="Test a regular expression against sample text and see every match and capture group highlighted, right in your browser." faq={[{q:'Which regex flavor is used?',a:'This tool uses JavaScript regular expressions, the same engine used by browsers and Node.js.'},{q:'Is my text sent anywhere?',a:'No. Matching runs locally using the browser\'s built-in RegExp engine.'}]}>
  <div className="controls">
   <div className="field" style={{gridColumn:'span 2'}}><label>Pattern</label><input value={pattern} onChange={e=>{setPattern(e.target.value);setError('')}} placeholder="\\b[A-Z][a-z]+\\b"/></div>
   <div className="field"><label>Flags</label><input value={flags} onChange={e=>setFlags(e.target.value)} placeholder="g, i, m…"/></div>
  </div>
  <div style={{marginTop:14}}><textarea className="textArea" style={{minHeight:160}} value={text} onChange={e=>setText(e.target.value)} placeholder="Paste sample text here…"/></div>
  {error&&<div className="notice error">{error}</div>}
  {!error&&pattern&&<div className="notice">{matches.length} match{matches.length===1?'':'es'} found.</div>}
  {matches.length>0&&<pre className="codeBox">{matches.map((m,i)=>`#${i+1}: "${m[0]}"${m.length>1?`  groups: ${JSON.stringify(m.slice(1))}`:''}`).join('\n')}</pre>}
 </ToolShell>;
}

export function UuidGenerator(){
 const[count,setCount]=useState(5);const[ids,setIds]=useState<string[]>([]);
 const generate=()=>setIds(Array.from({length:Math.min(100,Math.max(1,count))},()=>crypto.randomUUID()));
 const copyAll=()=>navigator.clipboard?.writeText(ids.join('\n'));
 return <ToolShell title="UUID generator online" description="Generate random UUID v4 identifiers for databases, testing and code, created locally using your browser's crypto API." faq={[{q:'Are these UUIDs unique?',a:'Each UUID v4 is generated with 122 bits of randomness, making collisions astronomically unlikely.'},{q:'Can I generate many at once?',a:'Yes, generate up to 100 UUIDs at a time.'}]}>
  <div className="controls">
   <div className="field"><label>How many?</label><input type="number" min="1" max="100" value={count} onChange={e=>setCount(Number(e.target.value))}/></div>
  </div>
  <div style={{marginTop:16}}><button className="btn btnPrimary" onClick={generate}>Generate UUIDs</button></div>
  {ids.length>0&&<><pre className="codeBox">{ids.join('\n')}</pre><div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copyAll}>Copy all</button></div></>}
 </ToolShell>;
}

export function HashGenerator(){
 const[text,setText]=useState('');const[algo,setAlgo]=useState('SHA-256');const[hash,setHash]=useState('');const[busy,setBusy]=useState(false);
 const run=async()=>{
  setBusy(true);
  try{
   const data=new TextEncoder().encode(text);
   const buf=await crypto.subtle.digest(algo,data);
   setHash(Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join(''));
  }finally{setBusy(false)}
 };
 const copy=()=>navigator.clipboard?.writeText(hash);
 return <ToolShell title="Hash generator online (SHA-1, SHA-256, SHA-512)" description="Generate a cryptographic hash of any text using SHA-1, SHA-256, SHA-384 or SHA-512, computed locally in your browser." faq={[{q:'Is my text uploaded?',a:'No. Hashing uses the browser\'s built-in Web Crypto API and never sends data anywhere.'},{q:'Which algorithm should I use?',a:'SHA-256 is a strong, widely used default for checksums and verification.'}]}>
  <textarea className="textArea" style={{minHeight:160}} value={text} onChange={e=>setText(e.target.value)} placeholder="Type or paste text to hash…"/>
  <div className="controls">
   <div className="field"><label>Algorithm</label><select value={algo} onChange={e=>setAlgo(e.target.value)}><option value="SHA-1">SHA-1</option><option value="SHA-256">SHA-256</option><option value="SHA-384">SHA-384</option><option value="SHA-512">SHA-512</option></select></div>
  </div>
  <div style={{marginTop:16}}><button className="btn btnPrimary" disabled={busy} onClick={run}>{busy?'Hashing…':'Generate hash'}</button></div>
  {hash&&<><pre className="codeBox" style={{wordBreak:'break-all'}}>{hash}</pre><div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy hash</button></div></>}
 </ToolShell>;
}

const toLocalInputValue=(d:Date)=>new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16);
export function TimestampConverter(){
 const[unix,setUnix]=useState(()=>String(Math.floor(Date.now()/1000)));
 const[dateStr,setDateStr]=useState(()=>toLocalInputValue(new Date()));
 const fromUnix=()=>{const n=Number(unix);if(!Number.isFinite(n))return null;return new Date(n*1000)};
 const d=fromUnix();
 const setNow=()=>{const now=new Date();setUnix(String(Math.floor(now.getTime()/1000)));setDateStr(toLocalInputValue(now))};
 const toUnixFromDate=()=>{const t=new Date(dateStr).getTime();if(!Number.isNaN(t))setUnix(String(Math.floor(t/1000)))};
 return <ToolShell title="Unix timestamp converter" description="Convert a Unix timestamp to a readable date, or a date to a Unix timestamp, instantly in your browser." faq={[{q:'What timezone is used?',a:'Dates are shown in your browser\'s local timezone alongside UTC.'}]}>
  <div className="controls">
   <div className="field"><label>Unix timestamp (seconds)</label><input value={unix} onChange={e=>setUnix(e.target.value)}/></div>
   <div className="field"><label>Date & time</label><input type="datetime-local" value={dateStr} onChange={e=>{setDateStr(e.target.value);toUnixFromDate()}}/></div>
  </div>
  <div style={{marginTop:14}}><button className="btn btnGhost" onClick={setNow}>Use current time</button></div>
  {d&&!isNaN(d.getTime())?<div className="colorGrid">
   <div className="colorField"><label>Local time</label><b>{d.toString()}</b></div>
   <div className="colorField"><label>UTC / ISO</label><b>{d.toISOString()}</b></div>
   <div className="colorField"><label>Unix (ms)</label><b>{d.getTime()}</b></div>
  </div>:<div className="notice error">Enter a valid Unix timestamp.</div>}
 </ToolShell>;
}

function parseCsv(csv:string):string[][]{
 const rows:string[][]=[];let row:string[]=[];let field='';let inQuotes=false;
 for(let i=0;i<csv.length;i++){
  const c=csv[i];
  if(inQuotes){
   if(c==='"'&&csv[i+1]==='"'){field+='"';i++}
   else if(c==='"')inQuotes=false;
   else field+=c;
  }else{
   if(c==='"')inQuotes=true;
   else if(c===','){row.push(field);field=''}
   else if(c==='\n'){row.push(field);rows.push(row);row=[];field=''}
   else if(c!=='\r')field+=c;
  }
 }
 if(field.length>0||row.length>0){row.push(field);rows.push(row)}
 return rows.filter(r=>r.some(f=>f.trim()!==''));
}

export function CsvToJsonConverter(){
 const[csv,setCsv]=useState('');const[output,setOutput]=useState('');const[error,setError]=useState('');
 const convert=()=>{
  try{
   const rows=parseCsv(csv.trim());
   if(rows.length<2){setError('Add a header row and at least one data row.');setOutput('');return}
   const headers=rows[0];
   const json=rows.slice(1).map(r=>Object.fromEntries(headers.map((h,i)=>[h.trim(),r[i]??''])));
   setOutput(JSON.stringify(json,null,2));setError('');
  }catch{setError('Could not parse this CSV.');setOutput('')}
 };
 const copy=()=>navigator.clipboard?.writeText(output);
 return <ToolShell title="CSV to JSON converter online" description="Paste CSV data with a header row and convert it into clean JSON, entirely in your browser." faq={[{q:'Does it handle quoted fields with commas?',a:'Yes, fields wrapped in double quotes, including commas or escaped quotes inside them, are parsed correctly.'}]}>
  <textarea className="textArea" value={csv} onChange={e=>setCsv(e.target.value)} placeholder={'name,email\nJohn,john@example.com'}/>
  <div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}>
   <button className="btn btnPrimary" onClick={convert}>Convert to JSON</button>
   <button className="btn btnGhost" onClick={()=>{setCsv('');setOutput('');setError('')}}>Clear</button>
  </div>
  {error&&<div className="notice error">{error}</div>}
  {output&&<><pre className="codeBox">{output}</pre><div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy JSON</button></div></>}
 </ToolShell>;
}

function toCsvValue(v:unknown){const s=v===null||v===undefined?'':String(v);return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}

export function JsonToCsvConverter(){
 const[json,setJson]=useState('');const[output,setOutput]=useState('');const[error,setError]=useState('');
 const convert=()=>{
  try{
   const data=JSON.parse(json);
   const rows=Array.isArray(data)?data:[data];
   if(rows.length===0||typeof rows[0]!=='object'){setError('Provide a JSON array of objects.');setOutput('');return}
   const headers=Array.from(rows.reduce((set:Set<string>,row)=>{Object.keys(row||{}).forEach(k=>set.add(k));return set},new Set<string>()));
   const lines=[headers.join(','),...rows.map(row=>headers.map(h=>toCsvValue((row as Record<string,unknown>)[h])).join(','))];
   setOutput(lines.join('\n'));setError('');
  }catch{setError('Could not parse this JSON. Make sure it is a valid array of objects.');setOutput('')}
 };
 const copy=()=>navigator.clipboard?.writeText(output);
 return <ToolShell title="JSON to CSV converter online" description="Paste a JSON array of objects and convert it into a downloadable CSV table, entirely in your browser." faq={[{q:'What if my objects have different fields?',a:'The CSV header includes every field found across all objects; missing values are left blank.'}]}>
  <textarea className="textArea" value={json} onChange={e=>setJson(e.target.value)} placeholder='[{"name":"John","email":"john@example.com"}]'/>
  <div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}>
   <button className="btn btnPrimary" onClick={convert}>Convert to CSV</button>
   <button className="btn btnGhost" onClick={()=>{setJson('');setOutput('');setError('')}}>Clear</button>
  </div>
  {error&&<div className="notice error">{error}</div>}
  {output&&<><pre className="codeBox">{output}</pre><div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy CSV</button></div></>}
 </ToolShell>;
}

export function AiTokenCounter(){
 const[text,setText]=useState('');
 const stats=useMemo(()=>{
  const chars=text.length;
  const words=text.trim()?text.trim().split(/\s+/).length:0;
  const approxTokens=Math.ceil(chars/4);
  return{chars,words,approxTokens};
 },[text]);
 return <ToolShell title="AI prompt token counter" description="Estimate how many tokens a prompt will use before sending it to an AI model, based on the common ~4-characters-per-token rule of thumb." faq={[{q:'Is this exact?',a:'No. Different AI providers use different tokenizers, so this gives a close approximation, not an exact count.'},{q:'Why does token count matter?',a:'Most AI APIs charge and limit usage by token count, so estimating ahead helps you stay within context limits and budget.'}]}>
  <textarea className="textArea" value={text} onChange={e=>setText(e.target.value)} placeholder="Paste your AI prompt here…"/>
  <div className="colorGrid">
   <div className="colorField"><label>Characters</label><b>{stats.chars}</b></div>
   <div className="colorField"><label>Words</label><b>{stats.words}</b></div>
   <div className="colorField"><label>~Estimated tokens</label><b>{stats.approxTokens}</b></div>
  </div>
 </ToolShell>;
}

function describeField(value:string,unit:string,names?:string[]):string{
 value=value.trim();
 if(value==='*')return `every ${unit}`;
 if(/^\*\/\d+$/.test(value))return `every ${value.slice(2)} ${unit}s`;
 const label=(n:string)=>names?names[parseInt(n,10)]||n:n;
 if(/^\d+(-\d+)?(,\d+(-\d+)?)*$/.test(value))return value.split(',').map(part=>part.includes('-')?part.split('-').map(label).join(' through '):label(part)).join(', ');
 return value;
}

export function CronParser(){
 const[expr,setExpr]=useState('*/15 * * * *');
 const parts=expr.trim().split(/\s+/);
 const valid=parts.length===5;
 const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
 const description=valid?(()=>{
  const[min,hour,dom,month,dow]=parts;
  const bits:string[]=[];
  bits.push(`At ${describeField(min,'minute')}`);
  if(hour!=='*')bits.push(`past ${describeField(hour,'hour')}`);
  if(dom!=='*')bits.push(`on day-of-month ${describeField(dom,'day')}`);
  if(month!=='*')bits.push(`in month ${describeField(month,'month')}`);
  if(dow!=='*')bits.push(`on ${describeField(dow,'day',days)}`);
  return bits.join(', ');
 })():'';
 return <ToolShell title="Cron expression parser" description="Paste a 5-field cron expression and get a plain-English description of its schedule, useful for DevOps and backend scheduling." faq={[{q:'What format is expected?',a:'Standard 5-field cron: minute, hour, day-of-month, month, day-of-week, e.g. "*/15 * * * *".'}]}>
  <div className="field"><label>Cron expression</label><input value={expr} onChange={e=>setExpr(e.target.value)} placeholder="*/15 * * * *" style={{fontFamily:"'Space Grotesk',monospace"}}/></div>
  {!valid&&<div className="notice error">Enter exactly 5 space-separated fields: minute hour day month weekday.</div>}
  {valid&&<div className="result"><span style={{textTransform:'capitalize'}}>{description}</span></div>}
 </ToolShell>;
}
