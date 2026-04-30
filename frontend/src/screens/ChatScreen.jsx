import { useState, useRef, useEffect } from "react";
import { SELLERS, INITIAL_MESSAGES } from "../data/listings";
import { Avatar, Toast } from "../components/ui";
import ReviewModal from "../components/ReviewModal";

const MAX_CHARS = 500;

export default function ChatScreen({ sellerId, onBack, onAddReview, user }) {
  const seller  = SELLERS[sellerId];
  const [messages, setMessages]         = useState(INITIAL_MESSAGES[sellerId] || []);
  const [input, setInput]               = useState("");
  const [showConfirm, setShowConfirm]   = useState(false);
  const [showReview, setShowReview]     = useState(false);
  const [markedComplete, setMarkedComplete] = useState(false);
  const [toast, setToast]               = useState(null);
  const messagesEndRef                  = useRef(null);

  // Auto-scroll to latest message — visibility of status (Nielsen #1)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const send = () => {
    if (!input.trim() || input.length > MAX_CHARS) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "me", text: input.trim(), time },
    ]);
    setInput("");

    // Show sent feedback — visibility of system status (Nielsen #1)
    showToast("Message sent.", "info");

    // Simulate reply
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
      id:       Date.now(),
      reviewer: user?.name || "Anonymous",
      rating,
      comment,
      date:     new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };
    onAddReview(sellerId, newReview);
    setShowReview(false);
    setMarkedComplete(true);
    showToast("Review submitted! Thank you for your feedback.", "success");
  };

  const charsLeft   = MAX_CHARS - input.length;
  const charsClass  = charsLeft < 50 ? (charsLeft < 0 ? "over" : "warn") : "";
  const canSend     = input.trim().length > 0 && input.length <= MAX_CHARS;

  return (
    <>
      {toast && <Toast message={toast.msg} type={toast.type} />}

      <div className="chat-wrapper">

        {/* Header */}
        <div className="chat-header">
          <button
            className="chat-back"
            onClick={onBack}
            aria-label="Back to messages inbox"
          >
            ←
          </button>
          <Avatar name={seller.name} size={36} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{seller.name}</div>
            {/* Online/status hint — real world conventions (Nielsen #2) */}
            <div style={{ fontSize: 11, color: "#8b949e" }}>
              {markedComplete ? "Deal completed" : "Tap to view profile"}
            </div>
          </div>

          {/* Mark as Purchased — only if not already done */}
          {!markedComplete ? (
            <button
              onClick={() => setShowConfirm(true)}
              aria-label="Mark this deal as complete"
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
            <span style={{
              fontSize: 12, color: "#22c55e", fontWeight: 600,
              display: "flex", alignItems: "center", gap: 4,
            }}>
              ✓ Deal Complete
            </span>
          )}
        </div>

        {/* Messages list */}
        <div
          className="chat-messages"
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
        >
          {messages.map((m) => (
            <div key={m.id} className={`message-bubble ${m.from}`}>
              {m.text}
              <div className="message-time">
                {m.time}
                {/* Sent checkmark for own messages — Nielsen #1 */}
                {m.from === "me" && (
                  <span style={{ marginLeft: 4, opacity: 0.7 }}>✓</span>
                )}
              </div>
            </div>
          ))}

          {/* Deal complete notice inside chat */}
          {markedComplete && (
            <div style={{
              textAlign: "center", fontSize: 13, color: "#8b949e",
              padding: "12px 20px", background: "#161b22",
              border: "1px solid #21262d", borderRadius: 10,
              margin: "8px auto", maxWidth: 320,
            }}
              role="status"
            >
              🎉 You marked this deal as complete
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="chat-input-area">
          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Type a message..."
              value={input}
              maxLength={MAX_CHARS + 10}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && canSend && send()}
              aria-label="Type your message"
            />
            <button
              className="btn btn-primary"
              style={{ padding: "12px 24px", opacity: canSend ? 1 : 0.5 }}
              onClick={send}
              disabled={!canSend}
              aria-label="Send message"
            >
              Send
            </button>
          </div>

          {/* Character counter + Enter hint — recognition not recall (Nielsen #6) */}
          <div className="chat-input-meta">
            <span style={{ marginRight: "auto", color: "#8b949e" }}>
              Press Enter to send
            </span>
            <span className={`char-counter ${charsClass}`}>
              {charsLeft} characters remaining
            </span>
          </div>
        </div>

        {/* Confirm purchase modal */}
        {showConfirm && (
          <div className="modal-overlay">
            <div className="modal-card" style={{ maxWidth: 380, textAlign: "center" }} role="dialog" aria-modal="true" aria-labelledby="confirm-purchase-title">
              <div className="modal-title" id="confirm-purchase-title">Mark as Purchased?</div>
              <p style={{ fontSize: 14, color: "#8b949e", marginBottom: 24, marginTop: -12, lineHeight: 1.6 }}>
                Confirm that you completed a deal with{" "}
                <strong style={{ color: "#e6edf3" }}>{seller.name}</strong>.
                You'll then be asked to leave a review.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  className="btn btn-primary btn-full"
                  onClick={() => { setShowConfirm(false); setShowReview(true); }}
                  autoFocus
                >
                  Yes, Confirm
                </button>
                <button
                  className="btn btn-ghost btn-full"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Review modal */}
        {showReview && (
          <ReviewModal
            sellerName={seller.name}
            onSubmit={handleReviewSubmit}
            onCancel={() => { setShowReview(false); setMarkedComplete(true); }}
          />
        )}
      </div>
    </>
  );
}