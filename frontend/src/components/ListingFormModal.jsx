import { useState } from "react";

const COMPANIES = [
  "Acer", "Apple", "Asus", "Chuwi", "Dell", "Fujitsu",
  "Google", "HP", "Huawei", "LG", "Lenovo", "MSI",
  "Mediacom", "Microsoft", "Razer", "Samsung", "Toshiba",
  "Vero", "Xiaomi",
];

const RAM_OPTIONS = ["4GB", "8GB", "16GB", "32GB"];

const MEMORY_OPTIONS = [
  "32GB Flash Storage", "64GB Flash Storage", "128GB Flash Storage",
  "256GB Flash Storage", "128GB SSD", "256GB SSD", "512GB SSD",
  "500GB HDD", "1TB HDD",
];

export default function ListingFormModal({ existing, onClose, onSave }) {
  const [form, setForm] = useState({
    title:            existing?.title            || "",
    brand:            existing?.brand            || "",
    price:            existing?.price            || "",
    description:      existing?.description      || "",
    main_image:       existing?.main_image       || "",
    condition_rating: existing?.condition_rating || 7,
    // specs
    cpu:     existing?.cpu     || "",
    ram:     existing?.ram     || "",
    storage: existing?.storage || "",
    gpu:     existing?.gpu     || "",
    display: existing?.display || "",
    battery: existing?.battery || "",
  });

  const [errors, setErrors] = useState({});
  const [imageUrls, setImageUrls] = useState(
  existing?.images?.map((i) => i.image_url) || [""]
  );
  const validate = () => {
    const e = {};
    if (!form.title.trim())             e.title   = "Please enter a title for the listing.";
    if (!form.brand.trim())             e.brand   = "Please select a brand.";
    if (!form.price || form.price <= 0) e.price   = "Please enter a valid price greater than 0.";
    if (!form.cpu.trim())               e.cpu     = "Please enter the CPU.";
    if (!form.ram)                      e.ram     = "Please select RAM.";
    if (!form.storage)                  e.storage = "Please select storage.";
    if (!form.gpu.trim())               e.gpu     = "Please enter the GPU.";
    return e;
  };

  const handleSave = () => {
  const e = validate();
  if (Object.keys(e).length > 0) {
    setErrors(e);
    return;
  }
  setErrors({});
  const validImages = imageUrls.filter((u) => u.trim());
  onSave({
    ...form,
    main_image: validImages[0] || form.main_image,
    images: validImages,
  });
};

  const field = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };
  // Add after the field() function (line 63)
  const addImageField    = () => setImageUrls((prev) => [...prev, ""]);
  const removeImageField = (i) => setImageUrls((prev) => prev.filter((_, idx) => idx !== i));
  const updateImageUrl   = (i, val) =>
  setImageUrls((prev) => prev.map((u, idx) => (idx === i ? val : u)));
  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="listing-form-title"
    >
      <div
        className="modal-card modal-card-wide"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <h2 className="modal-title" id="listing-form-title">
          {existing ? "Edit Listing" : "Add New Listing"}
        </h2>

        {/* ── Basic Info ─────────────────────────────────── */}

        {/* Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="listing-title">
            Laptop Title <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            id="listing-title"
            className="form-input"
            placeholder="e.g. Dell XPS 15 — 16GB RAM, 512GB SSD"
            value={form.title}
            onChange={(e) => field("title", e.target.value)}
            style={{ borderColor: errors.title ? "#ef4444" : undefined }}
          />
          {errors.title && (
            <div role="alert" style={{ color: "#f87171", fontSize: 12, marginTop: 4 }}>
              ⚠ {errors.title}
            </div>
          )}
        </div>

        {/* Brand */}
        <div className="form-group">
          <label className="form-label" htmlFor="listing-brand">
            Brand <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <select
            id="listing-brand"
            className="form-input"
            value={form.brand}
            onChange={(e) => field("brand", e.target.value)}
            style={{ borderColor: errors.brand ? "#ef4444" : undefined }}
          >
            <option value="">Select a brand</option>
            {COMPANIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.brand && (
            <div role="alert" style={{ color: "#f87171", fontSize: 12, marginTop: 4 }}>
              ⚠ {errors.brand}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="form-group">
          <label className="form-label" htmlFor="listing-price">
            Price (Rs) <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            id="listing-price"
            className="form-input"
            type="number"
            min="1"
            placeholder="e.g. 150000"
            value={form.price}
            onChange={(e) => field("price", Number(e.target.value))}
            style={{ borderColor: errors.price ? "#ef4444" : undefined }}
          />
          {errors.price && (
            <div role="alert" style={{ color: "#f87171", fontSize: 12, marginTop: 4 }}>
              ⚠ {errors.price}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label" htmlFor="listing-desc">
            Description
            <span style={{ color: "#8b949e", fontWeight: 400, marginLeft: 6, fontSize: 11 }}>
              (optional)
            </span>
          </label>
          <textarea
            id="listing-desc"
            className="form-input"
            placeholder="Describe the condition, accessories included, reason for selling..."
            value={form.description}
            rows={3}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ resize: "vertical" }}
          />
        </div>

       {/* Image URLs */}
<div className="form-group">
  <label className="form-label">
    Image URLs
    <span style={{ color: "#8b949e", fontWeight: 400, marginLeft: 6, fontSize: 11 }}>
      (optional · first image shown as main)
    </span>
  </label>
  {imageUrls.map((url, i) => (
    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
      <input
        className="form-input"
        placeholder="https://example.com/image.jpg"
        value={url}
        onChange={(e) => updateImageUrl(i, e.target.value)}
        style={{ flex: 1 }}
      />
      {imageUrls.length > 1 && (
        <button
          type="button"
          onClick={() => removeImageField(i)}
          style={{
            background: "none", border: "1px solid #ef4444",
            color: "#f87171", borderRadius: 6, padding: "0 10px",
            cursor: "pointer", fontSize: 16, flexShrink: 0,
          }}
          aria-label="Remove image"
        >
          ✕
        </button>
      )}
    </div>
  ))}
  <button
    type="button"
    onClick={addImageField}
    style={{
      fontSize: 13, color: "#2563eb", background: "none",
      border: "1px dashed #2563eb", borderRadius: 6,
      padding: "6px 12px", cursor: "pointer", width: "100%",
      fontFamily: "inherit",
    }}
  >
    + Add another image URL
  </button>
</div>

        {/* ── Specifications ─────────────────────────────── */}
        <div style={{
          borderTop: "1px solid #21262d",
          margin: "8px 0 16px",
          paddingTop: 16,
          fontSize: 12,
          color: "#8b949e",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontWeight: 600,
        }}>
          Specifications
        </div>

        {/* CPU */}
        <div className="form-group">
          <label className="form-label" htmlFor="listing-cpu">
            CPU <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            id="listing-cpu"
            className="form-input"
            placeholder="e.g. Intel Core i7-13700H"
            value={form.cpu}
            onChange={(e) => field("cpu", e.target.value)}
            style={{ borderColor: errors.cpu ? "#ef4444" : undefined }}
          />
          {errors.cpu && (
            <div role="alert" style={{ color: "#f87171", fontSize: 12, marginTop: 4 }}>
              ⚠ {errors.cpu}
            </div>
          )}
        </div>

        {/* RAM */}
        <div className="form-group">
          <label className="form-label" htmlFor="listing-ram">
            RAM <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <select
            id="listing-ram"
            className="form-input"
            value={form.ram}
            onChange={(e) => field("ram", e.target.value)}
            style={{ borderColor: errors.ram ? "#ef4444" : undefined }}
          >
            <option value="">Select RAM</option>
            {RAM_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {errors.ram && (
            <div role="alert" style={{ color: "#f87171", fontSize: 12, marginTop: 4 }}>
              ⚠ {errors.ram}
            </div>
          )}
        </div>

        {/* Storage */}
        <div className="form-group">
          <label className="form-label" htmlFor="listing-storage">
            Storage <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <select
            id="listing-storage"
            className="form-input"
            value={form.storage}
            onChange={(e) => field("storage", e.target.value)}
            style={{ borderColor: errors.storage ? "#ef4444" : undefined }}
          >
            <option value="">Select Storage</option>
            {MEMORY_OPTIONS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {errors.storage && (
            <div role="alert" style={{ color: "#f87171", fontSize: 12, marginTop: 4 }}>
              ⚠ {errors.storage}
            </div>
          )}
        </div>

        {/* GPU */}
        <div className="form-group">
          <label className="form-label" htmlFor="listing-gpu">
            GPU <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <input
            id="listing-gpu"
            className="form-input"
            placeholder="e.g. Nvidia RTX 4060"
            value={form.gpu}
            onChange={(e) => field("gpu", e.target.value)}
            style={{ borderColor: errors.gpu ? "#ef4444" : undefined }}
          />
          {errors.gpu && (
            <div role="alert" style={{ color: "#f87171", fontSize: 12, marginTop: 4 }}>
              ⚠ {errors.gpu}
            </div>
          )}
        </div>

        {/* Display */}
        <div className="form-group">
          <label className="form-label" htmlFor="listing-display">
            Display
            <span style={{ color: "#8b949e", fontWeight: 400, marginLeft: 6, fontSize: 11 }}>
              (optional)
            </span>
          </label>
          <input
            id="listing-display"
            className="form-input"
            placeholder='e.g. 15.6" FHD IPS'
            value={form.display}
            onChange={(e) => setForm({ ...form, display: e.target.value })}
          />
        </div>

        {/* Battery */}
        <div className="form-group">
          <label className="form-label" htmlFor="listing-battery">
            Battery
            <span style={{ color: "#8b949e", fontWeight: 400, marginLeft: 6, fontSize: 11 }}>
              (optional)
            </span>
          </label>
          <input
            id="listing-battery"
            className="form-input"
            placeholder="e.g. 86 Wh"
            value={form.battery}
            onChange={(e) => setForm({ ...form, battery: e.target.value })}
          />
        </div>

        {/* Condition slider */}
        <div className="form-group">
          <label className="form-label">
            Condition:{" "}
            <strong style={{ color: "#e6edf3" }}>{form.condition_rating}/10</strong>
          </label>
          <input
            type="range"
            min={4}
            max={10}
            value={form.condition_rating}
            onChange={(e) => setForm({ ...form, condition_rating: Number(e.target.value) })}
            style={{ width: "100%", accentColor: "#2563eb" }}
          />
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontSize: 11, color: "#8b949e", marginTop: 4,
          }}>
            <span>4 — Poor</span>
            <span>10 — Mint</span>
          </div>
        </div>

        <p style={{ fontSize: 11, color: "#8b949e", marginBottom: 16 }}>
          <span style={{ color: "#ef4444" }}>*</span> Required fields
        </p>

        {/* Buttons */}
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