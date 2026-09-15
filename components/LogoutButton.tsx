'use client';import {useRouter} from 'next/navigation';import {useState} from 'react';

export default function LogoutButton(){
 const router=useRouter();const[busy,setBusy]=useState(false);
 const logout=async()=>{setBusy(true);await fetch('/api/auth/logout',{method:'POST'});router.push('/');router.refresh()};
 return <button className="authSubmit" style={{background:'#1c2547'}} disabled={busy} onClick={logout}>{busy?'Logging out…':'Log out'}</button>;
}
