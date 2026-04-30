import { useState } from "react";

const MAX_COMMENT = 300;

export default function ReviewModal({ sellerName, onSubmit, onCancel }) {
  const [rating, setRating]   = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError]     = useState("");

  const charsLeft  = MAX_COMMENT - comment.length;
  const charsClass = charsLeft < 50 ? (charsLeft < 0 ? "over" : "warn") : "";

  const handle = () => {
    if (rating === 0)       return setError("Please select a star rating before submitting.");
    if (!comment.trim())    return setError("Please write a short comment about your experience.");
    if (comment.length > MAX_COMMENT) return setError(`Comment must be under ${MAX_COMMENT} characters.`);
    setError("");
    onSubmit({ rating, comment });
  };

  const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-title"
    >
      <div className="modal-card">
        <h2 className="modal-title" id="review-title">Rate Your Experience</h2>
        <p style={{
          textAlign: "center", fontSize: 14, color: "#8b949e",
          marginBottom: 24, marginTop: -12, lineHeight: 1.5,
        }}>
          How was your deal with{" "}
          <strong style={{ color: "#e6edf3" }}>{sellerName}</strong>?
        </p>

        {/* Star Picker — affordance with hover feedback (Norman) */}
        <div
          style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 8 }}
          role="radiogroup"
          aria-label="Star rating"
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              role="radio"
              aria-checked={rating === star}
              aria-label={`${star} star${star > 1 ? "s" : ""} — ${labels[star]}`}
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
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>

        {/* Rating label — immediate feedback (Nielsen #1) */}
        <p style={{
          textAlign: "center", fontSize: 13,
          color: "#f59e0b", marginBottom: 20, minHeight: 20, fontWeight: 500,
        }}
          aria-live="polite"
        >
          {labels[hovered || rating] || "Select a rating"}
        </p>

        {/* Comment field with character counter */}
        <div className="form-group">
          <label className="form-label" htmlFor="review-comment">
            Your Review
          </label>
          <textarea
            id="review-comment"
            className="form-input"
            rows={3}
            placeholder="Tell others about your experience with this seller..."
            value={comment}
            onChange={(e) => { setComment(e.target.value); setError(""); }}
            style={{ resize: "none", lineHeight: 1.6 }}
            aria-required="true"
            aria-describedby="review-char-count"
          />
          {/* Character counter — recognition not recall (Nielsen #6) */}
          <div
            id="review-char-count"
            className={`char-counter ${charsClass}`}
            aria-live="polite"
          >
            {charsLeft} characters remaining
          </div>
        </div>

        {/* Error — plain language with icon (Nielsen #9) */}
        {error && (
          <div
            role="alert"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8, padding: "10px 14px", marginBottom: 14,
              color: "#f87171", fontSize: 13, lineHeight: 1.5,
            }}
          >
            ⚠ {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            className="btn btn-primary btn-full"
            onClick={handle}
            aria-label="Submit your review"
          >
            Submit Review
          </button>
          <button
            className="btn btn-ghost btn-full"
            onClick={onCancel}
            aria-label="Skip leaving a review"
          >
            Skip for Now
          </button>
        </div>

        {/* Reassurance — user control (Nielsen #3) */}
        <p style={{
          fontSize: 11, color: "#8b949e",
          textAlign: "center", marginTop: 12,
        }}>
          Your review helps other buyers make informed decisions.
        </p>
      </div>
    </div>
  );
}