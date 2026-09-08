import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { QUESTION_SECONDS } from "../hooks/useQuestionTimer";

function formatClock(seconds) {
  const value = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(value / 60);
  const rest = value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

export default function AssessmentTimer({
  timerKey,
  isPlaying = true,
  duration = QUESTION_SECONDS,
  remaining = duration,
  onComplete,
  size = 58,
}) {
  const atZero = remaining <= 0;
  const stopped = atZero || !isPlaying;

  return (
    <div
      className={`assessment-timer ${stopped ? "is-expired" : ""}`}
      aria-label={`${formatClock(atZero ? 0 : duration)} remaining`}
    >
      <CountdownCircleTimer
        key={timerKey}
        isPlaying={isPlaying && !atZero}
        duration={duration}
        initialRemainingTime={atZero ? 0 : undefined}
        size={size}
        strokeWidth={5}
        trailColor="#E3E0DA"
        colors={stopped ? "#EC0D11" : ["#1B4332", "#CE8F2C", "#EC0D11"]}
        colorsTime={stopped ? undefined : [duration, 8, 0]}
        rotation="clockwise"
        onComplete={() => {
          onComplete?.();
          return { shouldRepeat: false };
        }}
      >
        {({ remainingTime }) => (
          <span className="assessment-timer-count">{formatClock(remainingTime)}</span>
        )}
      </CountdownCircleTimer>
    </div>
  );
}
