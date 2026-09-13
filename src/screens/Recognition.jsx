import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { publicAsset } from "../assets";
import AssessmentTimer from "../components/AssessmentTimer";
import AudioPlayerRow from "../components/AudioPlayerRow";
import Button from "../components/Button";
import HintCard from "../components/HintCard";
import InstructionCard from "../components/InstructionCard";
import LevelPill from "../components/LevelPill";
import OptionRow from "../components/OptionRow";
import TestHeader from "../components/TestHeader";
import AssessmentErrorCard from "../components/AssessmentErrorCard";
import TryAgainOverlay from "../components/TryAgainOverlay";
import { getQuestion, nextRoute, prevRoute, sectionQuestionCount, useSession } from "../context/TestSession";
import useQuestionTimer from "../hooks/useQuestionTimer";

const LETTERS = ["A", "B", "C", "D"];

export default function Recognition() {
  const { section } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { saveAnswer, answers } = useSession();
  const number = Number(params.get("q") || 1);
  const question = useMemo(() => getQuestion(section, "recognition", number), [section, number]);
  const { expired, setExpired, restart, timerKey } = useQuestionTimer(question?.globalIndex);
  const existing = answers[question?.globalIndex];
  const [choice, setChoice] = useState(existing?.choice || "");
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    setChoice(answers[question?.globalIndex]?.choice || "");
    setSheet(false);
  }, [question?.globalIndex, answers]);

  if (!question) return <Navigate to="/" replace />;

  const instruction =
    "Listen to the reference audio carefully. Which of the following options matches the reference audio?";
  const hint =
    section === "pitch"
      ? "You can replay the reference and option audios as many times as you wish before submitting."
      : "Select the rhythm that matches the reference";

  const goNext = (payload) => {
    saveAnswer(question.globalIndex, payload);
    navigate(nextRoute(section, "recognition", number));
  };

  return (
    <div className="test-screen">
      <TestHeader
        current={number}
        total={sectionQuestionCount(section, "recognition")}
        onBack={() => navigate(prevRoute(section, "recognition", number))}
      >
        
      </TestHeader>
      <LevelPill>{question.title}</LevelPill>
      <InstructionCard number={question.number}>{instruction}</InstructionCard>
      <h3 className="ref-label">Reference Audio</h3>
      <AudioPlayerRow key={`${question.id}-ref`} kind={section} frequency={question.frequency} pattern={question.rhythmPattern} />
      <AssessmentTimer
          timerKey={timerKey}
          isPlaying={!expired}
          onComplete={() => setExpired(true)}
          size={28}
        />
      <HintCard>{hint}</HintCard>
      <div className="options">
        {LETTERS.map((letter, i) => (
          <OptionRow
            key={`${question.id}-${letter}`}
            letter={letter}
            kind={section}
            frequency={question.optionFreqs[i]}
            pattern={question.optionPatterns[i]}
            selected={choice === letter}
            onSelect={() => {
              if (expired) return;
              setChoice(letter);
              setSheet(false);
            }}
          />
        ))}
      </div>
      <div className="test-actions">
        {sheet && !expired ? (
          <AssessmentErrorCard
            variant="recognition"
            heading="Please select an answer or skip this question."
          />
        ) : null}
        <Button
          className={!choice ? "is-disabled" : ""}
          aria-disabled={!choice}
          onClick={() => {
            if (expired) return;
            if (!choice) {
              setSheet(true);
              return;
            }
            goNext({ choice, skipped: false });
          }}
        >
          NEXT
        </Button>
        <Button variant="ghostPill" onClick={() => goNext({ choice: "", skipped: true })}>
          SKIP
          <img src={publicAsset("assets/icons/skip-arrow.svg")} alt="" />
        </Button>
      </div>
      {expired ? (
        <TryAgainOverlay
          questionType="recognition"
          onRetry={() => {
            setSheet(false);
            setChoice("");
            restart();
          }}
        />
      ) : null}
    </div>
  );
}
