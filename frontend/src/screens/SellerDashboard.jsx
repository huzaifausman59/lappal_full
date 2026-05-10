import { EmptyState, Toast, ConfirmDialog } from "../components/ui";
import { NoListingsIcon } from "../components/icons";
import ListingFormModal from "../components/ListingFormModal";
import { useState, useEffect } from "react";
import { api } from "../api";
import { API_URL, SOCKET_URL } from "../config/api";


export default function SellerDashboard({ user, onViewProduct }) {
  const [listings, setListings]         = useState([]);
  const [showAdd, setShowAdd]           = useState(false);
  const [editListing, setEditListing]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast]               = useState(null);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (user?.id) {
      api.get(`${API_URL}/users/${user.id}/listings`).then((data) => {
        setListings(data);
        setLoading(false);
      });
    }
  }, [user]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ← NEW: instead of deleting immediately, ask for confirmation first
  const confirmDelete = (listing) => {
    setDeleteTarget(listing);
  };

  const openEditListing = async (listing) => {
    try {
      const fullListing = await api.get(`${API_URL}/listings/${listing.id}`);
      setEditListing(fullListing);
    } catch (error) {
      showToast("Unable to load listing details for editing.", "error");
    }
  };

  // ← NEW: called after user confirms in the dialog
  const handleDeleteConfirmed = async () => {
    await api.delete(`${API_URL}/listings/${deleteTarget.id}`);
    setListings((prev) => prev.filter((l) => l.id !== deleteTarget.id));
    showToast(`"${deleteTarget.title}" has been removed.`, "success");
    setDeleteTarget(null);
  };

  const handleSave = async (data) => {
    const specs = [
      { key: "CPU",     value: data.cpu },
      { key: "RAM",     value: data.ram },
      { key: "Storage", value: data.storage },
      { key: "GPU",     value: data.gpu },
      { key: "Display", value: data.display },
      { key: "Battery", value: data.battery },
    ].filter((spec) => spec.value);

    if (editListing) {
      await api.put(`${API_URL}/listings/${editListing.id}`, {
        title:            data.title,
        brand:            data.brand,
        price:            data.price,
        description:      data.description,
        main_image:       data.main_image,
        condition_rating: data.condition_rating,
        specs,
        images: data.images || [],
      });
      setListings((prev) =>
        prev.map((l) => (l.id === editListing.id ? { ...l, ...data } : l))
      );
      showToast("Listing updated successfully.");
    } else {
      const result = await api.post(`${API_URL}/listings`, {
        title:            data.title,
        brand:            data.brand,
        price:            data.price,
        description:      data.description,
        main_image:       data.main_image,
        condition_rating: data.condition_rating,
        specs,
        images: data.images || [], // only send filled specs
      });
      setListings((prev) => [...prev, { ...data, id: result.listingId }]);
      showToast("New listing added successfully.");
    }
    setShowAdd(false);
    setEditListing(null);
  };

  return (
    <div className="page">

      {/* Toast notification */}
      {toast && <Toast message={toast.msg} type={toast.type} />}

      {/* Delete confirmation dialog — error prevention (Nielsen #5) */}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete Listing?"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`}
          confirmLabel="Yes, Delete"
          confirmDanger={true}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#8b949e", fontSize: 14 }}>
          Loading listings...
        </div>
      )}

      {/* Header */}
      <div className="dash-header">
        <div>
          <div className="dash-title">My Listings</div>
          {/* Live count — visibility of system status (Nielsen #1) */}
          <div style={{ fontSize: 13, color: "#8b949e", marginTop: 4 }}>
            {listings.length} active listing{listings.length !== 1 ? "s" : ""}
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAdd(true)}
          aria-label="Add a new listing"
        >
          + Add New Listing
        </button>
      </div>

      {/* Empty state */}
      {listings.length === 0 ? (
        <EmptyState
          icon={<NoListingsIcon />}
          text="No listings yet. Add your first one to start selling!"
        />
      ) : (
        <div
          className="my-listings-grid"
          role="list"
          aria-label="Your listings"
        >
          {listings.map((l) => (
            <div
              key={l.id}
              className="my-listing-card"
              role="listitem"
            >
              <img
                src={l.main_image}
                alt={l.title}
                onClick={() => onViewProduct(l.id)}
                style={{ cursor: "pointer" }}
                loading="lazy"
              />
              <div className="my-listing-body">
                {/* Title and price */}
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                  {l.title}
                </div>
                <div className="listing-price">${l.price.toLocaleString()}</div>

                {/* Actions */}
                <div className="my-listing-actions">
                  <button
                    className="btn-edit"
                    onClick={() => openEditListing(l)}
                    aria-label={`Edit ${l.title}`}
                  >
                     Edit
                  </button>
                  <button
                    className="btn-delete-card"
                    onClick={() => confirmDelete(l)}
                    aria-label={`Delete ${l.title}`}
                  >
                     Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {(showAdd || editListing) && (
        <ListingFormModal
          existing={editListing}
          onClose={() => { setShowAdd(false); setEditListing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}