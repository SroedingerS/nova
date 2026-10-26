import { readFile, writeFile, mkdir } from "node:fs/promises";
import { html, guideHtml } from "../.prerender/prerender.js";
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
const guideTitle = "Инструкция Nova — слушать, читать и настроить под себя";
const guideDescription =
  "Путеводитель по Nova: читалка, плеер, скачивание, библиотека и настройки. Поиск по вопросам, короткие инструкции и настоящие экраны приложения.";
const guidePage = template
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${guideTitle}</title>`)
  .replace(
    /(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*(")/g,
    `$1${guideDescription}$2`,
  )
  .replace(
    /(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*(")/g,
    `$1${guideTitle}$2`,
  )
  .replace(
    /https:\/\/sroedingers\.github\.io\/nova\/(?=")/g,
    "https://sroedingers.github.io/nova/guide/",
  )
  .replace(
    metadataPattern,
    '<script type="application/ld+json">' +
      JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: guideTitle,
        description: guideDescription,
        url: "https://sroedingers.github.io/nova/guide/",
        inLanguage: "ru",
      }) +
      "</script>",
  )
  .replace("<!--app-html-->", guideHtml);
await mkdir("dist/guide", { recursive: true });
await writeFile("dist/guide/index.html", guidePage);
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
