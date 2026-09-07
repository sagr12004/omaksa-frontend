import { Link } from "react-router-dom";

export default function ConsentText() {
  return (
    <p className="consent-text">
      By continuing, I agree to the <Link to="/legal/terms">Terms of Use</Link>
      {" & "}
      <Link to="/legal/terms">Privacy Policy</Link>
    </p>
  );
}
