// src/components/Review/MenuItemReview.jsx

import React, { useState, useEffect } from "react";
import Parse from "../../parseConfig";
import ReactStars from "react-stars";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

export default function MenuItemReview({ foodItem, station, diningHall }) {
  const [showForm, setShowForm] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [reviewsCount, setReviewsCount] = useState(0);

  const fetchReviews = async () => {
    const query = new Parse.Query("Reviews");
    query.equalTo("foodItem", foodItem);
    query.equalTo("diningHall", diningHall);
    query.descending("createdAt");
    const results = await query.find();

    const fetchedReviews = results.map((r) => ({
      text: r.get("reviewText"),
      rating: r.get("rating"),
      username: r.get("username"),
    }));

    setReviews(fetchedReviews);

    if (fetchedReviews.length > 0) {
      const avg = fetchedReviews.reduce((sum, r) => sum + r.rating, 0) / fetchedReviews.length;
      setAverageRating(avg.toFixed(1));
      setReviewsCount(fetchedReviews.length);
    } else {
      setAverageRating(null);
      setReviewsCount(0);
    }
  };

  const handleToggleReviews = () => {
    if (!showReviews) {
      fetchReviews();
    } else {
      setAverageRating(null);
      setReviewsCount(0);
      setReviews([]);
    }
    setShowReviews(!showReviews);
  };

  const handleReviewSubmit = () => {
    if (showReviews) {
      fetchReviews(); // refresh list + average when review is submitted
    }
  };

  return (
    <div style={{ marginTop: "0.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        {showReviews && averageRating && (
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            {averageRating}
            <ReactStars count={5} value={parseFloat(averageRating)} edit={false} size={18} half={true} />
            ({reviewsCount})
          </span>
        )}

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Hide Form" : "Leave Review"}
        </button>

        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={handleToggleReviews}
        >
          {showReviews ? "Hide Reviews" : "Show Reviews"}
        </button>
      </div>

      {showForm && (
        <div className="mt-2">
          <ReviewForm
            foodItem={foodItem}
            station={station}
            diningHall={diningHall}
            onReviewSubmit={handleReviewSubmit}
          />
        </div>
      )}

      {showReviews && (
        <div className="mt-2">
          <ReviewList reviews={reviews} />
        </div>
      )}
    </div>
  );
}
