import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PhoneFrame from "./components/PhoneFrame";
import { TestSessionProvider } from "./context/TestSession";
import Demonstration from "./screens/Demonstration";
import Login from "./screens/Login";
import OTP from "./screens/OTP";
import PasswordLogin from "./screens/PasswordLogin";
import Personalize from "./screens/Personalize";
import Profile from "./screens/Profile";
import QuestionReview from "./screens/QuestionReview";
import Recognition from "./screens/Recognition";
import Report from "./screens/Report";
import Results from "./screens/Results";
import ResultsPending from "./screens/ResultsPending";
import ResultsSubmitted from "./screens/ResultsSubmitted";
import Splash from "./screens/Splash";
import Terms from "./screens/Terms";
import "./App.css";

export default function App() {
  return (
    <TestSessionProvider>
      <BrowserRouter>
        <PhoneFrame>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/auth/phone" element={<Login />} />
            <Route path="/auth/otp" element={<OTP />} />
            <Route path="/auth/password" element={<PasswordLogin />} />
            <Route path="/legal/terms" element={<Terms />} />
            <Route path="/onboarding/personalize" element={<Personalize />} />
            <Route path="/welcome" element={<Profile />} />
            <Route path="/test/:section/recognition" element={<Recognition />} />
            <Route path="/test/:section/demonstration" element={<Demonstration />} />
            <Route path="/results/pending" element={<ResultsPending />} />
            <Route path="/results/submitted" element={<ResultsSubmitted />} />
            <Route path="/results" element={<Results />} />
            <Route path="/results/review/:index" element={<QuestionReview />} />
            <Route path="/results/report" element={<Report />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PhoneFrame>
      </BrowserRouter>
    </TestSessionProvider>
  );
}
