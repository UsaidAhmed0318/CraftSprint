import {randomBytes,randomUUID,scryptSync,timingSafeEqual,createHmac} from 'crypto';
import {promises as fs} from 'fs';
import path from 'path';

export type User={id:string;name:string;email:string;passwordHash:string;createdAt:string};
type StoredUser=User;

const DATA_DIR=path.join(process.cwd(),'.runtime-data');
const USERS_FILE=path.join(DATA_DIR,'users.json');
export const SESSION_COOKIE='cs_session';
const SESSION_MAX_AGE=60*60*24*30; // 30 days

const AUTH_SECRET=process.env.AUTH_SECRET||(()=>{
 if(process.env.NODE_ENV==='production')console.warn('AUTH_SECRET is not set — using an insecure default. Set AUTH_SECRET in your environment before going live.');
 return 'dev-only-insecure-secret-change-me';
})();

async function ensureStore(){
 await fs.mkdir(DATA_DIR,{recursive:true});
 try{await fs.access(USERS_FILE)}catch{await fs.writeFile(USERS_FILE,'[]','utf8')}
}

export async function readUsers():Promise<StoredUser[]>{
 await ensureStore();
 try{const raw=await fs.readFile(USERS_FILE,'utf8');return JSON.parse(raw)}catch{return[]}
}

async function writeUsers(users:StoredUser[]){
 await ensureStore();
 await fs.writeFile(USERS_FILE,JSON.stringify(users,null,2),'utf8');
}

export function hashPassword(password:string):string{
 const salt=randomBytes(16).toString('hex');
 const hash=scryptSync(password,salt,64).toString('hex');
 return `${salt}:${hash}`;
}

export function verifyPassword(password:string,stored:string):boolean{
 const[salt,hash]=stored.split(':');
 if(!salt||!hash)return false;
 const check=scryptSync(password,salt,64);
 const expected=Buffer.from(hash,'hex');
 if(check.length!==expected.length)return false;
 return timingSafeEqual(check,expected);
}

export async function findUserByEmail(email:string):Promise<StoredUser|undefined>{
 const users=await readUsers();
 return users.find(u=>u.email.toLowerCase()===email.toLowerCase());
}

export async function createUser(name:string,email:string,password:string):Promise<User>{
 const users=await readUsers();
 if(users.some(u=>u.email.toLowerCase()===email.toLowerCase()))throw new Error('An account with this email already exists.');
 const user:StoredUser={id:randomUUID(),name,email,passwordHash:hashPassword(password),createdAt:new Date().toISOString()};
 users.push(user);
 await writeUsers(users);
 return user;
}

function sign(payload:string):string{return createHmac('sha256',AUTH_SECRET).update(payload).digest('hex')}

export function createSessionToken(userId:string):string{
 const payload=JSON.stringify({sub:userId,exp:Date.now()+SESSION_MAX_AGE*1000});
 const encoded=Buffer.from(payload).toString('base64url');
 return `${encoded}.${sign(encoded)}`;
}

export function verifySessionToken(token:string|undefined):{sub:string}|null{
 if(!token)return null;
 const[encoded,sig]=token.split('.');
 if(!encoded||!sig)return null;
 if(sig!==sign(encoded))return null;
 try{
  const payload=JSON.parse(Buffer.from(encoded,'base64url').toString('utf8'));
  if(typeof payload.exp!=='number'||payload.exp<Date.now())return null;
  return{sub:payload.sub};
 }catch{return null}
}

export const sessionCookieOptions={httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax' as const,path:'/',maxAge:SESSION_MAX_AGE};

export function publicUser(user:User){return{id:user.id,name:user.name,email:user.email}}
