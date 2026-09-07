export default function PhoneFrame({ children, className = "" }) {
  return (
    <div className="app-shell">
      <div className={`phone ${className}`}>{children}</div>
    </div>
  );
}
