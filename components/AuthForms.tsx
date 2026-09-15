'use client';import {useState} from 'react';import Link from 'next/link';import Image from 'next/image';import {useRouter} from 'next/navigation';

export function SignupForm(){
 const[name,setName]=useState('');const[email,setEmail]=useState('');const[password,setPassword]=useState('');const[confirm,setConfirm]=useState('');
 const[error,setError]=useState('');const[busy,setBusy]=useState(false);
 const router=useRouter();

 const submit=async(e:React.FormEvent)=>{
  e.preventDefault();setError('');
  if(password.length<8){setError('Password must be at least 8 characters.');return}
  if(password!==confirm){setError('Passwords do not match.');return}
  setBusy(true);
  try{
   const r=await fetch('/api/auth/signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email,password})});
   const data=await r.json();
   if(!r.ok){setError(data.error||'Could not create account.');return}
   router.push('/account');router.refresh();
  }catch{setError('Network error. Please try again.')}
  finally{setBusy(false)}
 };

 return <div className="authWrap"><div className="authCard">
  <div className="authLogo"><Image src="/images/favicon.png" alt="CraftSprint" width={48} height={48} style={{borderRadius:12}}/></div>
  <h1>Create your account</h1>
  <p>Join CraftSprint to save your preferences and get the most out of every tool.</p>
  <form onSubmit={submit}>
   <div className="authField"><label>Full name</label><input required value={name} onChange={e=>setName(e.target.value)} maxLength={80} placeholder="Your name"/></div>
   <div className="authField"><label>Email</label><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></div>
   <div className="authField"><label>Password</label><input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters"/></div>
   <div className="authField"><label>Confirm password</label><input required type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Re-enter password"/></div>
   <button className="authSubmit" disabled={busy}>{busy?'Creating account…':'Create account'}</button>
   {error&&<div className="authNotice">{error}</div>}
  </form>
  <div className="authSwitch">Already have an account? <Link href="/login">Log in</Link></div>
 </div></div>;
}

export function LoginForm(){
 const[email,setEmail]=useState('');const[password,setPassword]=useState('');
 const[error,setError]=useState('');const[busy,setBusy]=useState(false);
 const router=useRouter();

 const submit=async(e:React.FormEvent)=>{
  e.preventDefault();setError('');setBusy(true);
  try{
   const r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
   const data=await r.json();
   if(!r.ok){setError(data.error||'Could not sign in.');return}
   router.push('/account');router.refresh();
  }catch{setError('Network error. Please try again.')}
  finally{setBusy(false)}
 };

 return <div className="authWrap"><div className="authCard">
  <div className="authLogo"><Image src="/images/favicon.png" alt="CraftSprint" width={48} height={48} style={{borderRadius:12}}/></div>
  <h1>Welcome back</h1>
  <p>Log in to continue to CraftSprint.</p>
  <form onSubmit={submit}>
   <div className="authField"><label>Email</label><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></div>
   <div className="authField"><label>Password</label><input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/></div>
   <button className="authSubmit" disabled={busy}>{busy?'Signing in…':'Log in'}</button>
   {error&&<div className="authNotice">{error}</div>}
  </form>
  <div className="authSwitch">New to CraftSprint? <Link href="/signup">Create an account</Link></div>
 </div></div>;
}
