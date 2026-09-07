export default function VerdictCard({ status, scoreText }) {
  const word = status === "correct" ? "Correct" : status === "incorrect" ? "Wrong" : "Skipped";
  return (
    <div className={`verdict-card is-${status}`}>
      <span className="verdict-icon" aria-hidden>
      </span>
      <p className="verdict-word">{word}</p>
      <p className="verdict-score">{scoreText}</p>
    </div>
  );
}
