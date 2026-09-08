import { useCallback, useEffect, useState } from "react";

export const QUESTION_SECONDS = 20;

export default function useQuestionTimer(resetKey) {
  const [expired, setExpired] = useState(false);
  const [epoch, setEpoch] = useState(0);

  const restart = useCallback(() => {
    setExpired(false);
    setEpoch((value) => value + 1);
  }, []);

  useEffect(() => {
    setExpired(false);
  }, [resetKey]);

  return {
    expired,
    setExpired,
    restart,
    timerKey: `${resetKey ?? "question"}-${epoch}`,
  };
}
