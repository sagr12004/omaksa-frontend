import { useEffect, useRef, useState } from "react";
import { QUESTION_SECONDS } from "../hooks/useQuestionTimer";

function formatClock(seconds) {
  const value = Math.max(0, Math.ceil(seconds - 0.001));
  const minutes = Math.floor(value / 60);
  const rest = value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function ClockFace({ progress, expired, face }) {
  const c = 18;
  const r = 14.2;
  const circ = 2 * Math.PI * r;
  const sweep = Math.max(0, Math.min(1, progress));
  const secondAngle = -90 + (1 - sweep) * 360;
  const minuteAngle = -90 + sweep * 28;
  const to = (angle, length) => {
    const rad = (angle * Math.PI) / 180;
    return [c + Math.cos(rad) * length, c + Math.sin(rad) * length];
  };
  const [sx, sy] = to(secondAngle, 10.5);
  const [mx, my] = to(minuteAngle, 6.5);
  const ring = expired ? "#EC0D11" : "#1B4332";
  const gold = expired ? "#EC0D11" : "#CE8F2C";

  return (
    <svg className="clock-face" width={face} height={face} viewBox="0 0 36 36" aria-hidden>
      <circle cx={c} cy={c} r="16.4" fill="#FAF8F5" stroke={gold} strokeWidth="1.7" />
      <circle cx={c} cy={c} r={r} fill="none" stroke="#E3E0DA" strokeWidth="2.2" />
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke={ring}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - sweep)}
        transform={`rotate(-90 ${c} ${c})`}
      />
      {[0, 90, 180, 270].map((deg) => {
        const outer = to(deg - 90, 13.2);
        const inner = to(deg - 90, 11.1);
        return (
          <line
            key={deg}
            x1={inner[0]}
            y1={inner[1]}
            x2={outer[0]}
            y2={outer[1]}
            stroke="#1B4332"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        );
      })}
      {[30, 60, 120, 150, 210, 240, 300, 330].map((deg) => {
        const outer = to(deg - 90, 13);
        const inner = to(deg - 90, 12.1);
        return (
          <line
            key={deg}
            x1={inner[0]}
            y1={inner[1]}
            x2={outer[0]}
            y2={outer[1]}
            stroke="#C4A574"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        );
      })}
      <line x1={c} y1={c} x2={mx} y2={my} stroke={gold} strokeWidth="1.8" strokeLinecap="round" />
      <line x1={c} y1={c} x2={sx} y2={sy} stroke={ring} strokeWidth="1.15" strokeLinecap="round" />
      <circle cx={c} cy={c} r="1.7" fill={gold} stroke="#FAF8F5" strokeWidth="0.6" />
    </svg>
  );
}

export default function AssessmentTimer({
  timerKey,
  isPlaying = true,
  duration = QUESTION_SECONDS,
  remaining = duration,
  onComplete,
  size = 36,
}) {
  const frozenZero = remaining <= 0;
  const [left, setLeft] = useState(frozenZero ? 0 : duration);
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (frozenZero) {
      setLeft(0);
      return undefined;
    }
    if (!isPlaying) return undefined;

    doneRef.current = false;
    setLeft(duration);
    const started = performance.now();
    let frame = 0;
    const tick = (now) => {
      const next = Math.max(0, duration - (now - started) / 1000);
      setLeft(next);
      if (next <= 0) {
        if (!doneRef.current) {
          doneRef.current = true;
          onCompleteRef.current?.();
        }
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [timerKey, isPlaying, duration, frozenZero]);

  const display = frozenZero || (!isPlaying && left <= 0) ? 0 : left;
  const expired = display <= 0;
  const progress = expired ? 0 : display / duration;

  return (
    <div
      className={`assessment-timer ${expired ? "is-expired" : ""}`}
      aria-label={`${formatClock(display)} remaining`}
    >
      <ClockFace progress={progress} expired={expired} face={size} />
      <span className="assessment-timer-count">{formatClock(display)}</span>
    </div>
  );
}
