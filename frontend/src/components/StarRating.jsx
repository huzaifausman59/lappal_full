// StarRating — reusable star display component
// Usage:
//   <StarRating rating={4.9} />
//   <StarRating rating={4.5} size={16} showNumber={false} />

export default function StarRating({ rating, size = 14, showNumber = true }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;

  const Star = ({ type }) => {
    if (type === "full") return (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
        <path d="M7 1l1.545 3.13 3.455.503-2.5 2.437.59 3.44L7 8.885l-3.09 1.625.59-3.44L2 4.633l3.455-.503L7 1z"
          fill="#f59e0b" stroke="#f59e0b" strokeWidth="0.5" strokeLinejoin="round"/>
      </svg>
    );
    if (type === "half") return (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
        <path d="M7 1l1.545 3.13 3.455.503-2.5 2.437.59 3.44L7 8.885l-3.09 1.625.59-3.44L2 4.633l3.455-.503L7 1z"
          fill="none" stroke="#f59e0b" strokeWidth="0.5" strokeLinejoin="round"/>
        <path d="M7 1l1.545 3.13 3.455.503-2.5 2.437.59 3.44L7 8.885V1z"
          fill="#f59e0b"/>
      </svg>
    );
    return (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
        <path d="M7 1l1.545 3.13 3.455.503-2.5 2.437.59 3.44L7 8.885l-3.09 1.625.59-3.44L2 4.633l3.455-.503L7 1z"
          fill="none" stroke="#8b949e" strokeWidth="0.5" strokeLinejoin="round"/>
      </svg>
    );
  };

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
      {Array(full).fill("full").map((t, i) => <Star key={"f"+i} type={t} />)}
      {Array(half).fill("half").map((t, i) => <Star key={"h"+i} type={t} />)}
      {Array(empty).fill("empty").map((t, i) => <Star key={"e"+i} type={t} />)}
      {showNumber && (
        <span style={{ fontSize: size, fontWeight: 600, color: "#f59e0b", marginLeft: 2 }}>
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
}
