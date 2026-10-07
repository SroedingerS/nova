import { readFile, writeFile } from "node:fs/promises";
import { parseRelease, repository } from "./release.mjs";
try {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "Nova-Preview",
  };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(
    `https://api.github.com/repos/${repository}/releases/latest`,
    { headers, signal: AbortSignal.timeout(15000) },
  );
  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
  const release = parseRelease(await response.json());
  await writeFile("src/release.json", JSON.stringify(release, null, 2) + "\n");
  console.log(`Official stable release: ${release.version}`);
} catch (error) {
  const saved = JSON.parse(await readFile("src/release.json", "utf8"));
  console.warn(
    `Release refresh unavailable; using verified snapshot ${saved.version}: ${error.message}`,
  );
}
