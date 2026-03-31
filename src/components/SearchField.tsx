type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function SearchField({ value, onChange }: Props) {
  return (
    <label className="search-field">
      <span className="search-field__label">Search names</span>
      <input
        className="search-field__input"
        type="search"
        placeholder="Type part of a name…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
    </label>
  );
}
