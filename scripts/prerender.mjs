import { readFile, writeFile } from "node:fs/promises";
import { html } from "../.prerender/prerender.js";
const template = await readFile("dist/index.html", "utf8");
const release = JSON.parse(await readFile("src/release.json", "utf8"));
const metadataPattern =
  /(<script\b[^>]*\bid="nova-application"[^>]*>)([\s\S]*?)(<\/script>)/;
const metadataMatch = template.match(metadataPattern);
if (!metadataMatch) throw new Error("Application metadata missing from HTML");
const application = {
  ...JSON.parse(metadataMatch[2]),
  softwareVersion: release.version,
  downloadUrl: release.apk,
  installUrl: release.apk,
  releaseNotes: release.url,
  fileSize: `${release.size} bytes`,
};
const page = template
  .replace(
    metadataPattern,
    (_, open, _json, close) =>
      `${open}${JSON.stringify(application).replace(/</g, "\\u003c")}${close}`,
  )
  .replace("<!--app-html-->", html);
await writeFile("dist/index.html", page);
await writeFile(
  "dist/404.html",
  page.replace(
    /(<meta\b[^>]*\bname="robots"[^>]*\bcontent=")[^"]*(")/,
    "$1noindex, follow$2",
  ),
);
console.log(
  "Static HTML rendered: content is available before JavaScript loads.",
);
