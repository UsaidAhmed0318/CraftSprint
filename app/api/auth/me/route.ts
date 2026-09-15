import {NextResponse} from 'next/server';import {cookies} from 'next/headers';import {verifySessionToken,readUsers,publicUser,SESSION_COOKIE} from '@/lib/auth';

export async function GET(){
 const store=await cookies();
 const token=store.get(SESSION_COOKIE)?.value;
 const session=verifySessionToken(token);
 if(!session)return NextResponse.json({user:null});

 const users=await readUsers();
 const user=users.find(u=>u.id===session.sub);
 if(!user)return NextResponse.json({user:null});
 return NextResponse.json({user:publicUser(user)});
}
