import { publicAsset } from "../assets";
import { shareResults } from "../lib/share";

const TARGETS = [
  { icon: publicAsset("assets/icons/whatsapp.svg"), label: "WhatsApp", kind: "whatsapp" },
  { icon: publicAsset("assets/icons/drive.svg"), label: "Drive", kind: "share" },
  { icon: publicAsset("assets/icons/bluetooth.svg"), label: "Bluetooth", kind: "share" },
  { icon: publicAsset("assets/icons/gmail.svg"), label: "Gmail", kind: "gmail" },
  { icon: publicAsset("assets/icons/photos.svg"), label: "Photos", kind: "share" },
  { icon: publicAsset("assets/icons/folder.svg"), label: "Folder", kind: "share" },
];

export default function ShareSheet({ open, onClose }) {
  if (!open) return null;

  const share = async (kind) => {
    const text = "I completed the Octavium Musical Aptitude, Knowledge & Skills challenge.";
    const url = window.location.href;
    if (kind === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank", "noopener");
    } else if (kind === "gmail") {
      window.location.href = `mailto:?subject=${encodeURIComponent("Octavium OMAKS results")}&body=${encodeURIComponent(`${text}\n${url}`)}`;
    } else {
      await shareResults();
    }
    onClose();
  };

  return (
    <div className="sheet-root share-root" role="dialog" aria-modal>
      <button className="sheet-backdrop" type="button" onClick={onClose} aria-label="Dismiss share" />
      <div className="share-sheet">
        <div className="share-handle">Share to</div>
        <div className="share-grid">
          {TARGETS.map((item) => (
            <button
              key={item.label}
              type="button"
              className="share-item"
              onClick={() => share(item.kind)}
            >
              <img src={item.icon} alt="" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
