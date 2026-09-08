import { createContext, useContext, useMemo, useState } from "react";

export const QUESTIONS_PER_SECTION = 8;
export const TOTAL_QUESTIONS = 30;
export const OTP_SECONDS = 30;

export const SECTIONS = [
  { id: "rhythm", mode: "recognition", title: "Rhythm Recognition – Level 1", count: 8 },
  { id: "rhythm", mode: "demonstration", title: "Rhythm Demonstration – Level 1", count: 7 },
  { id: "pitch", mode: "recognition", title: "Pitch Recognition – Level 1", count: 8 },
  { id: "pitch", mode: "demonstration", title: "Pitch Demonstration – Level 1", count: 7 },
];

const LETTERS = ["A", "B", "C", "D"];
const LEVELS = ["Easy", "Easy", "Medium", "Medium", "Hard", "Hard", "Easy", "Medium", "Hard", "Medium"];
const FREQS = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25, 587.33, 659.25];
const RHYTHM_BEATS = [
  [0, 1, 2, 3],
  [0, 0.5, 1, 2, 3],
  [0, 1, 1.5, 2.5, 3],
  [0, 1.5, 2, 3],
];
const RHYTHM_ANDS = [
  [0.5, 1.5, 2.5, 3.5],
  [1.5, 2.5],
  [0.5, 2],
  [0.75, 2.5],
];

function rhythmPattern(index) {
  const slot = ((index % 4) + 4) % 4;
  return { beats: RHYTHM_BEATS[slot], ands: RHYTHM_ANDS[slot] };
}

function buildQuestions() {
  let globalIndex = 0;
  return SECTIONS.flatMap((section) =>
    Array.from({ length: section.count }, (_, i) => {
      const correct = LETTERS[(i + section.count) % 4];
      const patternIndex = (i + (section.mode === "demonstration" ? 2 : 0)) % 4;
      const freqIndex = (i + (section.id === "pitch" ? 3 : 0)) % FREQS.length;
      const question = {
        id: `${section.id}-${section.mode}-${i}`,
        globalIndex,
        sectionId: section.id,
        mode: section.mode,
        title: section.title,
        number: i + 1,
        displayNumber: globalIndex + 1,
        level: LEVELS[i % LEVELS.length],
        points: 1,
        correct,
        frequency: FREQS[freqIndex],
        rhythmPattern: rhythmPattern(patternIndex),
        optionFreqs: LETTERS.map((letter, idx) =>
          letter === correct ? FREQS[freqIndex] : FREQS[(freqIndex + idx + 1) % FREQS.length]
        ),
        optionPatterns: LETTERS.map((letter, idx) =>
          rhythmPattern(letter === correct ? patternIndex : patternIndex + idx + 1)
        ),
      };
      globalIndex += 1;
      return question;
    })
  );
}

const QUESTIONS = buildQuestions();

const emptyAnswers = () => ({});

const TestSessionContext = createContext(null);

export function TestSessionProvider({ children }) {
  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState("+91");
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [gender, setGender] = useState("Male");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [answers, setAnswers] = useState(emptyAnswers);
  const [shareOpen, setShareOpen] = useState(false);

  const resetTest = () => {
    setAnswers(emptyAnswers());
    setShareOpen(false);
  };

  const saveAnswer = (globalIndex, payload) => {
    setAnswers((prev) => ({ ...prev, [globalIndex]: payload }));
  };

  const questions = QUESTIONS;

  const results = useMemo(() => computeResults(questions, answers), [answers, questions]);

  const value = {
    mobile,
    setMobile,
    country,
    setCountry,
    emailOrMobile,
    setEmailOrMobile,
    gender,
    setGender,
    age,
    setAge,
    dob,
    setDob,
    answers,
    saveAnswer,
    resetTest,
    questions,
    results,
    shareOpen,
    setShareOpen,
  };

  return <TestSessionContext.Provider value={value}>{children}</TestSessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(TestSessionContext);
  if (!ctx) throw new Error("useSession must be used within TestSessionProvider");
  return ctx;
}

export function getQuestion(sectionId, mode, number) {
  return QUESTIONS.find(
    (q) => q.sectionId === sectionId && q.mode === mode && q.number === number
  );
}

export function sectionQuestionCount(sectionId, mode) {
  return SECTIONS.find((section) => section.id === sectionId && section.mode === mode)?.count || 0;
}

export function nextRoute(sectionId, mode, number) {
  const current = QUESTIONS.find(
    (q) => q.sectionId === sectionId && q.mode === mode && q.number === number
  );
  if (!current) return "/";
  const next = QUESTIONS[current.globalIndex + 1];
  if (!next) return "/results/pending";
  return `/test/${next.sectionId}/${next.mode}?q=${next.number}`;
}

export function prevRoute(sectionId, mode, number) {
  const current = QUESTIONS.find(
    (q) => q.sectionId === sectionId && q.mode === mode && q.number === number
  );
  if (!current || current.globalIndex === 0) return "/onboarding/personalize";
  const previous = QUESTIONS[current.globalIndex - 1];
  return `/test/${previous.sectionId}/${previous.mode}?q=${previous.number}`;
}

function computeResults(questions, answers) {
  const bySection = SECTIONS.map((section) => {
    const qs = questions.filter((q) => q.sectionId === section.id && q.mode === section.mode);
    let correct = 0;
    let skipped = 0;
    let incorrect = 0;
    const items = qs.map((q) => {
      const a = answers[q.globalIndex];
      let status = "skipped";
      if (!a || a.skipped) {
        skipped += 1;
        status = "skipped";
      } else if (q.mode === "recognition") {
        status = a.choice === q.correct ? "correct" : "incorrect";
        if (status === "correct") correct += 1;
        else incorrect += 1;
      } else {
        status = a.recorded ? (Number(a.score) >= 0.55 ? "correct" : "incorrect") : "skipped";
        if (status === "correct") correct += 1;
        else if (status === "incorrect") incorrect += 1;
        else skipped += 1;
      }
      return { ...q, answer: a, status };
    });
    const total = qs.length;
    const pct = Math.round((correct / total) * 100);
    return { ...section, items, correct, skipped, incorrect, total, pct };
  });

  const overallCorrect = bySection.reduce((s, x) => s + x.correct, 0);
  const overallTotal = bySection.reduce((s, x) => s + x.total, 0);
  const overallPct = Math.round((overallCorrect / overallTotal) * 100);
  const overallSkipped = bySection.reduce((s, x) => s + x.skipped, 0);
  const overallIncorrect = bySection.reduce((s, x) => s + x.incorrect, 0);

  let band = "Developing";
  if (overallPct >= 70) band = "Melodic Aptitude";
  else if (overallPct >= 45) band = "Growing";

  return {
    bySection,
    overallPct,
    overallCorrect,
    overallIncorrect,
    overallSkipped,
    overallTotal,
    band,
    allItems: bySection.flatMap((s) => s.items),
  };
}
