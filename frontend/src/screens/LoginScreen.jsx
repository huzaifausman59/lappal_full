import { useState } from "react";
import { LappalLogo } from "../components/icons";
import { Toast } from "../components/ui";
import { API_URL, SOCKET_URL } from "../config/api";

export default function LoginScreen({ onLogin, onSwitchToRegister }) {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [toast, setToast]     = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handle = async () => {
    if (!form.email.trim())    return setError("Please enter your email address.");
    if (!form.password.trim()) return setError("Please enter your password.");
    if (!/\S+@\S+\.\S+/.test(form.email)) return setError("Please enter a valid email address.");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (data.errors && data.errors.length > 0) {
        setError(data.errors.map((e) => e.msg).join(" · "));
        return;
      }

      if (data.message && data.message !== "Login successful ") {
        setError(data.message);
        return;
      }

      if (data.token) {
        localStorage.setItem("lappal_token", data.token);
        localStorage.setItem("lappal_user", JSON.stringify(data.user));
      }

      showToast("Login successful! Welcome back.");

      setTimeout(() => {
        onLogin({
          id:       data.user.id,
          name:     data.user.username,
          email:    data.user.email,
          username: data.user.username,
          role:     "buyer",
          token:    data.token,
        });
      }, 800);

    } catch {
      setError("Could not connect to the server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && <Toast message={toast.msg} type={toast.type} />}

      <div className="modal-overlay" style={{ position: "fixed" }}>
        <div className="modal-card" role="main" aria-labelledby="login-title">

          <div className="modal-logo">
            <LappalLogo size="sm" />
          </div>

          <h1 className="modal-title" id="login-title">Welcome Back</h1>

          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              autoComplete="email"
              onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(""); }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="form-input"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              autoComplete="current-password"
              onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handle()}
            />
          </div>

          {error && (
            <div
              role="alert"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 8, padding: "10px 14px", marginBottom: 14,
                color: "#f87171", fontSize: 13, lineHeight: 1.5,
              }}
            >
              ⚠ {error}
            </div>
          )}

          <button
            className="btn btn-primary btn-full"
            onClick={handle}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {loading && (
            <div style={{ marginTop: 10, background: "#21262d", borderRadius: 4, overflow: "hidden", height: 2 }}>
              <div style={{
                height: "100%", background: "#2563eb", borderRadius: 4,
                animation: "loadBar 1.2s ease-in-out infinite", width: "60%",
              }} />
              <style>{`@keyframes loadBar { 0%{transform:translateX(-100%)} 100%{transform:translateX(250%)} }`}</style>
            </div>
          )}

          <div className="auth-switch">
            Don't have an account?{" "}
            <span onClick={onSwitchToRegister} role="button" tabIndex={0}>
              Register here
            </span>
          </div>

        </div>
      </div>
    </>
  );
}