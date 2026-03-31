type Chip = { groupId: string; categoryId: string; label: string };

type Props = {
  chips: Chip[];
  onRemove: (groupId: string) => void;
};

export function ActiveFilterChips({ chips, onRemove }: Props) {
  if (chips.length === 0) return null;
  return (
    <div className="active-filters" aria-label="Active filters">
      <span className="active-filters__label">Active filters</span>
      <ul className="active-filters__list">
        {chips.map((c) => (
          <li key={`${c.groupId}-${c.categoryId}`}>
            <button
              type="button"
              className="filter-chip"
              onClick={() => onRemove(c.groupId)}
            >
              <span>{c.label}</span>
              <span className="filter-chip__x" aria-hidden>
                ×
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
