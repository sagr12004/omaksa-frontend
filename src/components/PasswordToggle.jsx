export default function PasswordToggle({ visible, onToggle }) {
  return (
    <button type="button" className="password-toggle" onClick={onToggle}>
      {visible ? "HIDE" : "SHOW"}
    </button>
  );
}
