import { useNavigate } from "react-router-dom";
import { assets } from "../assets";
import BackChevron from "../components/BackChevron";
import Button from "../components/Button";
import { useSession } from "../context/TestSession";

export default function Report() {
  const navigate = useNavigate();
  const { results } = useSession();

  return (
    <div className="report-screen">
      <img className="piano-bg" src={assets.pianoGuitarBg} alt="" />
      <header className="report-top">
        <button type="button" className="icon-back" onClick={() => navigate("/results")} aria-label="Back">
          <BackChevron />
        </button>
        <h1>Detailed Report</h1>
        <div className="overall-card compact">
          <div>
            <h3>Overall musicality</h3>
            <p>{results.band}</p>
          </div>
          <strong>{results.overallPct}%</strong>
        </div>
        <div className="legend">
          <span className="ok">Right {results.overallCorrect}</span>
          <span className="bad">Wrong {results.overallIncorrect}</span>
          <span className="skip">Skipped {results.overallSkipped}</span>
        </div>
      </header>
      <div className="report-list">
        {results.bySection.map((section, sectionIndex) => (
          <section key={section.title}>
            <div className="report-group">
              <span className="idx">{sectionIndex + 1}</span>
              {section.title.replace(" – Level 1", "")}
            </div>
            {section.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className="report-row"
                onClick={() => navigate(`/results/review/${item.globalIndex}`)}
              >
                <span className="idx">{item.number}</span>
                <div>
                  <strong>Question-{item.number}</strong>
                  <small>Level 1 -{item.level}</small>
                </div>
                <span className={`status is-${item.status}`}>
                  {item.status === "correct" ? "Correct" : item.status === "incorrect" ? "Wrong" : "Skipped"}
                </span>
                <span className="pts">{item.status === "correct" ? "1/1" : "0/1"}</span>
                <span className="chev">›</span>
              </button>
            ))}
          </section>
        ))}
      </div>
      <footer className="report-footer">
        <Button onClick={() => window.print()}>
          DOWNLOAD PDF
        </Button>
        <Button variant="outline" onClick={() => navigate("/results")}>BACK TO RESULTS</Button>
      </footer>
    </div>
  );
}
