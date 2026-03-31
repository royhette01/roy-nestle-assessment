import type { GenderFilter } from "../lib/filterNames";

type Props = {
  value: GenderFilter;
  onChange: (g: GenderFilter) => void;
};

const options: { id: GenderFilter; label: string }[] = [
  { id: "M", label: "Male" },
  { id: "F", label: "Female" },
  { id: "both", label: "Both" },
];

export function GenderPicker({ value, onChange }: Props) {
  return (
    <div className="gender-strip">
      <p className="gender-strip__label">Choose your pet’s gender</p>
      <div className="gender-strip__buttons" role="group" aria-label="Pet gender">
        {options.map((o) => {
          const active = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              className={`pill-btn${active ? " pill-btn--solid" : ""}`}
              aria-pressed={active}
              onClick={() => onChange(o.id)}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
