// ─── Lappal Icon Library ──────────────────────────────────────────────────────
// Import what you need:
//   import { LappalLogo, SearchEmptyIcon, NoListingsIcon } from "../components/icons"

// ─── Logo ─────────────────────────────────────────────────────────────────────
// Usage:
//   <LappalLogo size="lg" />   → large pill (landing screen)
//   <LappalLogo size="sm" />   → small pill (navbar, modals)

export function LappalLogo({ size = "sm" }) {
  if (size === "lg") {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          background: "#2563eb",
          borderRadius: 14,
          padding: "10px 20px 10px 12px",
          gap: 10,
        }}
      >
        <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
          <rect x="0" y="0" width="26" height="15" rx="3" fill="white" fillOpacity="0.18" />
          <rect x="3" y="3" width="9" height="1.5" rx="0.75" fill="white" fillOpacity="0.6" />
          <rect x="3" y="6" width="6" height="1.5" rx="0.75" fill="white" fillOpacity="0.35" />
          <rect x="0" y="15" width="26" height="5" rx="2.5" fill="white" fillOpacity="0.9" />
          <rect x="10" y="13.5" width="6" height="2" rx="1" fill="#2563eb" />
        </svg>
        <span
          style={{
            color: "white",
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: -0.3,
            fontFamily: "inherit",
          }}
        >
          Lappal
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "#2563eb",
        borderRadius: 10,
        padding: "6px 14px 6px 10px",
        gap: 8,
      }}
    >
      <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
        <rect x="0" y="0" width="18" height="10" rx="2.5" fill="white" fillOpacity="0.18" />
        <rect x="2" y="2" width="6" height="1.5" rx="0.75" fill="white" fillOpacity="0.6" />
        <rect x="0" y="10" width="18" height="4" rx="2" fill="white" fillOpacity="0.9" />
        <rect x="6" y="9" width="6" height="2" rx="1" fill="#2563eb" />
      </svg>
      <span
        style={{
          color: "white",
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "inherit",
        }}
      >
        Lappal
      </span>
    </div>
  );
}

// ─── Search Empty State Icon ──────────────────────────────────────────────────
// Usage:
//   <SearchEmptyIcon />
//   <SearchEmptyIcon size={96} />   → custom size (default: 72)

export function SearchEmptyIcon({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="36" fill="#2563eb" fillOpacity="0.06" />
      <circle cx="33" cy="33" r="17" fill="none" stroke="#2563eb" strokeWidth="2.5" />
      <line
        x1="45"
        y1="45"
        x2="56"
        y2="56"
        stroke="#2563eb"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="26"
        y1="30"
        x2="40"
        y2="30"
        stroke="#2563eb"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
      <line
        x1="26"
        y1="35"
        x2="38"
        y2="35"
        stroke="#2563eb"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />
      <line
        x1="26"
        y1="40"
        x2="35"
        y2="40"
        stroke="#2563eb"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.15"
      />
    </svg>
  );
}

// ─── No Listings Empty State Icon ─────────────────────────────────────────────
// Usage:
//   <NoListingsIcon />
//   <NoListingsIcon size={96} />   → custom size (default: 72)

export function NoListingsIcon({ size = 72 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="36" fill="#2563eb" fillOpacity="0.06" />
      <rect
        x="10" y="16" width="24" height="18" rx="4"
        fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.35"
      />
      <rect
        x="38" y="16" width="24" height="18" rx="4"
        fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.35"
      />
      <rect
        x="10" y="38" width="24" height="18" rx="4"
        fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.35"
      />
      <rect
        x="38" y="38" width="24" height="18" rx="4"
        fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.35"
      />
      <circle cx="36" cy="36" r="12" fill="#2563eb" />
      <line
        x1="36" y1="30" x2="36" y2="42"
        stroke="white" strokeWidth="2.5" strokeLinecap="round"
      />
      <line
        x1="30" y1="36" x2="42" y2="36"
        stroke="white" strokeWidth="2.5" strokeLinecap="round"
      />
    </svg>
  );
}
