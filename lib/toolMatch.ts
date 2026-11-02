import { tools } from '@/data/tools';

const SYN: Record<string, string[]> = {
  photo: ['image'],
  picture: ['image'],
  pic: ['image'],
  jpg: ['image'],
  jpeg: ['image'],
  png: ['image'],
  webp: ['image'],
  shrink: ['compress'],
  reduce: ['compress'],
  smaller: ['compress'],
  kb: ['compress'],
  size: ['resize', 'compress'],
  join: ['merge'],
  combine: ['merge'],
  split: ['split'],
  unlock: ['unlocker'],
  lock: ['protect', 'password'],
  sign: ['signature'],
  cv: ['resume'],
  bill: ['invoice', 'bill', 'tip'],
  code: ['developer', 'json', 'minifier'],
  api: ['api'],
  regex: ['regex'],
  token: ['token', 'jwt'],
  hash: ['hash'],
  encode: ['base64', 'url'],
  decode: ['base64', 'jwt', 'url'],
  words: ['word'],
  count: ['counter', 'word'],
  grammar: ['readability'],
  seo: ['seo', 'meta'],
  title: ['headline', 'meta'],
  video: ['video'],
  audio: ['audio'],
  mp3: ['audio'],
  gif: ['gif'],
  subtitle: ['srt'],
  loan: ['loan', 'emi'],
  mortgage: ['loan', 'emi'],
  interest: ['interest', 'loan'],
  tax: ['vat', 'tax'],
  gst: ['vat'],
  salary: ['percentage'],
  money: ['currency', 'profit', 'discount'],
  sale: ['discount'],
  weight: ['bmi', 'calorie'],
  diet: ['calorie'],
  health: ['bmi', 'calorie'],
  birthday: ['age'],
  math: ['scientific', 'fraction', 'quadratic', 'statistics'],
  calculator: ['calculator'],
  equation: ['quadratic'],
  average: ['statistics'],
  mean: ['statistics'],
  grade: ['gpa'],
  student: ['gpa', 'fraction', 'scientific'],
  electric: ['ohm', 'resistor'],
  electronics: ['ohm', 'resistor'],
  circuit: ['ohm', 'resistor'],
  voltage: ['ohm'],
  network: ['subnet'],
  ip: ['subnet'],
  linux: ['chmod'],
  permission: ['chmod'],
  game: ['game'],
  play: ['game'],
  bored: ['game'],
  typing: ['typing'],
  timer: ['stopwatch', 'pomodoro'],
  speak: ['speech'],
  voice: ['speech'],
  read: ['speech'],
};

export function matchTools(query: string, limit = 5) {
  const words = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1);
  const terms = new Set<string>();
  words.forEach(w => {
    terms.add(w);
    (SYN[w] || []).forEach(s => terms.add(s));
    if (w.endsWith('s')) terms.add(w.slice(0, -1));
  });
  const scored = tools
    .map(t => {
      const name = t.name.toLowerCase(),
        hay = `${name} ${t.slug} ${t.description.toLowerCase()} ${t.category.toLowerCase()}`;
      let s = 0;
      terms.forEach(term => {
        if (term.length < 3 && !['ip', 'kb', 'cv'].includes(term)) return;
        const re = term.length < 4 ? new RegExp(`\\b${term}\\b`) : null;
        const inName = re ? re.test(name) : name.includes(term);
        const inHay = re ? re.test(hay) : hay.includes(term);
        if (inName) s += 3;
        else if (inHay) s += 1;
      });
      return { t, s };
    })
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s);
  return scored.slice(0, limit).map(x => x.t);
}
