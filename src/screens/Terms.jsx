import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../components/AuthLayout";

export default function Terms() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("English");
  return (
    <AuthLayout variant="terms" onBack={() => navigate("/auth/phone")} title="TERMS OF USE">
      <div className="terms-toolbar">
        <button
          type="button"
          className="lang-pill"
          onClick={() => setLang((current) => (current === "English" ? "हिन्दी" : "English"))}
          aria-label="Toggle language"
        >
          🌐 {lang} ▾
        </button>
      </div>
      <div className="terms-scroll">
        <h2>OCTAVIUM: TERMS OF USE</h2>
        <h3>Disclaimer</h3>
        <p>
          The information and services provided through Octavium are intended for general informational and educational
          purposes only. While we make reasonable efforts to keep the information accurate and up to date, Octavium does
          not guarantee that all information will always be complete, accurate, or error-free. Users are responsible for
          verifying information before relying on it. Octavium shall not be held responsible for any loss, damage, or
          inconvenience arising from the use of the platform or its services.
        </p>
        <h3>1. User Account, Password, and Security:</h3>
        <p>
          Users are responsible for maintaining the confidentiality of their account information and for all activities
          carried out through their account. Users must provide accurate information while creating an account and should
          keep their login credentials secure. Octavium may take reasonable measures to protect user accounts and may
          suspend or terminate accounts in case of misuse, unauthorized access, or violation of these Terms of Use.
        </p>
        <h3>2. Services Offered:</h3>
        <p>
          Octavium provides users with access to its platform and related services for discovering, learning, creating,
          and managing their musical activities. The services available through Octavium may be updated, modified,
          expanded, or discontinued from time to time. Users agree to use the services only for their intended purposes
          and in accordance with these Terms of Use.
        </p>
      </div>
    </AuthLayout>
  );
}
