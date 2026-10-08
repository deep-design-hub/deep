import React from "react";

export function Stars({ value = 0, size = 15 }) {
  const pct = Math.max(0, Math.min(100, (Number(value) || 0) / 5 * 100));
  return (
    <span className="nh-stars" style={{ fontSize: size + "px" }} title={`${Number(value).toFixed(1)} out of 5`}>
      <span className="nh-stars__row" aria-hidden="true">★★★★★</span>
      <span className="nh-stars__row nh-stars__row--fill" aria-hidden="true" style={{ width: pct + "%" }}>
        ★★★★★
      </span>
      <span className="visually-hidden">{Number(value).toFixed(1)} out of 5 stars</span>
    </span>
  );
}

export function StarPicker({ value = 0, onChange, size = 26 }) {
  const [hover, setHover] = React.useState(0);
  const active = hover || value;
  return (
    <div className="nh-picker" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className={"nh-picker__star" + (n <= active ? " is-on" : "")}
          style={{ fontSize: size + "px" }}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onFocus={() => setHover(n)}
          onBlur={() => setHover(0)}
          onClick={() => onChange && onChange(n)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
