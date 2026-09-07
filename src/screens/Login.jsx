import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import Checkbox from "../components/Checkbox";
import ConsentText from "../components/ConsentText";
import CountrySelector from "../components/CountrySelector";
import HelpLink from "../components/HelpLink";
import TextField from "../components/TextField";
import { contactSupport } from "../lib/support";
import { useSession } from "../context/TestSession";

export default function Login() {
  const navigate = useNavigate();
  const { mobile, setMobile, country, setCountry } = useSession();
  const [accepted, setAccepted] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");

  const continueLogin = () => {
    const clean = mobile.replace(/\D/g, "");
    if (!clean) {
      setError("Please enter mobile number");
      return;
    }
    const minDigits = country === "+91" ? 10 : 8;
    const maxDigits = country === "+91" ? 10 : 15;
    if (clean.length < minDigits || clean.length > maxDigits) {
      setError("Enter a valid mobile number");
      return;
    }
    if (!accepted) {
      setError("Please accept the Terms of Use & Privacy Policy");
      return;
    }
    setError("");
    navigate("/auth/otp");
  };

  return (
    <AuthLayout variant="phone">
      <div className="login-headings">
        <h1>Login or Sign Up</h1>
        <p>Enter your mobile number to continue</p>
      </div>

      <div className="phone-row">
        <CountrySelector value={country} onChange={setCountry} />
        <TextField
          id="mobile"
          label="Mobile Number"
          required
          value={mobile}
          focused={focused}
          inputMode="numeric"
          maxLength={10}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            setMobile(e.target.value.replace(/\D/g, "").slice(0, 10));
            setError("");
          }}
        />
      </div>

      <div className="login-error-slot" aria-live="polite">
        <p className={`login-error ${error ? "is-visible" : ""}`}>{error || "Please enter mobile number"}</p>
      </div>

      <div className="terms-block">
        <Checkbox checked={accepted} onChange={setAccepted}>
          <ConsentText />
        </Checkbox>
      </div>

      <Button onClick={continueLogin}>CONTINUE</Button>
      <HelpLink onClick={contactSupport} />
    </AuthLayout>
  );
}
