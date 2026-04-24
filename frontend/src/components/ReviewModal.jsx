import { useState } from "react";

export default function ReviewModal({ sellerName, onSubmit, onCancel }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handle = () => {
    if (rating === 0) return setError("Please select a star rating.");
    if (!comment.trim()) return setError("Please write a short comment.");
    setError("");
    onSubmit({ rating, comment });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-title">Rate Your Experience</div>
        <p style={{ textAlign: "center", fontSize: 14, color: "#8b949e", marginBottom: 24, marginTop: -12 }}>
          How was your deal with <strong style={{ color: "#e6edf3" }}>{sellerName}</strong>?
        </p>

        {/* Star Picker */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 24 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              style={{
                background: "none", border: "none", cursor: "pointer", padding: 4,
                transition: "transform 0.1s",
                transform: hovered >= star || rating >= star ? "scale(1.2)" : "scale(1)",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 3l3.09 6.26L26 10.27l-5 4.87 1.18 6.88L16 18.77l-6.18 3.25L11 15.14 6 10.27l6.91-1.01L16 3z"
                  fill={hovered >= star || rating >= star ? "#f59e0b" : "none"}
                  stroke={hovered >= star || rating >= star ? "#f59e0b" : "#8b949e"}
                  strokeWidth="1.5" strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>

        {/* Rating label */}
        <p style={{ textAlign: "center", fontSize: 13, color: "#f59e0b", marginBottom: 20, minHeight: 20 }}>
          {["", "Poor", "Fair", "Good", "Great", "Excellent!"][rating] || ""}
        </p>

        {/* Comment */}
        <div className="form-group">
          <label className="form-label">Your Review</label>
          <textarea
            className="form-input"
            rows={3}
            placeholder="Tell others about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ resize: "none", lineHeight: 1.6 }}
          />
        </div>

        {error && <p style={{ color: "#f85149", fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-primary btn-full" onClick={handle}>Submit Review</button>
          <button className="btn btn-ghost btn-full" onClick={onCancel}>Skip</button>
        </div>
      </div>
    </div>
  );
}