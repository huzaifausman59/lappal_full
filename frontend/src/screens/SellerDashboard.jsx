import { useState } from "react";
import { LISTINGS } from "../data/listings";
import { EmptyState, Toast } from "../components/ui";
import ListingFormModal from "../components/ListingFormModal";
import { NoListingsIcon } from "../components/icons";


export default function SellerDashboard({ user, onViewProduct }) {
  const [listings, setListings] = useState(
    LISTINGS.filter((l) => l.seller === "TechStore Pro")
  );
  const [showAdd, setShowAdd] = useState(false);
  const [editListing, setEditListing] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const deleteListing = (id) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
    showToast("Listing deleted.");
  };

  const handleSave = (data) => {
    if (editListing) {
      setListings((prev) =>
        prev.map((l) => (l.id === editListing.id ? { ...l, ...data } : l))
      );
      showToast("Listing updated!");
    } else {
      setListings((prev) => [
        ...prev,
        { ...LISTINGS[0], ...data, id: Date.now(), seller: user.name },
      ]);
      showToast("Listing added!");
    }
    setShowAdd(false);
    setEditListing(null);
  };

  return (
    <div className="page">
      {toast && <Toast message={toast} />}

      <div className="dash-header">
        <div className="dash-title">My Listings</div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          + Add New Listing
        </button>
      </div>

      {listings.length === 0 ? (
        <EmptyState icon={<NoListingsIcon />} text="No listings yet. Add your first one!" />
      ) : (
        <div className="my-listings-grid">
          {listings.map((l) => (
            <div key={l.id} className="my-listing-card">
              <img
                src={l.image}
                alt={l.title}
                onClick={() => onViewProduct(l.id)}
                style={{ cursor: "pointer" }}
              />
              <div className="my-listing-body">
                <div className="listing-price">${l.price.toLocaleString()}</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                  {l.title}
                </div>
                <div className="my-listing-actions">
                  <button
                    className="btn-edit"
                    onClick={() => setEditListing(l)}
                  >
                     Edit
                  </button>
                  <button
                    className="btn-delete-card"
                    onClick={() => deleteListing(l.id)}
                  >
                     Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showAdd || editListing) && (
        <ListingFormModal
          existing={editListing}
          onClose={() => {
            setShowAdd(false);
            setEditListing(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
