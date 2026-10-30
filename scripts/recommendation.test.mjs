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
const compact=(...parts)=>'#2.'+Buffer.from(parts.join('\n'),'utf8').toString('base64url');
test('compact ASCII links preserve exact targets for book, series and author',()=>{
  for (const [k,kind,extra] of [['b','book',[]],['s','series',['Автор','Звёздные хроники']],['a','author',['Автор']]]) {
    const hash=compact(k,'izib','144205','https://pda.izib.uk/art144205',...extra);
    const target=recommendation('',hash);
    assert.equal(target.source,'https://pda.izib.uk/art144205');
    assert.equal(target.app,'audiobooksnova://share?d='+hash.slice(1));
    assert.equal(target.title,kind==='series'?'Звёздные хроники':kind==='author'?'Автор':'Книга в Nova');
    assert.equal(recommendation('',hash+'='),null);
    assert.equal(recommendation('?v=1',hash),null);
  }
  assert.ok(('https://sroedingers.github.io/nova/open/'+compact('b','izib','144205','https://pda.izib.uk/art144205')).length<120);
  assert.equal(recommendation('',compact('b','izib','42','file:///private/book')),null);
  assert.equal(recommendation('',compact('b','izib','42','https://pda.izib.uk/book?token=private')),null);
});
test('legacy button omits redundant book display text while keeping the page title',()=>{
  const target=recommendation(query({title:'Хозяин Хаоса. Том 1'}));
  assert.equal(target.title,'Хозяин Хаоса. Том 1');
  assert.equal(new URL(target.app).searchParams.has('title'),false);
});
