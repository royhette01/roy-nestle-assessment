/**
 * Usage: node scripts/import-full-names.mjs /path/to/names-response.json
 * Expects top-level { "data": [ ... ] } from the assessment API.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const src = process.argv[2];
if (!src) {
  console.error("Usage: node scripts/import-full-names.mjs <path-to-json>");
  process.exit(1);
}

const raw = readFileSync(src, "utf8");
const parsed = JSON.parse(raw);
if (!parsed?.data || !Array.isArray(parsed.data)) {
  console.error("JSON must have a { data: Name[] } shape.");
  process.exit(1);
}

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "data", "names.json");
writeFileSync(out, JSON.stringify({ data: parsed.data }, null, 0), "utf8");
console.log(`Wrote ${parsed.data.length} names to public/data/names.json`);
