import { Logo } from "../components/ui";

export default function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card logout-modal-card">
        <div className="modal-logo" style={{ marginBottom: 16 }}>
          <Logo />
        </div>
        <p style={{ fontSize: 15, color: "#8b949e", marginBottom: 24 }}>
          Are you sure you want to logout?
        </p>
        <div className="logout-buttons">
          <button className="btn btn-danger btn-full" onClick={onConfirm}>
            Yes
          </button>
          <button className="btn btn-ghost btn-full" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
