import { useState } from "react";

const COMPANIES = [
  "Acer", "Apple", "Asus", "Chuwi", "Dell", "Fujitsu",
  "Google", "HP", "Huawei", "LG", "Lenovo", "MSI",
  "Mediacom", "Microsoft", "Razer", "Samsung", "Toshiba",
  "Vero", "Xiaomi",
];

const RAM_OPTIONS = ["2GB", "4GB", "6GB", "8GB", "12GB", "16GB", "24GB", "32GB", "64GB"];

const DEFAULT_FORM = {
  Company: "",
  Product: "",
  Cpu: "",
  Ram: "",
  Memory: "",
  Gpu: "",
  Age_years: 3,
  Condition_10: 7,
  Battery_Health_percent: 80,
};

// Helper to render a slider with a live value badge
function SliderField({ label, name, min, max, value, unit, onChange, description }) {
  const pct = ((value - min) / (max - min)) * 100;

  const getColor = () => {
    if (name === "Condition_10" || name === "Battery_Health_percent") {
      if (pct >= 66) return "#22c55e";
      if (pct >= 33) return "#f59e0b";
      return "#ef4444";
    }
    // Age — lower is better
    if (pct <= 33) return "#22c55e";
    if (pct <= 66) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="form-group">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <label className="form-label" style={{ marginBottom: 0 }}>{label}</label>
        <span style={{
          background: "rgba(37,99,235,0.15)",
          border: "1px solid rgba(37,99,235,0.3)",
          color: getColor(),
          fontSize: 13, fontWeight: 700,
          padding: "2px 10px", borderRadius: 6,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {value}{unit}
        </span>
      </div>
      {description && (
        <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 8 }}>{description}</div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(name, Number(e.target.value))}
        style={{
          width: "100%", accentColor: "#2563eb",
          height: 4, cursor: "pointer",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8b949e", marginTop: 4 }}>
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

export default function PriceEstimatorScreen() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setResult(null);
    setError("");
  };

  const validate = () => {
    if (!form.Company) return "Please select a company.";
    if (!form.Product.trim()) return "Please enter the product name.";
    if (!form.Cpu.trim()) return "Please enter the CPU.";
    if (!form.Ram) return "Please select RAM.";
    if (!form.Memory.trim()) return "Please enter the storage.";
    if (!form.Gpu.trim()) return "Please enter the GPU.";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) return setError(err);
    setError("");
    setLoading(true);
    setResult(null);

    try {
      // Mock response for now 
      await new Promise((r) => setTimeout(r, 1400));
      const base = 800;
      const mock =
        base +
        (form.Condition_10 / 10) * 600 +
        (form.Battery_Health_percent / 100) * 200 -
        form.Age_years * 60 +
        (form.Ram === "32GB" ? 300 : form.Ram === "16GB" ? 150 : form.Ram === "8GB" ? 50 : 0);
      setResult(Math.max(100, Math.round(mock)));
    } catch {
      setError("Could not reach the prediction API. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getResultLabel = (price) => {
    if (price >= 1500) return { label: "Premium", color: "#a78bfa" };
    if (price >= 900)  return { label: "Mid-Range", color: "#60a5fa" };
    if (price >= 400)  return { label: "Budget", color: "#34d399" };
    return { label: "Entry Level", color: "#f59e0b" };
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
    {/* Main sparkle */}
    <path
      d="M12 3 L14 9 L20 11 L14 13 L12 19 L10 13 L4 11 L10 9 Z"
      fill="white"
      opacity="0.95"
    />
    {/* Small sparkle top right */}
    <path
      d="M18 2 L19 5 L22 6 L19 7 L18 10 L17 7 L14 6 L17 5 Z"
      fill="white"
      opacity="0.6"
    />
    {/* Tiny dot bottom left */}
    <circle cx="5" cy="19" r="1.5" fill="white" opacity="0.4"/>
  </svg>
</div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>AI Price Estimator</h1>
            <p style={{ fontSize: 13, color: "#8b949e", marginTop: 4 }}>
              Enter your laptop specs to get a fair market price estimate
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* ── Left Column: Basic Info ── */}
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
          </div>

          {/* Company */}
          <div className="form-group">
            <label className="form-label">Company</label>
            <select
              className="form-input"
              value={form.Company}
              onChange={(e) => handleChange("Company", e.target.value)}
              style={{ cursor: "pointer" }}
            >
              <option value="">Select a brand...</option>
              {COMPANIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Product */}
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input
              className="form-input"
              placeholder="e.g. Legion Y520-15IKBN"
              value={form.Product}
              onChange={(e) => handleChange("Product", e.target.value)}
            />
          </div>

          {/* CPU */}
          <div className="form-group">
            <label className="form-label">CPU</label>
            <input
              className="form-input"
              placeholder="e.g. Intel Core i7 7700HQ 2.8GHz"
              value={form.Cpu}
              onChange={(e) => handleChange("Cpu", e.target.value)}
            />
          </div>

          {/* RAM */}
          <div className="form-group">
            <label className="form-label">RAM</label>
            <select
              className="form-input"
              value={form.Ram}
              onChange={(e) => handleChange("Ram", e.target.value)}
              style={{ cursor: "pointer" }}
            >
              <option value="">Select RAM...</option>
              {RAM_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Storage */}
          <div className="form-group">
            <label className="form-label">Storage</label>
            <input
              className="form-input"
              placeholder="e.g. 512GB SSD"
              value={form.Memory}
              onChange={(e) => handleChange("Memory", e.target.value)}
            />
          </div>

          {/* GPU */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">GPU</label>
            <input
              className="form-input"
              placeholder="e.g. Nvidia GeForce GTX 1060"
              value={form.Gpu}
              onChange={(e) => handleChange("Gpu", e.target.value)}
            />
          </div>
        </div>

        {/* ── Right Column: Condition Sliders ── */}
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
            label="Age"
            name="Age_years"
            min={0} max={15}
            value={form.Age_years}
            unit=" yrs"
            onChange={handleChange}
            description="How old is the laptop?"
          />

          <SliderField
            label="Condition"
            name="Condition_10"
            min={1} max={10}
            value={form.Condition_10}
            unit="/10"
            onChange={handleChange}
            description="1 = heavily damaged, 10 = brand new"
          />

          <SliderField
            label="Battery Health"
            name="Battery_Health_percent"
            min={0} max={100}
            value={form.Battery_Health_percent}
            unit="%"
            onChange={handleChange}
            description="Current battery capacity vs original"
          />

          {/* Summary preview */}
          <div style={{
            background: "#0d1117", border: "1px solid #21262d",
            borderRadius: 10, padding: 14, marginTop: 8,
          }}>
            <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Summary
            </div>
            {[
              ["Brand", form.Company || "—"],
              ["RAM", form.Ram || "—"],
              ["Age", `${form.Age_years} yrs`],
              ["Condition", `${form.Condition_10}/10`],
              ["Battery", `${form.Battery_Health_percent}%`],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: "#8b949e" }}>{k}</span>
                <span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          marginTop: 16, padding: "12px 16px",
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 10, color: "#f87171", fontSize: 14,
        }}>
          {error}
        </div>
      )}

      {/* Submit button */}
      <button
        className="btn btn-primary btn-full"
        style={{ marginTop: 20, fontSize: 16, padding: "14px 0", borderRadius: 12 }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Estimating..." : "Get Price Estimate"}
      </button>

      {/* Loading bar */}
      {loading && (
        <div style={{ marginTop: 12, background: "#21262d", borderRadius: 4, overflow: "hidden", height: 3 }}>
          <div style={{
            height: "100%", background: "#2563eb", borderRadius: 4,
            animation: "loadBar 1.4s ease-in-out infinite",
            width: "60%",
          }} />
          <style>{`
            @keyframes loadBar {
              0%   { transform: translateX(-100%); }
              100% { transform: translateX(250%); }
            }
          `}</style>
        </div>
      )}

      {/* Result */}
      {result !== null && !loading && (
        <div style={{
          marginTop: 24,
          background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(37,99,235,0.04))",
          border: "1px solid rgba(37,99,235,0.3)",
          borderRadius: 16, padding: 28, textAlign: "center",
          animation: "popIn 0.3s ease",
        }}>
          <div style={{ fontSize: 13, color: "#8b949e", marginBottom: 8 }}>
            Estimated Fair Market Price
          </div>
          <div style={{
            fontSize: 48, fontWeight: 700, color: "#2563eb",
            fontFamily: "'JetBrains Mono', monospace", marginBottom: 8,
          }}>
            €{result.toLocaleString()}
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
          <p style={{ fontSize: 13, color: "#8b949e", maxWidth: 400, margin: "0 auto" }}>
            This is an AI-generated estimate based on your laptop's specs and condition.
            Use this as a guide when creating your listing.
          </p>
          <button
            className="btn btn-ghost"
            style={{ marginTop: 16, fontSize: 13 }}
            onClick={() => { setResult(null); setForm(DEFAULT_FORM); }}
          >
            Reset & Try Again
          </button>
        </div>
      )}
    </div>
  );
}
