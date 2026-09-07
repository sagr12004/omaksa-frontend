import { useRef } from "react";

export default function OtpInput({ value, onChange, error, expired }) {
  const digits = value.padEnd(6, " ").slice(0, 6).split("");
  const refs = useRef([]);

  const setDigit = (index, char) => {
    const next = digits.map((d) => (d === " " ? "" : d));
    next[index] = char;
    onChange(next.join("").replace(/\s/g, "").slice(0, 6));
  };

  return (
    <div className={`otp-row ${error || expired ? "has-error" : ""}`}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (refs.current[index] = el)}
          className="otp-box"
          inputMode="numeric"
          maxLength={1}
          value={digit === " " ? "" : digit}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(-1);
            setDigit(index, v);
            if (v && refs.current[index + 1]) refs.current[index + 1].focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !digits[index].trim() && refs.current[index - 1]) {
              refs.current[index - 1].focus();
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            onChange(pasted);
            const focusAt = Math.min(pasted.length, 5);
            refs.current[focusAt]?.focus();
          }}
        />
      ))}
    </div>
  );
}
