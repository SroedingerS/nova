import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { transpileModule, ModuleKind, ScriptTarget } from "typescript";
const source = readFileSync(
  new URL("../src/guide-data.ts", import.meta.url),
  "utf8",
);
const js = transpileModule(source, {
  compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ES2022 },
}).outputText;
const { guideArticles, guideCategories, matchesGuide, normalizeGuideQuery } =
  await import(
    "data:text/javascript;base64," + Buffer.from(js).toString("base64")
  );
const settings = JSON.parse(
  readFileSync(new URL("../src/guide-settings.json", import.meta.url), "utf8"),
);
test("every article, category and related link has a unique existing destination", () => {
  const ids = new Set(guideArticles.map((a) => a.id));
  assert.equal(ids.size, guideArticles.length);
  for (const article of guideArticles) {
    assert.ok(
      guideCategories.some((c) => c.id === article.category),
      article.id,
    );
    assert.ok(article.steps.length >= 3, article.id);
    for (const id of article.related)
      assert.ok(ids.has(id), `${article.id} -> ${id}`);
  }
});
test("settings search entries lead to real explanations without duplicate names", () => {
  assert.equal(new Set(settings.map((s) => s.title)).size, settings.length);
  for (const setting of settings)
    assert.ok(
      guideArticles.some((a) => a.id === setting.article),
      setting.title,
    );
});
test("Russian search handles case, ё, punctuation and multiword intent", () => {
  assert.equal(normalizeGuideQuery("  ЕЩЁ, E-INK! "), "еще e ink");
  const find = (q) =>
    guideArticles.filter((a) => matchesGuide(a, q)).map((a) => a.id);
  assert.ok(find("без интернета").includes("downloads"));
  assert.ok(find("читать вслух").includes("reader-voice"));
  assert.ok(find("шрифт").includes("reader-look"));
  assert.deepEqual(find("несуществующийзапросххх"), []);
  assert.equal(find("   ").length, guideArticles.length);
});
test("every referenced screenshot exists and is a valid PNG or WebP", () => {
  for (const article of guideArticles.filter((a) => a.image)) {
    const path = new URL("../public/" + article.image, import.meta.url);
    assert.ok(existsSync(path), article.image);
    const bytes = readFileSync(path);
    assert.ok(
      bytes
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ||
        bytes.subarray(8, 12).toString() === "WEBP",
      article.image,
    );
  }
});
test("production guide contains readable article content and correct route metadata", () => {
  const html = readFileSync(
    new URL("../dist/guide/index.html", import.meta.url),
    "utf8",
  );
  assert.match(html, /<title>Инструкция Nova/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/sroedingers.github.io\/nova\/guide\/"/,
  );
  for (const article of guideArticles)
    assert.ok(html.includes(`id="${article.id}"`), article.id);
  assert.ok(html.includes(guideArticles[0].steps[0]));
  assert.ok(!html.includes("<!--app-html-->"));
});
