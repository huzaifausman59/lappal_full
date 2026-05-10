import { Breadcrumb } from "../components/ui";
import StarRating from "../components/StarRating";
import { useState, useEffect } from "react";
import { api } from "../api";
import { API_URL, SOCKET_URL } from "../config/api";

export default function SellerProfileScreen({ sellerId, onBack, onViewProduct }) {
  const [seller, setSeller]     = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get(`${API_URL}/users/${sellerId}`).then((data) => {
      setSeller(data);
      setLoading(false);
    });
    api.get(`${API_URL}/users/${sellerId}/listings`).then(setListings);
  }, [sellerId]);

  if (loading || !seller) return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "#8b949e", fontSize: 14 }}>
      Loading seller profile...
    </div>
  );

  const sellerReviews = seller.reviews || [];
  const liveRating    = seller.avg_rating || 0;

  return (
    <div className="page">

      {/* Breadcrumb — recognition not recall (Nielsen #6) */}
      <Breadcrumb
        crumbs={[
          { label: "Marketplace", onClick: onBack },
          { label: seller.name },
        ]}
      />

      <div className="seller-profile-layout">

        {/* Left: seller info + reviews */}
        <div className="seller-profile-card">

          {/* Seller name and rating at top — visible immediately */}
          <div className="seller-profile-name">{seller.username || seller.full_name}</div>
          {/* Live rating — visibility of system status (Nielsen #1) */}
          <div style={{ marginBottom: 16 }}>
            {liveRating > 0
              ? <StarRating rating={liveRating} size={16} />
              : <span style={{ fontSize: 13, color: "#8b949e" }}>No reviews yet</span>
            }
            <span style={{ fontSize: 12, color: "#8b949e", marginLeft: 6 }}>
              ({sellerReviews.length} review{sellerReviews.length !== 1 ? "s" : ""})
            </span>
          </div>

          {/* Seller details */}
          <div className="profile-row">
            <div className="profile-key">Member Since</div>
            <div className="profile-val">{new Date(seller.joined_at).getFullYear()}</div>
          </div>
          <div className="profile-row">
            <div className="profile-key">Location</div>
            <div className="profile-val">{seller.location || "N/A"}</div>
          </div>
          <div className="profile-row">
            <div className="profile-key">Total Listings</div>
            <div className="profile-val">{listings.length}</div>
          </div>
          <div className="profile-row">
            <div className="profile-key">Total Sales</div>
            <div className="profile-val">{seller.total_sales} sold</div>
          </div>

          {/* Trust indicator — real world conventions (Nielsen #2) */}
          <div style={{
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 8, padding: "10px 14px",
            marginTop: 4, marginBottom: 20,
          }}>
            <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 600, marginBottom: 2 }}>
              ✓ Verified Seller
            </div>
            <div style={{ fontSize: 11, color: "#8b949e", lineHeight: 1.5 }}>
              This seller has completed {seller.total_sales} transactions on Lappal.
            </div>
          </div>

          {/* Reviews section */}
          <div style={{
            fontSize: 11, color: "#8b949e", textTransform: "uppercase",
            letterSpacing: "0.5px", marginBottom: 12, fontWeight: 600,
          }}>
            Reviews
            <span style={{ marginLeft: 6, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
              ({sellerReviews.length})
            </span>
          </div>

          {sellerReviews.length === 0 ? (
            <p style={{ fontSize: 13, color: "#8b949e", lineHeight: 1.6 }}>
              No reviews yet. Be the first to review this seller after completing a purchase.
            </p>
          ) : (
            <div role="list" aria-label="Seller reviews">
              {sellerReviews.map((r) => (
                <div
                  key={r.id}
                  role="listitem"
                  style={{
                    borderTop: "1px solid #21262d",
                    paddingTop: 12, marginBottom: 12,
                  }}
                >
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", marginBottom: 4,
                  }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{r.reviewer}</span>
                    <StarRating rating={r.rating} size={12} showNumber={false} />
                  </div>
                  <div style={{ fontSize: 13, color: "#c9d1d9", lineHeight: 1.5 }}>
                    {r.comment}
                  </div>
                  <div style={{ fontSize: 11, color: "#8b949e", marginTop: 4 }}>
                    {new Date(r.reviewed_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: listings */}
        <div>
          <div
            className="seller-listings-title"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <span>{seller.username}'s Listings</span>
            {/* Count — visibility of system status (Nielsen #1) */}
            <span style={{ fontSize: 13, color: "#8b949e", fontWeight: 400 }}>
              {listings.length} listing{listings.length !== 1 ? "s" : ""}
            </span>
          </div>

          {listings.length === 0 ? (
            <p style={{ fontSize: 14, color: "#8b949e", marginTop: 12 }}>
              This seller has no active listings right now.
            </p>
          ) : (
            <div
              className="seller-listings-grid"
              role="list"
              aria-label={`${seller.name}'s listings`}
            >
              {listings.map((l) => (
                <div
                  key={l.id}
                  className="listing-card"
                  role="listitem"
                  onClick={() => onViewProduct(l.id)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && onViewProduct(l.id)}
                  aria-label={`View ${l.title} for $${l.price.toLocaleString()}`}
                >
                  <img src={l.main_image} alt={l.title} loading="lazy" />
                  <div className="listing-card-body">
                    <div className="listing-card-title">{l.title}</div>
                    <div className="listing-price">Rs {l.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}