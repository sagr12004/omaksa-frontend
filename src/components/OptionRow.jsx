import { publicAsset } from "../assets";
import AudioPlayerRow from "./AudioPlayerRow";

export default function OptionRow({ letter, selected, onSelect, kind, frequency, pattern }) {
  return (
    <div
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      className={`option-row ${selected ? "is-selected" : ""}`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <span className="option-letter">{letter}</span>
      <AudioPlayerRow kind={kind} frequency={frequency} pattern={pattern} compact />
      <span className={`option-check ${selected ? "is-checked" : ""}`} aria-hidden>
        {selected ? <img src={publicAsset("assets/icons/check.svg")} alt="" /> : null}
      </span>
    </div>
  );
}
