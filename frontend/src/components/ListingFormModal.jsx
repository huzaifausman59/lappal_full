import { useState } from "react";

export default function ListingFormModal({ existing, onClose, onSave }) {
  const [form, setForm] = useState({
    title: existing?.title || "",
    price: existing?.price || "",
    image: existing?.image || "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim())        e.title = "Please enter a title for the listing.";
    if (!form.price || form.price <= 0) e.price = "Please enter a valid price greater than 0.";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    onSave(form);
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="listing-form-title"
    >
      <div className="modal-card modal-card-wide">
        <h2
          className="modal-title"
          id="listing-form-title"
        >
          {existing ? "Edit Listing" : "Add New Listing"}
        </h2>

        {/* Title field */}
        <div className="form-group">
          <label className="form-label" htmlFor="listing-title">
            Laptop Title
            <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>
          </label>
          <input
            id="listing-title"
            className="form-input"
            placeholder="e.g. Dell XPS 15 — 16GB RAM, 512GB SSD"
            value={form.title}
            onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: "" }); }}
            aria-required="true"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? "title-error" : undefined}
            style={{ borderColor: errors.title ? "#ef4444" : undefined }}
          />
          {errors.title && (
            <div id="title-error" role="alert" style={{ color: "#f87171", fontSize: 12, marginTop: 4 }}>
              ⚠ {errors.title}
            </div>
          )}
        </div>

        {/* Price field */}
        <div className="form-group">
          <label className="form-label" htmlFor="listing-price">
            Price (USD)
            <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>
          </label>
          <input
            id="listing-price"
            className="form-input"
            type="number"
            min="1"
            placeholder="e.g. 1299"
            value={form.price}
            onChange={(e) => { setForm({ ...form, price: Number(e.target.value) }); setErrors({ ...errors, price: "" }); }}
            aria-required="true"
            aria-invalid={!!errors.price}
            aria-describedby={errors.price ? "price-error" : undefined}
            style={{ borderColor: errors.price ? "#ef4444" : undefined }}
          />
          {errors.price && (
            <div id="price-error" role="alert" style={{ color: "#f87171", fontSize: 12, marginTop: 4 }}>
              ⚠ {errors.price}
            </div>
          )}
        </div>

        {/* Image URL field — optional */}
        <div className="form-group">
          <label className="form-label" htmlFor="listing-image">
            Image URL
            <span style={{ color: "#8b949e", fontWeight: 400, marginLeft: 6, fontSize: 11 }}>
              (optional)
            </span>
          </label>
          <input
            id="listing-image"
            className="form-input"
            placeholder="https://..."
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
        </div>

        {/* Required field note */}
        <p style={{ fontSize: 11, color: "#8b949e", marginBottom: 16 }}>
          <span style={{ color: "#ef4444" }}>*</span> Required fields
        </p>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            className="btn btn-primary btn-full"
            onClick={handleSave}
            autoFocus
          >
            {existing ? "Save Changes" : "Add Listing"}
          </button>
          <button
            className="btn btn-ghost btn-full"
            onClick={onClose}
            aria-label="Cancel and close without saving"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}