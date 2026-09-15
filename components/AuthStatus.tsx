'use client';import {useEffect,useState} from 'react';import Link from 'next/link';import {useRouter} from 'next/navigation';

type Me={id:string;name:string;email:string};

export default function AuthStatus({mobile=false}:{mobile?:boolean}){
 const[user,setUser]=useState<Me|null|undefined>(undefined);
 const router=useRouter();

 useEffect(()=>{
  let active=true;
  fetch('/api/auth/me').then(r=>r.json()).then(d=>{if(active)setUser(d.user)}).catch(()=>{if(active)setUser(null)});
  return()=>{active=false};
 },[]);

 const logout=async()=>{await fetch('/api/auth/logout',{method:'POST'});setUser(null);router.push('/');router.refresh()};

 if(user===undefined)return null;

 if(mobile){
  return user?<><Link href="/account">My account</Link><a onClick={logout} style={{cursor:'pointer'}}>Log out</a></>:<><Link href="/login">Log in</Link><Link href="/signup">Sign up</Link></>;
 }

 return <div className="navAuth">
  {user?<><Link href="/account">Hi, {user.name.split(' ')[0]}</Link><button className="btn btnPrimary" onClick={logout}>Log out</button></>:<><Link href="/login">Log in</Link><Link className="btn btnPrimary" href="/signup">Sign up</Link></>}
 </div>;
}
