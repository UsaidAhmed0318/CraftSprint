import ContactForm from '@/components/ContactForm';import PromoSlider from '@/components/PromoSlider';import {site} from '@/lib/site';
export const metadata={title:'Contact CraftSprint',description:'Contact CraftSprint about feedback, bugs, feature requests or partnerships.'};
export default function Contact(){return <main className="section"><div className="container article">
 <span className="kicker">Contact</span>
 <h1>Tell us what would make the tools better.</h1>
 <p>Found a bug, have a feature request, or want to suggest a useful tool? Send a message and we&apos;ll get back to you at your email.</p>

 <div className="vipCard" style={{display:'flex',flexWrap:'wrap',gap:20,justifyContent:'space-between',alignItems:'center',marginBottom:26}}>
  <div><h3 style={{margin:'0 0 6px'}}>Prefer email?</h3><a href={`mailto:${site.email}`} style={{color:'var(--brand)',fontWeight:700}}>{site.email}</a></div>
  <div><h3 style={{margin:'0 0 6px'}}>Prefer WhatsApp?</h3><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{color:'var(--brand)',fontWeight:700}}>+{site.whatsapp}</a></div>
 </div>

 <PromoSlider/>
 <ContactForm/>
</div></main>}
