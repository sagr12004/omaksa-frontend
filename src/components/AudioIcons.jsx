export function PlayPauseIcon({ playing, size = 18 }) {
  return playing ? (
    <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true">
      <rect x="7.2" y="6.4" width="4.6" height="15.2" rx="1" fill="#faf8f5" />
      <rect x="16.2" y="6.4" width="4.6" height="15.2" rx="1" fill="#faf8f5" />
    </svg>
  ) : (
    <svg viewBox="0 0 28 28" width={size} height={size} aria-hidden="true">
      <path d="M10.2 7.1v13.8L21.4 14 10.2 7.1z" fill="#faf8f5" />
    </svg>
  );
}

export function SpeakerIcon({ muted, size = 17 }) {
  return (
    <svg viewBox="0 0 18 18" width={size} height={size} aria-hidden="true">
      <path d="M2.6 6.4h2.4L8.8 3.6v10.8L5 11.6H2.6V6.4z" fill="#1B4332" />
      {muted ? (
        <path
          d="M11.2 6.6l4 4.8M15.2 6.6l-4 4.8"
          stroke="#1B4332"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path
            d="M11.1 6.2c1 .8 1.6 1.9 1.6 2.8s-.6 2-1.6 2.8"
            fill="none"
            stroke="#1B4332"
            strokeWidth="1.35"
            strokeLinecap="round"
          />
          <path
            d="M13.1 4.6c1.6 1.3 2.5 3 2.5 4.4s-.9 3.1-2.5 4.4"
            fill="none"
            stroke="#1B4332"
            strokeWidth="1.35"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
