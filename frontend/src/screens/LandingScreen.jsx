import { LappalLogo } from "../components/icons";

export default function LandingScreen({ onNavigate }) {
  return (
    <div className="landing">
      <div className="landing-logo">
        <LappalLogo size="lg" />
      </div>
      <p className="landing-subtitle">
        Your trusted marketplace for cutting-edge technology
      </p>
      <div className="landing-buttons">
        <button className="btn btn-outline" onClick={() => onNavigate("login")}>
          Login
        </button>
        <button className="btn btn-primary" onClick={() => onNavigate("register")}>
          Register
        </button>
      </div>
    </div>
  );
}
