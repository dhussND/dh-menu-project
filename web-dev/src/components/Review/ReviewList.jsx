// src/components/Review/ReviewList.jsx

import React from "react";
import ReactStars from "react-stars";

export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <p className="text-muted small mt-2">No reviews yet. Be the first!</p>;
  }

  return (
    <ul className="list-group mt-2">
      {reviews.map((r, idx) => (
        <li key={idx} className="list-group-item">
          <div className="d-flex justify-content-between align-items-center">
            <strong>{r.username || "Anonymous"}</strong>
            <ReactStars count={5} value={r.rating} edit={false} size={18} half={true} />
          </div>
          <div className="mt-1">{r.text}</div>
        </li>
      ))}
    </ul>
  );
}
