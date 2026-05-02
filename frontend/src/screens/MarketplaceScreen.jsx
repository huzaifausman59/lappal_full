import { useState } from "react";
import { LISTINGS } from "../data/listings";
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
      <img src={listing.image} alt={listing.title} loading="lazy" />
      <div className="listing-card-body">
        <div className="listing-card-title">{listing.title}</div>
        <div className="listing-price">Rs {listing.price.toLocaleString()}</div>
        <div className="listing-seller">Sold by: {listing.seller}</div>
      </div>
    </div>
  );
}

export default function MarketplaceScreen({ onViewProduct }) {
  const [brands, setBrands] = useState([]);
  const [price, setPrice]   = useState("all");

  const brandList = ["Dell", "ASUS", "Apple", "HP", "Lenovo"];

  const toggleBrand = (b) =>
    setBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );

  const clearFilters = () => {
    setBrands([]);
    setPrice("all");
  };

  const filtered = LISTINGS.filter((l) => {
    if (brands.length && !brands.includes(l.brand)) return false;
    if (price === "under1k" && l.price >= 1000)              return false;
    if (price === "1k2k" && (l.price < 1000 || l.price > 2000)) return false;
    if (price === "over2k" && l.price <= 2000)               return false;
    return true;
  });

  const activeFilterCount = brands.length + (price !== "all" ? 1 : 0);

  return (
    <div className="page">

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
            ["under1k",  "Under Rs 1K"],
            ["1k2k",     "Rs 1K – Rs 2K"],
            ["over2k",   "Over Rs 2K"],
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
        Showing <strong>{filtered.length}</strong> of <strong>{LISTINGS.length}</strong> listings
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