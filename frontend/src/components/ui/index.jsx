// Shared primitive UI components used across the app
import { LappalLogo } from "../icons";

export function Logo({ size = "sm" }) {
  return <LappalLogo size={size} />;
}


export function Navbar({ user, onNavigate, onLogoutClick }) {
  const home = user?.role === "seller" ? "dashboard" : "marketplace";
  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => onNavigate(home)}>
        <LappalLogo size="sm" />
      </div>
      {user && (
        <div className="navbar-links">
          {user.role === "seller" ? (
            <button className="nav-link" onClick={() => onNavigate("marketplace")}>Home</button>
          ) : (
            <>
              <button className="nav-link" onClick={() => onNavigate("dashboard")}>Dashboard</button>
              <button className="nav-link" onClick={() => onNavigate("messages")}>Messages</button>
              <button className="nav-link" onClick={() => onNavigate("estimator")}>Price Estimator</button>
            </>
          )}
          <button className="nav-link" onClick={() => onNavigate("profile")}>Profile</button>
          <button className="nav-link" onClick={onLogoutClick}>Logout</button>
        </div>
      )}
    </nav>
  );
}

export function Avatar({ name, size = 44 }) {
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {name[0]}
    </div>
  );
}

export function Toast({ message }) {
  return <div className="toast">{message}</div>;
}

export function EmptyState({ icon, text }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <div className="empty-state-text">{text}</div>
    </div>
  );
}

export function BackButton({ onClick, label = "Back" }) {
  return (
    <button className="back-btn" onClick={onClick}>
      ← {label}
    </button>
  );
}
