import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import AudioPlayerRow from "../components/AudioPlayerRow";
import BeatTrainer from "../components/BeatTrainer";
import Button from "../components/Button";
import HintCard from "../components/HintCard";
import InstructionCard from "../components/InstructionCard";
import LevelPill from "../components/LevelPill";
import RecordControl from "../components/RecordControl";
import TestHeader from "../components/TestHeader";
import TryAgainOverlay from "../components/TryAgainOverlay";
import { getQuestion, nextRoute, prevRoute, sectionQuestionCount, useSession } from "../context/TestSession";
import useQuestionTimer from "../hooks/useQuestionTimer";

export default function Demonstration() {
  const { section } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { saveAnswer } = useSession();
  const number = Number(params.get("q") || 1);
  const question = useMemo(() => getQuestion(section, "demonstration", number), [section, number]);
  const { remaining, expired, restart } = useQuestionTimer(question?.globalIndex);
  const [recordState, setRecordState] = useState("idle");
  const [blobUrl, setBlobUrl] = useState("");
  const [error, setError] = useState(false);
  const [playback, setPlayback] = useState({ currentTime: 0, playing: false, activeBeat: -1 });
  const [beatTaps, setBeatTaps] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    setRecordState("idle");
    setBlobUrl("");
    setError(false);
    setPlayback({ currentTime: 0, playing: false, activeBeat: -1 });
    setBeatTaps([]);
    setAnalysis(null);
  }, [question?.globalIndex]);

  if (!question) return <Navigate to="/" replace />;

  const instruction =
    section === "pitch"
      ? "Listen to the reference audio carefully. Now reproduce the audio using your voice."
      : "Listen to the reference audio carefully. Count along with the audio while recording your response?";

  const tapBeat = (beat) => {
    const expected = beat;
    const deviation = Math.abs(playback.currentTime - expected);
    setBeatTaps((previous) => [
      ...previous,
      {
        beat,
        at: playback.currentTime,
        deviation,
        correct: playback.playing && deviation <= 0.22,
      },
    ]);
  };

  const goNext = (payload) => {
    saveAnswer(question.globalIndex, payload);
    navigate(nextRoute(section, "demonstration", number));
  };

  return (
    <div className="test-screen">
      <TestHeader
        current={number}
        total={sectionQuestionCount(section, "demonstration")}
        countdown={remaining}
        onBack={() => navigate(prevRoute(section, "demonstration", number))}
      />
      <LevelPill>{question.title}</LevelPill>
      <InstructionCard number={question.number}>{instruction}</InstructionCard>
      <h3 className="ref-label">Reference Audio</h3>
      <AudioPlayerRow
        key={`${question.id}-ref`}
        kind={section}
        frequency={question.frequency}
        pattern={question.rhythmPattern}
        onProgress={section === "rhythm" ? setPlayback : undefined}
      />
      <HintCard>
        {section === "pitch" ? (
          "You can record the reference audio as many times as you wish before submitting."
        ) : (
          <BeatTrainer
            currentTime={playback.currentTime}
            playing={playback.playing}
            activeBeat={playback.activeBeat}
            taps={beatTaps}
            onTap={tapBeat}
          />
        )}
      </HintCard>
      <RecordControl
        key={question.id}
        kind={section}
        referenceFrequency={question.frequency}
        state={recordState}
        halt={expired}
        error={error}
        onStateChange={(next, url, nextAnalysis) => {
          if (expired || next === "expired") setError(false);
          else setError(next === "error");
          if (next === "expired") return;
          setRecordState(next);
          if (url) setBlobUrl(url);
          if (nextAnalysis) setAnalysis(nextAnalysis);
          if (next === "idle") setBlobUrl("");
        }}
      />
      <Button
        className={recordState !== "recorded" ? "is-disabled" : ""}
        disabled={expired || recordState === "recording" || recordState === "processing"}
        aria-disabled={recordState !== "recorded"}
        onClick={() => {
          if (expired || recordState === "recording" || recordState === "processing") return;
          if (recordState !== "recorded") {
            setError(true);
            return;
          }
          const correctTaps = beatTaps.filter((tap) => tap.correct).length;
          goNext({
            recorded: true,
            blobUrl,
            skipped: false,
            beatTaps,
            beatAccuracy: section === "rhythm" ? correctTaps / Math.max(1, beatTaps.length) : null,
            analysis,
            score:
              section === "rhythm"
                ? analysis?.score * 0.65 +
                  (correctTaps / Math.max(1, beatTaps.length)) * 0.35
                : analysis?.score,
          });
        }}
      >
        NEXT
      </Button>
      <Button variant="ghostPill" onClick={() => goNext({ recorded: false, skipped: true })}>
        SKIP
        <img src="/assets/icons/skip-arrow.svg" alt="" />
      </Button>
      {expired ? (
        <TryAgainOverlay
          questionType="demonstration"
          onRetry={() => {
            setError(false);
            setBlobUrl("");
            setAnalysis(null);
            setBeatTaps([]);
            setRecordState("idle");
            restart();
          }}
        />
      ) : null}
    </div>
  );
}
