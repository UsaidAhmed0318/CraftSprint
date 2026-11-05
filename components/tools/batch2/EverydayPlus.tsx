'use client';
/** Everyday tools: Smart QR (Wi-Fi, contact, email, WhatsApp, SMS), Coin & Dice, Citation Generator,
 * Hijri Date Converter, Freelance Rate Calculator, Reading Time Calculator. All in the browser. */
import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import ToolShell from '@/components/shared/ToolShell';
import { Num, Text, Fields, Stats, Stat, CopyButton, Choice, Note, money, fmt } from '@/components/shared/ui';
import { downloadBlob } from '@/lib/utils/download';

/* ---------- Smart QR ---------- */
type QrKind = 'wifi' | 'contact' | 'email' | 'whatsapp' | 'sms';
const escWifi = (s: string) => s.replace(/([\\;,:"])/g, '\\$1');
export function SmartQr() {
  const [kind, setKind] = useState<QrKind>('wifi');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [d, setD] = useState('');
  const [enc, setEnc] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [png, setPng] = useState('');
  const data = useMemo(() => {
    if (kind === 'wifi')
      return a ? `WIFI:T:${enc};S:${escWifi(a)};${enc === 'nopass' ? '' : `P:${escWifi(b)};`};` : '';
    if (kind === 'contact')
      return a
        ? [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `N:${a}`,
            `FN:${a}`,
            b && `TEL:${b}`,
            c && `EMAIL:${c}`,
            d && `ORG:${d}`,
            'END:VCARD',
          ]
            .filter(Boolean)
            .join('\n')
        : '';
    if (kind === 'email')
      return a ? `mailto:${a}?subject=${encodeURIComponent(b)}&body=${encodeURIComponent(c)}` : '';
    if (kind === 'whatsapp')
      return a.replace(/\D/g, '').length >= 8
        ? `https://wa.me/${a.replace(/\D/g, '')}${b ? `?text=${encodeURIComponent(b)}` : ''}`
        : '';
    return a ? `SMSTO:${a}:${b}` : '';
  }, [kind, a, b, c, d, enc]);
  useEffect(() => {
    if (!data) return;
    QRCode.toDataURL(data, { width: 600, margin: 2 })
      .then(setPng)
      .catch(() => setPng(''));
  }, [data]);
  const labels: Record<QrKind, [string, string?, string?, string?]> = {
    wifi: ['Network name (SSID)', 'Password'],
    contact: ['Full name', 'Phone', 'Email', 'Company'],
    email: ['Email address', 'Subject', 'Message'],
    whatsapp: ['Phone with country code', 'Message (optional)'],
    sms: ['Phone number', 'Message'],
  };
  const L = labels[kind];
  return (
    <ToolShell
      title="Smart QR code generator"
      description="Make QR codes that do something: join Wi-Fi, save a contact, send an email, open a WhatsApp chat or an SMS."
      faq={[
        {
          q: 'Does the Wi-Fi QR code share my password?',
          a: 'It contains the network name and password so phones can join. Only share it with people you would give the password to. It is created on your device and not uploaded.',
        },
        {
          q: 'Will it work with any phone camera?',
          a: 'Yes, modern iPhone and Android cameras read Wi-Fi, contact, email, WhatsApp and SMS QR codes.',
        },
      ]}
    >
      <Choice
        options={[
          { value: 'wifi' as const, label: 'Wi-Fi' },
          { value: 'contact' as const, label: 'Contact' },
          { value: 'email' as const, label: 'Email' },
          { value: 'whatsapp' as const, label: 'WhatsApp' },
          { value: 'sms' as const, label: 'SMS' },
        ]}
        value={kind}
        set={k => {
          setKind(k);
          setA('');
          setB('');
          setC('');
          setD('');
          setPng('');
        }}
      />
      <Fields cols={2}>
        <Text label={L[0]} value={a} set={setA} />
        {L[1] && <Text label={L[1]} value={b} set={setB} />}
        {L[2] && <Text label={L[2]} value={c} set={setC} />}
        {L[3] && <Text label={L[3]} value={d} set={setD} />}
      </Fields>
      {kind === 'wifi' && (
        <Choice
          options={[
            { value: 'WPA' as const, label: 'WPA/WPA2/WPA3' },
            { value: 'WEP' as const, label: 'WEP' },
            { value: 'nopass' as const, label: 'No password' },
          ]}
          value={enc}
          set={setEnc}
        />
      )}
      {data && png && (
        <div className="qrOut">
          <img src={png} alt="Your QR code" width={240} height={240} />
          <button
            className="btn btnPrimary"
            onClick={() =>
              fetch(png)
                .then(r => r.blob())
                .then(bl => downloadBlob(bl, `qr-${kind}.png`))
            }
          >
            Download PNG
          </button>
        </div>
      )}
    </ToolShell>
  );
}

/* ---------- Coin flip & dice ---------- */
const rand = (n: number) => {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % n;
};
export function CoinDice() {
  const [mode, setMode] = useState<'coin' | 'dice'>('coin');
  const [dice, setDice] = useState(2);
  const [result, setResult] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [spin, setSpin] = useState(0);
  const roll = () => {
    const r =
      mode === 'coin'
        ? [rand(2) ? 'Heads' : 'Tails']
        : Array.from({ length: dice }, () => String(rand(6) + 1));
    setResult(r);
    setSpin(s => s + 1);
    setHistory(h =>
      [
        mode === 'coin'
          ? r[0]
          : `${r.join(' + ')}${r.length > 1 ? ` = ${r.reduce((x, y) => x + Number(y), 0)}` : ''}`,
        ...h,
      ].slice(0, 10),
    );
  };
  return (
    <ToolShell
      title="Coin flip & dice roller"
      description="Flip a coin or roll 1–6 dice with fair, truly random results for games and quick decisions."
      faq={[
        {
          q: 'Is it really random?',
          a: 'Yes. It uses your browser’s cryptographic random number generator, so every side has the same chance.',
        },
      ]}
    >
      <Choice
        options={[
          { value: 'coin' as const, label: 'Coin' },
          { value: 'dice' as const, label: 'Dice' },
        ]}
        value={mode}
        set={m => {
          setMode(m);
          setResult([]);
        }}
      />
      {mode === 'dice' && (
        <Num
          label="Number of dice (1–6)"
          value={dice}
          set={v => setDice(Math.max(1, Math.min(6, Math.round(v) || 1)))}
        />
      )}
      <div className="cdShow" key={spin} aria-live="polite">
        {result.length ? (
          result.map((r, i) => (
            <span key={i} className={mode === 'coin' ? 'coin' : 'die'}>
              {mode === 'coin' ? r : r}
            </span>
          ))
        ) : (
          <span className="cdHint">Press the button</span>
        )}
      </div>
      <button className="btn btnPrimary gameBigBtn" onClick={roll}>
        {mode === 'coin' ? 'Flip coin' : `Roll ${dice} ${dice === 1 ? 'die' : 'dice'}`}
      </button>
      {history.length > 0 && <p className="notice">Last results: {history.join(' · ')}</p>}
    </ToolShell>
  );
}

/* ---------- Citation generator ---------- */
export function CitationGenerator() {
  const [type, setType] = useState<'web' | 'book'>('web');
  const [style, setStyle] = useState<'apa' | 'mla' | 'chicago'>('apa');
  const [authors, setAuthors] = useState('');
  const [title, setTitle] = useState('');
  const [site, setSite] = useState('');
  const [year, setYear] = useState('');
  const [url, setUrl] = useState('');
  const [publisher, setPublisher] = useState('');
  const [accessed, setAccessed] = useState('');
  const names = authors
    .split(/;|\n/)
    .map(x => x.trim())
    .filter(Boolean);
  const parse = (n: string) => {
    const parts = n.split(/\s+/);
    const last = parts.pop() || '';
    return { first: parts.join(' '), last, initials: parts.map(p => `${p[0]}.`).join(' ') };
  };
  const apaList = names.map(n => (parse(n).first ? `${parse(n).last}, ${parse(n).initials}` : n));
  const apaAuthors =
    apaList.length <= 1
      ? apaList.join('')
      : `${apaList.slice(0, -1).join(', ')}, & ${apaList[apaList.length - 1]}`;
  const mlaAuthors =
    names.length === 0
      ? ''
      : names.length === 1
        ? `${parse(names[0]).last}, ${parse(names[0]).first}`
        : names.length === 2
          ? `${parse(names[0]).last}, ${parse(names[0]).first}, and ${names[1]}`
          : `${parse(names[0]).last}, ${parse(names[0]).first}, et al`;
  const cite = useMemo(() => {
    const y = year || 'n.d.';
    if (style === 'apa')
      return type === 'web'
        ? `${apaAuthors ? `${apaAuthors} ` : ''}(${y}). ${title || '[Title]'}. ${site ? `${site}. ` : ''}${url}`.trim()
        : `${apaAuthors ? `${apaAuthors} ` : ''}(${y}). ${title || '[Title]'}. ${publisher}.`.trim();
    if (style === 'mla')
      return type === 'web'
        ? `${mlaAuthors ? `${mlaAuthors}. ` : ''}“${title || '[Title]'}.” ${site ? `${site}, ` : ''}${year ? `${year}, ` : ''}${url.replace(/^https?:\/\//, '')}.${accessed ? ` Accessed ${accessed}.` : ''}`
        : `${mlaAuthors ? `${mlaAuthors}. ` : ''}${title || '[Title]'}. ${publisher}${year ? `, ${year}` : ''}.`;
    return type === 'web'
      ? `${names.length ? `${names.join(', ')}. ` : ''}“${title || '[Title]'}.” ${site ? `${site}. ` : ''}${year ? `${year}. ` : ''}${url}.`
      : `${names.length ? `${names.join(', ')}. ` : ''}${title || '[Title]'}. ${publisher}${year ? `, ${year}` : ''}.`;
  }, [style, type, apaAuthors, mlaAuthors, names, title, site, year, url, publisher, accessed]);
  return (
    <ToolShell
      title="Citation generator (APA, MLA, Chicago)"
      description="Create references for websites and books in APA 7, MLA 9 or Chicago style for essays, assignments and research."
      faq={[
        {
          q: 'How do I write several authors?',
          a: 'Put each author’s full name on a new line or separate them with a semicolon, first name first — for example “Ayesha Khan; John Smith”.',
        },
        {
          q: 'Should I italicise anything?',
          a: 'Yes: in your document, put the book title (APA, MLA, Chicago) or website name (MLA) in italics; plain text cannot show italics.',
        },
      ]}
    >
      <Choice
        options={[
          { value: 'apa' as const, label: 'APA 7' },
          { value: 'mla' as const, label: 'MLA 9' },
          { value: 'chicago' as const, label: 'Chicago' },
        ]}
        value={style}
        set={setStyle}
      />
      <Choice
        options={[
          { value: 'web' as const, label: 'Website / article' },
          { value: 'book' as const, label: 'Book' },
        ]}
        value={type}
        set={setType}
      />
      <div className="field">
        <label htmlFor="cit-a">Author(s) — one per line or separated by ;</label>
        <textarea
          id="cit-a"
          className="textArea"
          style={{ minHeight: 70 }}
          value={authors}
          onChange={e => setAuthors(e.target.value)}
          placeholder="Ayesha Khan; John Smith"
        />
      </div>
      <Fields cols={2}>
        <Text label="Title" value={title} set={setTitle} />
        <Text label="Year" value={year} set={setYear} placeholder="2026" />
        {type === 'web' ? (
          <Text label="Website name" value={site} set={setSite} />
        ) : (
          <Text label="Publisher" value={publisher} set={setPublisher} />
        )}
        {type === 'web' && <Text label="URL" value={url} set={setUrl} placeholder="https://…" />}
        {type === 'web' && style === 'mla' && (
          <Text label="Date accessed" value={accessed} set={setAccessed} placeholder="5 Nov. 2026" />
        )}
      </Fields>
      <pre className="codeBox" style={{ whiteSpace: 'pre-wrap' }}>
        {cite}
      </pre>
      <CopyButton text={cite} label="Copy citation" />
    </ToolShell>
  );
}

/* ---------- Hijri date converter ---------- */
export function HijriConverter() {
  const [date, setDate] = useState('');
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- today's date is only known in the browser
    setDate(new Date().toISOString().slice(0, 10));
  }, []);
  const out = useMemo(() => {
    if (!date) return null;
    const d = new Date(`${date}T12:00:00`);
    if (isNaN(d.getTime())) return null;
    const f = (cal: string, o: Intl.DateTimeFormatOptions) => {
      try {
        return new Intl.DateTimeFormat(`en-u-ca-${cal}`, o).format(d);
      } catch {
        return '—';
      }
    };
    return {
      uq: f('islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }),
      civil: f('islamic-civil', { day: 'numeric', month: 'long', year: 'numeric' }),
      ar: (() => {
        try {
          return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(d);
        } catch {
          return '—';
        }
      })(),
      weekday: d.toLocaleDateString('en', { weekday: 'long' }),
    };
  }, [date]);
  return (
    <ToolShell
      title="Hijri date converter"
      description="Convert any Gregorian date to the Islamic (Hijri) calendar using the Umm al-Qura and civil calculations."
      faq={[
        {
          q: 'Why can the date differ by a day from my local calendar?',
          a: 'Many countries start Islamic months by moon sighting, which can differ by a day from calculated calendars such as Umm al-Qura. Check your local announcement for religious dates.',
        },
      ]}
    >
      <div className="field">
        <label htmlFor="hj-d">Gregorian date</label>
        <input id="hj-d" type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      {out && (
        <Stats cols={2}>
          <Stat label="Hijri (Umm al-Qura)" value={out.uq} />
          <Stat label="Hijri (civil)" value={out.civil} />
          <Stat label="In Arabic" value={out.ar} />
          <Stat label="Weekday" value={out.weekday} />
        </Stats>
      )}
    </ToolShell>
  );
}

/* ---------- Freelance rate calculator ---------- */
export function FreelanceRate() {
  const [income, setIncome] = useState(30000);
  const [expenses, setExpenses] = useState(3000);
  const [weeks, setWeeks] = useState(46);
  const [hours, setHours] = useState(25);
  const [fees, setFees] = useState(10);
  const [tax, setTax] = useState(0);
  const billable = weeks * hours;
  const needed = (income + expenses) / Math.max(0.01, 1 - tax / 100) / Math.max(0.01, 1 - fees / 100);
  const rate = billable > 0 ? needed / billable : NaN;
  return (
    <ToolShell
      title="Freelance rate calculator"
      description="Work out the hourly and daily rate you need to charge to reach your yearly income after expenses, platform fees and tax."
      faq={[
        {
          q: 'How is the rate calculated?',
          a: 'Rate = (target income + yearly expenses) ÷ (1 − tax %) ÷ (1 − platform fee %) ÷ billable hours per year.',
        },
        {
          q: 'What are billable hours?',
          a: 'Hours you can actually charge clients for — not admin, marketing or learning time. 20–30 hours a week is common.',
        },
      ]}
    >
      <Fields cols={3}>
        <Num label="Yearly take-home goal" value={income} set={setIncome} />
        <Num label="Yearly business expenses" value={expenses} set={setExpenses} />
        <Num label="Working weeks per year" value={weeks} set={setWeeks} />
        <Num label="Billable hours per week" value={hours} set={setHours} />
        <Num label="Platform fee (%)" value={fees} set={setFees} />
        <Num label="Tax (%)" value={tax} set={setTax} />
      </Fields>
      <Stats cols={3}>
        <Stat label="Hourly rate" value={money(rate)} />
        <Stat label="Day rate (8 h)" value={money(rate * 8)} />
        <Stat label="Yearly billing needed" value={money(needed)} />
      </Stats>
    </ToolShell>
  );
}

/* ---------- Reading time calculator ---------- */
export function ReadingTime() {
  const [text, setText] = useState('');
  const [wpm, setWpm] = useState(230);
  const words = (text.trim().match(/\S+/g) || []).length;
  const mins = words / Math.max(50, wpm);
  const speak = words / 150;
  const t = (m: number) =>
    m < 1 ? `${Math.max(1, Math.round(m * 60))} sec` : `${Math.floor(m)} min ${Math.round((m % 1) * 60)} sec`;
  return (
    <ToolShell
      title="Reading time calculator"
      description="Paste any text to see how long it takes to read and to speak aloud — for blog posts, speeches and scripts."
      faq={[
        {
          q: 'What reading speed is used?',
          a: 'About 230 words per minute for silent reading (you can change it) and 150 words per minute for speaking aloud.',
        },
      ]}
    >
      <div className="field">
        <label htmlFor="rt-in">Your text</label>
        <textarea
          id="rt-in"
          className="textArea"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste your article or script"
        />
      </div>
      <Num label="Reading speed (words per minute)" value={wpm} set={setWpm} />
      <Stats cols={3}>
        <Stat label="Words" value={fmt(words, 0)} />
        <Stat label="Reading time" value={words ? t(mins) : '—'} />
        <Stat label="Speaking time" value={words ? t(speak) : '—'} />
      </Stats>
      {!text && <Note>Tip: 1,500 words is about a 7-minute read.</Note>}
    </ToolShell>
  );
}
