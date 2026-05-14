import { useState } from "react";
import { Tooltip } from "../components/ui";
import { API_URL, SOCKET_URL } from "../config/api";

const COMPANIES = [
  "Acer", "Apple", "Asus", "Chuwi", "Dell", "Fujitsu",
  "Google", "HP", "Huawei", "LG", "Lenovo", "MSI",
  "Mediacom", "Microsoft", "Razer", "Samsung", "Toshiba",
  "Vero", "Xiaomi",
];

const RAM_OPTIONS    = ["4GB", "8GB", "16GB", "32GB"];
const MEMORY_OPTIONS = [
  "32GB Flash Storage", "64GB Flash Storage", "128GB Flash Storage",
  "256GB Flash Storage", "128GB SSD", "256GB SSD", "512GB SSD",
  "500GB HDD", "1TB HDD",
];

const DEFAULT_FORM = {
  Company: "", Product: "", Cpu: "", Ram: "", Memory: "", Gpu: "",
  Age_years: 5, Condition_10: 5, Battery_Health_percent: 8,
};

function SliderField({ label, name, min, max, value, unit, onChange, description, tooltipText }) {
  const pct = ((value - min) / (max - min)) * 100;

  const getColor = () => {
    if (name === "Condition_10" || name === "Battery_Health_percent") {
      if (pct >= 66) return "#22c55e";
      if (pct >= 33) return "#f59e0b";
      return "#ef4444";
    }
    if (pct <= 33) return "#22c55e";
    if (pct <= 66) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="form-group">
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 6,
      }}>
        {/* Label with optional tooltip — help in context (Nielsen #10) */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <label className="form-label" style={{ marginBottom: 0 }}>{label}</label>
          {tooltipText && <Tooltip text={tooltipText}><span /></Tooltip>}
        </div>
        {/* Live value badge — visibility of system status (Nielsen #1) */}
        <span style={{
          background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.3)",
          color: getColor(), fontSize: 13, fontWeight: 700,
          padding: "2px 10px", borderRadius: 6,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {value}{unit}
        </span>
      </div>

      {/* Description above slider — recognition not recall (Nielsen #6) */}
      {description && (
        <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 8 }}>
          {description}
        </div>
      )}

      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(name, Number(e.target.value))}
        style={{ width: "100%", accentColor: "#2563eb", height: 4, cursor: "pointer" }}
        aria-label={`${label}: ${value}${unit}`}
        aria-valuemin={min} aria-valuemax={max} aria-valuenow={value}
      />
      <div style={{
        display: "flex", justifyContent: "space-between",
        fontSize: 11, color: "#8b949e", marginTop: 4,
      }}>
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

export default function PriceEstimatorScreen({ user }) {
  const [form, setForm]       = useState(DEFAULT_FORM);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setResult(null);
    setError("");
  };

  const validate = () => {
    if (!form.Company)        return "Please select a brand.";
    if (!form.Product.trim()) return "Please enter the product name.";
    if (!form.Cpu.trim())     return "Please enter the CPU model.";
    if (!form.Ram)            return "Please select the RAM amount.";
    if (!form.Memory)         return "Please select the storage option.";
    if (!form.Gpu.trim())     return "Please enter the GPU model.";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) return setError(err);
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const token = localStorage.getItem("lappal_token");

      const res = await fetch(`${API_URL}/ai/response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          Company:             form.Company,
          Product:             form.Product,
          Cpu:                 form.Cpu,
          Ram:                 form.Ram,
          Memory:              form.Memory,
          Gpu:                 form.Gpu,
          Age_years:           form.Age_years,
          Condition_10:        form.Condition_10,
          "Battery_Health_%":  form.Battery_Health_percent,
        }),
      });

      const data = await res.json();

      if (data.errors && data.errors.length > 0) {
        setError(data.errors.map((e) => e.msg).join(" · "));
        return;
      }
      if (data.message && !data.predictedPrice) {
        setError(data.message);
        return;
      }
      if (data.predictedPrice !== undefined) {
        setResult(data.predictedPrice);
      } else {
        setError("Unexpected response from server. Please try again.");
      }

    } catch {
      setError("Could not reach the prediction API. Make sure your backend server is running at localhost:3000, then try again.");
    } finally {
      setLoading(false);
    }
  };

  const getResultLabel = (price) => {
    if (price >= 1500) return { label: "Premium",     color: "#a78bfa" };
    if (price >= 900)  return { label: "Mid-Range",   color: "#60a5fa" };
    if (price >= 400)  return { label: "Budget",      color: "#34d399" };
    return               { label: "Entry Level",  color: "#f59e0b" };
  };

  return (
    <div className="page" style={{ maxWidth: 760, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: "#2563eb",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 3 L14 9 L20 11 L14 13 L12 19 L10 13 L4 11 L10 9 Z" fill="white" opacity="0.95"/>
              <path d="M18 2 L19 5 L22 6 L19 7 L18 10 L17 7 L14 6 L17 5 Z" fill="white" opacity="0.6"/>
              <circle cx="5" cy="19" r="1.5" fill="white" opacity="0.4"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>AI Price Estimator</h1>
            <p style={{ fontSize: 13, color: "#8b949e", marginTop: 4 }}>
              Fill in your laptop's details to get an AI-powered fair market price estimate
            </p>
          </div>
        </div>

        {/* How it works — help and documentation (Nielsen #10) */}
        <div style={{
          background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.15)",
          borderRadius: 10, padding: "10px 16px",
          fontSize: 12, color: "#8b949e", lineHeight: 1.6,
        }}>
          ℹ Our AI model was trained on thousands of real laptop sales.
          Fill in all fields accurately for the best estimate.
          Results may vary ±15% based on local market conditions.
        </div>
      </div>

<div className="estimator-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
  
        {/* Left: Laptop Details */}
        <div style={{
          background: "#161b22", border: "1px solid #21262d",
          borderRadius: 14, padding: 24,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: "#8b949e",
            textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 18,
            paddingBottom: 10, borderBottom: "1px solid #21262d",
          }}>
            Laptop Details
            <span style={{ marginLeft: 8, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
              — all fields required
            </span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="est-company">Brand</label>
            <select
              id="est-company"
              className="form-input"
              value={form.Company}
              onChange={(e) => handleChange("Company", e.target.value)}
              style={{ cursor: "pointer" }}
              aria-required="true"
            >
              <option value="">Select a brand...</option>
              {COMPANIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="est-product">Product Name</label>
            <input
              id="est-product"
              className="form-input"
              placeholder="e.g. Legion Y520-15IKBN"
              value={form.Product}
              onChange={(e) => handleChange("Product", e.target.value)}
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="est-cpu">CPU</label>
            <input
              id="est-cpu"
              className="form-input"
              placeholder="e.g. Intel Core i7 7700HQ 2.8GHz"
              value={form.Cpu}
              onChange={(e) => handleChange("Cpu", e.target.value)}
              aria-required="true"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="est-ram">RAM</label>
            <select
              id="est-ram"
              className="form-input"
              value={form.Ram}
              onChange={(e) => handleChange("Ram", e.target.value)}
              style={{ cursor: "pointer" }}
              aria-required="true"
            >
              <option value="">Select RAM...</option>
              {RAM_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="est-storage">Storage</label>
            <select
              id="est-storage"
              className="form-input"
              value={form.Memory}
              onChange={(e) => handleChange("Memory", e.target.value)}
              style={{ cursor: "pointer" }}
              aria-required="true"
            >
              <option value="">Select storage...</option>
              {MEMORY_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="est-gpu">GPU</label>
            <input
              id="est-gpu"
              className="form-input"
              placeholder="e.g. Nvidia GeForce GTX 1060"
              value={form.Gpu}
              onChange={(e) => handleChange("Gpu", e.target.value)}
              aria-required="true"
            />
          </div>
        </div>

        {/* Right: Condition Sliders */}
        <div style={{
          background: "#161b22", border: "1px solid #21262d",
          borderRadius: 14, padding: 24,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: "#8b949e",
            textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 18,
            paddingBottom: 10, borderBottom: "1px solid #21262d",
          }}>
            Condition & Age
          </div>

          <SliderField
            label="Used Age"
            name="Age_years"
            min={5} max={10}
            value={form.Age_years}
            unit=" yrs"
            onChange={handleChange}
            description="How many years old is this laptop?"
            tooltipText="Older laptops generally have lower market value"
          />

          <SliderField
            label="Condition"
            name="Condition_10"
            min={0} max={5}
            value={form.Condition_10}
            unit="/5"
            onChange={handleChange}
            description="0 = heavily damaged · 3 = good used · 5 = brand new"
            tooltipText="Rate the physical and functional state of the laptop"
          />

          <SliderField
            label="Battery Health"
            name="Battery_Health_percent"
            min={0} max={10}
            value={form.Battery_Health_percent}
            unit="/10"
            onChange={handleChange}
            description="8 and above is considered healthy"
            tooltipText="Check battery health in your OS settings. Windows: Battery Report. Mac: Hold Alt + click battery icon."
          />

          {/* Summary panel — recognition not recall (Nielsen #6) */}
          <div style={{
            background: "#0d1117", border: "1px solid #21262d",
            borderRadius: 10, padding: 14, marginTop: 8,
          }}>
            <div style={{
              fontSize: 11, color: "#8b949e", marginBottom: 10,
              fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px",
            }}>
              Summary
            </div>
            {[
              ["Brand",     form.Company || "—"],
              ["RAM",       form.Ram     || "—"],
              ["Storage",   form.Memory  || "—"],
              ["Age",       `${form.Age_years} yrs`],
              ["Condition", `${form.Condition_10}/10`],
              ["Battery",   `${form.Battery_Health_percent}/10`],
            ].map(([k, v]) => (
              <div key={k} style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 13, marginBottom: 6,
              }}>
                <span style={{ color: "#8b949e" }}>{k}</span>
                <span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error — styled box with actionable message (Nielsen #9) */}
      {error && (
        <div
          role="alert"
          style={{
            marginTop: 16, padding: "12px 16px",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 10, color: "#f87171", fontSize: 14, lineHeight: 1.5,
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* Submit button */}
      <button
        className="btn btn-primary btn-full"
        style={{ marginTop: 20, fontSize: 16, padding: "14px 0", borderRadius: 12 }}
        onClick={handleSubmit}
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? "Analysing specs..." : "Get Price Estimate"}
      </button>

      {/* Loading bar — visibility of system status (Nielsen #1) */}
      {loading && (
        <div style={{
          marginTop: 12, background: "#21262d",
          borderRadius: 4, overflow: "hidden", height: 3,
        }}>
          <div style={{
            height: "100%", background: "#2563eb", borderRadius: 4,
            animation: "loadBar 1.4s ease-in-out infinite", width: "60%",
          }} />
          <style>{`@keyframes loadBar{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}}`}</style>
        </div>
      )}

      {/* Result card */}
      {result !== null && !loading && (
        <div style={{
          marginTop: 24,
          background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(37,99,235,0.04))",
          border: "1px solid rgba(37,99,235,0.3)",
          borderRadius: 16, padding: 28, textAlign: "center",
          animation: "popIn 0.3s ease",
        }}
          role="region"
          aria-label="Price estimate result"
          aria-live="polite"
        >
          <div style={{ fontSize: 13, color: "#8b949e", marginBottom: 8 }}>
            Estimated Fair Market Price
          </div>
          <div style={{
            fontSize: 48, fontWeight: 700, color: "#2563eb",
            fontFamily: "'JetBrains Mono', monospace", marginBottom: 8,
          }}>
            {Number(result).toLocaleString()} PKR
          </div>
          <div style={{
            display: "inline-block",
            background: "rgba(37,99,235,0.15)",
            border: `1px solid ${getResultLabel(result).color}`,
            color: getResultLabel(result).color,
            fontSize: 13, fontWeight: 600,
            padding: "4px 14px", borderRadius: 20, marginBottom: 16,
          }}>
            {getResultLabel(result).label}
          </div>

          {/* Disclaimer — help and documentation (Nielsen #10) */}
          <p style={{ fontSize: 13, color: "#8b949e", maxWidth: 420, margin: "0 auto", lineHeight: 1.6 }}>
            This AI estimate is based on real market data and may vary by ±15%.
            Use it as a starting guide when pricing your listing — final price
            is always set by you.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setResult(null); setForm(DEFAULT_FORM); }}
            >
              Reset & Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}