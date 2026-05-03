import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { Avatar, Toast } from "../components/ui";
import ReviewModal from "../components/ReviewModal";

const MAX_CHARS = 500;
const SOCKET_URL = "http://localhost:3000";

export default function ChatScreen({
  conversationId,
  otherUser,
  onBack,
  onAddReview,
  user,
}) {
  const [messages, setMessages]             = useState([]);
  const [input, setInput]                   = useState("");
  const [showConfirm, setShowConfirm]       = useState(false);
  const [showReview, setShowReview]         = useState(false);
  const [markedComplete, setMarkedComplete] = useState(false);
  const [toast, setToast]                   = useState(null);
  const [loading, setLoading]               = useState(true);
  const messagesEndRef                      = useRef(null);
  const socketRef                           = useRef(null);

  // ── Auto scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Socket setup + fetch message history ─────────────────────────────────
  useEffect(() => {
    if (!conversationId) return;

    const token = localStorage.getItem("lappal_token");

    // 1. Fetch existing message history from REST API
    fetch(`http://localhost:3000/api/conversations/${conversationId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // Map backend shape { sender_id, body, sent_at } to local shape
        const mapped = data.map((m) => ({
          id:   m.id,
          from: m.sender_id === user?.id ? "me" : "them",
          text: m.body,
          time: new Date(m.sent_at).toLocaleTimeString([], {
            hour: "2-digit", minute: "2-digit",
          }),
        }));
        setMessages(mapped);
        setLoading(false);
      })
      .catch(() => {
        showToast("Could not load messages.", "error");
        setLoading(false);
      });

    // 2. Connect socket and join conversation room
    const socket = io(SOCKET_URL, {
      auth: { token },
    });
    socketRef.current = socket;

    socket.emit("join_conversation", conversationId);

    // 3. Listen for incoming messages from other user
    socket.on("receive_message", (message) => {
      // Only add if it's not from ourselves (REST already added ours)
      if (message.sender_id !== user?.id) {
        setMessages((prev) => [
          ...prev,
          {
            id:   message.id,
            from: "them",
            text: message.body,
            time: new Date(message.sent_at).toLocaleTimeString([], {
              hour: "2-digit", minute: "2-digit",
            }),
          },
        ]);
      }
    });

    // 4. Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [conversationId]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Send message ──────────────────────────────────────────────────────────
  const send = async () => {
    if (!input.trim() || input.length > MAX_CHARS) return;

    const token = localStorage.getItem("lappal_token");
    const text  = input.trim();
    const time  = new Date().toLocaleTimeString([], {
      hour: "2-digit", minute: "2-digit",
    });

    // Optimistically add to UI immediately
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "me", text, time },
    ]);
    setInput("");
    showToast("Message sent.", "info");

    try {
      // POST to REST — backend handles socket broadcast to other user
      await fetch(
        `http://localhost:3000/api/conversations/${conversationId}/messages`,
        {
          method:  "POST",
          headers: {
            "Content-Type":  "application/json",
            Authorization:   `Bearer ${token}`,
          },
          body: JSON.stringify({ body: text }),
        }
      );
    } catch {
      showToast("Failed to send message. Please try again.", "error");
    }
  };

  // ── Review submit ─────────────────────────────────────────────────────────
  const handleReviewSubmit = async ({ rating, comment }) => {
    const token = localStorage.getItem("lappal_token");

    try {
      await fetch("http://localhost:3000/api/reviews", {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          rating,
          comment,
        }),
      });
    } catch {
      showToast("Could not submit review. Please try again.", "error");
    }

    // Also update local state so profile page reflects it immediately
    if (onAddReview) {
      onAddReview(otherUser?.id, {
        id:       Date.now(),
        reviewer: user?.name || "Anonymous",
        rating,
        comment,
        date: new Date().toLocaleDateString("en-US", {
          month: "long", year: "numeric",
        }),
      });
    }

    setShowReview(false);
    setMarkedComplete(true);
    showToast("Review submitted! Thank you for your feedback.", "success");
  };

  // ── Mark as purchased ─────────────────────────────────────────────────────
  const handleMarkPurchased = async () => {
    const token = localStorage.getItem("lappal_token");
    setShowConfirm(false);

    try {
      await fetch("http://localhost:3000/api/deals", {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({ conversation_id: conversationId }),
      });
    } catch {
      showToast("Could not mark deal. Please try again.", "error");
      return;
    }

    setShowReview(true);
  };

  const charsLeft  = MAX_CHARS - input.length;
  const charsClass = charsLeft < 50 ? (charsLeft < 0 ? "over" : "warn") : "";
  const canSend    = input.trim().length > 0 && input.length <= MAX_CHARS;

  // ── Render ────────────────────────────────────────────────────────────────
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
          <Avatar name={otherUser?.name || "?"} size={36} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>
              {otherUser?.name || "Unknown User"}
            </div>
            <div style={{ fontSize: 11, color: "#8b949e" }}>
              {markedComplete ? "Deal completed" : "Active conversation"}
            </div>
          </div>

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

        {/* Messages */}
        <div
          className="chat-messages"
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
        >
          {/* Loading state */}
          {loading && (
            <div style={{
              textAlign: "center", color: "#8b949e",
              fontSize: 13, padding: "20px 0",
            }}>
              Loading messages...
            </div>
          )}

          {/* Message bubbles */}
          {!loading && messages.map((m) => (
            <div key={m.id} className={`message-bubble ${m.from}`}>
              {m.text}
              <div className="message-time">
                {m.time}
                {m.from === "me" && (
                  <span style={{ marginLeft: 4, opacity: 0.7 }}>✓</span>
                )}
              </div>
            </div>
          ))}

          {/* Empty state */}
          {!loading && messages.length === 0 && (
            <div style={{
              textAlign: "center", color: "#8b949e",
              fontSize: 13, padding: "40px 20px",
            }}>
              No messages yet. Say hello!
            </div>
          )}

          {/* Deal complete notice */}
          {markedComplete && (
            <div style={{
              textAlign: "center", fontSize: 13, color: "#8b949e",
              padding: "12px 20px", background: "#161b22",
              border: "1px solid #21262d", borderRadius: 10,
              margin: "8px auto", maxWidth: 320,
            }}
              role="status"
            >
               You marked this deal as complete
            </div>
          )}

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
          <div className="chat-input-meta">
            <span style={{ color: "#8b949e" }}>Press Enter to send</span>
            <span className={`char-counter ${charsClass}`}>
              {charsLeft} characters remaining
            </span>
          </div>
        </div>

        {/* Confirm purchase modal */}
        {showConfirm && (
          <div className="modal-overlay">
            <div
              className="modal-card"
              style={{ maxWidth: 380, textAlign: "center" }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-purchase-title"
            >
              <div className="modal-title" id="confirm-purchase-title">
                Mark as Purchased?
              </div>
              <p style={{
                fontSize: 14, color: "#8b949e",
                marginBottom: 24, marginTop: -12, lineHeight: 1.6,
              }}>
                Confirm that you completed a deal with{" "}
                <strong style={{ color: "#e6edf3" }}>
                  {otherUser?.name || "this seller"}
                </strong>.
                You'll then be asked to leave a review.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  className="btn btn-primary btn-full"
                  onClick={handleMarkPurchased}
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
            sellerName={otherUser?.name || "the seller"}
            onSubmit={handleReviewSubmit}
            onCancel={() => {
              setShowReview(false);
              setMarkedComplete(true);
            }}
          />
        )}
      </div>
    </>
  );
}