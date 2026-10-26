// Local review only. Published GitHub Pages output remains in dist/ unchanged.
import { readFile, writeFile, mkdir, cp } from "node:fs/promises";
import path from "node:path";
await mkdir("portable-preview", { recursive: true });
await cp("dist", "portable-preview", { recursive: true });
for (const [page, prefix] of [
  ["index.html", "./"],
  ["guide/index.html", "../"],
]) {
  let html = await readFile(path.join("dist", page), "utf8");
  const scripts = [
    ...html.matchAll(
      /<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/g,
    ),
  ];
  const styles = [
    ...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g),
  ];
  for (const match of scripts) {
    const js = await readFile(
      path.join("dist", match[1].replace(/^\/nova\//, "")),
      "utf8",
    );
    html = html.replace(
      match[0],
      () =>
        '<script type="module">' +
        js.replaceAll("/nova/", prefix).replaceAll("</script", "<\\/script") +
        "</script>",
    );
  }
  for (const match of styles) {
    const css = await readFile(
      path.join("dist", match[1].replace(/^\/nova\//, "")),
      "utf8",
    );
    html = html.replace(
      match[0],
      () => "<style>" + css.replaceAll("/nova/", prefix) + "</style>",
    );
  }
  html = html.replace(/((?:src|href)=")\/nova\//g, (_, open) => open + prefix);
  // A file browser does not supply an index document for directory links.
  html = html.replace(
    "</body>",
    `<script>document.addEventListener('click',function(event){var anchor=event.target.closest('a');if(!anchor)return;var url=new URL(anchor.href,location.href);if(url.protocol==='file:'&&url.pathname.endsWith('/')){url.pathname+='index.html';anchor.href=url.href;}},true);</script></body>`,
  );
  await writeFile(path.join("portable-preview", page), html);
}
console.log(
  "Portable preview ready: portable-preview/index.html and portable-preview/guide/index.html",
);
