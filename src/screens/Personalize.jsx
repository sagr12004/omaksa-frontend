import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import TextField from "../components/TextField";
import { useSession } from "../context/TestSession";

const GENDERS = ["Male", "Female", "Other"];
const AGES = ["Under 13", "13 – 18", "19 – 25", "26 – 35", "36 – 50", "Above 50"];

function formatDobInput(raw) {
  const digits = String(raw).replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseDob(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

function yearsFromDob(date, now = new Date()) {
  let years = now.getFullYear() - date.getFullYear();
  const monthDelta = now.getMonth() - date.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < date.getDate())) years -= 1;
  return years;
}

function bracketFromAge(years) {
  if (years < 13) return "Under 13";
  if (years <= 18) return "13 – 18";
  if (years <= 25) return "19 – 25";
  if (years <= 35) return "26 – 35";
  if (years <= 50) return "36 – 50";
  return "Above 50";
}

function GenderMark({ kind, selected }) {
  const stroke = selected ? "#FAF8F5" : "#1B4332";
  if (kind === "Male") {
    return (
      <svg className="gender-mark" viewBox="0 0 24 24" aria-hidden>
        <circle cx="10.5" cy="9" r="3.2" fill="none" stroke={stroke} strokeWidth="1.6" />
        <path d="M10.5 12.4V18.2M8.2 15.6H12.8" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M13.4 6.2H17.6V10.4" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17.6 6.2L13.8 10" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "Female") {
    return (
      <svg className="gender-mark" viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="8.4" r="3.2" fill="none" stroke={stroke} strokeWidth="1.6" />
        <path d="M12 11.6V18.4M9.2 15.4H14.8" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className="gender-mark" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="8.2" r="3" fill="none" stroke={stroke} strokeWidth="1.6" />
      <path d="M8.4 18.2c.6-2.6 2-4 3.6-4s3 1.4 3.6 4" fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Personalize() {
  const navigate = useNavigate();
  const { gender, setGender, age, setAge, dob, setDob } = useSession();
  const [dobError, setDobError] = useState("");
  const [dobFocused, setDobFocused] = useState(false);

  const applyDob = (next) => {
    setDob(next);
    if (next.length < 10) {
      setDobError("");
      return;
    }
    const parsed = parseDob(next);
    if (!parsed) {
      setDobError("Please enter a valid date of birth");
      setAge("");
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsed > today) {
      setDobError("Date of birth cannot be in the future");
      setAge("");
      return;
    }
    const years = yearsFromDob(parsed, today);
    if (years < 0 || years > 120) {
      setDobError("Please enter a valid date of birth");
      setAge("");
      return;
    }
    setDobError("");
    setAge(bracketFromAge(years));
  };

  const dobLocked = Boolean(parseDob(dob) && !dobError);

  return (
    <div className="personalize">
      <span className="decor-note n1">♪</span>
      <span className="decor-note n2">♫</span>
      <h1>Tell us about you</h1>
      <p className="subtitle">Let&apos;s personalize your music journey</p>
      <span className="heading-accent" />

      <h2>Gender</h2>
      <div className="choice-grid">
        {GENDERS.map((item) => (
          <button
            key={item}
            type="button"
            className={`choice-card tall ${gender === item ? "is-selected" : ""}`}
            onClick={() => setGender(item)}
          >
            <GenderMark kind={item} selected={gender === item} />
            {item}
          </button>
        ))}
      </div>

      <div className="dob-stack">
        <h2>Date of Birth</h2>
        <TextField
          id="dob"
          value={dob}
          focused={dobFocused}
          error={dobError}
          placeholder="DD/MM/YYYY"
          inputMode="numeric"
          autoComplete="bday"
          aria-label="Date of Birth"
          onFocus={() => setDobFocused(true)}
          onBlur={() => {
            setDobFocused(false);
            if (dob && dob.length < 10) setDobError("Please enter a valid date of birth");
          }}
          onChange={(event) => applyDob(formatDobInput(event.target.value))}
        />
        <h2>Age Bracket</h2>
        <div className={`choice-grid ${dobLocked ? "is-readonly" : ""}`}>
          {AGES.map((item) => (
            <button
              key={item}
              type="button"
              className={`choice-card ${age === item ? "is-selected" : ""}`}
              aria-disabled={dobLocked}
              onClick={() => {
                if (dobLocked) return;
                setDob("");
                setDobError("");
                setAge(item);
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <p className="dob-privacy">Date of birth is optional. You can provide your age bracket instead.</p>
      </div>

      <Button onClick={() => navigate("/test/rhythm/recognition?q=1")}>Continue to Octavium →</Button>
      <p className="helper">You can change this later in your profile</p>
      <span className="bottom-accent" />
      <p className="bottom-motif">♪ ♫ ♪</p>
      <p className="bottom-message">Music builds a better you</p>
    </div>
  );
}
