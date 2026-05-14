import { LappalLogo } from "../components/icons";

export default function LandingScreen({ onNavigate }) {
  return (
    <div className="landing" role="main">

      <div className="landing-logo">
        <LappalLogo size="lg" />
      </div>

      <p className="landing-subtitle">
        Your trusted marketplace for buying and selling laptops
      </p>

      {/* Feature highlights — match between system and real world (Nielsen #2) */}
      <div className="landing-features" style={{
  display: "flex", gap: 24, marginBottom: 40, flexWrap: "wrap",
  justifyContent: "center",
}}>
{[
  {
    label: "Browse listings",
    icon: (
      <svg width="16" height="16" viewBox="0 0 72 72" fill="none">
        <circle cx="33" cy="33" r="17" fill="none" stroke="#8b949e" strokeWidth="2.5"/>
        <line x1="45" y1="45" x2="56" y2="56" stroke="#8b949e" strokeWidth="3" strokeLinecap="round"/>
        <line x1="26" y1="30" x2="40" y2="30" stroke="#8b949e" strokeWidth="2" strokeLinecap="round" opacity="0.45"/>
        <line x1="26" y1="35" x2="38" y2="35" stroke="#8b949e" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
      </svg>
    ),
  },
  {
    label: "AI price estimates",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 3 L14 9 L20 11 L14 13 L12 19 L10 13 L4 11 L10 9 Z"
          fill="#8b949e" opacity="0.95"/>
        <path d="M18 2 L19 5 L22 6 L19 7 L18 10 L17 7 L14 6 L17 5 Z"
          fill="#8b949e" opacity="0.6"/>
        <circle cx="5" cy="19" r="1.5" fill="#8b949e" opacity="0.4"/>
      </svg>
    ),
  },
  {
    label: "Chat with sellers",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
          fill="none" stroke="#8b949e" strokeWidth="1.8" strokeLinejoin="round"/>
        <line x1="8" y1="9" x2="16" y2="9" stroke="#8b949e" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <line x1="8" y1="13" x2="13" y2="13" stroke="#8b949e" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
  },
].map(({ icon, label }) => (
  <div key={label} style={{
    display: "flex", alignItems: "center", gap: 7,
    fontSize: 13, color: "#8b949e",
  }}>
    {icon}
    <span>{label}</span>
  </div>
))}
      </div>

      <div className="landing-buttons">
        <button
          className="btn btn-outline"
          onClick={() => onNavigate("login")}
          aria-label="Log in to your existing account"
        >
          Login
        </button>
        <button
          className="btn btn-primary"
          onClick={() => onNavigate("register")}
          aria-label="Create a new Lappal account"
        >
          Register
        </button>
      </div>

      {/* Trust line — real world conventions (Nielsen #2) */}
      <p style={{
        fontSize: 12, color: "#8b949e", marginTop: 24, textAlign: "center",
      }}>
        Free to join · No listing fees · Secure messaging
      </p>
    </div>
  );
}