import {NextResponse} from 'next/server';import {createUser,createSessionToken,publicUser,SESSION_COOKIE,sessionCookieOptions} from '@/lib/auth';

export async function POST(req:Request){
 try{
  const body=await req.json();
  const name=typeof body.name==='string'?body.name.trim():'';
  const email=typeof body.email==='string'?body.email.trim():'';
  const password=typeof body.password==='string'?body.password:'';
  if(!name||name.length>80)return NextResponse.json({error:'Enter a valid name.'},{status:400});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return NextResponse.json({error:'Enter a valid email address.'},{status:400});
  if(password.length<8)return NextResponse.json({error:'Password must be at least 8 characters.'},{status:400});

  const user=await createUser(name,email,password);
  const token=createSessionToken(user.id);
  const res=NextResponse.json({ok:true,user:publicUser(user)});
  res.cookies.set(SESSION_COOKIE,token,sessionCookieOptions);
  return res;
 }catch(e){
  const message=e instanceof Error?e.message:'Could not create account.';
  return NextResponse.json({error:message},{status:400});
 }
}
