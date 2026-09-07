const CODES = ["+91", "+1", "+44", "+61"];

export default function CountrySelector({ value, onChange }) {
  return (
    <div className="country-selector">
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label="Country code">
        {CODES.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
      <img className="country-chevron" src="/assets/icons/chevron-down.svg" alt="" />
    </div>
  );
}
