import { describe, expect, it } from "vitest";
import { filterNames, sortNamesByTitle, type NameFilters } from "./filterNames";
import type { PetName } from "../types";

const sample: PetName[] = [
  {
    id: "1",
    title: "Aaron",
    definition: "<p>a</p>",
    gender: ["M"],
    categories: ["c1", "c2"],
  },
  {
    id: "2",
    title: "Bella",
    definition: "<p>b</p>",
    gender: ["F"],
    categories: ["c1"],
  },
  {
    id: "3",
    title: "Alex",
    definition: "<p>x</p>",
    gender: ["M", "F"],
    categories: [],
  },
];

describe("filterNames", () => {
  it("filters by gender male", () => {
    const f: NameFilters = {
      gender: "M",
      letter: null,
      categoryIds: [],
      query: "",
    };
    const out = filterNames(sample, f);
    expect(out.map((n) => n.title).sort()).toEqual(["Aaron", "Alex"]);
  });

  it("filters by letter", () => {
    const f: NameFilters = {
      gender: "both",
      letter: "B",
      categoryIds: [],
      query: "",
    };
    expect(filterNames(sample, f).map((n) => n.title)).toEqual(["Bella"]);
  });

  it("matches any selected category (OR)", () => {
    const f: NameFilters = {
      gender: "both",
      letter: null,
      categoryIds: ["c2"],
      query: "",
    };
    expect(filterNames(sample, f).map((n) => n.title)).toEqual(["Aaron"]);
  });

  it("filters by query substring", () => {
    const f: NameFilters = {
      gender: "both",
      letter: null,
      categoryIds: [],
      query: "bel",
    };
    expect(filterNames(sample, f).map((n) => n.title)).toEqual(["Bella"]);
  });
});

describe("sortNamesByTitle", () => {
  it("sorts case-insensitively", () => {
    const s = sortNamesByTitle([sample[1]!, sample[0]!, sample[2]!]);
    expect(s.map((n) => n.title)).toEqual(["Aaron", "Alex", "Bella"]);
  });
});
