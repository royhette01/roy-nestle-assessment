import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "public", "data");
const parts = readdirSync(dataDir)
  .filter((f) => /^names\.part\d+\.json$/.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (parts.length === 0) {
  console.warn("No names.part*.json files found — leaving public/data/names.json unchanged.");
  process.exit(0);
}

const merged = [];
for (const file of parts) {
  const raw = readFileSync(join(dataDir, file), "utf8");
  const parsed = JSON.parse(raw);
  const chunk = Array.isArray(parsed) ? parsed : parsed.data;
  if (!Array.isArray(chunk)) {
    console.error(`Invalid chunk in ${file}`);
    process.exit(1);
  }
  merged.push(...chunk);
}

writeFileSync(join(dataDir, "names.json"), JSON.stringify({ data: merged }, null, 0), "utf8");
console.log(`Wrote names.json with ${merged.length} names from ${parts.length} part(s).`);
