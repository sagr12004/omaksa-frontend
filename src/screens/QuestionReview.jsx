import { Navigate, useNavigate, useParams } from "react-router-dom";
import { assets, publicAsset } from "../assets";
import BackChevron from "../components/BackChevron";
import Button from "../components/Button";
import InterpretationCard from "../components/InterpretationCard";
import QuestionNavStrip from "../components/QuestionNavStrip";
import ScoreBar from "../components/ScoreBar";
import ScoreTable from "../components/ScoreTable";
import VerdictCard from "../components/VerdictCard";
import { TOTAL_QUESTIONS, useSession } from "../context/TestSession";
import { shareResults } from "../lib/share";

export default function QuestionReview() {
  const { index } = useParams();
  const navigate = useNavigate();
  const { results } = useSession();
  if (!results.allItems.length) return <Navigate to="/results" replace />;

  const parsed = Number.parseInt(index, 10);
  const lastIndex = results.allItems.length - 1;
  const i = Number.isFinite(parsed) ? Math.min(lastIndex, Math.max(0, parsed)) : 0;
  const item = results.allItems[i];
  if (!item) return <Navigate to="/results" replace />;
  const goToQuestion = (globalIndex) => {
    const next = Math.min(lastIndex, Math.max(0, globalIndex));
    navigate(`/results/review/${next}`);
  };
  const sectionItems = results.allItems.filter((q) => q.sectionId === item.sectionId && q.mode === item.mode);
  const section = results.bySection.find((s) => s.id === item.sectionId && s.mode === item.mode);
  const sectionIndex = results.bySection.findIndex((s) => s.id === item.sectionId && s.mode === item.mode);
  const sectionName = item.title.replace(" – Level 1", "");

  const pill =
    item.status === "skipped"
      ? "Question skipped"
      : item.status === "incorrect"
        ? "Needs Practice"
        : `Strong ${sectionName}`;

  const copy =
    item.status === "skipped"
      ? "You skipped this question. Skipped items score zero. You can still hear the reference on review but the mark will not change."
      : item.status === "incorrect"
        ? item.sectionId === "pitch"
          ? "The pitch was close to the reference but not an exact match. Listen again on review and compare the option against the reference tone."
          : "The tempo was close to the reference but not an exact match. Listen again on review and compare the faster option against 60 BPM."
        : `${sectionName} is high across the levels you answered. You can confidently chose a ${
            item.sectionId === "pitch" ? "melodic" : "percussive"
          } instrument.`;

  return (
    <div className="review-screen">
      <img className="piano-bg" src={assets.pianoGuitarBg} alt="" />
      <header className="results-top">
        <button type="button" className="icon-back" onClick={() => navigate("/results")} aria-label="Back">
          <BackChevron />
        </button>
        <h1>Question Review</h1>
        <button
          type="button"
          className="share-btn"
          onClick={() => shareResults("Octavium question review")}
          aria-label="Share question review"
        >
          <img src={publicAsset("assets/icons/share.svg")} alt="" />
        </button>
      </header>
      <QuestionNavStrip
        total={TOTAL_QUESTIONS}
        current={item.displayNumber}
        statuses={results.allItems.map((question) => question.status)}
        onSelect={(n) => goToQuestion(n - 1)}
      />
      <ScoreBar index={sectionIndex + 1} label={sectionName} percent={section.pct} />
      <VerdictCard status={item.status} scoreText={`${item.status === "correct" ? 1 : 0}/1`} />
      <ScoreTable
        section={`${sectionItems.findIndex((q) => q.id === item.id) + 1}/${sectionItems.length}`}
        level={item.level}
        points={item.points}
        score={item.status === "correct" ? 1 : 0}
      />
      <InterpretationCard pill={pill}>{copy}</InterpretationCard>
      <div className="nav-pair">
        <Button
          variant="outline"
          size="md"
          className="review-nav-btn"
          disabled={i === 0}
          onClick={() => goToQuestion(i - 1)}
        >
          PREVIOUS
        </Button>
        <Button
          variant="outline"
          size="md"
          className="review-nav-btn"
          disabled={i === lastIndex}
          onClick={() => goToQuestion(i + 1)}
        >
          NEXT
        </Button>
      </div>
      <Button onClick={() => navigate("/results")}>VIEW REPORT</Button>
    </div>
  );
}
