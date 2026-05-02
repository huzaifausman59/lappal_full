import { useState } from "react";
import { LISTINGS, SELLERS } from "../data/listings";
import { Breadcrumb } from "../components/ui";
import StarRating from "../components/StarRating";
import { calcRating } from "../App";

export default function ProductDetailScreen({
  listingId,
  onBack,
  onViewSeller,
  onMessageSeller,
  reviews,
}) {
  const listing = LISTINGS.find((l) => l.id === listingId);
  const seller  = SELLERS[listing?.sellerId];
  const [activeImg, setActiveImg] = useState(0);

  if (!listing || !seller) return null;

  const sellerReviews = reviews?.[listing.sellerId] || [];
  const liveRating    = sellerReviews.length > 0
    ? calcRating(sellerReviews)
    : seller.rating;

  return (
    <div className="page">

      {/* Breadcrumb — recognition rather than recall (Nielsen #6) */}
      <Breadcrumb
        crumbs={[
          { label: " ⬅ Marketplace", onClick: onBack },
          { label: listing.title },
        ]}
      />

      <div className="product-layout">

        {/* Left: Images + Specs */}
        <div>
          {/* Main image with zoom hint — affordance (Norman) */}
          <img
            className="product-main-img"
            src={listing.images[activeImg]}
            alt={`${listing.title} — image ${activeImg + 1} of ${listing.images.length}`}
          />
          <p className="img-hint">Click image to zoom · {listing.images.length} photos</p>

          {/* Thumbnails */}
          <div className="thumbnail-row" role="list" aria-label="Product images">
            {listing.images.map((img, i) => (
              <img
                key={i}
                role="listitem"
                className={`thumbnail ${activeImg === i ? "active" : ""}`}
                src={img}
                alt={`${listing.title} photo ${i + 1}`}
                onClick={() => setActiveImg(i)}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setActiveImg(i)}
                aria-label={`View photo ${i + 1}`}
                aria-pressed={activeImg === i}
              />
            ))}
          </div>

          {/* Specifications */}
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

        {/* Right: Info + Seller */}
        <div className="product-side">
          <div className="product-info-card">
            <div className="product-title">{listing.title}</div>
            <div className="product-price">Rs {listing.price.toLocaleString()}</div>
            <div className="product-desc-label">Description</div>
            <div className="product-desc">{listing.description}</div>
          </div>

          {/* Seller Info Card */}
          <div className="seller-info-card">
            <div className="seller-info-title">Seller Information</div>

            <div className="seller-info-row">
              <div className="seller-info-key">Seller</div>
              <div
                className="seller-info-val seller-link"
                onClick={() => onViewSeller(listing.sellerId)}
                role="button"
                tabIndex={0}
                aria-label={`View ${listing.seller}'s profile`}
              >
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
              <div className="seller-info-val">
                {sellerReviews.length} review{sellerReviews.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="seller-info-row">
              <div className="seller-info-key">Member Since</div>
              <div className="seller-info-val">{seller.since}</div>
            </div>

            <div className="seller-info-row" style={{ marginBottom: 18 }}>
              <div className="seller-info-key">Total Sales</div>
              <div className="seller-info-val">{seller.totalSales} sold</div>
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={() => onMessageSeller(listing.sellerId)}
              aria-label={`Send a message to ${listing.seller}`}
            >
              Message Seller
            </button>

            {/* Reassurance text below button — helps user decision (Norman) */}
            <p style={{
              fontSize: 11, color: "#8b949e", textAlign: "center",
              marginTop: 10, lineHeight: 1.5,
            }}>
              You'll be able to negotiate and arrange pickup via messages
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}