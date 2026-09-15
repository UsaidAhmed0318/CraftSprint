import {NextResponse} from 'next/server';

export async function GET(req:Request){
 const {searchParams}=new URL(req.url);
 const from=(searchParams.get('from')||'USD').toUpperCase();
 const to=(searchParams.get('to')||'EUR').toUpperCase();
 try{
  const r=await fetch(`https://open.er-api.com/v6/latest/${from}`,{next:{revalidate:3600}});
  if(!r.ok)return NextResponse.json({error:'Could not fetch exchange rates.'},{status:502});
  const data=await r.json();
  const rate=data.rates?.[to];
  if(data.result!=='success'||typeof rate!=='number')return NextResponse.json({error:'Unsupported currency pair.'},{status:400});
  return NextResponse.json({from,to,rate,date:data.time_last_update_utc});
 }catch{return NextResponse.json({error:'Could not fetch exchange rates.'},{status:502})}
}
