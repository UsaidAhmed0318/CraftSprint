import type {Metadata} from 'next';import Image from 'next/image';import {redirect} from 'next/navigation';import {cookies} from 'next/headers';import {verifySessionToken,readUsers,SESSION_COOKIE} from '@/lib/auth';import LogoutButton from '@/components/LogoutButton';

export const metadata:Metadata={title:'My Account',description:'Manage your CraftSprint account.'};

export default async function AccountPage(){
 const store=await cookies();
 const session=verifySessionToken(store.get(SESSION_COOKIE)?.value);
 if(!session)redirect('/login');

 const users=await readUsers();
 const user=users.find(u=>u.id===session!.sub);
 if(!user)redirect('/login');

 return <div className="authWrap"><div className="authCard">
  <div className="authLogo"><Image src="/images/favicon.png" alt="CraftSprint" width={48} height={48} style={{borderRadius:12}}/></div>
  <h1>My account</h1>
  <p>You&apos;re signed in to CraftSprint.</p>
  <div className="colorGrid" style={{gridTemplateColumns:'1fr'}}>
   <div className="colorField" style={{background:'rgba(255,255,255,.06)'}}><label style={{color:'#9aa5c4'}}>Name</label><b style={{color:'#fff'}}>{user.name}</b></div>
   <div className="colorField" style={{background:'rgba(255,255,255,.06)'}}><label style={{color:'#9aa5c4'}}>Email</label><b style={{color:'#fff'}}>{user.email}</b></div>
   <div className="colorField" style={{background:'rgba(255,255,255,.06)'}}><label style={{color:'#9aa5c4'}}>Member since</label><b style={{color:'#fff'}}>{new Date(user.createdAt).toLocaleDateString()}</b></div>
  </div>
  <div style={{marginTop:22}}><LogoutButton/></div>
 </div></div>;
}
