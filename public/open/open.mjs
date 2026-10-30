const fields = new Set(['v','kind','source','id','url','title','author','narrator','series']);
const kinds = new Set(['book','series','author']);
const sensitive = new Set(['token','access_token','refresh_token','password','signature','auth','secret','key']);
const clean = value => (value || '').replace(/[\x00-\x1f\x7f\s]+/g,' ').trim().slice(0,180);

export function compactFields(hash) {
  if (typeof hash !== 'string' || !hash.startsWith('#2.') || hash.length > 12000) return null;
  const encoded=hash.slice(3);
  if (!/^[A-Za-z0-9_-]+$/.test(encoded)) return null;
  try {
    const binary=atob(encoded.replace(/-/g,'+').replace(/_/g,'/'));
    if (binary.length>8192 || btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')!==encoded) return null;
    const parts=new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(binary,c=>c.charCodeAt(0))).split('\n');
    const kind={b:'book',s:'series',a:'author'}[parts[0]];
    if (!kind || parts.length!==({book:4,series:6,author:5}[kind]) || parts.some(p=>/[\x00-\x1f\x7f]/.test(p))) return null;
    const p=new URLSearchParams({v:'1',kind,source:parts[1],id:parts[2],url:parts[3]});
    if (kind!=='book') p.set('author',parts[4]);
    if (kind==='series') p.set('series',parts[5]);
    return p;
  } catch { return null; }
}

export function recommendation(search,hash='') {
  if (typeof search !== 'string' || search.length > 12000) return null;
  if (hash && search) return null;
  const p = hash ? compactFields(hash) : new URLSearchParams(search);
  if (!p) return null;
  const seen = new Set();
  for (const [key] of p) {
    if (!fields.has(key) || seen.has(key)) return null;
    seen.add(key);
  }
  if (p.get('v') !== '1' || !kinds.has(p.get('kind')) || !p.get('id') || p.get('id').length > 256 ||
      /[\x00-\x1f\x7f]/.test(p.get('id')) || !/^[a-z0-9_]{1,64}$/.test(p.get('source')||'')) return null;
  let source;
  try { source = new URL(p.get('url')); } catch { return null; }
  // No file/SMB URLs, credentials, private-address links, signing parameters or embedded scripts.
  if (!['https:','http:'].includes(source.protocol) || source.username || source.password || source.port || source.hash ||
      source.href.length > 2048 || !source.hostname.includes('.') || /^\d+(?:\.\d+){3}$/.test(source.hostname) ||
      /(?:^|\.)(?:localhost|local|internal|invalid)$/.test(source.hostname)) return null;
  for (const [key] of source.searchParams) if (sensitive.has(key.toLowerCase())) return null;
  const kind = p.get('kind');
  if (kind === 'series' && !clean(p.get('series')) || kind === 'author' && !clean(p.get('author'))) return null;
  const native=new URLSearchParams(p);
  // Legacy book links also work in browsers that decode display text before handing
  // the URI to Android. The title remains on this page, but isn't needed to find the book.
  if (kind==='book') native.delete('title');
  return {
    title: kind === 'series' ? clean(p.get('series')) : kind === 'author' ? clean(p.get('author')) : clean(p.get('title')) || 'Книга в Nova',
    description: kind === 'series' ? 'Откройте цикл в Nova и выберите нужную книгу.' :
      kind === 'author' ? 'Откройте список книг автора в Nova.' :
      [clean(p.get('author')), clean(p.get('narrator'))].filter(Boolean).join(' · ') || 'Откройте книгу в Nova или на источнике.',
    app: hash ? 'audiobooksnova://share?d='+hash.slice(1) : 'audiobooksnova://share?'+native.toString(),
    source: source.href,
    host: source.hostname,
  };
}

if (typeof document !== 'undefined') {
  const book = recommendation(location.search,location.hash);
  if (book && location.hash) document.getElementById('note').textContent=
    'Для коротких ссылок нужна Nova 3.0.1n или новее. Прежние ссылки остаются доступны. Если приложение ещё не установлено, скачайте его с официальной страницы.';
  document.getElementById('title').textContent = book?.title || 'Ссылка не распознана';
  document.getElementById('description').textContent = book?.description ||
    'Попросите отправителя поделиться книгой ещё раз. Скачать Nova и открыть инструкцию можно ниже.';
  if (book) {
    const open = document.getElementById('open');
    open.href = book.app; open.hidden = false;
    const source = document.getElementById('source');
    source.href = book.source; source.textContent = `Открыть на ${book.host}`; source.hidden = false;
  }
}
