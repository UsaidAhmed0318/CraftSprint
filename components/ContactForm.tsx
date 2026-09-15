'use client';import {useState} from 'react';export default function ContactForm(){const[name,setName]=useState('');const[email,setEmail]=useState('');const[message,setMessage]=useState('');const[state,setState]=useState('');const[busy,setBusy]=useState(false);const[isError,setIsError]=useState(false);
async function submit(e:React.FormEvent){
 e.preventDefault();setBusy(true);setState('Sending…');setIsError(false);
 try{
  const r=await fetch('/api/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,message})});
  const data=await r.json().catch(()=>({}));
  if(r.ok){setState('Thanks — your message was sent. We\'ll reply by email soon.');setName('');setEmail('');setMessage('')}
  else{setIsError(true);setState(data.error||'Could not send. Please try again.')}
 }catch{setIsError(true);setState('Network error. Please check your connection and try again.')}
 finally{setBusy(false)}
}
return <form onSubmit={submit} className="toolPanel"><div className="field"><label>Name</label><input required value={name} onChange={e=>setName(e.target.value)} maxLength={80}/></div><div className="field" style={{marginTop:14}}><label>Email</label><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} maxLength={120}/></div><div className="field" style={{marginTop:14}}><label>Message</label><textarea required className="textArea" value={message} onChange={e=>setMessage(e.target.value)} maxLength={2000}/></div><button className="btn btnPrimary" style={{marginTop:14}} disabled={busy}>{busy?'Sending…':'Send message'}</button>{state&&<div className={`notice ${isError?'error':''}`}>{state}</div>}</form>}
