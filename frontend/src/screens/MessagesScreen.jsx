import { useState, useEffect } from "react";
import { Avatar } from "../components/ui";

export default function MessagesScreen({ onOpenChat, user }) {
  const [conversations, setConversations] = useState([]);
  const [search, setSearch]               = useState("");
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");

  // Fetch real conversations from backend on mount
  useEffect(() => {
    const token = localStorage.getItem("lappal_token");

    fetch("http://localhost:3000/conversations", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setConversations(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load conversations. Please try again.");
        setLoading(false);
      });
  }, []);

  // Filter by search
  const filtered = conversations.filter((c) =>
    c.other_user_name.toLowerCase().includes(search.toLowerCase()) ||
    c.preview_text?.toLowerCase().includes(search.toLowerCase())
  );

  // Format timestamp nicely
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now  = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (days === 1) return "Yesterday";
    if (days < 7)  return date.toLocaleDateString([], { weekday: "long" });
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="page" style={{ maxWidth: 760, margin: "0 auto" }}>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 20,
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Messages</h1>
          <div style={{ fontSize: 13, color: "#8b949e", marginTop: 4 }}>
            {loading
              ? "Loading..."
              : `${conversations.length} conversation${conversations.length !== 1 ? "s" : ""}`
            }
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: 16, position: "relative" }}>
        <input
          className="form-input"
          type="search"
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search conversations"
          style={{ paddingLeft: 40 }}
        />
        <span style={{
          position: "absolute", left: 14, top: "50%",
          transform: "translateY(-50%)", color: "#8b949e",
          fontSize: 15, pointerEvents: "none",
        }}>
          🔍
        </span>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#8b949e", fontSize: 14 }}>
          Loading conversations...
        </div>
      )}

      {/* Error state */}
      {error && (
        <div style={{
          padding: "12px 16px", background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10,
          color: "#f87171", fontSize: 14, marginBottom: 16,
        }}>
          ⚠ {error}
        </div>
      )}

      {/* Empty state — no conversations at all */}
      {!loading && !error && conversations.length === 0 && (
        <div style={{
          textAlign: "center", padding: "40px 20px",
          color: "#8b949e", fontSize: 14,
        }}>
          No conversations yet. Message a seller from any listing page to get started.
        </div>
      )}

      {/* Empty search state */}
      {!loading && conversations.length > 0 && filtered.length === 0 && (
        <div style={{
          textAlign: "center", padding: "40px 20px",
          color: "#8b949e", fontSize: 14,
        }}
          role="status"
        >
          No conversations found for "{search}"
        </div>
      )}

      {/* Conversation list */}
      {!loading && filtered.length > 0 && (
        <div
          className="inbox-list"
          role="list"
          aria-label="Message conversations"
        >
          {filtered.map((c) => (
            <div
              key={c.id}
              className="inbox-item"
              role="listitem"
              onClick={() => onOpenChat(
                c.id,
                { id: c.other_user_id, name: c.other_user_name, listing_id: c.listing_id, is_buyer: c.buyer_id === user?.id }
              )}
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                onOpenChat(c.id, { id: c.other_user_id, name: c.other_user_name, listing_id: c.listing_id, is_buyer: c.buyer_id === user?.id })
              }
              aria-label={`Open conversation with ${c.other_user_name}. Last message: ${c.preview_text}`}
            >
              <Avatar name={c.other_user_name || "?"} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="inbox-name">{c.other_user_name}</div>
                <div className="inbox-preview">{c.preview_text || "No messages yet"}</div>
              </div>

              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "flex-end", gap: 6,
              }}>
                <div className="inbox-time">{formatTime(c.last_time)}</div>
                {/* Unread badge */}
                {c.unread_count > 0 && (
                  <span style={{
                    background: "#2563eb", color: "white",
                    borderRadius: "50%", width: 18, height: 18,
                    fontSize: 10, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {c.unread_count}
                  </span>
                )}
                {c.unread_count === 0 && (
                  <span style={{ color: "#8b949e", fontSize: 14 }}>›</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Helper text */}
      <p style={{
        fontSize: 12, color: "#8b949e", textAlign: "center",
        marginTop: 20, lineHeight: 1.6,
      }}>
        Messages are between you and other users. Once you complete a deal,
        you can leave a review from the chat screen.
      </p>
    </div>
  );
}