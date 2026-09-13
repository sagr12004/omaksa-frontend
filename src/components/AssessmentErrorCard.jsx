import { publicAsset } from "../assets";

export default function AssessmentErrorCard({ heading, message, variant = "demonstration" }) {
  return (
    <div className={`assessment-error-card is-${variant}`} role="alert">
      <span className="assessment-error-icon" aria-hidden>
        <img src={publicAsset("assets/icons/caution.svg")} alt="" />
      </span>
      <p>
        <strong>{heading}</strong>
        {variant === "demonstration" && message ? <span>{message}</span> : null}
      </p>
    </div>
  );
}
