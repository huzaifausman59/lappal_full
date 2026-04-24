import { useState } from "react";
import { LISTINGS, SELLERS } from "../data/listings";
import { BackButton } from "../components/ui";
import StarRating from "../components/StarRating";
import { calcRating } from "../App";

export default function ProductDetailScreen({
  listingId, onBack, onViewSeller, onMessageSeller, reviews,
}) {
  const listing = LISTINGS.find((l) => l.id === listingId);
  const seller  = SELLERS[listing?.sellerId];
  const [activeImg, setActiveImg] = useState(0);

  if (!listing || !seller) return null;

  const sellerReviews = reviews?.[listing.sellerId] || [];
  const liveRating    = sellerReviews.length > 0 ? calcRating(sellerReviews) : seller.rating;

  return (
    <div className="page">
      <BackButton onClick={onBack} />
      <div className="product-layout">

        {/* Left */}
        <div>
          <img className="product-main-img" src={listing.images[activeImg]} alt={listing.title} />
          <div className="thumbnail-row">
            {listing.images.map((img, i) => (
              <img
                key={i}
                className={`thumbnail ${activeImg === i ? "active" : ""}`}
                src={img} alt=""
                onClick={() => setActiveImg(i)}
              />
            ))}
          </div>
          <div className="specs-section">
            <div className="specs-title">Specifications</div>
            <div className="specs-grid">
              {Object.entries(listing.specs).map(([k, v]) => (
                <div key={k}>
                  <div className="spec-key">{k}</div>
                  <div className="spec-value">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="product-side">
          <div className="product-info-card">
            <div className="product-title">{listing.title}</div>
            <div className="product-price">${listing.price.toLocaleString()}</div>
            <div className="product-desc-label">Description</div>
            <div className="product-desc">{listing.description}</div>
          </div>

          <div className="seller-info-card">
            <div className="seller-info-title">Seller Information</div>
            <div className="seller-info-row">
              <div className="seller-info-key">Seller</div>
              <div className="seller-info-val seller-link" onClick={() => onViewSeller(listing.sellerId)}>
                {listing.seller}
              </div>
            </div>
            <div className="seller-info-row">
              <div className="seller-info-key">Rating</div>
              <div className="seller-info-val">
                {liveRating > 0
                  ? <StarRating rating={liveRating} size={14} />
                  : <span style={{ color: "#8b949e", fontSize: 13 }}>No reviews yet</span>
                }
              </div>
            </div>
            <div className="seller-info-row">
              <div className="seller-info-key">Reviews</div>
              <div className="seller-info-val">{sellerReviews.length} reviews</div>
            </div>
            <div className="seller-info-row">
              <div className="seller-info-key">Member Since</div>
              <div className="seller-info-val">{seller.since}</div>
            </div>
            <div className="seller-info-row" style={{ marginBottom: 18 }}>
              <div className="seller-info-key">Total Sales</div>
              <div className="seller-info-val">{seller.totalSales} sold</div>
            </div>
            <button className="btn btn-primary btn-full" onClick={() => onMessageSeller(listing.sellerId)}>
              Message Seller
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}