// Shared primitive UI components used across the app
import { LappalLogo } from "../icons";

export function Logo({ size = "sm" }) {
  return <LappalLogo size={size} />;
}


export function Navbar({ user, onNavigate, onLogoutClick, activeScreen }) {
  const home = user?.role === "seller" ? "dashboard" : "marketplace";
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-brand" onClick={() => onNavigate(home)}>
        <LappalLogo size="sm" />
      </div>
      {user && (
        <div className="navbar-links">
          {user.role === "seller" ? (
            <button
              className={`nav-link ${activeScreen === "marketplace" ? "active" : ""}`}
              onClick={() => onNavigate("marketplace")}
            >
              Home
            </button>
          ) : (
            <>
              <button
                className={`nav-link ${activeScreen === "dashboard" ? "active" : ""}`}
                onClick={() => onNavigate("dashboard")}
              >
                Dashboard
              </button>
              <button
                className={`nav-link ${activeScreen === "messages" ? "active" : ""}`}
                onClick={() => onNavigate("messages")}
              >
                Messages
              </button>
            </>
          )}
          <button
            className={`nav-link ${activeScreen === "estimator" ? "active" : ""}`}
            onClick={() => onNavigate("estimator")}
          >
            Price Estimator
          </button>
          <button
            className={`nav-link ${activeScreen === "profile" ? "active" : ""}`}
            onClick={() => onNavigate("profile")}
          >
            Profile
          </button>
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

export function Toast({ message, type = "success" }) {
  const icons = { success: "✓", error: "✕", info: "ℹ" };
  return (
    <div className={`toast toast-${type}`} role="alert" aria-live="polite">
      <span style={{ fontWeight: 700, fontSize: 15 }}>{icons[type]}</span>
      {message}
    </div>
  );
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

// Breadcrumb — crumbs = [{ label, onClick? }]
export function Breadcrumb({ crumbs }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              className={`breadcrumb-item ${isLast ? "current" : ""}`}
              onClick={!isLast ? crumb.onClick : undefined}
              aria-current={isLast ? "page" : undefined}
            >
              {crumb.label}
            </span>
            {!isLast && <span className="breadcrumb-sep" aria-hidden="true">›</span>}
          </span>
        );
      })}
    </nav>
  );
}

// Tooltip — wrap any label, shows on hover
export function Tooltip({ text, children }) {
  return (
    <div className="tooltip-wrap">
      {children}
      <span className="tooltip-icon" aria-label="More info">?</span>
      <div className="tooltip-box" role="tooltip">{text}</div>
    </div>
  );
}

// PageProgress — brief blue bar shown on screen transitions
export function PageProgress() {
  return (
    <div className="page-progress" aria-hidden="true">
      <div className="page-progress-fill" />
    </div>
  );
}

// ConfirmDialog — reusable confirmation modal
export function ConfirmDialog({ title, message, confirmLabel = "Confirm", confirmDanger = false, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal-card" style={{ maxWidth: 380, textAlign: "center" }}>
        <div className="modal-title" id="confirm-title">{title}</div>
        <p style={{ fontSize: 14, color: "#8b949e", marginBottom: 24, marginTop: -12, lineHeight: 1.6 }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            className={`btn ${confirmDanger ? "btn-danger" : "btn-primary"} btn-full`}
            onClick={onConfirm}
            autoFocus
          >
            {confirmLabel}
          </button>
          <button className="btn btn-ghost btn-full" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}