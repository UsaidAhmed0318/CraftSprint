'use client';
/**
 * Tools batch 2 (all run in the browser):
 * Open Graph & Twitter Card generator, WhatsApp link generator, Google review QR,
 * SIP, ROI and break-even calculators, remove duplicate lines, text sorter, find & replace,
 * SQL formatter, XML formatter, payment reminder generator, rotate PDF, website speed checker.
 */
import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import ToolShell from '@/components/shared/ToolShell';
import Dropzone from '@/components/shared/Dropzone';
import { Num, Text, Fields, Stats, Stat, CopyButton, Choice, Note, fmt, money } from '@/components/shared/ui';
import { downloadBlob } from '@/lib/utils/download';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/* ---------- Open Graph & Twitter Card generator ---------- */
export function OpenGraphGenerator() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [site, setSite] = useState('');
  const [card, setCard] = useState<'summary_large_image' | 'summary'>('summary_large_image');
  const code = [
    `<meta property="og:type" content="website" />`,
    title && `<meta property="og:title" content="${esc(title)}" />`,
    desc && `<meta property="og:description" content="${esc(desc)}" />`,
    url && `<meta property="og:url" content="${esc(url)}" />`,
    image && `<meta property="og:image" content="${esc(image)}" />`,
    site && `<meta property="og:site_name" content="${esc(site)}" />`,
    `<meta name="twitter:card" content="${card}" />`,
    title && `<meta name="twitter:title" content="${esc(title)}" />`,
    desc && `<meta name="twitter:description" content="${esc(desc)}" />`,
    image && `<meta name="twitter:image" content="${esc(image)}" />`,
  ]
    .filter(Boolean)
    .join('\n');
  return (
    <ToolShell
      title="Open Graph & Twitter Card generator"
      description="Create the meta tags that control how your page looks when it is shared on Facebook, LinkedIn, WhatsApp and X."
      faq={[
        {
          q: 'Where do I paste these tags?',
          a: 'Inside the <head> of your page. Most website builders have a “custom head code” or SEO settings field.',
        },
        {
          q: 'What image size works best?',
          a: 'Use 1200 × 630 pixels for large previews. Keep important text away from the edges.',
        },
      ]}
    >
      <Fields cols={2}>
        <Text label="Page title" value={title} set={setTitle} placeholder="Free Online Image Compressor" />
        <Text label="Site name" value={site} set={setSite} placeholder="CraftSprint" />
      </Fields>
      <div className="field">
        <label htmlFor="og-d">Description</label>
        <textarea
          id="og-d"
          className="textArea"
          style={{ minHeight: 80 }}
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="One or two sentences about the page"
        />
      </div>
      <Fields cols={2}>
        <Text label="Page URL" value={url} set={setUrl} placeholder="https://example.com/page" />
        <Text
          label="Image URL (1200×630)"
          value={image}
          set={setImage}
          placeholder="https://example.com/share.jpg"
        />
      </Fields>
      <Choice
        options={[
          { value: 'summary_large_image' as const, label: 'Large image card' },
          { value: 'summary' as const, label: 'Small card' },
        ]}
        value={card}
        set={setCard}
      />
      <div className="ogPreview" aria-label="Share preview">
        {image ? <img src={image} alt="" /> : <div className="ogNoImg">Image preview</div>}
        <div>
          <small>
            {(() => {
              try {
                return url ? new URL(url).hostname : 'example.com';
              } catch {
                return 'example.com';
              }
            })()}
          </small>
          <b>{title || 'Your page title'}</b>
          <p>{desc || 'Your description appears here.'}</p>
        </div>
      </div>
      <pre className="codeBox">{code}</pre>
      <CopyButton text={code} label="Copy meta tags" />
    </ToolShell>
  );
}

/* ---------- WhatsApp link generator ---------- */
export function WhatsAppLinkGenerator() {
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const digits = phone.replace(/\D/g, '');
  const link =
    digits.length >= 8 ? `https://wa.me/${digits}${msg ? `?text=${encodeURIComponent(msg)}` : ''}` : '';
  return (
    <ToolShell
      title="WhatsApp link generator"
      description="Make a click-to-chat WhatsApp link with an optional pre-filled message, for your website, bio or ads."
      faq={[
        {
          q: 'How should I write the number?',
          a: 'Use the full international number with the country code and no leading zero — for example 923001234567 for Pakistan or 447700900123 for the UK.',
        },
        {
          q: 'Does this work without saving the number?',
          a: 'Yes. Anyone who opens the link starts a WhatsApp chat with you directly.',
        },
      ]}
    >
      <Fields cols={2}>
        <Text
          label="Phone number with country code"
          value={phone}
          set={setPhone}
          placeholder="923001234567"
        />
        <Text label="Message (optional)" value={msg} set={setMsg} placeholder="Hi! I'd like to know more" />
      </Fields>
      {phone && digits.length < 8 && <Note error>Enter the full number with country code.</Note>}
      {link && (
        <>
          <pre className="codeBox">{link}</pre>
          <div className="rowBtns">
            <CopyButton text={link} label="Copy link" />
            <a className="btn btnGhost" href={link} target="_blank" rel="noopener noreferrer">
              Test link
            </a>
          </div>
        </>
      )}
    </ToolShell>
  );
}

/* ---------- Google review QR generator ---------- */
export function GoogleReviewQr() {
  const [link, setLink] = useState('');
  const [png, setPng] = useState('');
  const valid = /^https?:\/\/\S+$/.test(link.trim());
  useEffect(() => {
    if (!valid) return;
    QRCode.toDataURL(link.trim(), { width: 600, margin: 2, errorCorrectionLevel: 'M' })
      .then(setPng)
      .catch(() => setPng(''));
  }, [link, valid]);
  return (
    <ToolShell
      title="Google review QR code generator"
      description="Turn your Google review link into a QR code that customers can scan to leave a review — print it on receipts, tables or flyers."
      faq={[
        {
          q: 'Where do I get my review link?',
          a: 'Search your business on Google Maps while signed in as the owner, open your Business Profile and choose “Ask for reviews”, then copy the link.',
        },
        {
          q: 'Does the QR code expire?',
          a: 'No. The code simply contains your link, so it works as long as the link does.',
        },
      ]}
    >
      <Text
        label="Google review link"
        value={link}
        set={setLink}
        placeholder="https://g.page/r/your-business/review"
      />
      {link && !valid && <Note error>Paste the full link starting with https://</Note>}
      {valid && png && (
        <div className="qrOut">
          <img src={png} alt="QR code for your Google review link" width={240} height={240} />
          <p>Scan to leave us a review</p>
          <button
            className="btn btnPrimary"
            onClick={() =>
              fetch(png)
                .then(r => r.blob())
                .then(b => downloadBlob(b, 'google-review-qr.png'))
            }
          >
            Download PNG
          </button>
        </div>
      )}
    </ToolShell>
  );
}

/* ---------- SIP calculator ---------- */
export function SipCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const n = years * 12;
  const r = rate / 12 / 100;
  const value = r === 0 ? monthly * n : monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = monthly * n;
  return (
    <ToolShell
      title="SIP calculator"
      description="Estimate how a monthly investment (SIP) could grow over time with compounding."
      faq={[
        {
          q: 'Which formula is used?',
          a: 'Future value of monthly investments made at the start of each month: P × ((1 + r)ⁿ − 1) ÷ r × (1 + r), where r is the monthly return and n the number of months.',
        },
        {
          q: 'Are returns guaranteed?',
          a: 'No. Market returns go up and down; this is an estimate for planning, not financial advice.',
        },
      ]}
    >
      <Fields cols={3}>
        <Num label="Monthly investment" value={monthly} set={setMonthly} />
        <Num label="Expected yearly return (%)" value={rate} set={setRate} />
        <Num label="Years" value={years} set={setYears} />
      </Fields>
      <Stats cols={3}>
        <Stat label="Total invested" value={money(invested)} />
        <Stat label="Estimated gains" value={money(value - invested)} />
        <Stat label="Estimated value" value={money(value)} />
      </Stats>
    </ToolShell>
  );
}

/* ---------- ROI calculator ---------- */
export function RoiCalculator() {
  const [cost, setCost] = useState(10000);
  const [ret, setRet] = useState(13000);
  const [years, setYears] = useState(2);
  const roi = cost ? ((ret - cost) / cost) * 100 : NaN;
  const annual = cost > 0 && ret > 0 && years > 0 ? (Math.pow(ret / cost, 1 / years) - 1) * 100 : NaN;
  return (
    <ToolShell
      title="ROI calculator"
      description="Work out the return on investment and the yearly (annualised) return of any investment or campaign."
      faq={[
        {
          q: 'How is ROI calculated?',
          a: 'ROI = (final value − amount invested) ÷ amount invested × 100. Annualised ROI = (final ÷ invested)^(1 ÷ years) − 1.',
        },
      ]}
    >
      <Fields cols={3}>
        <Num label="Amount invested" value={cost} set={setCost} />
        <Num label="Final value / return" value={ret} set={setRet} />
        <Num label="Period (years)" value={years} set={setYears} />
      </Fields>
      <Stats cols={3}>
        <Stat label="Profit" value={money(ret - cost)} />
        <Stat label="ROI" value={`${fmt(roi, 2)}%`} />
        <Stat label="Annualised ROI" value={`${fmt(annual, 2)}%`} />
      </Stats>
    </ToolShell>
  );
}

/* ---------- Break-even calculator ---------- */
export function BreakEvenCalculator() {
  const [fixed, setFixed] = useState(50000);
  const [price, setPrice] = useState(500);
  const [variable, setVariable] = useState(300);
  const margin = price - variable;
  const units = margin > 0 ? fixed / margin : NaN;
  return (
    <ToolShell
      title="Break-even calculator"
      description="Find how many units you must sell — and how much revenue you need — to cover your costs."
      faq={[
        {
          q: 'What is the break-even formula?',
          a: 'Break-even units = fixed costs ÷ (price per unit − variable cost per unit). Break-even revenue = break-even units × price.',
        },
      ]}
    >
      <Fields cols={3}>
        <Num label="Fixed costs (per period)" value={fixed} set={setFixed} />
        <Num label="Price per unit" value={price} set={setPrice} />
        <Num label="Variable cost per unit" value={variable} set={setVariable} />
      </Fields>
      {margin <= 0 && (
        <Note error>The price must be higher than the variable cost, otherwise you never break even.</Note>
      )}
      <Stats cols={3}>
        <Stat label="Profit per unit" value={money(margin)} />
        <Stat label="Break-even units" value={fmt(Math.ceil(units), 0)} />
        <Stat label="Break-even revenue" value={money(Math.ceil(units) * price)} />
      </Stats>
    </ToolShell>
  );
}

/* ---------- Text line tools ---------- */
function TextIO({
  value,
  set,
  out,
  label,
}: {
  value: string;
  set: (s: string) => void;
  out: string;
  label: string;
}) {
  return (
    <>
      <div className="field">
        <label htmlFor={`${label}-in`}>Your text</label>
        <textarea
          id={`${label}-in`}
          className="textArea"
          value={value}
          onChange={e => set(e.target.value)}
          placeholder="Paste your lines here"
        />
      </div>
      <div className="field">
        <label htmlFor={`${label}-out`}>Result</label>
        <textarea id={`${label}-out`} className="textArea" value={out} readOnly />
      </div>
      <CopyButton text={out} />
    </>
  );
}
export function RemoveDuplicateLines() {
  const [text, setText] = useState('');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [trim, setTrim] = useState(true);
  const { out, removed } = useMemo(() => {
    const seen = new Set<string>();
    const lines = text.split(/\r?\n/);
    const kept = lines.filter(l => {
      const k = (trim ? l.trim() : l)[ignoreCase ? 'toLowerCase' : 'toString']();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    return { out: kept.join('\n'), removed: text ? lines.length - kept.length : 0 };
  }, [text, ignoreCase, trim]);
  return (
    <ToolShell
      title="Remove duplicate lines"
      description="Delete repeated lines from lists, keeping the first time each line appears."
      faq={[
        {
          q: 'Is the order kept?',
          a: 'Yes. Lines stay in their original order; only later repeats are removed.',
        },
      ]}
    >
      <div className="controls" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <label className="checkInline">
          <input type="checkbox" checked={ignoreCase} onChange={e => setIgnoreCase(e.target.checked)} />{' '}
          Ignore upper/lower case
        </label>
        <label className="checkInline">
          <input type="checkbox" checked={trim} onChange={e => setTrim(e.target.checked)} /> Ignore spaces at
          the ends
        </label>
      </div>
      <TextIO value={text} set={setText} out={out} label="dup" />
      <div className="stats">
        <span>{removed} duplicate lines removed</span>
      </div>
    </ToolShell>
  );
}
export function TextSorter() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'az' | 'za' | 'num' | 'len' | 'rev' | 'shuffle'>('az');
  const [order, setOrder] = useState<number[] | null>(null);
  const out = useMemo(() => {
    const lines = text.split(/\r?\n/).filter(l => l.length);
    const col = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    if (mode === 'az') lines.sort(col.compare);
    if (mode === 'za') lines.sort((a, b) => col.compare(b, a));
    if (mode === 'num') lines.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0));
    if (mode === 'len') lines.sort((a, b) => a.length - b.length);
    if (mode === 'rev') lines.reverse();
    if (mode === 'shuffle' && order)
      return order
        .filter(i => i < lines.length)
        .map(i => lines[i])
        .join('\n');
    return lines.join('\n');
  }, [text, mode, order]);
  const shuffle = () => {
    const n = text.split(/\r?\n/).filter(l => l.length).length;
    const o = [...Array(n).keys()];
    for (let i = o.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [o[i], o[j]] = [o[j], o[i]];
    }
    setOrder(o);
  };
  return (
    <ToolShell
      title="Text sorter"
      description="Sort lines A–Z, Z–A, by number or length, reverse them or shuffle them."
      faq={[
        {
          q: 'Does A–Z handle numbers inside text?',
          a: 'Yes — “item 2” comes before “item 10”, like a person would sort them.',
        },
      ]}
    >
      <Choice
        options={[
          { value: 'az' as const, label: 'A–Z' },
          { value: 'za' as const, label: 'Z–A' },
          { value: 'num' as const, label: 'Numbers' },
          { value: 'len' as const, label: 'Length' },
          { value: 'rev' as const, label: 'Reverse' },
          { value: 'shuffle' as const, label: 'Shuffle' },
        ]}
        value={mode}
        set={m => {
          setMode(m);
          if (m === 'shuffle') shuffle();
        }}
      />
      <TextIO value={text} set={setText} out={out} label="sort" />
    </ToolShell>
  );
}
export function FindReplace() {
  const [text, setText] = useState('');
  const [find, setFind] = useState('');
  const [repl, setRepl] = useState('');
  const [cs, setCs] = useState(false);
  const [regex, setRegex] = useState(false);
  const { out, count, error } = useMemo(() => {
    if (!find) return { out: text, count: 0, error: '' };
    try {
      const re = new RegExp(regex ? find : find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), cs ? 'g' : 'gi');
      const count = (text.match(re) || []).length;
      return { out: text.replace(re, repl), count, error: '' };
    } catch (e) {
      return { out: text, count: 0, error: (e as Error).message };
    }
  }, [text, find, repl, cs, regex]);
  return (
    <ToolShell
      title="Find and replace"
      description="Find words or patterns in your text and replace every match at once."
      faq={[
        {
          q: 'Can I use regular expressions?',
          a: 'Yes — turn on “Regular expression” and use $1, $2 in the replacement for captured groups.',
        },
      ]}
    >
      <Fields cols={2}>
        <Text label="Find" value={find} set={setFind} />
        <Text label="Replace with" value={repl} set={setRepl} />
      </Fields>
      <div className="controls" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <label className="checkInline">
          <input type="checkbox" checked={cs} onChange={e => setCs(e.target.checked)} /> Match case
        </label>
        <label className="checkInline">
          <input type="checkbox" checked={regex} onChange={e => setRegex(e.target.checked)} /> Regular
          expression
        </label>
      </div>
      {error && <Note error>{error}</Note>}
      <TextIO value={text} set={setText} out={out} label="fr" />
      <div className="stats">
        <span>{count} matches replaced</span>
      </div>
    </ToolShell>
  );
}

/* ---------- SQL formatter ---------- */
const SQL_BREAK = [
  'SELECT',
  'FROM',
  'WHERE',
  'GROUP BY',
  'ORDER BY',
  'HAVING',
  'LIMIT',
  'OFFSET',
  'INSERT INTO',
  'VALUES',
  'UPDATE',
  'SET',
  'DELETE FROM',
  'LEFT JOIN',
  'RIGHT JOIN',
  'INNER JOIN',
  'FULL JOIN',
  'JOIN',
  'UNION ALL',
  'UNION',
];
const SQL_WORDS = [
  ...SQL_BREAK,
  'AND',
  'OR',
  'ON',
  'AS',
  'IN',
  'NOT',
  'NULL',
  'IS',
  'LIKE',
  'BETWEEN',
  'DISTINCT',
  'COUNT',
  'SUM',
  'AVG',
  'MIN',
  'MAX',
  'CASE',
  'WHEN',
  'THEN',
  'ELSE',
  'END',
  'ASC',
  'DESC',
  'CREATE',
  'TABLE',
  'PRIMARY',
  'KEY',
  'INTO',
];
export function formatSql(sql: string, upper = true) {
  // keep quoted strings untouched
  const strings: string[] = [];
  let s = sql
    .replace(/'(?:''|[^'])*'/g, m => `\u0000${strings.push(m) - 1}\u0000`)
    .replace(/\s+/g, ' ')
    .trim();
  for (const w of [...SQL_WORDS].sort((a, b) => b.length - a.length)) {
    const re = new RegExp(`\\b${w.replace(' ', '\\s+')}\\b`, 'gi');
    s = s.replace(re, upper ? w : w.toLowerCase());
  }
  for (const w of [...SQL_BREAK].sort((a, b) => b.length - a.length)) {
    const kw = upper ? w : w.toLowerCase();
    s = s.split(` ${kw} `).join(`\n${kw}\n  `);
  }
  s = s.replace(/^(SELECT|select) /, '$1\n  ');
  s = s.replace(/,\s*/g, ',\n  ').replace(/ (AND|OR|and|or) /g, '\n  $1 ');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => strings[Number(i)]).replace(/\n\s*\n/g, '\n');
}
export function SqlFormatter() {
  const [sql, setSql] = useState('');
  const [upper, setUpper] = useState(true);
  const out = useMemo(() => (sql.trim() ? formatSql(sql, upper) : ''), [sql, upper]);
  return (
    <ToolShell
      title="SQL formatter"
      description="Beautify SQL queries: one clause per line, indented columns and consistent keyword case."
      faq={[
        {
          q: 'Does it change my query?',
          a: 'Only spacing and keyword case. Text inside quotes is kept exactly as written.',
        },
      ]}
    >
      <label className="checkInline">
        <input type="checkbox" checked={upper} onChange={e => setUpper(e.target.checked)} /> UPPERCASE
        keywords
      </label>
      <TextIO value={sql} set={setSql} out={out} label="sql" />
    </ToolShell>
  );
}

/* ---------- XML formatter ---------- */
export function formatXml(xml: string, indent = '  ') {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const err = doc.querySelector('parsererror');
  if (err) throw new Error(err.textContent?.split('\n')[0] || 'Invalid XML');
  const walk = (node: Node, depth: number): string => {
    const pad = indent.repeat(depth);
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent?.trim();
      return t ? pad + t : '';
    }
    if (node.nodeType === Node.COMMENT_NODE) return `${pad}<!--${node.textContent}-->`;
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const el = node as Element;
    const attrs = [...el.attributes].map(a => ` ${a.name}="${a.value}"`).join('');
    const kids = [...el.childNodes].map(c => walk(c, depth + 1)).filter(Boolean);
    if (!kids.length) return `${pad}<${el.tagName}${attrs}/>`;
    if (kids.length === 1 && el.childNodes.length === 1 && el.firstChild?.nodeType === Node.TEXT_NODE)
      return `${pad}<${el.tagName}${attrs}>${kids[0].trim()}</${el.tagName}>`;
    return `${pad}<${el.tagName}${attrs}>\n${kids.join('\n')}\n${pad}</${el.tagName}>`;
  };
  const decl = xml.trim().startsWith('<?xml') ? xml.trim().split('?>')[0] + '?>\n' : '';
  return decl + walk(doc.documentElement, 0);
}
export function XmlFormatter() {
  const [xml, setXml] = useState('');
  const { out, error } = useMemo(() => {
    if (!xml.trim()) return { out: '', error: '' };
    try {
      return { out: formatXml(xml), error: '' };
    } catch (e) {
      return { out: '', error: (e as Error).message };
    }
  }, [xml]);
  return (
    <ToolShell
      title="XML formatter & validator"
      description="Indent XML so it is easy to read, and see an error message if the XML is not valid."
      faq={[
        {
          q: 'Is my XML uploaded?',
          a: 'No. The browser’s own XML parser checks and formats it on your device.',
        },
      ]}
    >
      {error && <Note error>Invalid XML: {error}</Note>}
      <TextIO value={xml} set={setXml} out={out} label="xml" />
    </ToolShell>
  );
}

/* ---------- Payment reminder generator ---------- */
export function PaymentReminder() {
  const [client, setClient] = useState('');
  const [invoice, setInvoice] = useState('');
  const [amount, setAmount] = useState('');
  const [due, setDue] = useState('');
  const [from, setFrom] = useState('');
  const [tone, setTone] = useState<'friendly' | 'firm' | 'final'>('friendly');
  const msg = useMemo(() => {
    const c = client || '[client name]';
    const inv = invoice || '[invoice number]';
    const amt = amount || '[amount]';
    const d = due || '[due date]';
    const f = from || '[your name]';
    if (tone === 'friendly')
      return `Hi ${c},\n\nI hope you're well. This is a friendly reminder that invoice ${inv} for ${amt} was due on ${d}. If you've already sent the payment, please ignore this message — thank you!\n\nIf you need another copy of the invoice, just let me know.\n\nBest regards,\n${f}`;
    if (tone === 'firm')
      return `Hello ${c},\n\nOur records show that invoice ${inv} for ${amt}, due on ${d}, is still unpaid. Please arrange payment at your earliest convenience and reply to confirm the expected payment date.\n\nThank you,\n${f}`;
    return `Dear ${c},\n\nThis is a final reminder that invoice ${inv} for ${amt} is now overdue since ${d}. Please make the payment within 7 days. If there is an issue with the invoice, contact me right away so we can resolve it.\n\nRegards,\n${f}`;
  }, [client, invoice, amount, due, from, tone]);
  return (
    <ToolShell
      title="Payment reminder generator"
      description="Write a polite, firm or final payment reminder for an unpaid invoice in seconds."
      faq={[
        {
          q: 'Can I send it on WhatsApp?',
          a: 'Yes — copy the message, or use the WhatsApp link generator to send it with a pre-filled message.',
        },
      ]}
    >
      <Fields cols={3}>
        <Text label="Client name" value={client} set={setClient} />
        <Text label="Invoice number" value={invoice} set={setInvoice} />
        <Text label="Amount" value={amount} set={setAmount} placeholder="$450" />
        <Text label="Due date" value={due} set={setDue} placeholder="5 March" />
        <Text label="Your name / business" value={from} set={setFrom} />
      </Fields>
      <Choice
        options={[
          { value: 'friendly' as const, label: 'Friendly' },
          { value: 'firm' as const, label: 'Firm' },
          { value: 'final' as const, label: 'Final notice' },
        ]}
        value={tone}
        set={setTone}
      />
      <pre className="codeBox" style={{ whiteSpace: 'pre-wrap' }}>
        {msg}
      </pre>
      <CopyButton text={msg} label="Copy message" />
    </ToolShell>
  );
}

/* ---------- Rotate PDF ---------- */
export function RotatePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [pages, setPages] = useState(0);
  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const { PDFDocument, degrees } = await import('@cantoo/pdf-lib');
      const doc = await PDFDocument.load(await file.arrayBuffer());
      doc.getPages().forEach(p => p.setRotation(degrees((p.getRotation().angle + angle) % 360)));
      setPages(doc.getPageCount());
      const bytes = await doc.save();
      downloadBlob(
        new Blob([bytes as BlobPart], { type: 'application/pdf' }),
        file.name.replace(/\.pdf$/i, '') + '-rotated.pdf',
      );
    } catch {
      setError('This PDF could not be opened. It may be password-protected or damaged.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="Rotate PDF"
      description="Turn every page of a PDF by 90°, 180° or 270° and download the fixed file."
      faq={[
        {
          q: 'Is quality reduced?',
          a: 'No. Rotating only changes the page orientation setting — text and images are not re-compressed.',
        },
      ]}
    >
      <Dropzone
        accept="application/pdf,.pdf"
        onFile={f => {
          setFile(f);
          setPages(0);
        }}
      />
      <Choice
        options={[
          { value: 90 as const, label: '90° right' },
          { value: 180 as const, label: '180°' },
          { value: 270 as const, label: '90° left' },
        ]}
        value={angle}
        set={setAngle}
      />
      <button className="btn btnPrimary" disabled={!file || busy} onClick={run}>
        {busy ? 'Rotating…' : 'Rotate and download'}
      </button>
      {pages > 0 && (
        <Note>
          Rotated {pages} page{pages > 1 ? 's' : ''}.
        </Note>
      )}
      {error && <Note error>{error}</Note>}
    </ToolShell>
  );
}

/* ---------- Website speed checker (Google PageSpeed Insights) ---------- */
type Psi = { score: number; metrics: { label: string; value: string }[] };
export function WebsiteSpeedChecker() {
  const [url, setUrl] = useState('');
  const [strategy, setStrategy] = useState<'mobile' | 'desktop'>('mobile');
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<Psi | null>(null);
  const [error, setError] = useState('');
  const run = async () => {
    let target = url.trim();
    if (!/^https?:\/\//i.test(target)) target = `https://${target}`;
    try {
      new URL(target);
    } catch {
      return setError('Enter a valid website address.');
    }
    setBusy(true);
    setError('');
    setRes(null);
    try {
      const r = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(target)}&strategy=${strategy}&category=performance`,
        { signal: AbortSignal.timeout(60000) },
      );
      const d = await r.json();
      if (!r.ok || !d.lighthouseResult) throw new Error(d?.error?.message || 'No result');
      const a = d.lighthouseResult.audits;
      setRes({
        score: Math.round((d.lighthouseResult.categories.performance.score || 0) * 100),
        metrics: [
          ['First Contentful Paint', 'first-contentful-paint'],
          ['Largest Contentful Paint', 'largest-contentful-paint'],
          ['Total Blocking Time', 'total-blocking-time'],
          ['Cumulative Layout Shift', 'cumulative-layout-shift'],
          ['Speed Index', 'speed-index'],
        ].map(([label, k]) => ({ label, value: a[k]?.displayValue ?? '—' })),
      });
    } catch (e) {
      setError(
        `Google PageSpeed could not test this page (${(e as Error).message}). Check the address or try again in a minute.`,
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <ToolShell
      title="Website speed checker"
      description="Test any public web page with Google PageSpeed Insights and see its performance score and Core Web Vitals."
      faq={[
        {
          q: 'Where do the results come from?',
          a: 'From Google PageSpeed Insights (Lighthouse). The page address you enter is sent to Google to run the test.',
        },
        {
          q: 'Why does the score change between tests?',
          a: 'Network and server conditions vary, so scores move a few points. Run it 2–3 times and look at the trend.',
        },
      ]}
    >
      <Fields cols={2}>
        <Text label="Website address" value={url} set={setUrl} placeholder="example.com" />
        <div className="field">
          <label>Device</label>
          <Choice
            options={[
              { value: 'mobile' as const, label: 'Mobile' },
              { value: 'desktop' as const, label: 'Desktop' },
            ]}
            value={strategy}
            set={setStrategy}
          />
        </div>
      </Fields>
      <button className="btn btnPrimary" disabled={!url.trim() || busy} onClick={run}>
        {busy ? 'Testing… (up to a minute)' : 'Check speed'}
      </button>
      {error && <Note error>{error}</Note>}
      {res && (
        <>
          <div className={`psiScore ${res.score >= 90 ? 'good' : res.score >= 50 ? 'ok' : 'bad'}`}>
            <b>{res.score}</b>
            <span>Performance</span>
          </div>
          <Stats cols={3}>
            {res.metrics.map(m => (
              <Stat key={m.label} label={m.label} value={m.value} />
            ))}
          </Stats>
        </>
      )}
    </ToolShell>
  );
}
