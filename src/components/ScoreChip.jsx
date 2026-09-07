export default function ScoreChip({ label, value }) {
  return (
    <div className="score-chip">
      <span className="chip-label">{label}</span>
      <span className="chip-value">{value}</span>
    </div>
  );
}
