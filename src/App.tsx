import { useCallback, useEffect, useMemo, useState } from "react";
import { ActiveFilterChips } from "./components/ActiveFilterChips";
import { AlphabetRail } from "./components/AlphabetRail";
import { CoverStage } from "./components/CoverStage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { FilterStrip } from "./components/FilterStrip";
import { GenderPicker } from "./components/GenderPicker";
import { NameDetail } from "./components/NameDetail";
import { NameListVirtual } from "./components/NameListVirtual";
import { SearchField } from "./components/SearchField";
import { useExplorerData } from "./hooks/useExplorerData";
import { filterNames, sortNamesByTitle, type GenderFilter } from "./lib/filterNames";
import { relatedNames } from "./lib/relatedNames";

function ExplorerApp() {
  const data = useExplorerData();
  const [gender, setGender] = useState<GenderFilter>("both");
  const [letter, setLetter] = useState<string | null>(null);
  const [selectionByGroup, setSelectionByGroup] = useState<
    Record<string, string | undefined>
  >({});
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  const begin = useCallback(() => setStarted(true), []);

  const categoryLabel = useMemo(() => {
    if (data.status !== "ok") return (_id: string) => _id;
    const map = new Map(data.categories.data.map((c) => [c.id, c.name]));
    return (id: string) => map.get(id) ?? id;
  }, [data]);

  const categoryIds = useMemo(() => {
    return Object.values(selectionByGroup).filter(
      (v): v is string => Boolean(v),
    );
  }, [selectionByGroup]);

  const chips = useMemo(() => {
    if (data.status !== "ok") return [];
    return data.categories.filterGroups
      .map((g) => {
        const cid = selectionByGroup[g.id];
        if (!cid) return null;
        return {
          groupId: g.id,
          categoryId: cid,
          label: categoryLabel(cid),
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [data, selectionByGroup, categoryLabel]);

  const filtered = useMemo(() => {
    if (data.status !== "ok") return [];
    const f = filterNames(data.names, {
      gender,
      letter,
      categoryIds,
      query,
    });
    return sortNamesByTitle(f);
  }, [data, gender, letter, categoryIds, query]);

  const selected = useMemo(() => {
    if (data.status !== "ok" || !selectedId) return null;
    return data.names.find((n) => n.id === selectedId) ?? null;
  }, [data, selectedId]);

  const related = useMemo(() => {
    if (!selected || data.status !== "ok") return [];
    return relatedNames(selected, data.names, 10);
  }, [selected, data]);

  useEffect(() => {
    if (selectedId && !filtered.some((n) => n.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filtered, selectedId]);

  const onGroupSelect = useCallback((groupId: string, categoryId: string | null) => {
    setStarted(true);
    setSelectionByGroup((prev) => {
      const next = { ...prev };
      if (!categoryId) delete next[groupId];
      else next[groupId] = categoryId;
      return next;
    });
  }, []);

  const onRemoveChip = useCallback((groupId: string) => {
    setSelectionByGroup((prev) => {
      const next = { ...prev };
      delete next[groupId];
      return next;
    });
  }, []);

  if (data.status === "loading") {
    return (
      <div className="page page--center">
        <p className="muted">Fetching names…</p>
      </div>
    );
  }

  if (data.status === "error") {
    return (
      <div className="page page--center fatal">
        <h1>Couldn’t load data</h1>
        <p>{data.message}</p>
      </div>
    );
  }

  return (
    <div className="page">
      

      <GenderPicker
        value={gender}
        onChange={(g) => {
          setGender(g);
          setStarted(true);
        }}
      />

      <FilterStrip
        groups={data.categories.filterGroups}
        selectionByGroup={selectionByGroup}
        categoryLabel={categoryLabel}
        onSelect={onGroupSelect}
      />

      <ActiveFilterChips chips={chips} onRemove={onRemoveChip} />

      <SearchField
        value={query}
        onChange={(q) => {
          setQuery(q);
          if (q.trim()) setStarted(true);
        }}
      />

      <AlphabetRail
        letters={data.letters}
        active={letter}
        onPick={(L) => {
          setLetter(L);
          setStarted(true);
        }}
      />

      {!started && <CoverStage onBegin={begin} />}

      {started && (
        <div className="main-grid">
          <aside className="main-grid__aside">
            <NameListVirtual
              names={filtered}
              activeId={selectedId}
              onSelect={(id) => setSelectedId(id)}
            />
            {filtered.length === 0 && (
              <p className="empty-hint">Nothing matches — loosen a filter or try another letter.</p>
            )}
          </aside>
          <main className="main-grid__detail">
            {selected ? (
              <NameDetail
                name={selected}
                categoryLabel={categoryLabel}
                related={related}
                onPickRelated={(id) => setSelectedId(id)}
              />
            ) : (
              <div className="detail-placeholder">
                <p className="detail-placeholder__title">Pick a name</p>
                <p className="muted">
                  Choose something from the list — you’ll see the full story, tags, and a few
                  cousins that feel close.
                </p>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ExplorerApp />
    </ErrorBoundary>
  );
}
