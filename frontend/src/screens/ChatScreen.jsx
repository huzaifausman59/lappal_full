import { useState } from "react";
import { SELLERS, INITIAL_MESSAGES } from "../data/listings";
import { Avatar } from "../components/ui";
import ReviewModal from "../components/ReviewModal";

export default function ChatScreen({ sellerId, onBack, onAddReview, user }) {
  const seller = SELLERS[sellerId];
  const [messages, setMessages] = useState(INITIAL_MESSAGES[sellerId] || []);
  const [input, setInput] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [markedComplete, setMarkedComplete] = useState(false);

  const send = () => {
    if (!input.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [...prev, { id: Date.now(), from: "me", text: input.trim(), time }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "them",
          text: "Thanks for reaching out! I'll get back to you shortly.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1200);
  };

  const handleReviewSubmit = ({ rating, comment }) => {
    const newReview = {
      id: Date.now(),
      reviewer: user?.name || "Anonymous",
      rating,
      comment,
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };
    onAddReview(sellerId, newReview);
    setShowReview(false);
    setMarkedComplete(true);
  };

  return (
    <div className="chat-wrapper">
      {/* Header */}
      <div className="chat-header">
        <button className="chat-back" onClick={onBack}>←</button>
        <Avatar name={seller.name} size={36} />
        <span style={{ fontWeight: 600, fontSize: 15, flex: 1 }}>{seller.name}</span>

        {!markedComplete ? (
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              background: "rgba(37,99,235,0.15)",
              border: "1px solid rgba(37,99,235,0.4)",
              color: "#2563eb", fontSize: 12, padding: "6px 14px",
              borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
              fontWeight: 600, whiteSpace: "nowrap",
            }}
          >
            Mark as Purchased
          </button>
        ) : (
          <span style={{ fontSize: 12, color: "#1a7f37", fontWeight: 600 }}>✓ Deal Complete</span>
        )}
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((m) => (
          <div key={m.id} className={`message-bubble ${m.from}`}>
            {m.text}
            <div className="message-time">{m.time}</div>
          </div>
        ))}
        {markedComplete && (
          <div style={{
            textAlign: "center", fontSize: 13, color: "#8b949e",
            padding: "12px 20px", background: "#161b22",
            border: "1px solid #21262d", borderRadius: 10,
            margin: "8px auto", maxWidth: 320,
          }}>
             You marked this deal as complete!!
          </div>
        )}
      </div>

      {/* Input */}
      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button className="btn btn-primary" style={{ padding: "12px 24px" }} onClick={send}>
          Send
        </button>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: 380, textAlign: "center" }}>
            <div className="modal-title">Mark as Purchased?</div>
            <p style={{ fontSize: 14, color: "#8b949e", marginBottom: 24, marginTop: -12 }}>
              Confirm that you completed a deal with{" "}
              <strong style={{ color: "#e6edf3" }}>{seller.name}</strong>.
              You'll then be asked to leave a review.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                className="btn btn-primary btn-full"
                onClick={() => { setShowConfirm(false); setShowReview(true); }}
              >
                Yes, Confirm
              </button>
              <button className="btn btn-ghost btn-full" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReview && (
        <ReviewModal
          sellerName={seller.name}
          onSubmit={handleReviewSubmit}
          onCancel={() => { setShowReview(false); setMarkedComplete(true); }}
        />
      )}
    </div>
  );
}