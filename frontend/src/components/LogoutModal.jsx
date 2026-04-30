import { LappalLogo } from "../components/icons";

export default function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
    >
      <div className="modal-card logout-modal-card">
        <div className="modal-logo" style={{ marginBottom: 16 }}>
          <LappalLogo size="sm" />
        </div>

        <h2
          className="modal-title"
          id="logout-title"
          style={{ fontSize: 18 }}
        >
          Log Out?
        </h2>

        <p style={{
          fontSize: 14, color: "#8b949e",
          marginBottom: 24, lineHeight: 1.6,
        }}>
          Are you sure you want to log out? You'll need to sign in again to access your account.
        </p>

        <div className="logout-buttons">
          <button
            className="btn btn-danger btn-full"
            onClick={onConfirm}
            autoFocus
            aria-label="Confirm logout"
          >
            Yes, Log Out
          </button>
          <button
            className="btn btn-ghost btn-full"
            onClick={onCancel}
            aria-label="Cancel and stay logged in"
          >
            Cancel
          </button>
        </div>

        {/* Reassurance — user control (Nielsen #3) */}
        <p style={{
          fontSize: 11, color: "#8b949e",
          textAlign: "center", marginTop: 12,
        }}>
          Your data and listings will be saved when you log back in.
        </p>
      </div>
    </div>
  );
}