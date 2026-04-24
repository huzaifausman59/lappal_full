import { useState } from "react";
import { Logo } from "../components/ui";

export default function RegisterScreen({ onLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [error, setError] = useState("");

  const handle = () => {
    if (!form.name || !form.email || !form.password)
      return setError("Please fill in all fields.");
    setError("");
    onLogin(form);
  };

  return (
    <div className="modal-overlay" style={{ position: "fixed" }}>
      <div className="modal-card">
        <div className="modal-logo">
          <Logo />
        </div>
        <div className="modal-title">Create Account</div>

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            className="form-input"
            placeholder="Enter your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-input"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Register as</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="role"
                value="buyer"
                checked={form.role === "buyer"}
                onChange={() => setForm({ ...form, role: "buyer" })}
              />
              Buyer
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="role"
                value="seller"
                checked={form.role === "seller"}
                onChange={() => setForm({ ...form, role: "seller" })}
              />
              Seller
            </label>
          </div>
        </div>

        {error && (
          <p style={{ color: "#f85149", fontSize: 13, marginBottom: 12 }}>
            {error}
          </p>
        )}

        <button className="btn btn-primary btn-full" onClick={handle}>
          Register
        </button>
      </div>
    </div>
  );
}
