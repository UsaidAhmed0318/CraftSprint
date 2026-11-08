// Tells Bing (and other IndexNow search engines) about every page in the live sitemap, so new pages are crawled fast.
// Run after a deploy:  npm run indexnow
const HOST = 'www.craftsprint.io';
const KEY = '6368c11b5e954b08aef990307900a5c8';

const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]).filter(u => u.includes(HOST));
if (!urls.length) throw new Error('No URLs found in the sitemap.');
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls.slice(0, 10000),
  }),
});
console.log(
  `IndexNow: sent ${urls.length} URLs → HTTP ${res.status} ${res.status === 200 || res.status === 202 ? '(accepted)' : await res.text()}`,
);
