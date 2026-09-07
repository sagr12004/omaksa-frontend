import { useCallback, useEffect, useRef, useState } from "react";
import { createClipUrl } from "../lib/audio";
import { claimAudio, releaseAudio } from "../lib/audioBus";

export function formatClock(seconds) {
  const value = Math.max(0, Math.ceil(seconds));
  return `0:${String(value).padStart(2, "0")}`;
}

export default function useAudioPlayer({ kind, frequency, pattern, onProgress, playerId }) {
  const duration = kind === "rhythm" ? 4 : 1;
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMutedState] = useState(false);
  const [levels, setLevels] = useState(() => Array(12).fill(6));
  const audioRef = useRef(null);
  const urlRef = useRef("");
  const contextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const frameRef = useRef(0);
  const playingRef = useRef(false);
  const mutedRef = useRef(false);
  const progressCallbackRef = useRef(onProgress);

  useEffect(() => {
    progressCallbackRef.current = onProgress;
  }, [onProgress]);

  const emit = useCallback(
    (elapsed, isPlaying) => {
      const beats = [0, 1, 2, 3];
      progressCallbackRef.current?.({
        currentTime: elapsed,
        duration,
        playing: isPlaying,
        activeBeat: isPlaying ? beats.findIndex((beat) => elapsed >= beat && elapsed < beat + 0.42) : -1,
      });
    },
    [duration]
  );

  const stopVisual = () => {
    cancelAnimationFrame(frameRef.current);
  };

  const tickLevels = useCallback(() => {
    if (!playingRef.current || !analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(data);
    const bars = 12;
    const step = Math.max(1, Math.floor(data.length / bars));
    setLevels(
      Array.from({ length: bars }, (_, index) => {
        let peak = 0;
        for (let offset = 0; offset < step; offset += 1) peak = Math.max(peak, data[index * step + offset] || 0);
        return 4 + (peak / 255) * 26;
      })
    );
    frameRef.current = requestAnimationFrame(tickLevels);
  }, []);

  const bindAudioEvents = useCallback(
    (audio) => {
      audio.onplay = () => {
        playingRef.current = true;
        setPlaying(true);
        tickLevels();
        emit(audio.currentTime || 0, true);
      };
      audio.onplaying = () => {
        playingRef.current = true;
        setPlaying(true);
        emit(audio.currentTime || 0, true);
      };
      audio.onpause = () => {
        playingRef.current = false;
        setPlaying(false);
        stopVisual();
        emit(audio.currentTime || 0, false);
      };
      audio.ontimeupdate = () => {
        const elapsed = audio.currentTime || 0;
        setCurrentTime(elapsed);
        setProgress(audio.duration ? elapsed / audio.duration : elapsed / duration);
        emit(elapsed, !audio.paused && !audio.ended);
      };
      audio.onended = () => {
        playingRef.current = false;
        setPlaying(false);
        stopVisual();
        setProgress(0);
        setCurrentTime(0);
        audio.currentTime = 0;
        releaseAudio(playerId);
        emit(0, false);
      };
    },
    [duration, emit, playerId, tickLevels]
  );

  const ensureAudio = useCallback(async () => {
    if (!urlRef.current) urlRef.current = createClipUrl({ kind, frequency, pattern });
    if (!audioRef.current) {
      const audio = new Audio(urlRef.current);
      audio.preload = "auto";
      audio.muted = mutedRef.current;
      audio.volume = mutedRef.current ? 0 : 1;
      audioRef.current = audio;
      bindAudioEvents(audio);
    }
    if (!contextRef.current) {
      const context = new AudioContext();
      contextRef.current = context;
      const analyser = context.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.72;
      analyserRef.current = analyser;
      try {
        sourceRef.current = context.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyser);
        analyser.connect(context.destination);
      } catch {
        // MediaElementSource can only be created once per element
      }
    }
    if (contextRef.current.state === "suspended") await contextRef.current.resume();
    return audioRef.current;
  }, [bindAudioEvents, frequency, kind, pattern]);

  const stop = useCallback(
    (reset = true) => {
      const audio = audioRef.current;
      releaseAudio(playerId);
      if (!audio) {
        playingRef.current = false;
        setPlaying(false);
        stopVisual();
        return;
      }
      if (reset) audio.currentTime = 0;
      if (!audio.paused) audio.pause();
      else {
        playingRef.current = false;
        setPlaying(false);
        stopVisual();
        emit(audio.currentTime || 0, false);
      }
      if (reset) {
        setProgress(0);
        setCurrentTime(0);
        emit(0, false);
      }
    },
    [emit, playerId]
  );

  const toggle = useCallback(() => {
    ensureAudio()
      .then((audio) => {
        if (!audio.paused && !audio.ended) {
          audio.pause();
          releaseAudio(playerId);
          return;
        }
        claimAudio(playerId, () => stop(true));
        return audio.play();
      })
      .catch(() => stop(true));
  }, [ensureAudio, playerId, stop]);

  const toggleMute = useCallback(() => {
    setMutedState((prev) => {
      const next = !prev;
      mutedRef.current = next;
      if (audioRef.current) {
        audioRef.current.muted = next;
        audioRef.current.volume = next ? 0 : 1;
      }
      return next;
    });
  }, []);

  useEffect(
    () => () => {
      stopVisual();
      audioRef.current?.pause();
      releaseAudio(playerId);
      contextRef.current?.close().catch(() => {});
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [playerId]
  );

  return {
    currentTime,
    duration,
    playing,
    progress,
    remaining: Math.max(0, duration - currentTime),
    muted,
    levels,
    toggle,
    toggleMute,
  };
}
