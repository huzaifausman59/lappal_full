import StarRating from "../components/StarRating";
import { BackButton, Toast } from "../components/ui";
import { useState, useEffect } from "react";
import { api } from "../api";

export default function ProfileScreen({ onBack, onViewProduct, onNavigate, user }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [profile, setProfile]             = useState(null);
  const [myListings, setMyListings]       = useState([]);
  const [myReviews, setMyReviews]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [toast, setToast]                 = useState(null);

  useEffect(() => {
    api.get("/users/profile").then((data) => {
      setProfile(data);
      setLoading(false);
    });

    if (user?.id) {
      api.get(`/users/${user.id}/listings`).then(setMyListings);
      api.get(`/users/${user.id}`).then((data) => {
        setMyReviews(data.reviews || []);
      });
    }
  }, [user]);

  if (loading || !profile) return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "#8b949e", fontSize: 14 }}>
      Loading profile...
    </div>
  );

  const liveRating = profile.avg_rating || 0;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="page" style={{ maxWidth: 680, margin: "0 auto" }}>

      {toast && <Toast message={toast.msg} type={toast.type} />}

      {onBack && <BackButton onClick={onBack} label="Marketplace" />}

      {/* ── User Info ── */}
      <section className="profile-section" aria-labelledby="user-info-label">
        <div className="profile-section-label" id="user-info-label">User Info</div>
        <div className="profile-user-card">
          {/* Avatar with initials */}
          <div
            className="profile-avatar"
            aria-label={`Avatar for ${profile.name}`}
            title={profile.name}
          >
            {profile.avatar_initials}
          </div>

          <div className="profile-name">{profile.full_name || profile.username}</div>
          <div className="profile-meta">
            <span style={{ color: "#2563eb" }}>📍</span>{" "}
            {profile.location || "Unknown"} · Joined {new Date(profile.joined_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </div>

          {/* Rating shown on user card — recognition not recall (Nielsen #6) */}
          {liveRating > 0 && (
            <div style={{ marginTop: 10 }}>
              <StarRating rating={liveRating} size={14} />
            </div>
          )}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="profile-section" aria-labelledby="stats-label">
        <div className="profile-section-label" id="stats-label">Stats</div>
        <div className="profile-stats-row" role="list">
          <div className="profile-stat" role="listitem">
            <div className="profile-stat-value">{myListings.length}</div>
            <div className="profile-stat-label">Listings</div>
          </div>
          <div className="profile-stat-divider" aria-hidden="true" />
          <div className="profile-stat" role="listitem">
            <div className="profile-stat-value">{profile.total_sales}</div>
            <div className="profile-stat-label">Sales</div>
          </div>
          <div className="profile-stat-divider" aria-hidden="true" />
          <div className="profile-stat" role="listitem">
            <div
              className="profile-stat-value"
              style={{ color: "#f59e0b" }}
              aria-label={`Rating: ${liveRating > 0 ? liveRating : "Not rated yet"}`}
            >
              {liveRating > 0 ? `${liveRating}★` : "—"}
            </div>
            <div className="profile-stat-label">Rating</div>
          </div>
        </div>
      </section>

      {/* ── Edit Profile ── */}
      <button
        className="btn btn-ghost btn-full"
        style={{ marginBottom: 24 }}
        onClick={() => setShowEditModal(true)}
        aria-label="Edit your profile information"
      >
        Edit Profile
      </button>

      {/* ── My Listings ── */}
      <section className="profile-section" aria-labelledby="listings-label">
        <div
          className="profile-section-label"
          id="listings-label"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span>My Listings</span>
          <span style={{ fontWeight: 400, color: "#8b949e", fontSize: 11 }}>
            {myListings.length} listing{myListings.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="profile-listings-grid" role="list">
          {myListings.map((l) => (
            <div
              key={l.id}
              className="profile-listing-card"
              role="listitem"
              onClick={() => onViewProduct?.(l.id)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onViewProduct?.(l.id)}
              aria-label={`View listing: ${l.title} at $${l.price.toLocaleString()}`}
            >
              <img src={l.main_image} alt={l.title} loading="lazy" />
              <div className="profile-listing-body">
                <div className="profile-listing-title">{l.title}</div>
                <div className="profile-listing-price">Rs {l.price.toLocaleString()}</div>
              </div>
            </div>
          ))}

          {/* Add new listing tile */}
          <div
            className="profile-listing-card profile-add-tile"
            onClick={() => onNavigate("dashboard")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onNavigate("dashboard")}
            aria-label="Add a new listing"
          >
            <span style={{ fontSize: 22, color: "#2563eb", marginBottom: 4 }}>+</span>
            <span style={{ fontSize: 13, color: "#8b949e" }}>Add new listing</span>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="profile-section" aria-labelledby="reviews-label">
        <div
          className="profile-section-label"
          id="reviews-label"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span>Reviews</span>
          <span style={{ fontWeight: 400, color: "#8b949e", fontSize: 11 }}>
            {myReviews.length} review{myReviews.length !== 1 ? "s" : ""}
          </span>
        </div>

        {myReviews.length === 0 ? (
          <div style={{
            fontSize: 13, color: "#8b949e", padding: "16px 0", lineHeight: 1.6,
          }}
            role="status"
          >
            No reviews yet. Complete a deal in the chat screen to receive your first review!
          </div>
        ) : (
          <div className="profile-reviews-list" role="list" aria-label="Your reviews">
            {myReviews.map((r) => (
              <div
                key={r.id}
                className="profile-review-item"
                role="listitem"
              >
                <div className="profile-review-header">
                  <span className="profile-review-name">{r.reviewer}</span>
                  <StarRating rating={r.rating} size={13} showNumber={false} />
                </div>
                <div className="profile-review-comment">{r.comment}</div>
                <div className="profile-review-date">
                  {new Date(r.reviewed_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSave={async (updated) => {
            await api.put("/users/profile", {
              full_name:       updated.name,
              location:        updated.location,
              avatar_initials: updated.initials,
            });
            setProfile((prev) => ({
              ...prev,
              full_name:       updated.name,
              location:        updated.location,
              avatar_initials: updated.initials,
            }));
            setShowEditModal(false);
            showToast("Profile updated successfully.");
          }}
        />
      )}
    </div>
  );
}

// ── Edit Profile Modal ────────────────────────────────────────────────────────
function EditProfileModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState({
    name:     profile.full_name || profile.username || "",
    location: profile.location  || "",
    initials: profile.avatar_initials || "",
  });
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!form.name.trim())     return setError("Name cannot be empty.");
    if (!form.location.trim()) return setError("Location cannot be empty.");
    if (!form.initials.trim()) return setError("Initials cannot be empty.");
    setError("");
    onSave(form);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
      <div className="modal-card">
        <div className="modal-title" id="edit-profile-title">Edit Profile</div>

        <div className="form-group">
          <label className="form-label" htmlFor="edit-name">Full Name</label>
          <input
            id="edit-name"
            className="form-input"
            value={form.name}
            onChange={(e) => { setForm({ ...form, name: e.target.value }); setError(""); }}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="edit-location">Location</label>
          <input
            id="edit-location"
            className="form-input"
            value={form.location}
            onChange={(e) => { setForm({ ...form, location: e.target.value }); setError(""); }}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="edit-initials">
            Avatar Initials
            <span style={{ color: "#8b949e", fontWeight: 400, marginLeft: 6, fontSize: 11 }}>
              (max 2 characters)
            </span>
          </label>
          <input
            id="edit-initials"
            className="form-input"
            maxLength={2}
            value={form.initials}
            onChange={(e) => { setForm({ ...form, initials: e.target.value.toUpperCase() }); setError(""); }}
          />
        </div>

        {/* Inline error — error recovery (Nielsen #9) */}
        {error && (
          <div
            role="alert"
            style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8, padding: "10px 14px", marginBottom: 14,
              color: "#f87171", fontSize: 13,
            }}
          >
            ⚠ {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            className="btn btn-primary btn-full"
            onClick={handleSave}
            autoFocus
          >
            Save Changes
          </button>
          <button
            className="btn btn-ghost btn-full"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>

        {/* Undo hint — user control & freedom (Nielsen #3) */}
        <p style={{ fontSize: 11, color: "#8b949e", textAlign: "center", marginTop: 12 }}>
          You can edit your profile at any time from the Profile page.
        </p>
      </div>
    </div>
  );
}