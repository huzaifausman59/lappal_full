import { useState } from "react";
import { Logo } from "../components/ui";

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handle = () => {
    if (!email || !password) return setError("Please fill in all fields.");
    setError("");
    onLogin({ email, name: email.split("@")[0], role: "buyer" });
  };

  return (
    <div className="modal-overlay" style={{ position: "fixed" }}>
      <div className="modal-card">
        <div className="modal-logo">
          <Logo />
        </div>
        <div className="modal-title">Welcome Back</div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handle()}
          />
        </div>

        {error && (
          <p style={{ color: "#f85149", fontSize: 13, marginBottom: 12 }}>
            {error}
          </p>
        )}

        <button className="btn btn-primary btn-full" onClick={handle}>
          Login
        </button>
      </div>
    </div>
  );
}
