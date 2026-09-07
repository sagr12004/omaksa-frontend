export default function Button({
  children,
  variant = "primary",
  size = "lg",
  disabled,
  type = "button",
  className = "",
  ...props
}) {
  const cls = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    disabled ? "is-disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={cls} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
