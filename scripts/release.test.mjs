import { test } from "node:test";
import assert from "node:assert/strict";
import { parseRelease, repository } from "./release.mjs";
const release = () => ({
  draft: false,
  prerelease: false,
  tag_name: "v2.9.4u",
  published_at: "2026-10-04T10:20:10Z",
  html_url: `https://github.com/${repository}/releases/tag/v2.9.4u`,
  assets: [
    {
      name: "AudiobooksNova-2.9.4u.apk",
      size: 41499462,
      browser_download_url: `https://github.com/${repository}/releases/download/v2.9.4u/AudiobooksNova-2.9.4u.apk`,
    },
  ],
});
test("selects official APK when other assets are present", () => {
  const r = release();
  r.assets.unshift({
    name: "notes.txt",
    size: 1,
    browser_download_url: "https://example.com/notes",
  });
  assert.equal(parseRelease(r).version, "2.9.4u");
  assert.match(parseRelease(r).apk, /\.apk$/);
});
test("rejects preview, draft and missing APK releases", () => {
  for (const r of [
    { ...release(), prerelease: true },
    { ...release(), draft: true },
    { ...release(), assets: [] },
  ])
    assert.throws(() => parseRelease(r));
});
test("rejects external download and malformed metadata", () => {
  const r = release();
  r.assets[0].browser_download_url = "https://example.com/app.apk";
  assert.throws(() => parseRelease(r));
  assert.throws(() => parseRelease({ ...release(), published_at: "unknown" }));
  assert.throws(() => parseRelease({ ...release(), tag_name: "3.0-preview" }));
});
