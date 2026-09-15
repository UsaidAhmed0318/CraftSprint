'use client';import {useState,useMemo} from 'react';import ToolShell from './ToolShell';

function base64UrlDecode(s:string){
 const pad=s.length%4===0?'':'='.repeat(4-(s.length%4));
 const b64=(s+pad).replace(/-/g,'+').replace(/_/g,'/');
 return decodeURIComponent(atob(b64).split('').map(c=>'%'+c.charCodeAt(0).toString(16).padStart(2,'0')).join(''));
}

export function JwtDecoder(){
 const[token,setToken]=useState('');
 const result=useMemo(()=>{
  const parts=token.trim().split('.');
  if(parts.length<2)return null;
  try{
   const header=JSON.parse(base64UrlDecode(parts[0]));
   const payload=JSON.parse(base64UrlDecode(parts[1]));
   return{header,payload};
  }catch{return{error:true}}
 },[token]);
 return <ToolShell title="JWT decoder online" description="Paste a JSON Web Token to instantly decode its header and payload. Decoding happens locally — no token data is sent anywhere." faq={[{q:'Does this verify the signature?',a:'No, this only decodes the header and payload for inspection; it does not verify the signature.'},{q:'Is my token uploaded?',a:'No, decoding happens entirely in your browser using Base64URL decoding.'}]}>
  <textarea className="textArea" style={{minHeight:120}} value={token} onChange={e=>setToken(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…"/>
  {result&&'error' in result&&<div className="notice error">This does not look like a valid JWT.</div>}
  {result&&!('error' in result)&&<>
   <h3 style={{marginTop:22}}>Header</h3><pre className="codeBox">{JSON.stringify(result.header,null,2)}</pre>
   <h3 style={{marginTop:22}}>Payload</h3><pre className="codeBox">{JSON.stringify(result.payload,null,2)}</pre>
  </>}
 </ToolShell>;
}

export function MetaTagGenerator(){
 const[title,setTitle]=useState('My Page Title');const[desc,setDesc]=useState('A short page description for search engines and social previews.');
 const[url,setUrl]=useState('https://example.com');const[image,setImage]=useState('https://example.com/og-image.png');const[siteName,setSiteName]=useState('My Site');
 const code=`<title>${title}</title>\n<meta name="description" content="${desc}">\n<link rel="canonical" href="${url}">\n\n<meta property="og:type" content="website">\n<meta property="og:title" content="${title}">\n<meta property="og:description" content="${desc}">\n<meta property="og:url" content="${url}">\n<meta property="og:image" content="${image}">\n<meta property="og:site_name" content="${siteName}">\n\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:title" content="${title}">\n<meta name="twitter:description" content="${desc}">\n<meta name="twitter:image" content="${image}">`;
 const copy=()=>navigator.clipboard?.writeText(code);
 return <ToolShell title="Meta tag generator (Open Graph & Twitter Card)" description="Fill in your page details and get ready-to-paste title, description, Open Graph and Twitter Card meta tags." faq={[{q:'Where do these tags go?',a:'Paste the generated tags inside the <head> section of your HTML page.'}]}>
  <div className="controls">
   <div className="field"><label>Page title</label><input value={title} onChange={e=>setTitle(e.target.value)}/></div>
   <div className="field"><label>Site name</label><input value={siteName} onChange={e=>setSiteName(e.target.value)}/></div>
   <div className="field"><label>Page URL</label><input value={url} onChange={e=>setUrl(e.target.value)}/></div>
  </div>
  <div className="field" style={{marginTop:14}}><label>Description</label><textarea className="textArea" style={{minHeight:80}} value={desc} onChange={e=>setDesc(e.target.value)}/></div>
  <div className="field" style={{marginTop:14}}><label>Image URL</label><input value={image} onChange={e=>setImage(e.target.value)}/></div>
  <pre className="codeBox">{code}</pre>
  <div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy tags</button></div>
 </ToolShell>;
}

export function RobotsTxtGenerator(){
 const[allowAll,setAllowAll]=useState(true);const[disallow,setDisallow]=useState('/admin\n/private');const[sitemap,setSitemap]=useState('https://example.com/sitemap.xml');
 const lines=['User-agent: *'];
 if(allowAll)lines.push('Allow: /');
 if(disallow.trim())disallow.trim().split('\n').forEach(p=>lines.push(`Disallow: ${p.trim()}`));
 lines.push('',`Sitemap: ${sitemap}`);
 const code=lines.join('\n');
 const copy=()=>navigator.clipboard?.writeText(code);
 return <ToolShell title="Robots.txt generator" description="Generate a robots.txt file that controls which parts of your site search engines are allowed to crawl." faq={[{q:'Where do I put robots.txt?',a:'Save it as robots.txt in the root of your domain, e.g. https://example.com/robots.txt.'}]}>
  <label className="checkRow"><input type="checkbox" checked={allowAll} onChange={e=>setAllowAll(e.target.checked)}/>Allow all crawlers by default</label>
  <div className="field" style={{marginTop:14}}><label>Disallow paths (one per line)</label><textarea className="textArea" style={{minHeight:100}} value={disallow} onChange={e=>setDisallow(e.target.value)}/></div>
  <div className="field" style={{marginTop:14}}><label>Sitemap URL</label><input value={sitemap} onChange={e=>setSitemap(e.target.value)}/></div>
  <pre className="codeBox">{code}</pre>
  <div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy robots.txt</button></div>
 </ToolShell>;
}

export function SitemapGenerator(){
 const[urls,setUrls]=useState('https://example.com/\nhttps://example.com/about\nhttps://example.com/contact');
 const code=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.trim().split('\n').filter(Boolean).map(u=>`  <url>\n    <loc>${u.trim()}</loc>\n  </url>`).join('\n')}\n</urlset>`;
 const copy=()=>navigator.clipboard?.writeText(code);
 return <ToolShell title="XML sitemap generator" description="Paste a list of page URLs and generate a valid sitemap.xml file for search engines." faq={[{q:'How many URLs can a sitemap contain?',a:'Up to 50,000 URLs per sitemap file according to the sitemap protocol; split larger sites into multiple files.'}]}>
  <div className="field"><label>Page URLs (one per line)</label><textarea className="textArea" value={urls} onChange={e=>setUrls(e.target.value)}/></div>
  <pre className="codeBox">{code}</pre>
  <div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy sitemap.xml</button></div>
 </ToolShell>;
}

function jsonToTs(value:unknown,name:string,out:Map<string,string>):string{
 if(value===null)return 'null';
 if(Array.isArray(value)){
  if(value.length===0)return 'unknown[]';
  return `${jsonToTs(value[0],name,out)}[]`;
 }
 if(typeof value==='object'){
  const fields=Object.entries(value as Record<string,unknown>).map(([k,v])=>`  ${/^[a-zA-Z_$][\w$]*$/.test(k)?k:`"${k}"`}: ${jsonToTs(v,k.charAt(0).toUpperCase()+k.slice(1),out)};`).join('\n');
  const typeName=name.charAt(0).toUpperCase()+name.slice(1)||'Root';
  out.set(typeName,`interface ${typeName} {\n${fields}\n}`);
  return typeName;
 }
 return typeof value;
}

export function JsonToTsConverter(){
 const[json,setJson]=useState('{\n  "id": 1,\n  "name": "John",\n  "active": true,\n  "tags": ["a","b"]\n}');
 const[output,setOutput]=useState('');const[error,setError]=useState('');
 const convert=()=>{
  try{
   const data=JSON.parse(json);
   const out=new Map<string,string>();
   jsonToTs(data,'Root',out);
   setOutput([...out.values()].reverse().join('\n\n'));setError('');
  }catch{setError('Invalid JSON.');setOutput('')}
 };
 const copy=()=>navigator.clipboard?.writeText(output);
 return <ToolShell title="JSON to TypeScript type converter" description="Paste a JSON object and generate matching TypeScript interfaces, saving you from writing types by hand." faq={[{q:'Does it handle nested objects and arrays?',a:'Yes, nested objects become their own named interfaces and arrays are typed based on their first item.'}]}>
  <textarea className="textArea" value={json} onChange={e=>setJson(e.target.value)}/>
  <div style={{marginTop:16}}><button className="btn btnPrimary" onClick={convert}>Generate TypeScript</button></div>
  {error&&<div className="notice error">{error}</div>}
  {output&&<><pre className="codeBox">{output}</pre><div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy types</button></div></>}
 </ToolShell>;
}

export function CssGridGenerator(){
 const[cols,setCols]=useState(3);const[rows,setRows]=useState(2);const[gap,setGap]=useState(12);
 const code=`display: grid;\ngrid-template-columns: repeat(${cols}, 1fr);\ngrid-template-rows: repeat(${rows}, 1fr);\ngap: ${gap}px;`;
 const copy=()=>navigator.clipboard?.writeText(code);
 return <ToolShell title="CSS Grid generator" description="Visually configure columns, rows and gap for a CSS Grid layout and copy the ready-to-use code." faq={[{q:'Does this cover every grid feature?',a:'This generator covers the most common equal-column/row grid setup; advanced named areas can be added manually.'}]}>
  <div className="controls">
   <div className="field"><label>Columns: {cols}</label><input type="range" min="1" max="8" value={cols} onChange={e=>setCols(Number(e.target.value))}/></div>
   <div className="field"><label>Rows: {rows}</label><input type="range" min="1" max="6" value={rows} onChange={e=>setRows(Number(e.target.value))}/></div>
   <div className="field"><label>Gap: {gap}px</label><input type="range" min="0" max="40" value={gap} onChange={e=>setGap(Number(e.target.value))}/></div>
  </div>
  <div className="gridPreview" style={{display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gridTemplateRows:`repeat(${rows},1fr)`,gap}}>{Array.from({length:cols*rows},(_,i)=><div key={i}>{i+1}</div>)}</div>
  <pre className="codeBox">{code}</pre>
  <div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy CSS</button></div>
 </ToolShell>;
}

export function CssFlexboxGenerator(){
 const[direction,setDirection]=useState('row');const[justify,setJustify]=useState('flex-start');const[align,setAlign]=useState('stretch');const[gap,setGap]=useState(12);const[count,setCount]=useState(4);
 const code=`display: flex;\nflex-direction: ${direction};\njustify-content: ${justify};\nalign-items: ${align};\ngap: ${gap}px;`;
 const copy=()=>navigator.clipboard?.writeText(code);
 return <ToolShell title="CSS Flexbox generator" description="Visually configure direction, justify-content, align-items and gap for a Flexbox layout and copy the CSS." faq={[{q:'What is the difference between justify-content and align-items?',a:'justify-content controls spacing along the main axis; align-items controls alignment along the cross axis.'}]}>
  <div className="controls">
   <div className="field"><label>Direction</label><select value={direction} onChange={e=>setDirection(e.target.value)}><option value="row">row</option><option value="row-reverse">row-reverse</option><option value="column">column</option><option value="column-reverse">column-reverse</option></select></div>
   <div className="field"><label>Justify content</label><select value={justify} onChange={e=>setJustify(e.target.value)}><option>flex-start</option><option>center</option><option>flex-end</option><option>space-between</option><option>space-around</option><option>space-evenly</option></select></div>
   <div className="field"><label>Align items</label><select value={align} onChange={e=>setAlign(e.target.value)}><option>stretch</option><option>flex-start</option><option>center</option><option>flex-end</option><option>baseline</option></select></div>
  </div>
  <div className="controls">
   <div className="field"><label>Gap: {gap}px</label><input type="range" min="0" max="40" value={gap} onChange={e=>setGap(Number(e.target.value))}/></div>
   <div className="field"><label>Items: {count}</label><input type="range" min="1" max="8" value={count} onChange={e=>setCount(Number(e.target.value))}/></div>
  </div>
  <div className="gridPreview" style={{display:'flex',flexDirection:direction as React.CSSProperties['flexDirection'],justifyContent:justify,alignItems:align,gap}}>{Array.from({length:count},(_,i)=><div key={i} style={{width:60,height:60}}>{i+1}</div>)}</div>
  <pre className="codeBox">{code}</pre>
  <div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy CSS</button></div>
 </ToolShell>;
}
