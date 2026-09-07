export default function HelpLink({ onClick }) {
  return (
    <button type="button" className="help-link" onClick={onClick}>
      Having trouble logging in ? <strong>Get help?</strong>
    </button>
  );
}
