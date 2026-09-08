import { useNavigate } from "react-router-dom";
import { assets, publicAsset } from "../assets";
import BackChevron from "../components/BackChevron";
import Button from "../components/Button";
import InterpretationCard from "../components/InterpretationCard";
import ScoreBar from "../components/ScoreBar";
import ScoreChip from "../components/ScoreChip";
import ShareSheet from "../components/ShareSheet";
import { useSession } from "../context/TestSession";

const CHIPS = [
  { key: 0, label: "Rhythm Rec" },
  { key: 1, label: "Rhythm Dem" },
  { key: 2, label: "Pitch Rec" },
  { key: 3, label: "Pitch Dem" },
];

export default function Results() {
  const navigate = useNavigate();
  const { results, shareOpen, setShareOpen, resetTest } = useSession();

  return (
    <div className="results-screen">
      <img className="piano-bg" src={assets.pianoGuitarBg} alt="" />
      <header className="results-top">
        <button type="button" className="icon-back" onClick={() => navigate("/results/submitted")} aria-label="Back">
          <BackChevron />
        </button>
        <h1>Yours Results</h1>
        <button type="button" className="share-btn" onClick={() => setShareOpen(true)} aria-label="Share">
          <img src={publicAsset("assets/icons/share.svg")} alt="" />
        </button>
      </header>
      <p className="done-count">10/10</p>
      <div className="complete-card">
        <span className="check-circle">✓</span>
        <div>
          <h2>Test complete!</h2>
          <p>Octavium musical aptitude test- All 4 sections submitted</p>
        </div>
      </div>
      <div className="overall-card">
        <div>
          <h3>Overall musicality</h3>
          <p>{results.band}</p>
        </div>
        <strong>{results.overallPct}%</strong>
      </div>
      <h3 className="profile-title">Your OMAKS profile</h3>
      <div className="axis">
        <span>Low</span>
        <span>High</span>
      </div>
      <div className="results-score-list">
        {results.bySection.map((section, i) => (
          <ScoreBar
            key={section.title}
            index={i + 1}
            label={section.title.replace(" – Level 1", "")}
            percent={section.pct}
          />
        ))}
      </div>
      <InterpretationCard pill={results.overallPct >= 70 ? "High scores on pitch" : "Low scores on all parameters"}>
        {results.overallPct >= 70
          ? "Pitch recognition is high, while pitch demonstration shows a lower score. Aptitude is high for melodic instruments."
          : "Extensive ear training on aspects of both rhythm and pitch is recommended to be able to pursue music learning formally. Begin with basic listening and clapping exercises before formal lessons."}
      </InterpretationCard>
      <div className="chip-row">
        {CHIPS.map((chip) => (
          <ScoreChip
            key={chip.label}
            label={chip.label}
            value={`${results.bySection[chip.key].correct}/${results.bySection[chip.key].total}`}
          />
        ))}
      </div>
      <Button onClick={() => navigate("/results/report")}>VIEW DETAILED REPORT</Button>
      <Button
        variant="outline"
        onClick={() => {
          resetTest();
          navigate("/test/rhythm/recognition?q=1", { replace: true });
        }}
      >
        RETAKE TEST
      </Button>
      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
}
