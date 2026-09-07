import { useEffect, useRef, useState } from "react";

export default function QuestionNavStrip({ total = 10, current, onSelect, statuses = [] }) {
  const scrollerRef = useRef(null);
  const [thumb, setThumb] = useState({ width: 40, left: 0 });

  const syncThumb = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = el.scrollWidth <= 0 ? 1 : el.clientWidth / el.scrollWidth;
    const width = Math.max(22, Math.round(ratio * 100));
    const left = max <= 0 ? 0 : (el.scrollLeft / max) * (100 - width);
    setThumb({ width, left });
  };

  useEffect(() => {
    syncThumb();
  }, [total]);

  useEffect(() => {
    const el = scrollerRef.current;
    const dot = el?.querySelector(`[data-question="${current}"]`);
    if (!el || !dot) return;
    const left = dot.offsetLeft - (el.clientWidth - dot.offsetWidth) / 2;
    el.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [current]);

  return (
    <div className="q-nav">
      <div className="q-nav-circles" ref={scrollerRef} onScroll={syncThumb}>
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            data-question={i + 1}
            className={`q-nav-dot is-${statuses[i] || "unanswered"} ${i + 1 === current ? "is-current" : ""}`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onSelect(i + 1);
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="q-nav-scroll-track" aria-hidden="true">
        <span className="q-nav-scroll-thumb" style={{ width: `${thumb.width}%`, left: `${thumb.left}%` }} />
      </div>
      <p className="q-nav-hint">Swipe to see all questions-tap to jump</p>
    </div>
  );
}
