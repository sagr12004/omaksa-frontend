export default function ScoreTable({ section, level, points, score }) {
  return (
    <div className="score-table">
      <div className="score-table-head">
        <span>Section</span>
        <span>Level</span>
        <span>Points</span>
        <span>Your Score</span>
      </div>
      <div className="score-table-row">
        <span>{section}</span>
        <span>{level}</span>
        <span>{points}</span>
        <span>{score}</span>
      </div>
    </div>
  );
}
