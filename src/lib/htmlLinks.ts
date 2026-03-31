const ORIGIN = "https://www.purina.co.uk";

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Plain-text definitions from CMS are wrapped; HTML passthrough stays intact. */
export function normalizeDefinitionHtml(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  if (t.includes("<")) return t;
  return `<p>${escapeHtml(t)}</p>`;
}

/** Makes relative Purina links in CMS HTML usable off-site. */
export function absolutizeDefinitionHtml(html: string): string {
  return html.replaceAll('href="/', `href="${ORIGIN}/`);
}
