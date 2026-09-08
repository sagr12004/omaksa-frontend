import { useRef } from "react";
import AssessmentTimer from "./AssessmentTimer";
import Button from "./Button";

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
        <span className="try-again-icon">
          <AssessmentTimer timerKey="try-again-expired" isPlaying={false} remaining={0} size={72} />
        </span>
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
