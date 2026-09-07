export default function InterpretationCard({ pill, title = "Interpretation", children }) {
  return (
    <div className="interpretation-card">
      {pill ? <span className="verdict-pill">{pill}</span> : null}
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
