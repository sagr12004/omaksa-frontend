import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import HelpLink from "../components/HelpLink";
import PasswordToggle from "../components/PasswordToggle";
import TextField from "../components/TextField";
import { contactSupport, requestPasswordReset } from "../lib/support";
import { useSession } from "../context/TestSession";

export default function PasswordLogin() {
  const navigate = useNavigate();
  const { emailOrMobile, setEmailOrMobile } = useSession();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPass, setFocusPass] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");

  const submit = () => {
    let ok = true;
    const value = emailOrMobile.trim();
    const isEmail = value.includes("@");
    const isPhone = /^\d{10}$/.test(value);
    if (!value || (!isEmail && !isPhone) || (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) {
      setEmailError("Please enter a valid email address or mobile number");
      ok = false;
    } else setEmailError("");
    if (!password || password.length < 4) {
      setPassError("Please enter a valid  password");
      ok = false;
    } else setPassError("");
    if (ok) navigate("/welcome");
  };

  return (
    <AuthLayout variant="password" onBack={() => navigate("/auth/otp")}>
      <h2 className="password-title">Login to your account</h2>
      <TextField
        id="email"
        label="Email or Mobile Number"
        required
        value={emailOrMobile}
        focused={focusEmail}
        error={emailError}
        onFocus={() => setFocusEmail(true)}
        onBlur={() => setFocusEmail(false)}
        onChange={(e) => {
          setEmailOrMobile(e.target.value);
          setEmailError("");
        }}
      />
      <TextField
        id="password"
        label="Password"
        required
        type={show ? "text" : "password"}
        value={password}
        focused={focusPass}
        error={passError}
        onFocus={() => setFocusPass(true)}
        onBlur={() => setFocusPass(false)}
        onChange={(e) => {
          setPassword(e.target.value);
          setPassError("");
        }}
      >
        <PasswordToggle visible={show} onToggle={() => setShow((v) => !v)} />
      </TextField>
      <Button onClick={submit}>CONTINUE</Button>
      <p className="forgot-row">
        Forgot your password?{" "}
        <button type="button" className="text-link" onClick={requestPasswordReset}>
          Reset here
        </button>
      </p>
      <HelpLink onClick={contactSupport} />
    </AuthLayout>
  );
}
