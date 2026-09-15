'use client';import {useState,useRef,useEffect} from 'react';import Link from 'next/link';import Image from 'next/image';import {Menu,X,ChevronDown} from 'lucide-react';import AuthStatus from './AuthStatus';
import SearchBar from './SearchBar';
import {tools,categories} from '@/data/tools';

export default function Header(){
 const[open,setOpen]=useState(false);
 const[menuOpen,setMenuOpen]=useState(false);
 const[mobileCat,setMobileCat]=useState<string|null>(null);
 const[scrolled,setScrolled]=useState(false);
 const menuRef=useRef<HTMLDivElement>(null);

 useEffect(()=>{
  const onClick=(e:MouseEvent)=>{if(menuRef.current&&!menuRef.current.contains(e.target as Node))setMenuOpen(false)};
  document.addEventListener('mousedown',onClick);
  return()=>document.removeEventListener('mousedown',onClick);
 },[]);

 useEffect(()=>{
  const onScroll=()=>setScrolled(window.scrollY>10);
  onScroll();
  window.addEventListener('scroll',onScroll,{passive:true});
  return()=>window.removeEventListener('scroll',onScroll);
 },[]);

 return <header className={`siteHeader ${scrolled?'scrolled':''}`}>
  <div className="container nav">
   <Link href="/" className="brand" onClick={()=>setOpen(false)}><Image src="/images/logo.png" alt="CraftSprint" width={2172} height={724} priority/></Link>
   <nav className="navLinks">
    <div className="megaWrap" ref={menuRef}>
     <button className="megaTrigger" onClick={()=>setMenuOpen(v=>!v)}>All tools <ChevronDown size={15}/></button>
     {menuOpen&&<div className="megaPanel">
      {categories.map(cat=><div className="megaCol" key={cat}>
       <h4>{cat}</h4>
       {tools.filter(t=>t.category===cat).map(t=><Link key={t.slug} href={`/tools/${t.slug}`} onClick={()=>setMenuOpen(false)}>{t.name}</Link>)}
      </div>)}
     </div>}
    </div>
    <Link href="/blog">Guides</Link>
    <Link href="/about">About</Link>
    <Link href="/contact">Contact</Link>
   </nav>
   <SearchBar compact/>
   <AuthStatus/>
   <button className="mobileNav" aria-label="Toggle menu" onClick={()=>setOpen(v=>!v)}>{open?<X/>:<Menu/>}</button>
  </div>
  <div className={`mobileMenu ${open?'open':''}`}>
   <div className="container" style={{display:'flex',flexDirection:'column'}}>
    <div style={{padding:'14px 0'}}><SearchBar/></div>
    {categories.map(cat=><div key={cat}>
     <button className="mobileCatToggle" onClick={()=>setMobileCat(c=>c===cat?null:cat)}>{cat} <ChevronDown size={15} style={{transform:mobileCat===cat?'rotate(180deg)':'none'}}/></button>
     {mobileCat===cat&&<div className="mobileCatList">{tools.filter(t=>t.category===cat).map(t=><Link key={t.slug} href={`/tools/${t.slug}`} onClick={()=>setOpen(false)}>{t.name}</Link>)}</div>}
    </div>)}
    <Link href="/blog" onClick={()=>setOpen(false)} style={{padding:'14px 0'}}>Guides</Link>
    <Link href="/about" onClick={()=>setOpen(false)} style={{padding:'14px 0'}}>About</Link>
    <Link href="/contact" onClick={()=>setOpen(false)} style={{padding:'14px 0'}}>Contact</Link>
    <AuthStatus mobile/>
   </div>
  </div>
 </header>;
}
