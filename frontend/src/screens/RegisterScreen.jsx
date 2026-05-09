import { useState } from "react";
import { LappalLogo } from "../components/icons";
import { Toast } from "../components/ui";

// Password strength calculator
function getPasswordStrength(pwd) {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 6)  score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score, label: "Weak",   color: "#ef4444", width: "25%" };
  if (score <= 2) return { score, label: "Fair",   color: "#f59e0b", width: "50%" };
  if (score <= 3) return { score, label: "Good",   color: "#60a5fa", width: "75%" };
  return              { score, label: "Strong", color: "#22c55e", width: "100%" };
}

export default function RegisterScreen({ onLogin, onSwitchToLogin }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [toast, setToast]     = useState(null);
  const [loading, setLoading] = useState(false);

  const pwdStrength = getPasswordStrength(form.password);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handle = async () => {
    if (!form.username.trim()) return setError("Please enter a username.");
    if (!form.email.trim())    return setError("Please enter your email address.");
    if (!/\S+@\S+\.\S+/.test(form.email)) return setError("Please enter a valid email address.");
    if (!form.password.trim()) return setError("Please enter a password.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters long.");
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

      if (data.errors && data.errors.length > 0) {
        setError(data.errors.map((e) => e.msg).join(" · "));
        return;
      }

      if (data.message === "Email already in use") {
        setError("This email is already registered. Try logging in instead.");
        return;
      }
      if (data.message === "username already exists") {
        setError("This username is taken. Please choose a different one.");
        return;
      }

      if (data.message === "User created successfully ") {
        showToast("Account created! Welcome to Lappal.");

        // Auto-generate initials from username and save to profile
        const initials = form.username.slice(0, 2).toUpperCase();

        // Login first to get the token
        const loginRes = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const loginData = await loginRes.json();

        if (loginData.token) {
          localStorage.setItem("lappal_token", loginData.token);
          localStorage.setItem("lappal_user", JSON.stringify(loginData.user));

          // Save initials immediately
          await fetch("http://localhost:3000/users/profile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${loginData.token}`,
            },
            body: JSON.stringify({
              full_name:       form.username,
              location:        "",
              avatar_initials: initials,
            }),
          });
        }

        setTimeout(() => {
          onLogin({ 
            id:       loginData.user.id,
            username: form.username, 
            email:    form.email,
            token:    loginData.token,
          });
        }, 800);
      }

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
        <div className="modal-card" role="main" aria-labelledby="register-title">

          <div className="modal-logo">
            <LappalLogo size="sm" />
          </div>

          <h1 className="modal-title" id="register-title">Create Account</h1>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              className="form-input"
              placeholder="Choose a username"
              value={form.username}
              autoComplete="username"
              onChange={(e) => { setForm({ ...form, username: e.target.value }); setError(""); }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              autoComplete="email"
              onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(""); }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">
              Password
              <span style={{ color: "#8b949e", fontWeight: 400, marginLeft: 6, fontSize: 11 }}>
                (min. 6 characters)
              </span>
            </label>
            <input
              id="reg-password"
              className="form-input"
              type="password"
              placeholder="Create a password"
              value={form.password}
              autoComplete="new-password"
              onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(""); }}
            />

            {/* Password strength indicator */}
            {form.password.length > 0 && (
              <>
                <div className="pwd-strength-bar">
                  <div
                    className="pwd-strength-fill"
                    style={{ width: pwdStrength.width, background: pwdStrength.color }}
                  />
                </div>
                <div className="pwd-strength-label" style={{ color: pwdStrength.color }}>
                  Password strength: {pwdStrength.label}
                </div>
              </>
            )}
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
            {loading ? "Creating account..." : "Register"}
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
            Already have an account?{" "}
            <span onClick={onSwitchToLogin} role="button" tabIndex={0}>
              Login here
            </span>
          </div>

        </div>
      </div>
    </>
  );
}