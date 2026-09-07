import { useNavigate } from "react-router-dom";
import { assets } from "../assets";
import Button from "../components/Button";

export default function Profile() {
  const navigate = useNavigate();
  return (
    <div className="profile-screen">
      <img className="deco notes-cluster" src={assets.notesCluster} alt="" />
      <img className="deco piano" src={assets.grandPiano} alt="" />
      <div className="profile-copy">
        <h1>Welcome to Octavium!</h1>
        <p>Let&apos;s tune your experience</p>
      </div>
      <img className="avatar" src={assets.avatar} alt="Octavium avatar" />
      <Button onClick={() => navigate("/onboarding/personalize")}>Take the OMAKS challenge</Button>
    </div>
  );
}
