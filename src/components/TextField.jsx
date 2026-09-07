import FloatingLabel from "./FloatingLabel";

export default function TextField({
  id,
  label,
  required,
  value,
  onChange,
  type = "text",
  error,
  children,
  className = "",
  focused = false,
  ...props
}) {
  const active = Boolean(value) || focused;

  return (
    <div className={`text-field ${error ? "has-error" : ""} ${className}`}>
      {label ? (
        <FloatingLabel htmlFor={id} active={active} error={error}>
          {label}
          {required ? <span className="req">*</span> : null}
        </FloatingLabel>
      ) : null}
      <input id={id} type={type} value={value} onChange={onChange} {...props} />
      {children}
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}
