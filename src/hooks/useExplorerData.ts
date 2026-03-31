import { useEffect, useState } from "react";
import type { CategoriesPayload, PetName } from "../types";

type LoadState =
  | { status: "loading" }
  | { status: "ok"; names: PetName[]; categories: CategoriesPayload; letters: string[] }
  | { status: "error"; message: string };

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
  return res.json() as Promise<T>;
}

export function useExplorerData(): LoadState {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [namesRes, catRes, lettersRes] = await Promise.all([
          fetchJson<{ data: PetName[] }>("/data/names.json"),
          fetchJson<CategoriesPayload>("/data/categories.json"),
          fetchJson<{ data: string[] }>("/data/letters.json"),
        ]);
        if (cancelled) return;
        setState({
          status: "ok",
          names: namesRes.data,
          categories: catRes,
          letters: lettersRes.data,
        });
      } catch (e) {
        if (cancelled) return;
        setState({
          status: "error",
          message: e instanceof Error ? e.message : "Something went wrong",
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
