import { useState } from "react";
import { INBOX_PREVIEWS } from "../data/listings";
import { Avatar } from "../components/ui";

export default function MessagesScreen({ onOpenChat }) {
  const [search, setSearch] = useState("");

  // Filter conversations by search — recognition not recall (Nielsen #6)
  const filtered = INBOX_PREVIEWS.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.preview.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page" style={{ maxWidth: 760, margin: "0 auto" }}>

      {/* Header row */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 20,
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>Messages</h1>
          {/* Live count — visibility of system status (Nielsen #1) */}
          <div style={{ fontSize: 13, color: "#8b949e", marginTop: 4 }}>
            {INBOX_PREVIEWS.length} conversation{INBOX_PREVIEWS.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Search bar — flexibility & efficiency (Nielsen #7) */}
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
          transform: "translateY(-50%)", color: "#8b949e", fontSize: 15,
          pointerEvents: "none",
        }}>
          🔍
        </span>
      </div>

      {/* Empty search state */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "40px 20px",
          color: "#8b949e", fontSize: 14,
        }}
          role="status"
        >
          No conversations found for "{search}"
        </div>
      ) : (
        <div
          className="inbox-list"
          role="list"
          aria-label="Message conversations"
        >
          {filtered.map((s) => (
            <div
              key={s.sellerId}
              className="inbox-item"
              role="listitem"
              onClick={() => onOpenChat(s.sellerId)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onOpenChat(s.sellerId)}
              aria-label={`Open conversation with ${s.name}. Last message: ${s.preview}`}
            >
              <Avatar name={s.name} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="inbox-name">{s.name}</div>
                <div className="inbox-preview">{s.preview}</div>
              </div>

              {/* Time + chevron — real world conventions (Nielsen #2) */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <div className="inbox-time">{s.time}</div>
                <span style={{ color: "#8b949e", fontSize: 14 }}>›</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Helper text — help and documentation (Nielsen #10) */}
      <p style={{
        fontSize: 12, color: "#8b949e", textAlign: "center",
        marginTop: 20, lineHeight: 1.6,
      }}>
        Messages are between you and sellers. Once you complete a deal,
        you can leave a review from the chat screen.
      </p>
    </div>
  );
}