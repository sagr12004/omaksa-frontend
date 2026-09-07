export default function InstructionCard({ number, children }) {
  return (
    <div className="instruction-card">
      <span className="instruction-badge">{number}</span>
      <p>{children}</p>
    </div>
  );
}
