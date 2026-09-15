'use client';import {useState,useMemo} from 'react';import ToolShell from './ToolShell';

export function KeywordDensityChecker(){
 const[text,setText]=useState('');const[keyword,setKeyword]=useState('');
 const stats=useMemo(()=>{
  const words=text.trim()?text.trim().split(/\s+/):[];
  const total=words.length;
  const kw=keyword.trim().toLowerCase();
  if(!kw||total===0)return{total,count:0,density:0};
  const count=(text.toLowerCase().match(new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'g'))||[]).length;
  return{total,count,density:total?(count/total)*100:0};
 },[text,keyword]);
 return <ToolShell title="Keyword density checker" description="Paste your content and a target keyword to see how many times it appears and what percentage of your text it makes up." faq={[{q:'What is a good keyword density?',a:'Most SEO guidance suggests 1-2% is a healthy range; higher density can look like keyword stuffing.'}]}>
  <textarea className="textArea" value={text} onChange={e=>setText(e.target.value)} placeholder="Paste your article or content here…"/>
  <div className="field" style={{marginTop:14}}><label>Target keyword or phrase</label><input value={keyword} onChange={e=>setKeyword(e.target.value)}/></div>
  <div className="colorGrid">
   <div className="colorField"><label>Total words</label><b>{stats.total}</b></div>
   <div className="colorField"><label>Keyword occurrences</label><b>{stats.count}</b></div>
   <div className="colorField"><label>Density</label><b>{stats.density.toFixed(2)}%</b></div>
  </div>
 </ToolShell>;
}

const POWER_WORDS=['free','proven','ultimate','essential','secret','instant','easy','powerful','amazing','exclusive','new','best','guaranteed','simple'];
export function HeadlineAnalyzer(){
 const[headline,setHeadline]=useState('');
 const analysis=useMemo(()=>{
  const words=headline.trim()?headline.trim().split(/\s+/):[];
  const chars=headline.length;
  const hasNumber=/\d/.test(headline);
  const hasPower=POWER_WORDS.some(w=>headline.toLowerCase().includes(w));
  const hasQuestion=headline.trim().endsWith('?');
  let score=40;
  if(words.length>=6&&words.length<=12)score+=20;
  if(hasNumber)score+=15;
  if(hasPower)score+=15;
  if(hasQuestion)score+=10;
  if(chars>20&&chars<70)score+=10;
  score=Math.min(100,score);
  return{words:words.length,chars,hasNumber,hasPower,hasQuestion,score};
 },[headline]);
 return <ToolShell title="Headline analyzer" description="Score your headline against common copywriting best practices — length, numbers, power words and questions." faq={[{q:'Is this AI-powered?',a:'No, this uses transparent, rule-based heuristics based on well-known copywriting guidelines, not machine learning.'}]}>
  <div className="field"><label>Your headline</label><input value={headline} onChange={e=>setHeadline(e.target.value)} placeholder="7 Proven Ways to Grow Your Business in 2026"/></div>
  <div className="result"><span>Headline score</span><b style={{fontSize:24,color:analysis.score>=70?'var(--success)':analysis.score>=50?'var(--brand)':'var(--danger)'}}>{analysis.score}/100</b></div>
  <div className="colorGrid">
   <div className="colorField"><label>Words</label><b>{analysis.words}</b></div>
   <div className="colorField"><label>Has a number</label><b>{analysis.hasNumber?'Yes':'No'}</b></div>
   <div className="colorField"><label>Has a power word</label><b>{analysis.hasPower?'Yes':'No'}</b></div>
  </div>
 </ToolShell>;
}

const SPAM_WORDS=['free','buy now','act now','urgent','winner','cash','guarantee','click here','limited time','click below'];
export function EmailSubjectLineTester(){
 const[subject,setSubject]=useState('');
 const chars=subject.length;
 const spamHits=SPAM_WORDS.filter(w=>subject.toLowerCase().includes(w));
 const hasEmoji=/\p{Extended_Pictographic}/u.test(subject);
 const hasPersonalization=/\{.*?\}|\[.*?\]/.test(subject);
 return <ToolShell title="Email subject line tester" description="Check your email subject line for length, spam-trigger words, emoji and personalization before you hit send." faq={[{q:'What is the ideal subject line length?',a:'Around 30-50 characters displays fully in most inboxes, especially on mobile.'}]}>
  <div className="field"><label>Subject line</label><input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Your order has shipped, {name}!"/></div>
  <div className="colorGrid">
   <div className="colorField"><label>Characters</label><b style={{color:chars>50?'var(--danger)':'inherit'}}>{chars}</b></div>
   <div className="colorField"><label>Emoji used</label><b>{hasEmoji?'Yes':'No'}</b></div>
   <div className="colorField"><label>Personalization</label><b>{hasPersonalization?'Yes':'No'}</b></div>
  </div>
  {spamHits.length>0?<div className="notice error">Possible spam-trigger phrases: {spamHits.join(', ')}</div>:subject&&<div className="notice">No common spam-trigger phrases found.</div>}
 </ToolShell>;
}

const CTA_BANK:Record<string,string[]>={
 Urgency:['Get started before it\'s gone','Only a few spots left — join now','Don\'t miss out — act today'],
 Benefit:['Start saving time today','Grow your business faster','Unlock your free trial'],
 Curiosity:['See how it works','Discover what\'s inside','Find out why thousands switched'],
 Direct:['Get started free','Sign up now','Book a demo'],
};
export function CtaGenerator(){
 const[category,setCategory]=useState<keyof typeof CTA_BANK>('Benefit');
 const copy=(t:string)=>navigator.clipboard?.writeText(t);
 return <ToolShell title="Call-to-action (CTA) generator" description="Browse a curated bank of high-converting call-to-action phrases by category and copy the one that fits your campaign." faq={[{q:'Are these AI-generated?',a:'No, these are curated, proven CTA patterns commonly used in marketing — pick and adapt the one that fits your brand voice.'}]}>
  <div className="toggleGroup">{(Object.keys(CTA_BANK) as (keyof typeof CTA_BANK)[]).map(c=><button key={c} className={`toggleBtn ${category===c?'active':''}`} onClick={()=>setCategory(c)}>{c}</button>)}</div>
  <div className="colorGrid" style={{gridTemplateColumns:'1fr'}}>{CTA_BANK[category].map(t=><div className="colorField" key={t} style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}><b>{t}</b><button className="btn btnGhost" onClick={()=>copy(t)}>Copy</button></div>)}</div>
 </ToolShell>;
}

export function SocialBioGenerator(){
 const[role,setRole]=useState('Designer');const[niche,setNiche]=useState('brand identity');const[trait,setTrait]=useState('coffee-fueled');
 const templates=[
  `${role} helping brands with ${niche}. ${trait} & always creating ✨`,
  `${trait} ${role.toLowerCase()} obsessed with ${niche}.`,
  `I'm a ${role} who loves ${niche}. Let's build something great.`,
  `${role} · ${niche} · ${trait} human 🌱`,
 ];
 const copy=(t:string)=>navigator.clipboard?.writeText(t);
 return <ToolShell title="Social media bio generator" description="Fill in your role and interests to get several ready-to-use bio templates for Instagram, X, LinkedIn and TikTok." faq={[{q:'Can I edit these?',a:'Yes, use them as a starting point and tweak the wording to match your voice.'}]}>
  <div className="controls">
   <div className="field"><label>Role</label><input value={role} onChange={e=>setRole(e.target.value)}/></div>
   <div className="field"><label>Niche / focus</label><input value={niche} onChange={e=>setNiche(e.target.value)}/></div>
   <div className="field"><label>Personality trait</label><input value={trait} onChange={e=>setTrait(e.target.value)}/></div>
  </div>
  <div className="colorGrid" style={{gridTemplateColumns:'1fr',marginTop:20}}>{templates.map(t=><div className="colorField" key={t} style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}><b style={{fontWeight:600}}>{t}</b><button className="btn btnGhost" onClick={()=>copy(t)}>Copy</button></div>)}</div>
 </ToolShell>;
}

export function BlogOutlineGenerator(){
 const[title,setTitle]=useState('');const[subtopics,setSubtopics]=useState('');
 const outline=useMemo(()=>{
  const topics=subtopics.split('\n').map(s=>s.trim()).filter(Boolean);
  if(!title.trim())return '';
  const lines=[`# ${title}`,'','## Introduction','- Hook the reader and introduce the problem','- Preview what the article covers',''];
  topics.forEach(t=>lines.push(`## ${t}`,'- Key point',''));
  lines.push('## Conclusion','- Summarize the main takeaways','- Call to action');
  return lines.join('\n');
 },[title,subtopics]);
 const copy=()=>navigator.clipboard?.writeText(outline);
 return <ToolShell title="Blog / article outline generator" description="Enter your title and subtopics to instantly generate a structured outline template with intro and conclusion sections." faq={[{q:'Does this write the article for me?',a:'No, it builds a structural skeleton with intro and conclusion so you can focus on writing the content for each section.'}]}>
  <div className="field"><label>Article title</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="10 Tips for Better Sleep"/></div>
  <div className="field" style={{marginTop:14}}><label>Subtopics / sections (one per line)</label><textarea className="textArea" style={{minHeight:120}} value={subtopics} onChange={e=>setSubtopics(e.target.value)} placeholder={'Set a consistent schedule\nLimit screen time\nCreate a calming routine'}/></div>
  {outline&&<><pre className="codeBox">{outline}</pre><div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy outline</button></div></>}
 </ToolShell>;
}

export function PlagiarismCheckerHelper(){
 const[text,setText]=useState('');
 const sentences=useMemo(()=>text.split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(s=>s.split(/\s+/).length>=6).slice(0,25),[text]);
 return <ToolShell title="Plagiarism checker helper" description="Break an article into sentences and generate one-click Google search links for each, so you can manually verify originality against what is publicly indexed." faq={[{q:'Does this scan a plagiarism database automatically?',a:'No. There is no free way to search the entire web programmatically. This tool instead prepares exact-match Google search links for each sentence so you can quickly check, one click at a time, whether that wording appears elsewhere online.'},{q:'Why are short sentences skipped?',a:'Sentences under 6 words are too generic to search meaningfully, so they are filtered out automatically.'}]}>
  <textarea className="textArea" value={text} onChange={e=>setText(e.target.value)} placeholder="Paste your article or essay here…"/>
  {sentences.length>0&&<div className="colorGrid" style={{gridTemplateColumns:'1fr'}}>
   {sentences.map((s,i)=><div className="colorField" key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
    <span style={{fontSize:13}}>{s}</span>
    <a className="btn btnGhost" style={{whiteSpace:'nowrap'}} href={`https://www.google.com/search?q=${encodeURIComponent(`"${s}"`)}`} target="_blank" rel="noopener noreferrer">Check on Google</a>
   </div>)}
  </div>}
  {text&&sentences.length===0&&<div className="notice">No sentences long enough to check yet — write a few complete sentences.</div>}
 </ToolShell>;
}
