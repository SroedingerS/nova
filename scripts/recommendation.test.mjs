import test from 'node:test';
import assert from 'node:assert/strict';
import { recommendation } from '../public/open/open.mjs';
const base = {v:'1',kind:'book',source:'audioboo',id:'42',url:'https://audioboo.org/42-book.html',title:'Книга <script> & название',author:'Автор',narrator:'Чтец',series:'Цикл'};
const query = data => '?' + new URLSearchParams({...base,...data});
test('preserves public target and safely produces an explicit app button', () => {
  const b = recommendation(query({}));
  assert.equal(b.title, base.title); // Rendered via textContent, never HTML.
  assert.ok(b.app.startsWith('audiobooksnova://share?v=1&'));
  assert.equal(b.host,'audioboo.org');
  assert.equal(recommendation(query({kind:'series'})).title,'Цикл');
  assert.equal(recommendation(query({kind:'author'})).title,'Автор');
});
test('rejects malformed, duplicate, private or credential-bearing targets', () => {
  for (const url of ['javascript:alert(1)','file:///private/book','smb://pc/books','https://u:p@audioboo.org/book',
    'https://127.0.0.1/book','https://pc.local/book','https://audioboo.org/book?%74oken=private'])
    assert.equal(recommendation(query({url})),null,url);
  assert.equal(recommendation(query({})+'&kind=author'),null);
  assert.equal(recommendation(query({})+'&progressMs=123'),null);
  assert.equal(recommendation(query({v:'2'})),null);
  assert.equal(recommendation(query({kind:'series',series:''})),null);
});
