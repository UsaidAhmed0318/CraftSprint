import {NextResponse} from 'next/server';import {findUserByEmail,verifyPassword,createSessionToken,publicUser,SESSION_COOKIE,sessionCookieOptions} from '@/lib/auth';

export async function POST(req:Request){
 try{
  const body=await req.json();
  const email=typeof body.email==='string'?body.email.trim():'';
  const password=typeof body.password==='string'?body.password:'';
  if(!email||!password)return NextResponse.json({error:'Enter your email and password.'},{status:400});

  const user=await findUserByEmail(email);
  if(!user||!verifyPassword(password,user.passwordHash))return NextResponse.json({error:'Incorrect email or password.'},{status:401});

  const token=createSessionToken(user.id);
  const res=NextResponse.json({ok:true,user:publicUser(user)});
  res.cookies.set(SESSION_COOKIE,token,sessionCookieOptions);
  return res;
 }catch{return NextResponse.json({error:'Could not sign in.'},{status:400})}
}
