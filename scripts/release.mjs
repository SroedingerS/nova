export const repository = "SroedingerS/AudiobooksNova-Releases";
export function parseRelease(release) {
  if (release.draft || release.prerelease)
    throw new Error("Only a published stable release is allowed");
  if (!/^v?\d+\.\d+\.\d+[a-z]*$/.test(release.tag_name ?? ""))
    throw new Error("Invalid version");
  if (
    !release.html_url?.startsWith(
      `https://github.com/${repository}/releases/tag/`,
    )
  )
    throw new Error("Unexpected release repository");
  if (!Number.isFinite(Date.parse(release.published_at)))
    throw new Error("Invalid release date");
  const apk = release.assets?.find((asset) =>
    /^AudiobooksNova-[\w.-]+\.apk$/.test(asset.name),
  );
  if (
    !apk?.browser_download_url?.startsWith(
      `https://github.com/${repository}/releases/download/`,
    )
  )
    throw new Error("Official APK not found");
  if (!Number.isFinite(apk.size) || apk.size <= 0)
    throw new Error("Invalid APK size");
  return {
    version: release.tag_name.replace(/^v/, ""),
    publishedAt: release.published_at,
    url: release.html_url,
    apk: apk.browser_download_url,
    size: apk.size,
  };
}
