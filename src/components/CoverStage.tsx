type Props = {
  onBegin: () => void;
};

export function CoverStage({ onBegin }: Props) {
  return (
    <section className="cover" aria-label="Intro">
      <div className="cover-hero">
        <div className="cover-hero__stage">
          <h1 className="cover-hero__type">
            <span className="cover-hero__line">I need</span>
            <span className="cover-hero__line">a name</span>
          </h1>
          <img
            className="cover-hero__dog"
            src="/hero-puppy-cutout.png"
            alt="Puppy sitting in front of the headline"
            width={480}
            height={600}
            decoding="async"
          />
        </div>
        <div className="cover-hero__sub">
          <button
            type="button"
            className="pill-btn pill-btn--solid"
            onClick={onBegin}
          >
            Start browsing names
          </button>
        </div>
      </div>
    </section>
  );
}
