import { useEffect, useState } from "react";
import BackChevron from "./BackChevron";

const QUESTION_SECONDS = 20;

export default function TestHeader({ current, total = 10, onBack, countdown }) {
  const pct = Math.max(6, Math.round((current / total) * 100));
  const [remaining, setRemaining] = useState(QUESTION_SECONDS);
  const controlled = typeof countdown === "number";

  useEffect(() => {
    if (controlled) return undefined;
    const started = performance.now();
    setRemaining(QUESTION_SECONDS);
    let frame = 0;
    const tick = () => {
      const elapsed = (performance.now() - started) / 1000;
      const next = Math.max(0, QUESTION_SECONDS - Math.floor(elapsed));
      setRemaining(next);
      if (next > 0) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [controlled, current, total]);

  const shown = controlled ? countdown : remaining;

  return (
    <header className="test-header">
      <button type="button" className="icon-back header-back" onClick={onBack} aria-label="Back">
        <BackChevron />
      </button>
      <div
        className={`timer-wrap ${shown <= 5 ? "is-warning" : shown <= 10 ? "is-caution" : ""}`}
        aria-label={`${shown} seconds remaining`}
      >
        <span className="timer-count">{shown}</span>
      </div>
      <div className="progress-track" aria-label={`${current} of ${total} questions complete`}>
        <span className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="q-count">{current}/{total}</span>
    </header>
  );
}
