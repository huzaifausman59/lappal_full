import { Breadcrumb } from "../components/ui";
import StarRating from "../components/StarRating";
import { useState, useEffect } from "react";
import { api } from "../api";
import { API_URL, SOCKET_URL } from "../config/api";


export default function ProductDetailScreen({
  listingId,
  onBack,
  onViewSeller,
  onMessageSeller,
  user,
}) {
  const [listing, setListing]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    api.get(`${API_URL}/listings/${listingId}`).then((data) => {
      setListing(data);
      setLoading(false);
    });
  }, [listingId]);

  if (loading) return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "#8b949e", fontSize: 14 }}>
      Loading listing...
    </div>
  );

  if (!listing) return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "#f87171", fontSize: 14 }}>
      Listing not found.
    </div>
  );

  const images  = listing.images?.length > 0
    ? listing.images.map(i => i.image_url)
    : [listing.main_image];

  const specs       = listing.specs   || [];
  const liveRating  = listing.seller_avg_rating || 0;
  const reviewCount = listing.seller_review_count || 0;

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
            src={images[activeImg]}
            alt={`${listing.title} — image ${activeImg + 1} of ${images.length}`}
          />
          <p className="img-hint">Click image to zoom · {images.length} photos</p>

          {/* Thumbnails */}
          <div className="thumbnail-row" role="list" aria-label="Product images">
            {images.map((img, i) => (
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
              {specs.map((s) => (
                <div key={s.key}>
                  <div className="spec-key">{s.key}</div>
                  <div className="spec-value">{s.value}</div>
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
                onClick={() => onViewSeller(listing.seller_id)}
                role="button"
                tabIndex={0}
                aria-label={`View ${listing.seller_name}'s profile`}
              >
                {listing.seller_name}
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
                {reviewCount} review{reviewCount !== 1 ? "s" : ""}              </div>
            </div>

            <div className="seller-info-row">
              <div className="seller-info-key">Member Since</div>
              <div className="seller-info-val">
                {listing.member_since
                  ? new Date(listing.member_since).getFullYear()
                  : "N/A"}
              </div>
            </div>

            <div className="seller-info-row" style={{ marginBottom: 18 }}>
              <div className="seller-info-key">Total Sales</div>
              <div className="seller-info-val">{listing.seller_total_sales} sold</div>
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={async () => {
                const result = await api.post("/conversations", {
                  seller_id:  listing.seller_id,
                  listing_id: listing.id,
                });
                onMessageSeller(result.conversationId, {
                  id:   listing.seller_id,
                  name: listing.seller_name,
                });
              }}
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