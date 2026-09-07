import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import HelpLink from "../components/HelpLink";
import OtpInput from "../components/OtpInput";
import { contactSupport, requestWhatsAppOtp } from "../lib/support";
import { OTP_SECONDS, useSession } from "../context/TestSession";

export default function OTP() {
  const navigate = useNavigate();
  const { mobile } = useSession();
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(OTP_SECONDS);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (seconds <= 0) {
      setExpired(true);
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const masked = `XXXXXX${(mobile || "9876").slice(-4)}`;

  const submit = () => {
    if (expired) {
      setError("OTP expired");
      return;
    }
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    navigate("/welcome");
  };

  return (
    <AuthLayout variant="otp" onBack={() => navigate("/auth/phone")} title="Enter OTP">
      <h2 className="otp-title">Verify with OTP</h2>
      <p className="otp-sub">Sent via SMS to {masked}</p>
      <OtpInput
        value={otp}
        error={error}
        expired={expired}
        onChange={(v) => {
          setOtp(v);
          setError("");
        }}
      />
      {error ? <p className="login-error">{error}</p> : null}
      <p className="otp-resend">
        Didn&apos;t receive the OTP?{" "}
        {seconds > 0 && !expired ? (
          <span>Resend OTP in {seconds}s</span>
        ) : (
          <button
            type="button"
            className="text-link"
            onClick={() => {
              setSeconds(OTP_SECONDS);
              setExpired(false);
              setError("");
            }}
          >
            Resend OTP
          </button>
        )}
      </p>
      <button type="button" className="whatsapp-otp" onClick={requestWhatsAppOtp}>
        <img src="/assets/icons/whatsapp.svg" alt="" />
        Get OTP on <strong>WhatsApp</strong>
      </button>
      <button type="button" className="password-switch" onClick={() => navigate("/auth/password")}>
        Log in using <strong>Password</strong>
      </button>
      <Button onClick={submit}>VERIFY</Button>
      <HelpLink onClick={contactSupport} />
    </AuthLayout>
  );
}
