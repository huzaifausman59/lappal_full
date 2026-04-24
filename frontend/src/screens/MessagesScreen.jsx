import { INBOX_PREVIEWS } from "../data/listings";
import { Avatar } from "../components/ui";

export default function MessagesScreen({ onOpenChat }) {
  return (
    <div className="page">
      <div className="inbox-header">Messages</div>
      <div className="inbox-list">
        {INBOX_PREVIEWS.map((s) => (
          <div
            key={s.sellerId}
            className="inbox-item"
            onClick={() => onOpenChat(s.sellerId)}
          >
            <Avatar name={s.name} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="inbox-name">{s.name}</div>
              <div className="inbox-preview">{s.preview}</div>
            </div>
            <div className="inbox-time">{s.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
