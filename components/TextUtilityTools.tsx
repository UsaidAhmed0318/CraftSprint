'use client';import {useState,useMemo} from 'react';import ToolShell from './ToolShell';

const toTitle=(s:string)=>s.toLowerCase().replace(/(^|\s)\S/g,c=>c.toUpperCase());
const toSentence=(s:string)=>s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g,c=>c.toUpperCase());
const toCamel=(s:string)=>s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g,(_,c)=>c.toUpperCase());
const toSnake=(s:string)=>s.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g,'_').replace(/^_+|_+$/g,'');

export function CaseConverter(){
 const[text,setText]=useState('');
 const copy=()=>navigator.clipboard?.writeText(text);
 return <ToolShell title="Convert text case online" description="Switch pasted text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase and snake_case instantly in your browser." faq={[{q:'Is my text uploaded?',a:'No. All case conversion happens locally in your browser.'},{q:'Can I convert code identifiers?',a:'Yes, camelCase and snake_case are useful for variable and file naming.'}]}>
  <textarea className="textArea" value={text} onChange={e=>setText(e.target.value)} placeholder="Paste your text here…"/>
  <div className="toggleGroup">
   <button className="toggleBtn" onClick={()=>setText(text.toUpperCase())}>UPPERCASE</button>
   <button className="toggleBtn" onClick={()=>setText(text.toLowerCase())}>lowercase</button>
   <button className="toggleBtn" onClick={()=>setText(toTitle(text))}>Title Case</button>
   <button className="toggleBtn" onClick={()=>setText(toSentence(text))}>Sentence case</button>
   <button className="toggleBtn" onClick={()=>setText(toCamel(text))}>camelCase</button>
   <button className="toggleBtn" onClick={()=>setText(toSnake(text))}>snake_case</button>
  </div>
  <div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy</button><button className="btn btnGhost" onClick={()=>setText('')}>Clear</button></div>
 </ToolShell>;
}

export function WordCounter(){
 const[text,setText]=useState('');
 const stats=useMemo(()=>{
  const trimmed=text.trim();
  const words=trimmed?trimmed.split(/\s+/).length:0;
  const chars=text.length;const charsNoSpaces=text.replace(/\s/g,'').length;
  const sentences=trimmed?(trimmed.match(/[.!?]+(\s|$)/g)||[]).length||1:0;
  const paragraphs=trimmed?trimmed.split(/\n\s*\n/).filter(Boolean).length:0;
  const readingTime=Math.max(1,Math.ceil(words/200));
  const speakingTime=Math.max(1,Math.ceil(words/130));
  return{words,chars,charsNoSpaces,sentences,paragraphs,readingTime,speakingTime};
 },[text]);
 return <ToolShell title="Count words and characters online" description="Paste your text to instantly see word count, character count, sentence count and estimated reading time." faq={[{q:'How is reading time calculated?',a:'Reading time assumes an average of 200 words per minute; speaking time assumes about 130 words per minute.'}]}>
  <textarea className="textArea" value={text} onChange={e=>setText(e.target.value)} placeholder="Paste or type your text here…"/>
  <div className="colorGrid">
   <div className="colorField"><label>Words</label><b>{stats.words}</b></div>
   <div className="colorField"><label>Characters</label><b>{stats.chars}</b></div>
   <div className="colorField"><label>Characters (no spaces)</label><b>{stats.charsNoSpaces}</b></div>
   <div className="colorField"><label>Sentences</label><b>{stats.sentences}</b></div>
   <div className="colorField"><label>Paragraphs</label><b>{stats.paragraphs}</b></div>
   <div className="colorField"><label>Reading time</label><b>{stats.readingTime} min</b></div>
  </div>
 </ToolShell>;
}

const LOREM_WORDS='lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');

function makeSentence(){const len=6+Math.floor(Math.random()*9);const words=Array.from({length:len},()=>LOREM_WORDS[Math.floor(Math.random()*LOREM_WORDS.length)]);const s=words.join(' ');return s.charAt(0).toUpperCase()+s.slice(1)+'.'}
function makeParagraph(){const count=3+Math.floor(Math.random()*4);return Array.from({length:count},makeSentence).join(' ')}

export function LoremIpsumGenerator(){
 const[count,setCount]=useState(3);
 const[unit,setUnit]=useState<'paragraphs'|'sentences'|'words'>('paragraphs');
 const[output,setOutput]=useState('');
 const generate=()=>{
  if(unit==='paragraphs')setOutput(Array.from({length:count},makeParagraph).join('\n\n'));
  else if(unit==='sentences')setOutput(Array.from({length:count},makeSentence).join(' '));
  else setOutput(Array.from({length:count},()=>LOREM_WORDS[Math.floor(Math.random()*LOREM_WORDS.length)]).join(' '));
 };
 const copy=()=>navigator.clipboard?.writeText(output);
 return <ToolShell title="Generate Lorem Ipsum placeholder text" description="Create placeholder paragraphs, sentences or words for mockups, wireframes and design layouts." faq={[{q:'What is Lorem Ipsum?',a:'Lorem Ipsum is scrambled, neutral placeholder text used by designers so real content does not distract from layout.'}]}>
  <div className="controls">
   <div className="field"><label>Amount</label><input type="number" min="1" max="50" value={count} onChange={e=>setCount(Number(e.target.value))}/></div>
   <div className="field"><label>Unit</label><select value={unit} onChange={e=>setUnit(e.target.value as typeof unit)}><option value="paragraphs">Paragraphs</option><option value="sentences">Sentences</option><option value="words">Words</option></select></div>
  </div>
  <div style={{marginTop:18}}><button className="btn btnPrimary" onClick={generate}>Generate text</button></div>
  {output&&<><pre className="codeBox">{output}</pre><div className="heroActions" style={{justifyContent:'flex-start',marginTop:14}}><button className="btn btnDark" onClick={copy}>Copy</button></div></>}
 </ToolShell>;
}
