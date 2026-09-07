import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useSession } from "../context/TestSession";

const GENDERS = ["Male", "Female", "Other"];
const AGES = ["Under 13", "13 – 18", "19 – 25", "26 – 35", "36 – 50", "Above 50"];

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
  const { gender, setGender, age, setAge } = useSession();

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

      <h2>Age</h2>
      <div className="choice-grid">
        {AGES.map((item) => (
          <button
            key={item}
            type="button"
            className={`choice-card ${age === item ? "is-selected" : ""}`}
            onClick={() => setAge(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <Button onClick={() => navigate("/test/rhythm/recognition?q=1")}>Continue to Octavium →</Button>
      <p className="helper">You can change this later in your profile</p>
      <span className="bottom-accent" />
      <p className="bottom-motif">♪ ♫ ♪</p>
      <p className="bottom-message">Music builds a better you</p>
    </div>
  );
}
