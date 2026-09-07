export default function FloatingLabel({ htmlFor, active, children, error }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`floating-label ${active ? "is-active" : ""} ${error ? "is-error" : ""}`}
    >
      {children}
    </label>
  );
}
