import {NextResponse} from 'next/server';import {Resend} from 'resend';
const CONTACT_EMAIL='usaidahmeddon@gmail.com';
export async function POST(req:Request){
 try{
  const body=await req.json();
  if(typeof body.name!=='string'||typeof body.email!=='string'||typeof body.message!=='string')return NextResponse.json({error:'Invalid request'},{status:400});
  if(!body.name.trim()||!body.message.trim())return NextResponse.json({error:'Name and message are required'},{status:400});
  if(body.name.length>80||body.email.length>120||body.message.length>2000)return NextResponse.json({error:'Input too long'},{status:400});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))return NextResponse.json({error:'Invalid email'},{status:400});

  const apiKey=process.env.RESEND_API_KEY;
  if(!apiKey){
   console.log('RESEND_API_KEY not set — logging message instead of emailing.',{name:body.name,email:body.email,message:body.message});
   return NextResponse.json({ok:true,delivered:false});
  }

  const resend=new Resend(apiKey);
  const {error}=await resend.emails.send({
   from:'CraftSprint <onboarding@resend.dev>',
   to:CONTACT_EMAIL,
   replyTo:body.email,
   subject:`New contact form message from ${body.name}`,
   text:`Name: ${body.name}\nEmail: ${body.email}\n\nMessage:\n${body.message}`,
  });
  if(error){console.error('Resend error',error);return NextResponse.json({error:'Could not send email'},{status:502})}
  return NextResponse.json({ok:true,delivered:true});
 }catch{return NextResponse.json({error:'Invalid JSON'},{status:400})}
}
