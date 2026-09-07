import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets";

export default function ResultsPending() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/results/submitted"), 2400);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="pending-screen">
      <img className="piano-bg" src={assets.pianoGuitarBg} alt="" />
      <img className="notes-loader" src={assets.notesLoader} alt="" />
      <img className="clef-loader" src={assets.loaderClef} alt="" />
      <h1>Please wait a moment</h1>
      <p>Your results are being calculated</p>
      <small>This will only take a few seconds</small>
    </div>
  );
}
