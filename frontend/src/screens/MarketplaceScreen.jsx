import { useState, useEffect } from "react";
import { api } from "../api";
import { EmptyState } from "../components/ui";
import { SearchEmptyIcon } from "../components/icons";

function ListingCard({ listing, onClick }) {
  return (
    <div
      className="listing-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${listing.title} for $${listing.price.toLocaleString()}`}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <img src={listing.main_image} alt={listing.title} loading="lazy" />
      <div className="listing-card-body">
        <div className="listing-card-title">{listing.title}</div>
        <div className="listing-price">Rs {listing.price.toLocaleString()}</div>
        <div className="listing-seller">Sold by: {listing.seller_name}</div>
      </div>
    </div>
  );
}

export default function MarketplaceScreen({ onViewProduct }) {
  const [allListings, setAllListings] = useState([]);
  const [brands, setBrands]           = useState([]);
  const [price, setPrice]             = useState("all");
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    api.get("/listings").then((data) => {
      setAllListings(data);
      setLoading(false);
    });
  }, []);

  const brandList = ["Dell", "Asus", "Apple", "HP", "Lenovo"];

  const toggleBrand = (b) =>
    setBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );

  const clearFilters = () => {
    setBrands([]);
    setPrice("all");
  };

 const filtered = allListings.filter((l) => {
  if (brands.length && !brands.includes(l.brand)) return false;
  if (price === "under1lac"   && l.price >= 100000)                       return false;
  if (price === "btw1and2lac" && (l.price < 100000 || l.price > 200000)) return false;
  if (price === "over2lac"    && l.price <= 200000)                       return false;
  return true;
});

  const activeFilterCount = brands.length + (price !== "all" ? 1 : 0);

  return (
    <div className="page">

      {loading && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#8b949e", fontSize: 14 }}>
          Loading listings...
        </div>
      )}

      {/* Filter Bar */}
      <div className="filter-bar" role="search" aria-label="Filter listings">
        <span className="filter-label">
          Brand:
          {brands.length > 0 && (
            <span className="filter-badge" aria-label={`${brands.length} brand filters active`}>
              {brands.length}
            </span>
          )}
        </span>
        <div className="filter-section">
          {brandList.map((b) => (
            <label key={b} className="checkbox-label">
              <input
                type="checkbox"
                checked={brands.includes(b)}
                onChange={() => toggleBrand(b)}
                aria-label={`Filter by ${b}`}
              />
              {b}
            </label>
          ))}
        </div>
        <div className="filter-divider" />
        <span className="filter-label">Price:</span>
        <div className="filter-section">
          {[
            ["all",      "All"],
            ["under1lac",  "Under Rs 1 Lac"],
            ["btw1and2lac",     "Rs 1 Lac – Rs 2 Lac"],
            ["over2lac",   "Over Rs 2 Lac"],
          ].map(([val, label]) => (
            <label key={val} className="radio-label">
              <input
                type="radio"
                name="price"
                value={val}
                checked={price === val}
                onChange={() => setPrice(val)}
                aria-label={`Price range: PKR{label}`}
              />
              {label}
            </label>
          ))}
        </div>

        {/* Clear filters button — user control & freedom (Nielsen #3) */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            style={{
              marginLeft: "auto", background: "none", border: "none",
              color: "#2563eb", fontSize: 13, fontWeight: 500,
              cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
            }}
            aria-label="Clear all filters"
          >
            Clear filters ✕
          </button>
        )}
      </div>

      {/* Results count — visibility of system status (Nielsen #1) */}
      <div className="results-count" aria-live="polite" aria-atomic="true">
        Showing <strong>{filtered.length}</strong> of <strong>{allListings.length}</strong>
        {activeFilterCount > 0 && (
          <span style={{ marginLeft: 8, color: "#2563eb", fontSize: 12 }}>
            ({activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active)
          </span>
        )}
      </div>

      {/* Listings grid or empty state */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<SearchEmptyIcon />}
          text="No listings match your filters. Try adjusting or clearing them."
        />
      ) : (
        <div
          className="listings-grid"
          role="list"
          aria-label="Available laptop listings"
        >
          {filtered.map((l) => (
            <div key={l.id} role="listitem">
              <ListingCard listing={l} onClick={() => onViewProduct(l.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}