import type { GenderCode, PetName } from "../types";

export type GenderFilter = "M" | "F" | "both";

export type NameFilters = {
  gender: GenderFilter;
  letter: string | null;
  categoryIds: string[];
  query: string;
};

function firstSignificantLetter(title: string): string {
  const t = title.trim();
  if (!t) return "";
  return t[0]!.toUpperCase();
}

function matchesGender(name: PetName, gender: GenderFilter): boolean {
  if (gender === "both") return true;
  const g = name.gender;
  if (g.length === 0) return true;
  return g.includes(gender as GenderCode) || g.length === 2;
}

function matchesCategories(name: PetName, categoryIds: string[]): boolean {
  if (categoryIds.length === 0) return true;
  const set = new Set(name.categories);
  return categoryIds.some((id) => set.has(id));
}

function matchesLetter(name: PetName, letter: string | null): boolean {
  if (!letter) return true;
  return firstSignificantLetter(name.title) === letter;
}

function matchesQuery(name: PetName, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return name.title.toLowerCase().includes(q);
}

export function filterNames(names: PetName[], f: NameFilters): PetName[] {
  return names.filter(
    (n) =>
      matchesGender(n, f.gender) &&
      matchesLetter(n, f.letter) &&
      matchesCategories(n, f.categoryIds) &&
      matchesQuery(n, f.query),
  );
}

export function sortNamesByTitle(names: PetName[]): PetName[] {
  return [...names].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
  );
}
