import BackChevron from "./BackChevron";

export default function TestHeader({ current, total = 10, onBack, children }) {
  const pct = Math.max(6, Math.round((current / total) * 100));

  return (
    <header className="test-header">
      <button type="button" className="icon-back header-back" onClick={onBack} aria-label="Back">
        <BackChevron />
      </button>
      {children}
      <div className="progress-track" aria-label={`${current} of ${total} questions complete`}>
        <span className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="q-count">{current}/{total}</span>
    </header>
  );
}
