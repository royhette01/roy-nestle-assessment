type Props = {
  letters: string[];
  active: string | null;
  onPick: (letter: string | null) => void;
};

export function AlphabetRail({ letters, active, onPick }: Props) {
  return (
    <section className="alpha-section" aria-labelledby="alpha-heading">
      <h2 id="alpha-heading" className="alpha-section__title">
        All pets names
      </h2>
      <div className="alpha-rail" role="toolbar" aria-label="First letter">
        {letters.map((L) => {
          const on = active === L;
          return (
            <button
              key={L}
              type="button"
              className={`alpha-pill${on ? " alpha-pill--on" : ""}`}
              aria-pressed={on}
              onClick={() => onPick(on ? null : L)}
            >
              {L}
            </button>
          );
        })}
      </div>
    </section>
  );
}
