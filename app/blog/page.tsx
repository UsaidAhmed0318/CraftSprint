import Link from 'next/link';import PromoSlider from '@/components/PromoSlider';import {tools,categories} from '@/data/tools';
export const metadata={title:'Guides & All Tools',description:'In-depth guides plus a full directory of every free CraftSprint tool, organized by category.'};
const posts=[['How to compress images without losing too much quality','A practical guide to choosing dimensions, formats and quality settings for smaller image files.','/blog/compress-images'],['JPG vs PNG vs WebP: which should you use?','Understand the trade-offs between common image formats for websites, documents and sharing.','/blog/jpg-png-webp'],['How to resize an image for a website','Learn how pixel dimensions, aspect ratio and file size affect images on the web.','/blog/resize-images']];
export default function Blog(){return <main className="section"><div className="container">
 <div className="sectionHead"><span className="kicker">Guides</span><h1>Practical answers, plus every tool.</h1><p>In-depth guides for common questions, and a full directory of all {tools.length} free tools organized by category.</p></div>
 <PromoSlider/>
 <h2 style={{fontFamily:"'Space Grotesk'",fontSize:26,margin:'8px 0 18px'}}>Featured guides</h2>
 <div className="blogGrid">{posts.map(([t,d,u])=><Link href={u} className="postCard" key={u}><span className="kicker">Guide</span><h3>{t}</h3><p>{d}</p><span className="toolLink">Read guide →</span></Link>)}</div>
 <h2 style={{fontFamily:"'Space Grotesk'",fontSize:26,margin:'50px 0 8px'}}>Every tool, by category</h2>
 <p style={{color:'var(--muted)',marginBottom:20}}>Jump straight to any tool — each one has its own guide, FAQ and works instantly in your browser.</p>
 {categories.map(cat=><div key={cat} style={{marginBottom:36}}>
  <h3 style={{fontSize:15,textTransform:'uppercase',letterSpacing:'.06em',color:'var(--brand)',fontWeight:800,marginBottom:14}}>{cat}</h3>
  <div className="toolGrid">{tools.filter(t=>t.category===cat).map(t=>{const Icon=t.icon;return <Link href={`/tools/${t.slug}`} className="toolCard" key={t.slug}><div className="iconBox"><Icon size={21}/></div><h3>{t.name}</h3><p>{t.description}</p><span className="toolLink">Use tool →</span></Link>})}</div>
 </div>)}
</div></main>}
