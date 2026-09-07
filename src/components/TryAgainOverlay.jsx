import { useRef } from "react";
import Button from "./Button";

function ExpiredTimerIcon() {
  return (
    <span className="try-again-icon" aria-hidden="true">
      <svg viewBox="0 0 72 72" width="72" height="72">
        <circle cx="36" cy="38" r="26" fill="#f3e6d4" />
        <circle cx="36" cy="38" r="20.5" fill="none" stroke="#1B4332" strokeWidth="2.4" />
        <path
          d="M36 17.5V13M28 14.2l1.6 3.6M44 14.2l-1.6 3.6"
          stroke="#1B4332"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <text
          x="36"
          y="44"
          textAnchor="middle"
          fill="#1B4332"
          fontFamily="Inter, sans-serif"
          fontSize="18"
          fontWeight="700"
        >
          0
        </text>
        <circle cx="54" cy="20" r="8" fill="#ec0d11" />
        <path d="M54 16.4v4.4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="54" cy="23.4" r="1.05" fill="#fff" />
      </svg>
    </span>
  );
}

export default function TryAgainOverlay({ onRetry, questionType = "demonstration" }) {
  const lockedRef = useRef(false);
  const recognition = questionType === "recognition";

  const handleRetry = () => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    onRetry();
  };

  return (
    <div className="try-again-overlay" role="dialog" aria-modal="true" aria-labelledby="try-again-title">
      <div className="try-again-glass" />
      <div className="try-again-card">
        <ExpiredTimerIcon />
        <h2 id="try-again-title">Try again</h2>
        <p className="try-again-lead">
          {recognition ? "Your answering time has ended." : "Your recording time has ended."}
        </p>
        <p className="try-again-copy">
          {recognition
            ? "Please select your answer again to continue."
            : "Please record your response again to continue."}
        </p>
        <Button className="try-again-btn" onClick={handleRetry}>
          TRY AGAIN
        </Button>
      </div>
    </div>
  );
}
