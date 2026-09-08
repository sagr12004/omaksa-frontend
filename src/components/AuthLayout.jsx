import { assets, publicAsset } from "../assets";
import BackChevron from "./BackChevron";

export default function AuthLayout({
  children,
  variant = "phone",
  onBack,
  onClose,
  title,
}) {
  const useLoginFrame = variant === "phone" || variant === "password";

  return (
    <div className={`auth-layout variant-${variant}`}>
      {useLoginFrame ? <img className="auth-frame-bg" src={assets.loginFrameBg} alt="" /> : null}
      {variant === "otp" || variant === "terms" ? (
        <>
          <img className="auth-texture" src={assets.paperTexture} alt="" />
          <img className="auth-soundhole" src={assets.guitarSoundhole} alt="" />
        </>
      ) : null}
      {variant === "phone" ? <img className="auth-soundhole" src={assets.guitarSoundhole} alt="" /> : null}

      <CardShell>
        {variant === "password" ? <img className="auth-violin" src={assets.violin} alt="" /> : null}
        {variant === "phone" ? <img className="auth-hero" src={assets.heroLogin} alt="" /> : null}
        {onClose ? (
          <button className="icon-close" type="button" onClick={onClose} aria-label="Close">
            <img src={publicAsset("assets/icons/close.svg")} alt="" />
          </button>
        ) : null}
        {onBack ? (
          <button className="icon-back" type="button" onClick={onBack} aria-label="Back">
            <BackChevron />
          </button>
        ) : null}
        {title ? <p className="auth-top-title">{title}</p> : null}
        <div className="auth-body">{children}</div>
      </CardShell>
    </div>
  );
}

function CardShell({ children }) {
  return <div className="surface-card auth-card">{children}</div>;
}
