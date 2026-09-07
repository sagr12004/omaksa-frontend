export default function ScoreBar({ index, label, percent }) {
  return (
    <div className="score-bar">
      <span className="score-index">{index}</span>
      <div className="score-track">
        <div className="score-fill" style={{ width: `${percent}%` }} />
        <span className="score-label">{label}</span>
      </div>
      <span className="score-pct">{percent}%</span>
    </div>
  );
}
