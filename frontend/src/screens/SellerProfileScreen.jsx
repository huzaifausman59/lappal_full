import { LISTINGS, SELLERS } from "../data/listings";
import { BackButton } from "../components/ui";
import StarRating from "../components/StarRating";
import { calcRating } from "../App";

export default function SellerProfileScreen({ sellerId, onBack, onViewProduct, reviews }) {
  const seller   = SELLERS[sellerId];
  const listings = LISTINGS.filter((l) => seller.listings.includes(l.id));

  const sellerReviews = reviews?.[sellerId] || [];
  const liveRating    = sellerReviews.length > 0 ? calcRating(sellerReviews) : seller.rating;

  return (
    <div className="page">
      <BackButton onClick={onBack} />
      <div className="seller-profile-layout">

        {/* Left */}
        <div className="seller-profile-card">
          <div className="seller-profile-name">{seller.name}</div>

          <div style={{ marginBottom: 16 }}>
            {liveRating > 0
              ? <StarRating rating={liveRating} size={16} />
              : <span style={{ fontSize: 13, color: "#8b949e" }}>No reviews yet</span>
            }
            <span style={{ fontSize: 12, color: "#8b949e", marginLeft: 6 }}>
              ({sellerReviews.length} review{sellerReviews.length !== 1 ? "s" : ""})
            </span>
          </div>

          <div className="profile-row">
            <div className="profile-key">Member Since</div>
            <div className="profile-val">{seller.since}</div>
          </div>
          <div className="profile-row">
            <div className="profile-key">Location</div>
            <div className="profile-val">{seller.location}</div>
          </div>
          <div className="profile-row">
            <div className="profile-key">Total Listings</div>
            <div className="profile-val">{seller.listings.length}</div>
          </div>
          <div className="profile-row">
            <div className="profile-key">Total Sales</div>
            <div className="profile-val">{seller.totalSales} sold</div>
          </div>

          {/* Reviews */}
          <div style={{ marginTop: 20 }}>
            <div style={{
              fontSize: 11, color: "#8b949e", textTransform: "uppercase",
              letterSpacing: "0.5px", marginBottom: 12, fontWeight: 600,
            }}>
              Reviews
            </div>
            {sellerReviews.length === 0 ? (
              <p style={{ fontSize: 13, color: "#8b949e" }}>No reviews yet.</p>
            ) : (
              sellerReviews.map((r) => (
                <div key={r.id} style={{ borderTop: "1px solid #21262d", paddingTop: 12, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{r.reviewer}</span>
                    <StarRating rating={r.rating} size={12} showNumber={false} />
                  </div>
                  <div style={{ fontSize: 13, color: "#c9d1d9", lineHeight: 1.5 }}>{r.comment}</div>
                  <div style={{ fontSize: 11, color: "#8b949e", marginTop: 4 }}>{r.date}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right */}
        <div>
          <div className="seller-listings-title">{seller.name}'s Listings</div>
          <div className="seller-listings-grid">
            {listings.map((l) => (
              <div key={l.id} className="listing-card" onClick={() => onViewProduct(l.id)}>
                <img src={l.image} alt={l.title} />
                <div className="listing-card-body">
                  <div className="listing-card-title">{l.title}</div>
                  <div className="listing-price">${l.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}