import { useNavigate } from "react-router-dom";
import { assets, publicAsset } from "../assets";
import BackChevron from "../components/BackChevron";
import Button from "../components/Button";
import { shareResults } from "../lib/share";

export default function ResultsSubmitted() {
  const navigate = useNavigate();
  return (
    <div className="submitted-screen">
      <img className="vinyl" src={assets.vinyl} alt="" />
      <img className="piano-bg" src={assets.pianoGuitarBg} alt="" />
      <img className="guitar-neck" src={assets.guitarNeck} alt="" />
      <header className="results-top">
        <button type="button" className="icon-back submitted-back" onClick={() => navigate("/welcome")} aria-label="Back">
          <BackChevron />
        </button>
        <button type="button" className="share-btn" aria-label="Share" onClick={() => shareResults()}>
          <img src={publicAsset("assets/icons/share.svg")} alt="" />
        </button>
      </header>
      <div className="thanks-card">
        <span className="check-circle">✓</span>
        <h1>Thank you!</h1>
        <p>for completing the OMAKS Challenge Test</p>
        <small>Octavium Musical Aptitude, Knowledge & skills</small>
      </div>
      <div className="ready-card">
        <p>Your answers have been submitted</p>
        <small>Your results are ready to view</small>
      </div>
      <Button variant="outline" onClick={() => navigate("/results/review/0")}>
        REVIEW QUESTIONS
      </Button>
      <Button onClick={() => navigate("/results")}>VIEW REPORT</Button>
    </div>
  );
}
