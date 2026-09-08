import { publicAsset } from "../assets";

export default function Checkbox({ checked, onChange, children }) {
  return (
    <label className="checkbox-row">
      <button
        type="button"
        className={`checkbox ${checked ? "is-checked" : ""}`}
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
      >
        {checked ? <img className="checkbox-tick" src={publicAsset("assets/icons/login-check.svg")} alt="" /> : null}
      </button>
      <span>{children}</span>
    </label>
  );
}
