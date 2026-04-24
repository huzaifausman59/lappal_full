import { useState } from "react";
import { LISTINGS } from "../data/listings";
import { EmptyState } from "../components/ui";
import { SearchEmptyIcon } from "../components/icons";

function ListingCard({ listing, onClick }) {
  return (
    <div className="listing-card" onClick={onClick}>
      <img src={listing.image} alt={listing.title} />
      <div className="listing-card-body">
        <div className="listing-card-title">{listing.title}</div>
        <div className="listing-price">${listing.price.toLocaleString()}</div>
        <div className="listing-seller">Sold by: {listing.seller}</div>
      </div>
    </div>
  );
}

export default function MarketplaceScreen({ onViewProduct }) {
  const [brands, setBrands] = useState([]);
  const [price, setPrice] = useState("all");

  const brandList = ["Dell", "ASUS", "Apple", "HP", "Lenovo"];

  const toggleBrand = (b) =>
    setBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );

  const filtered = LISTINGS.filter((l) => {
    if (brands.length && !brands.includes(l.brand)) return false;
    if (price === "under1k" && l.price >= 1000) return false;
    if (price === "1k2k" && (l.price < 1000 || l.price > 2000)) return false;
    if (price === "over2k" && l.price <= 2000) return false;
    return true;
  });

  return (
    <div className="page">
      {/* Filter Bar */}
      <div className="filter-bar">
        <span className="filter-label">Brand:</span>
        <div className="filter-section">
          {brandList.map((b) => (
            <label key={b} className="checkbox-label">
              <input
                type="checkbox"
                checked={brands.includes(b)}
                onChange={() => toggleBrand(b)}
              />
              {b}
            </label>
          ))}
        </div>
        <div className="filter-divider" />
        <span className="filter-label">Price:</span>
        <div className="filter-section">
          {[
            ["all", "All"],
            ["under1k", "Under $1K"],
            ["1k2k", "$1K – $2K"],
            ["over2k", "Over $2K"],
          ].map(([val, label]) => (
            <label key={val} className="radio-label">
              <input
                type="radio"
                name="price"
                value={val}
                checked={price === val}
                onChange={() => setPrice(val)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Listings */}
      {filtered.length === 0 ? (
        <EmptyState icon={<SearchEmptyIcon />} text="No listings match your filters." />
      ) : (
        <div className="listings-grid">
          {filtered.map((l) => (
            <ListingCard key={l.id} listing={l} onClick={() => onViewProduct(l.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
