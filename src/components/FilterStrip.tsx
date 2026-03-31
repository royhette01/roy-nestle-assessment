import type { FilterGroup } from "../types";

type Props = {
  groups: FilterGroup[];
  selectionByGroup: Record<string, string | undefined>;
  categoryLabel: (id: string) => string;
  onSelect: (groupId: string, categoryId: string | null) => void;
};

export function FilterStrip({
  groups,
  selectionByGroup,
  categoryLabel,
  onSelect,
}: Props) {
  return (
    <div className="filter-strip">
      <span className="filter-strip__title">Filters</span>
      <div className="filter-strip__dropdowns">
        {groups.map((g) => (
          <label key={g.id} className="filter-dd">
            <span className="visually-hidden">{g.label}</span>
            <select
              className="filter-dd__select"
              value={selectionByGroup[g.id] ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                onSelect(g.id, v || null);
              }}
            >
              <option value="">{g.label}</option>
              {g.categoryIds.map((cid) => (
                <option key={cid} value={cid}>
                  {categoryLabel(cid)}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </div>
  );
}
