import { readFile, writeFile } from "node:fs/promises";
import { html } from "../.prerender/prerender.js";
const template = await readFile("dist/index.html", "utf8");
await writeFile("dist/index.html", template.replace("<!--app-html-->", html));
await writeFile("dist/404.html", template.replace("<!--app-html-->", html));
console.log(
  "Static HTML rendered: content is available before JavaScript loads.",
);
