import { useEffect, useMemo, useRef, useState } from "react";
import { analyzeRecording } from "../lib/audioAnalysis";
import { claimAudio, releaseAudio } from "../lib/audioBus";
import { QUESTION_SECONDS } from "../hooks/useQuestionTimer";
import { PlayPauseIcon } from "./AudioIcons";

export const RECORDING_DURATION = QUESTION_SECONDS;
const MIC_ID = "omaksa-mic";
const PLAYBACK_ID = "omaksa-recording";

function playbackBars() {
  return Array.from({ length: 36 }, (_, index) => {
    const a = Math.sin(index * 0.55) * 10;
    const b = Math.sin(index * 1.37 + 0.4) * 6;
    return Math.max(5, Math.round(12 + a + b));
  });
}

export default function RecordControl({ state, halt = false, onStateChange, onRemaining, error, kind, referenceFrequency }) {
  const [seconds, setSeconds] = useState(0);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const processRef = useRef(null);
  const urlRef = useRef(null);
  const streamRef = useRef(null);
  const audioRef = useRef(null);
  const startedRef = useRef(0);
  const releasedRef = useRef(false);
  const generationRef = useRef(0);
  const mountedRef = useRef(true);
  const transferredRef = useRef(false);
  const expireOnceRef = useRef(false);
  const stateRef = useRef(state);
  const onStateChangeRef = useRef(onStateChange);
  const onRemainingRef = useRef(onRemaining);
  const lastRemainingRef = useRef(RECORDING_DURATION);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [playbackPlaying, setPlaybackPlaying] = useState(false);
  const [levels, setLevels] = useState(() => Array(32).fill(4));
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);
  const waveFrameRef = useRef(0);
  const bars = useMemo(() => playbackBars(), []);

  stateRef.current = state;
  onStateChangeRef.current = onStateChange;
  onRemainingRef.current = onRemaining;

  const reportRemaining = (value) => {
    const next = Math.max(0, value);
    if (lastRemainingRef.current === next) return;
    lastRemainingRef.current = next;
    onRemainingRef.current?.(next);
  };

  const stopHardware = () => {
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    timerRef.current = null;
    if (waveFrameRef.current) cancelAnimationFrame(waveFrameRef.current);
    waveFrameRef.current = null;
    analyserRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    if (mediaRef.current && mediaRef.current.state !== "inactive") {
      try {
        mediaRef.current.stop();
      } catch {
        // already stopped
      }
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    releaseAudio(MIC_ID);
  };

  const expireRecording = () => {
    if (expireOnceRef.current) return;
    expireOnceRef.current = true;
    releasedRef.current = true;
    stateRef.current = "expired";
    setSeconds(RECORDING_DURATION);
    setLevels(Array(32).fill(4));
    reportRemaining(0);
    onStateChangeRef.current("expired");
    stopHardware();
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      generationRef.current += 1;
      releasedRef.current = true;
      if (processRef.current) clearTimeout(processRef.current);
      stopHardware();
      audioRef.current?.pause();
      if (urlRef.current && !transferredRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!halt) return;
    expireOnceRef.current = true;
    releasedRef.current = true;
    setLevels(Array(32).fill(4));
    audioRef.current?.pause();
    stopHardware();
    if (urlRef.current && !transferredRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }, [halt]);

  useEffect(() => {
    if (state !== "idle") return;
    expireOnceRef.current = false;
    releasedRef.current = false;
    if (processRef.current) clearTimeout(processRef.current);
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    timerRef.current = null;
    if (waveFrameRef.current) cancelAnimationFrame(waveFrameRef.current);
    setSeconds(0);
    setLevels(Array(32).fill(4));
    setPlaybackProgress(0);
    setPlaybackPlaying(false);
    reportRemaining(RECORDING_DURATION);
  }, [state]);

  const startRecord = async (event) => {
    event?.preventDefault();
    if (halt || stateRef.current === "processing" || stateRef.current === "recording" || stateRef.current === "expired") return;
    releasedRef.current = false;
    expireOnceRef.current = false;
    const generation = ++generationRef.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (releasedRef.current || generation !== generationRef.current || !mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      const recorder = new MediaRecorder(stream);
      streamRef.current = stream;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        if (generation !== generationRef.current || !mountedRef.current) return;
        if (expireOnceRef.current || stateRef.current === "expired") {
          chunksRef.current = [];
          if (urlRef.current && !transferredRef.current) URL.revokeObjectURL(urlRef.current);
          urlRef.current = null;
          return;
        }
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (blob.size < 64 || performance.now() - startedRef.current < 250) {
          onStateChangeRef.current("error");
          return;
        }
        onStateChangeRef.current("processing");
        if (urlRef.current && !transferredRef.current) URL.revokeObjectURL(urlRef.current);
        transferredRef.current = false;
        urlRef.current = URL.createObjectURL(blob);
        try {
          const analysis = await analyzeRecording(blob, kind, referenceFrequency);
          if (generation !== generationRef.current || !mountedRef.current) return;
          if (expireOnceRef.current || stateRef.current === "expired") {
            if (urlRef.current && !transferredRef.current) URL.revokeObjectURL(urlRef.current);
            urlRef.current = null;
            return;
          }
          transferredRef.current = true;
          processRef.current = setTimeout(() => {
            if (generation !== generationRef.current || !mountedRef.current) return;
            if (expireOnceRef.current || stateRef.current === "expired") return;
            onStateChangeRef.current("recorded", urlRef.current, analysis.valid ? analysis : { ...analysis, score: 0 });
          }, 500);
        } catch {
          if (mountedRef.current && !expireOnceRef.current) onStateChangeRef.current("error");
        }
      };
      mediaRef.current = recorder;
      recorder.start();
      startedRef.current = performance.now();
      setSeconds(0);
      reportRemaining(RECORDING_DURATION);

      try {
        const context = new AudioContext();
        if (context.state === "suspended") await context.resume();
        audioCtxRef.current = context;
        const source = context.createMediaStreamSource(stream);
        const analyser = context.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0.42;
        source.connect(analyser);
        analyserRef.current = analyser;
        const tickWave = () => {
          if (!analyserRef.current || releasedRef.current || expireOnceRef.current) return;
          const data = new Uint8Array(analyserRef.current.fftSize);
          analyserRef.current.getByteTimeDomainData(data);
          const count = 32;
          const step = Math.max(1, Math.floor(data.length / count));
          setLevels(
            Array.from({ length: count }, (_, index) => {
              let peak = 0;
              for (let offset = 0; offset < step; offset += 1) {
                peak = Math.max(peak, Math.abs((data[index * step + offset] - 128) / 128));
              }
              return 4 + peak * 40;
            })
          );
          waveFrameRef.current = requestAnimationFrame(tickWave);
        };
        waveFrameRef.current = requestAnimationFrame(tickWave);
      } catch {
        // visualization is optional
      }

      const tickTimer = () => {
        if (expireOnceRef.current) return;
        const elapsed = (performance.now() - startedRef.current) / 1000;
        const remaining = Math.max(0, RECORDING_DURATION - elapsed);
        setSeconds(Math.min(RECORDING_DURATION, elapsed));
        reportRemaining(Math.ceil(remaining));
        if (remaining <= 0) {
          expireRecording();
          return;
        }
        timerRef.current = requestAnimationFrame(tickTimer);
      };
      timerRef.current = requestAnimationFrame(tickTimer);
      claimAudio(MIC_ID, () => {
        if (mediaRef.current?.state === "recording" && !expireOnceRef.current) stopRecord();
      });
      stateRef.current = "recording";
      onStateChangeRef.current("recording");
    } catch {
      if (mountedRef.current) onStateChangeRef.current("error");
    }
  };

  const stopRecord = (reason = "manual") => {
    if (reason === "expired") {
      expireRecording();
      return;
    }
    if (expireOnceRef.current || stateRef.current === "expired") return;
    if (mediaRef.current?.state !== "recording") return;
    releasedRef.current = true;
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    timerRef.current = null;
    if (waveFrameRef.current) cancelAnimationFrame(waveFrameRef.current);
    analyserRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    setLevels(Array(32).fill(4));
    if (mediaRef.current && mediaRef.current.state === "recording") mediaRef.current.stop();
    releaseAudio(MIC_ID);
  };

  const playBack = () => {
    if (!urlRef.current) return;
    if (!audioRef.current || audioRef.current.src !== urlRef.current) {
      audioRef.current?.pause();
      const audio = new Audio(urlRef.current);
      audioRef.current = audio;
      audio.onplay = () => setPlaybackPlaying(true);
      audio.onpause = () => setPlaybackPlaying(false);
      audio.ontimeupdate = () => {
        setPlaybackProgress(audio.duration ? audio.currentTime / audio.duration : 0);
      };
      audio.onended = () => {
        setPlaybackPlaying(false);
        setPlaybackProgress(0);
        audio.currentTime = 0;
        releaseAudio(PLAYBACK_ID);
      };
    }
    const audio = audioRef.current;
    if (!audio.paused) {
      audio.pause();
      releaseAudio(PLAYBACK_ID);
      return;
    }
    claimAudio(PLAYBACK_ID, () => {
      audio.pause();
    });
    audio.play().catch(() => onStateChangeRef.current("error"));
  };

  const reset = () => {
    if (processRef.current) clearTimeout(processRef.current);
    stopHardware();
    audioRef.current?.pause();
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    audioRef.current = null;
    transferredRef.current = false;
    expireOnceRef.current = false;
    generationRef.current += 1;
    setPlaybackProgress(0);
    setPlaybackPlaying(false);
    setLevels(Array(32).fill(4));
    setSeconds(0);
    reportRemaining(RECORDING_DURATION);
    releaseAudio(PLAYBACK_ID);
    onStateChangeRef.current("idle");
  };

  const remaining = Math.max(0, Math.ceil(RECORDING_DURATION - seconds));
  const mmss = `0:${String(remaining).padStart(2, "0")}`;
  const recordedClock = `0:${String(Math.min(RECORDING_DURATION, Math.max(1, Math.round(seconds)))).padStart(2, "0")}`;
  const timerTone = remaining <= 5 ? "is-warning" : remaining <= 10 ? "is-caution" : "";
  const micState = state === "expired" || halt ? "idle" : state;

  return (
    <div className={`record-card state-${state} ${error ? "has-error" : ""}`}>
      <p className="record-kicker">Record</p>
      <button
        type="button"
        className={`mic-button ${micState}`}
        onClick={(event) => {
          if (halt || state === "expired" || state === "processing") return;
          if (state === "recording") stopRecord();
          else startRecord(event);
        }}
        disabled={state === "processing" || state === "expired" || halt}
      >
        {state === "processing" ? (
          <span className="processing-stack">
            <span className="processing-ring" aria-hidden />
            <img src="/assets/icons/hourglass.svg" alt="" />
          </span>
        ) : (
          <img className="mic-icon" src="/assets/icons/mic.svg" alt="" />
        )}
        {state === "recording" && !halt ? (
          <span className={`mic-timer ${timerTone}`}>{mmss}</span>
        ) : (
          <span className="mic-rec">Rec</span>
        )}
      </button>

      {state === "idle" || state === "error" ? (
        <p className="record-status">
          Tap the microphone to record.
          <br />
          Tap again to finish
        </p>
      ) : null}
      {state === "recording" && !halt ? (
        <>
          <p className="record-status is-recording">
            <span className="rec-pill">
              <i /> Recording
            </span>
          </p>
          <span className="record-live-wave" aria-hidden>
            {levels.map((height, index) => (
              <i key={index} style={{ height: `${Math.max(3, Math.min(36, height))}px` }} />
            ))}
          </span>
        </>
      ) : null}
      {state === "processing" ? <p className="record-status is-processing">Processing your audio...</p> : null}
      {state === "recorded" ? (
        <p className="record-status">Recorded. Tap the microphone to re-record</p>
      ) : null}

      <p className="your-recording">Your Recording</p>

      {state === "recorded" ? (
        <div className="playback-bar">
          <button
            type="button"
            className="play-btn"
            onClick={playBack}
            aria-label={playbackPlaying ? "Pause recording" : "Play recording"}
            aria-pressed={playbackPlaying}
          >
            <PlayPauseIcon playing={playbackPlaying} />
          </button>
          <span className="wave-track recorded-wave-track" aria-hidden>
            {bars.map((base, index) => {
              const played = index / bars.length <= playbackProgress;
              return <i key={index} className={played ? "is-played" : ""} style={{ height: `${base}px` }} />;
            })}
            <span className="wave-playhead" style={{ left: `${playbackProgress * 100}%` }} />
          </span>
          <span className="duration">{recordedClock}</span>
        </div>
      ) : (
        <div className={`empty-recording ${error ? "is-error" : ""}`}>No recording yet</div>
      )}

      {(state === "recorded" || state === "processing") && !halt && (
        <button type="button" className="record-again" onClick={reset}>
          <img src="/assets/icons/reload.svg" alt="" /> RECORD AGAIN
        </button>
      )}

      {error && state !== "expired" && !halt ? (
        <div className="caution-banner">
          <img src="/assets/icons/caution.svg" alt="" />
          <p>
            <strong>Record your response first</strong>
            <span>You need to record before you can continue to next question</span>
          </p>
        </div>
      ) : null}
    </div>
  );
}
