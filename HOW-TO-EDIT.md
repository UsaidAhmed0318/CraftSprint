# CraftSprint — Code kaise edit karein (aasaan guide)

## Folder ka naqsha

| Folder / file | Kya hai |
|---|---|
| `data/tools.ts` | **Saare tools ki list**: naam, chhoti description, icon, category |
| `data/seo.ts` | **Har tool ka Google title aur description** |
| `lib/toolRegistry.tsx` | Kaunsa tool kaunsi file se chalta hai |
| `lib/categories.ts` | Categories ke naam, description aur icon |
| `lib/site.ts` | Website ka naam, URL, email |
| `components/shared/ui.tsx` | Chhote ready-made parts: `Num`, `Text`, `Stat`, `Stats`, `Fields`, `Choice`, `CopyButton`, `Note` |
| `components/shared/ToolShell.tsx` | Har tool page ka dhaancha: breadcrumb, title, favourite button, FAQ, related tools |
| `components/tools/<category>/*.tsx` | Tools ke asli components, category ke hisaab se folders mein (images, design, pdf, developer, writing, media, calculators, productivity, games) |
| `components/layout/` | Header, Footer, search, theme button |
| `components/shared/` | Har tool mein istemal hone wale parts (ToolShell, Dropzone, ui) |
| `app/tools/[slug]/page.tsx` | **Ek hi page jo saare tools dikhata hai** — har tool ke liye alag page banane ki zaroorat nahi |
| `app/category/[slug]/page.tsx` | Category pages |
| `data/posts.ts` | **Saare blog posts** |
| `app/blog/[slug]/page.tsx` | Ek hi page jo saare blog posts dikhata hai |
| `data/toolContent.ts` | Tools ke neeche wala lamba "About" text (Google ke liye) |
| `app/page.tsx` | Homepage |
| `app/globals.css` | Saara design. Rang sab se upar `:root` (light) aur `:root[data-theme='dark']` (dark) mein hain |

## Kisi tool ka Google title ya description badalna
Sirf `data/seo.ts` kholein aur us tool ki line badlein. Bas.

## Naya tool add karna (3 qadam)
1. **Component banayein** — maslan `components/tools/calculators/MathCalculators.tsx` mein:
```tsx
export function MyTool(){
  const [a,setA]=useState(10);
  return <ToolShell title="My tool" description="Ek line mein kya karta hai." faq={[{q:'Sawal?',a:'Jawab.'}]}>
    <Fields><Num label="Value" value={a} set={setA}/></Fields>
    <Stats><Stat label="Double" value={fmt(a*2)}/></Stats>
  </ToolShell>;
}
```
2. **List mein daalein** — `data/tools.ts` mein ek line:
`{slug:'my-tool',name:'My Tool',description:'Chhoti description.',icon:Calculator,category:'Calculators'},`
3. **Do jagah ek ek line** —
   - `lib/toolRegistry.tsx`: `'my-tool':dynamic(()=>import('@/components/tools/calculators/MathCalculators').then(m=>m.MyTool)),`
   - `data/seo.ts`: `'my-tool':{title:"My Tool — Free Online",description:"150 characters tak ki description."},`

Page, sitemap, category, search, breadcrumbs, related tools aur share image **khud ban jate hain**.

## Naya blog post likhna
`data/posts.ts` kholein, kisi ek post ko copy karein aur ye cheezein badlein:
- `slug` — URL ka hissa, jaise `how-to-split-pdf` (sirf chhote angrezi huroof aur `-`)
- `title`, `description`, `topic`, `date`
- `tools` — post ke aakhir mein kaunse tools dikhane hain
- `sections` — har section ka `heading` aur `paragraphs`

Save karte hi blog page, blog list aur sitemap khud update ho jate hain.

## Kisi tool ke neeche "About" text likhna
`data/toolContent.ts` mein tool ke slug ke saath ek entry add karein (150–300 words). Google ke liye ye bahut faidemand hai.

## Rang badalna
`app/globals.css` ki pehli lines mein `--brand` (neela) aur `--gold` (sunehra) badlein. Dark theme ke rang `:root[data-theme='dark']` mein hain.

## Zaroori environment variables (Vercel → Settings → Environment Variables)
| Naam | Kis liye |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Aap ka domain, jaise `https://craftsprint.com` (SEO ke liye **lazmi**) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics |
| `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_SLOT` | AdSense approval ke baad |
| `ANTHROPIC_API_KEY` | (Optional) Tool Assistant ko asli AI banane ke liye |

## Chalane ke commands
```
npm install
npm run dev     # apne computer par: http://localhost:3000
npm run build   # deploy se pehle check
```

## File wale tools ke liye zaroori qaida
Agar tool koi file banata hai (`URL.createObjectURL`), to state ke foran baad
`useRevokeObjectUrl(out)` lagayein (`@/hooks/useObjectUrl`). Is se purani file memory se nikal jati hai.
Download ke liye `downloadBlob(blob,'naam.ext')` (`@/lib/utils/download`) use karein.
Jab user nayi file ya setting chune, purana result `setOut('')` se saaf karein, taake purana nateeja na dikhe.

## Naye hisse (loader, assistant, samples)
| File | Kaam |
|---|---|
| `components/layout/SplashLoader.tsx` + `lib/initScripts.ts` | Shuru ka loader; har session mein sirf pehle page pe ~1 second |
| `components/home/Hero3D.tsx` + `app/vip.css` | Homepage ka 3D hero aur naya design |
| `components/shared/ToolAssistant.tsx` | "Ask CraftSprint" chat; search bar se bhi khulta hai (`lib/utils/assistant.ts`) |
| `lib/utils/samples.ts` | "Try with a sample" wali namoona files (image, PDF, audio, video) |
| `components/shared/ResultBanner.tsx` | Download ke baad "Your file is ready" + "Download again" |
| `lib/utils/polyfills.ts` + `public/pdf.worker.polyfilled.mjs` | Purane browsers mein PDF tools chalane ke liye |
