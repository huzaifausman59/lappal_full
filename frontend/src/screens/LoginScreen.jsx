import { useState } from "react";
import { LappalLogo } from "../components/icons";

export default function LoginScreen({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);        

  const handle = async () => {                           
    if (!form.email.trim())    return setError("Please enter your email.");
    if (!form.password.trim()) return setError("Please enter your password.");
    setError("");
    setLoading(true);                                    

    try {                                                
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:    form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      // Handle validation errors array from backend
      if (data.errors && data.errors.length > 0) {
        setError(data.errors.map((e) => e.msg).join(" · "));
        return;
      }

      // Handle wrong credentials
      if (data.message && data.message !== "Login successful ") {
        setError(data.message);
        return;
      }

      // Save token to localStorage
      if (data.token) {
        localStorage.setItem("lappal_token", data.token);
        localStorage.setItem("lappal_user", JSON.stringify(data.user));
      }

      // Pass user up to App.jsx
      onLogin({
        id:       data.user.id,
        name:     data.user.username,
        email:    data.user.email,
        username: data.user.username,
        role:     "buyer",
        token:    data.token,
      });

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
        <div className="modal-title">Welcome Back</div>

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
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handle()}
          />
        </div>

        {error && (
          <p style={{ color: "#f85149", fontSize: 13, marginBottom: 12 }}>{error}</p>
        )}

        <button
          className="btn btn-primary btn-full"
          onClick={handle}
          disabled={loading}                           
        >
          {loading ? "Logging in..." : "Login"}         
        </button>
      </div>
    </div>
  );
}