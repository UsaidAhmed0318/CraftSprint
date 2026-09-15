'use client';import {useEffect,useState} from 'react';import Image from 'next/image';

export default function SiteLoader(){
 const[visible,setVisible]=useState(true);
 const[fading,setFading]=useState(false);

 useEffect(()=>{
  const t1=setTimeout(()=>setFading(true),850);
  const t2=setTimeout(()=>setVisible(false),1250);
  return()=>{clearTimeout(t1);clearTimeout(t2)};
 },[]);

 if(!visible)return null;
 return <div className={`siteLoader ${fading?'fadeOut':''}`} aria-hidden="true">
  <div className="siteLoaderStage">
   <div className="siteLoaderLogo"><Image src="/images/favicon.png" alt="" width={64} height={64} priority/></div>
  </div>
  <div className="siteLoaderBar"><span/></div>
  <div className="siteLoaderText">CraftSprint</div>
 </div>;
}
