import React from "react";

/*
 * PageStamp — the rotating circular "text ring + icon" stamp that sits
 * on the right side of every inner-page header (Gallery, Portfolio,
 * Service, Contact, Project). Hidden on small screens via CSS.
 *
 * textLength/lengthAdjust keep the phrase evenly spaced around the ring.
 */
export default function PageStamp({ text = "Deep Design Dev · Design · Code · Ship · ", icon = "auto_awesome", label }) {
  const id = "nhStampPath";
  return (
    <div className="nh-stamp" aria-hidden="true">
      <svg className="nh-stamp__svg" viewBox="0 0 108 108">
        <defs>
          <path id={id} d="M54,54 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0"></path>
        </defs>
        <text className="nh-stamp__text">
          <textPath href={`#${id}`} startOffset="0" textLength="289" lengthAdjust="spacingAndGlyphs">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="nh-stamp__core">
        <span className="material-symbols-rounded">{icon}</span>
      </span>
      {label ? <span className="visually-hidden">{label}</span> : null}
    </div>
  );
}
