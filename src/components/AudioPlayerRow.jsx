import { useId, useMemo } from "react";
import useAudioPlayer, { formatClock } from "../hooks/useAudioPlayer";
import { PlayPauseIcon, SpeakerIcon } from "./AudioIcons";

function buildWave(count) {
  return Array.from({ length: count }, (_, index) => {
    const a = Math.sin(index * 0.55) * 10;
    const b = Math.sin(index * 1.37 + 0.4) * 6;
    const c = Math.sin(index * 0.18) * 4;
    return Math.max(5, Math.round(12 + a + b + c));
  });
}

export default function AudioPlayerRow({
  kind = "pitch",
  frequency = 440,
  pattern,
  compact = false,
  onProgress,
}) {
  const playerId = useId();
  const bars = useMemo(() => buildWave(compact ? 28 : 36), [compact]);
  const { duration, playing, progress, remaining, muted, levels, toggle, toggleMute } = useAudioPlayer({
    kind,
    frequency,
    pattern,
    onProgress,
    playerId,
  });

  return (
    <div className={`audio-row ${compact ? "is-compact" : ""} ${playing ? "is-playing" : ""}`}>
      <button
        type="button"
        className="play-btn"
        onClick={(event) => {
          event.stopPropagation();
          toggle();
        }}
        aria-label={playing ? "Pause audio" : "Play audio"}
        aria-pressed={playing}
      >
        <PlayPauseIcon playing={playing} size={compact ? 14 : 18} />
      </button>
      <span className="wave-track" aria-hidden>
        {bars.map((base, index) => {
          const live = playing ? Math.max(base, levels[index % levels.length] || base) : base;
          const played = index / bars.length <= progress;
          return <i key={index} className={played ? "is-played" : ""} style={{ height: `${live}px` }} />;
        })}
        <span className="wave-playhead" style={{ left: `${progress * 100}%` }} />
      </span>
      <span className="duration">{formatClock(playing || progress ? remaining : duration)}</span>
      {!compact ? (
        <button
          type="button"
          className={`sound-glyph ${muted ? "is-muted" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            toggleMute();
          }}
          aria-label={muted ? "Unmute audio" : "Mute audio"}
          aria-pressed={muted}
        >
          <SpeakerIcon muted={muted} size={17} />
        </button>
      ) : null}
    </div>
  );
}
