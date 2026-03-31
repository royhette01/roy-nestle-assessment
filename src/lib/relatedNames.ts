import type { PetName } from "../types";

function sharedCategories(a: string[], b: string[]): number {
  const sb = new Set(b);
  return a.reduce((n, id) => n + (sb.has(id) ? 1 : 0), 0);
}

function firstLetter(t: string): string {
  return t.trim()[0]?.toUpperCase() ?? "";
}

export function relatedNames(current: PetName, pool: PetName[], limit = 8): PetName[] {
  const others = pool.filter((p) => p.id !== current.id);
  const curLetter = firstLetter(current.title);
  const scored = others.map((p) => {
    const cat = sharedCategories(current.categories, p.categories);
    const letterBoost = firstLetter(p.title) === curLetter ? 0.5 : 0;
    return { p, score: cat + letterBoost };
  });
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.p.title.localeCompare(b.p.title, undefined, { sensitivity: "base" });
  });
  return scored.slice(0, limit).map((s) => s.p);
}
