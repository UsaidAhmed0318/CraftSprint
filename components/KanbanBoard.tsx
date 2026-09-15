'use client';import {useState,useEffect} from 'react';import ToolShell from './ToolShell';

type Task={id:string;text:string};
type Board=Record<'todo'|'doing'|'done',Task[]>;
const EMPTY:Board={todo:[],doing:[],done:[]};
const STORAGE_KEY='craftsprint-kanban';
const COLS:{key:keyof Board;label:string}[]=[{key:'todo',label:'To Do'},{key:'doing',label:'In Progress'},{key:'done',label:'Done'}];

function loadBoard():Board{
 try{const raw=localStorage.getItem(STORAGE_KEY);return raw?JSON.parse(raw):EMPTY}catch{return EMPTY}
}

export function KanbanBoard(){
 const[board,setBoard]=useState<Board>(loadBoard);
 const[input,setInput]=useState('');

 useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(board))}catch{}},[board]);

 const addTask=()=>{
  if(!input.trim())return;
  setBoard(b=>({...b,todo:[...b.todo,{id:crypto.randomUUID(),text:input.trim()}]}));
  setInput('');
 };
 const move=(col:keyof Board,id:string,dir:1|-1)=>{
  const order:(keyof Board)[]=['todo','doing','done'];
  const idx=order.indexOf(col);const target=order[idx+dir];if(!target)return;
  setBoard(b=>{
   const task=b[col].find(t=>t.id===id);if(!task)return b;
   return{...b,[col]:b[col].filter(t=>t.id!==id),[target]:[...b[target],task]};
  });
 };
 const remove=(col:keyof Board,id:string)=>setBoard(b=>({...b,[col]:b[col].filter(t=>t.id!==id)}));

 return <ToolShell title="Task & Kanban board" description="A simple To Do / In Progress / Done board for tracking small tasks, saved locally in your browser." faq={[{q:'Is this saved to an account?',a:'No, tasks are saved only in this browser using localStorage — they won\'t sync across devices and will be lost if you clear your browser data.'}]}>
  <div className="controls" style={{gridTemplateColumns:'1fr auto'}}>
   <div className="field"><label>New task</label><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTask()} placeholder="Write a task and press Enter"/></div>
   <div style={{display:'flex',alignItems:'end'}}><button className="btn btnPrimary" onClick={addTask}>Add</button></div>
  </div>
  <div className="controls" style={{marginTop:20,alignItems:'start'}}>
   {COLS.map(col=><div key={col.key} className="colorField" style={{minHeight:200}}>
    <label>{col.label} ({board[col.key].length})</label>
    {board[col.key].map(t=><div key={t.id} style={{background:'#fff',borderRadius:10,padding:'10px 12px',marginTop:8,fontSize:13,display:'flex',justifyContent:'space-between',gap:8,alignItems:'center',border:'1px solid var(--line)'}}>
     <span>{t.text}</span>
     <span style={{display:'flex',gap:4}}>
      {col.key!=='todo'&&<button className="btn btnGhost" style={{padding:'4px 8px'}} onClick={()=>move(col.key,t.id,-1)}>←</button>}
      {col.key!=='done'&&<button className="btn btnGhost" style={{padding:'4px 8px'}} onClick={()=>move(col.key,t.id,1)}>→</button>}
      <button className="btn btnGhost" style={{padding:'4px 8px'}} onClick={()=>remove(col.key,t.id)}>✕</button>
     </span>
    </div>)}
   </div>)}
  </div>
 </ToolShell>;
}
