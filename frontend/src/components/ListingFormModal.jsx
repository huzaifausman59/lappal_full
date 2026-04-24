import { useState } from "react";

export default function ListingFormModal({ existing, onClose, onSave }) {
  const [form, setForm] = useState({
    title: existing?.title || "",
    price: existing?.price || "",
    image: existing?.image || "",
  });

  return (
    <div className="modal-overlay">
      <div className="modal-card modal-card-wide">
        <div className="modal-title">
          {existing ? "Edit Listing" : "Add New Listing"}
        </div>

        <div className="form-group">
          <label className="form-label">Laptop Title</label>
          <input
            className="form-input"
            placeholder="e.g. Dell XPS 15"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Price (USD)</label>
          <input
            className="form-input"
            type="number"
            placeholder="e.g. 1299"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />
        </div>

        <div className="form-group">
          <label className="form-label">Image URL</label>
          <input
            className="form-input"
            placeholder="https://..."
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            className="btn btn-primary btn-full"
            onClick={() => onSave(form)}
          >
            {existing ? "Save Changes" : "Add Listing"}
          </button>
          <button className="btn btn-ghost btn-full" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
