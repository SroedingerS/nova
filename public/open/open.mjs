const fields = new Set(['v','kind','source','id','url','title','author','narrator','series']);
const kinds = new Set(['book','series','author']);
const sensitive = new Set(['token','access_token','refresh_token','password','signature','auth','secret','key']);
const clean = value => (value || '').replace(/[\x00-\x1f\x7f\s]+/g,' ').trim().slice(0,180);

export function recommendation(search) {
  if (typeof search !== 'string' || search.length > 12000) return null;
  const p = new URLSearchParams(search);
  const seen = new Set();
  for (const [key] of p) {
    if (!fields.has(key) || seen.has(key)) return null;
    seen.add(key);
  }
  if (p.get('v') !== '1' || !kinds.has(p.get('kind')) || !p.get('id') || p.get('id').length > 256 || !p.get('source')) return null;
  let source;
  try { source = new URL(p.get('url')); } catch { return null; }
  // No file/SMB URLs, credentials, private-address links, signing parameters or embedded scripts.
  if (!['https:','http:'].includes(source.protocol) || source.username || source.password || source.port || source.hash ||
      source.href.length > 2048 || !source.hostname.includes('.') || /^\d+(?:\.\d+){3}$/.test(source.hostname) ||
      /(?:^|\.)(?:localhost|local|internal|invalid)$/.test(source.hostname)) return null;
  for (const [key] of source.searchParams) if (sensitive.has(key.toLowerCase())) return null;
  const kind = p.get('kind');
  if (kind === 'series' && !clean(p.get('series')) || kind === 'author' && !clean(p.get('author'))) return null;
  return {
    title: kind === 'series' ? clean(p.get('series')) : kind === 'author' ? clean(p.get('author')) : clean(p.get('title')) || 'Книга в Nova',
    description: kind === 'series' ? 'Откройте цикл в Nova и выберите нужную книгу.' :
      kind === 'author' ? 'Откройте список книг автора в Nova.' :
      [clean(p.get('author')), clean(p.get('narrator'))].filter(Boolean).join(' · ') || 'Откройте книгу в Nova или на источнике.',
    app: 'audiobooksnova://share?' + p.toString(),
    source: source.href,
    host: source.hostname,
  };
}

if (typeof document !== 'undefined') {
  const book = recommendation(location.search);
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
