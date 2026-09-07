export default function ValidationSheet({ open, onClose, message }) {
  if (!open) return null;
  return (
    <div className="sheet-root" role="dialog" aria-modal>
      <div className="validation-sheet">
        <button type="button" className="sheet-close" onClick={onClose} aria-label="Close">
          <img src="/assets/icons/close.svg" alt="" />
        </button>
        <div className="sheet-illustration" aria-hidden>
          <img src="/assets/icons/warning-triangle.svg" alt="" />
        </div>
        <p>{message || "Please select an answer or skip this question."}</p>
      </div>
    </div>
  );
}
