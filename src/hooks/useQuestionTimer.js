import { useCallback, useEffect, useRef, useState } from "react";

export const QUESTION_SECONDS = 20;

export default function useQuestionTimer(resetKey) {
  const [remaining, setRemaining] = useState(QUESTION_SECONDS);
  const [expired, setExpired] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const expiredRef = useRef(false);
  const generationRef = useRef(0);

  const restart = useCallback(() => {
    expiredRef.current = false;
    setExpired(false);
    setRemaining(QUESTION_SECONDS);
    setEpoch((value) => value + 1);
  }, []);

  useEffect(() => {
    expiredRef.current = false;
    setExpired(false);
    setRemaining(QUESTION_SECONDS);
    const generation = ++generationRef.current;
    const started = performance.now();
    let frame = 0;

    const tick = () => {
      if (generation !== generationRef.current) return;
      const left = Math.max(0, QUESTION_SECONDS - (performance.now() - started) / 1000);
      setRemaining(Math.max(0, Math.ceil(left)));
      if (left <= 0) {
        if (!expiredRef.current) {
          expiredRef.current = true;
          setRemaining(0);
          setExpired(true);
        }
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [resetKey, epoch]);

  return { remaining, expired, restart };
}
