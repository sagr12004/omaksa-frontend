const BEATS = [1, 2, 3, 4];

export default function BeatTrainer({ currentTime = 0, playing, taps, onTap, activeBeat = -1 }) {
  const liveBeat = playing
    ? activeBeat >= 0
      ? activeBeat
      : BEATS.findIndex((_, index) => currentTime >= index && currentTime < index + 0.35)
    : -1;

  return (
    <div className="beat-trainer">
      <span className="beat-lead">Follow the beat</span>
      <div className="beat-count" aria-label="Tap the numbered beats in time with the audio">
        {BEATS.map((beat, index) => {
          const lastTap = taps?.filter((tap) => tap.beat === index).at(-1);
          return (
            <span className="beat-unit" key={beat}>
              <button
                type="button"
                className={[
                  "beat-number",
                  liveBeat === index ? "is-active" : "",
                  lastTap?.correct === true ? "is-correct" : "",
                  lastTap?.correct === false ? "is-incorrect" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onTap(index)}
                aria-label={`Tap beat ${beat}`}
              >
                {beat}
              </button>
              <span className="beat-and">and</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
