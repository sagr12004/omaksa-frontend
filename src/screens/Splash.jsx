import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(1);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(2), 500);
    const t2 = setTimeout(() => setStage(3), 1400);
    const t3 = setTimeout(() => navigate("/auth/phone"), 2300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [navigate]);

  return (
    <div className={`splash stage-${stage}`}>
      <span className="splash-dot" />
      <h1>OCTAVIUM</h1>
    </div>
  );
}
