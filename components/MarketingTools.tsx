'use client';import {useState,useMemo} from 'react';import ToolShell from './ToolShell';

export function UtmLinkBuilder(){
 const[url,setUrl]=useState('');const[source,setSource]=useState('');const[medium,setMedium]=useState('');
 const[campaign,setCampaign]=useState('');const[term,setTerm]=useState('');const[content,setContent]=useState('');
 const result=useMemo(()=>{
  if(!url.trim())return '';
  try{
   const u=new URL(url.trim());
   if(source)u.searchParams.set('utm_source',source);
   if(medium)u.searchParams.set('utm_medium',medium);
   if(campaign)u.searchParams.set('utm_campaign',campaign);
   if(term)u.searchParams.set('utm_term',term);
   if(content)u.searchParams.set('utm_content',content);
   return u.toString();
  }catch{return ''}
 },[url,source,medium,campaign,term,content]);
 const copy=()=>navigator.clipboard?.writeText(result);
 return <ToolShell title="UTM campaign link builder" description="Build trackable UTM links for ads, email and social campaigns so you can see exactly which channel drives traffic in Google Analytics." faq={[{q:'What is a UTM link?',a:'A UTM link is a regular URL with extra utm_ query parameters that analytics tools use to attribute traffic to a specific campaign, source and medium.'},{q:'Which fields are required?',a:'At minimum, set the destination URL, source and medium; campaign name is strongly recommended for reporting.'}]}>
  <div className="field"><label>Website URL</label><input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://example.com/landing-page"/></div>
  <div className="controls">
   <div className="field"><label>Campaign source</label><input value={source} onChange={e=>setSource(e.target.value)} placeholder="facebook, google, newsletter"/></div>
   <div className="field"><label>Campaign medium</label><input value={medium} onChange={e=>setMedium(e.target.value)} placeholder="cpc, social, email"/></div>
   <div className="field"><label>Campaign name</label><input value={campaign} onChange={e=>setCampaign(e.target.value)} placeholder="summer_sale"/></div>
  </div>
  <div className="controls">
   <div className="field"><label>Term (optional)</label><input value={term} onChange={e=>setTerm(e.target.value)} placeholder="running+shoes"/></div>
   <div className="field"><label>Content (optional)</label><input value={content} onChange={e=>setContent(e.target.value)} placeholder="logolink"/></div>
  </div>
  {url.trim()&&!result&&<div className="notice error">Enter a full URL including https://</div>}
  {result&&<><pre className="codeBox" style={{wordBreak:'break-all'}}>{result}</pre><div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy link</button></div></>}
 </ToolShell>;
}

export function HashtagGenerator(){
 const[input,setInput]=useState('');const[style,setStyle]=useState<'lower'|'camel'>('camel');
 const tags=useMemo(()=>{
  const words=input.split(/[,\n]+/).map(w=>w.trim()).filter(Boolean);
  const seen=new Set<string>();const out:string[]=[];
  for(const w of words){
   const clean=w.replace(/[^a-zA-Z0-9\s]/g,'').trim();
   if(!clean)continue;
   const tag=style==='camel'
    ?clean.split(/\s+/).map(p=>p.charAt(0).toUpperCase()+p.slice(1).toLowerCase()).join('')
    :clean.replace(/\s+/g,'').toLowerCase();
   const key=tag.toLowerCase();
   if(!seen.has(key)){seen.add(key);out.push('#'+tag)}
  }
  return out;
 },[input,style]);
 const text=tags.join(' ');
 const copy=()=>navigator.clipboard?.writeText(text);
 return <ToolShell title="Hashtag generator & formatter" description="Turn a list of keywords or phrases into clean, deduplicated hashtags for Instagram, TikTok, X and LinkedIn posts." faq={[{q:'How many hashtags should I use?',a:'Instagram allows up to 30 per post, but 5-15 relevant tags usually perform better than the maximum.'},{q:'Does this remove duplicates?',a:'Yes, duplicate hashtags (regardless of case) are automatically removed.'}]}>
  <div className="field"><label>Keywords or phrases (comma or new line separated)</label><textarea className="textArea" style={{minHeight:140}} value={input} onChange={e=>setInput(e.target.value)} placeholder={'content creator\nsmall business\nfreelance design'}/></div>
  <div className="toggleGroup">
   <button className={`toggleBtn ${style==='camel'?'active':''}`} onClick={()=>setStyle('camel')}>#CamelCase</button>
   <button className={`toggleBtn ${style==='lower'?'active':''}`} onClick={()=>setStyle('lower')}>#lowercase</button>
  </div>
  {tags.length>0&&<><pre className="codeBox">{text}</pre><div className="stats"><span>{tags.length} hashtags</span><span>{text.length} characters</span></div><div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy hashtags</button></div></>}
 </ToolShell>;
}
