import { useState } from "react";
import { LappalLogo } from "../components/icons";

export default function RegisterScreen({ onLogin }) {
  const [form, setForm] = useState({
    username: "",                                     
    email: "",
    password: "",
    role: "buyer"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);       

  const handle = async () => {                         
    if (!form.username.trim()) return setError("Please enter a username.");  
    if (!form.email.trim())    return setError("Please enter your email.");
    if (!form.password.trim()) return setError("Please enter a password.");
    setError("");
    setLoading(true);                                   

    try {                                               
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email:    form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      // Handle validation errors array
      if (data.errors && data.errors.length > 0) {
        setError(data.errors.map((e) => e.msg).join(" · "));
        return;
      }

      // Handle known conflicts
      if (data.message === "Email already in use") {
        setError("This email is already registered. Try logging in.");
        return;
      }
      if (data.message === "username already exists") {
        setError("This username is taken. Please choose another.");
        return;
      }

      // Success
      if (data.message === "User created successfully ") {
        onLogin({ username: form.username, email: form.email, role: form.role });
      }

    } catch (err) {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setLoading(false);                               
    }
  };

  return (
    <div className="modal-overlay" style={{ position: "fixed" }}>
      <div className="modal-card">
        <div className="modal-logo">
          <LappalLogo size="sm" />
        </div>
        <div className="modal-title">Create Account</div>

        {/* ← NEW username field */}
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            className="form-input"
            placeholder="Enter a username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
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
            placeholder="Min. 6 characters"             
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Register as</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio" name="role" value="buyer"
                checked={form.role === "buyer"}
                onChange={() => setForm({ ...form, role: "buyer" })}
              />
              Buyer
            </label>
            <label className="radio-label">
              <input
                type="radio" name="role" value="seller"
                checked={form.role === "seller"}
                onChange={() => setForm({ ...form, role: "seller" })}
              />
              Seller
            </label>
          </div>
        </div>

        {error && (
          <p style={{ color: "#f85149", fontSize: 13, marginBottom: 12 }}>{error}</p>
        )}

        <button
          className="btn btn-primary btn-full"
          onClick={handle}
          disabled={loading}                           
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </div>
    </div>
  );
}