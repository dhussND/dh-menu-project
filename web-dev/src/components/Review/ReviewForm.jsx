import React, { useState } from "react";
import "../../styles/theme.css";

const ReviewForm = ({ onReviewSubmit, foodItem, station, diningHall }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reviewText || rating === 0) return;

    const Parse = await import("../../parseConfig").then(m => m.default);
    const Reviews = Parse.Object.extend("Reviews");
    const review = new Reviews();

    const currentUser = Parse.User.current();
    const username = currentUser ? currentUser.get("firstName") : "Anonymous";

    // set review properties
    review.set("reviewText", reviewText);
    review.set("rating", rating);
    review.set("foodItem", foodItem);
    review.set("station", station);
    review.set("diningHall", diningHall);
    review.set("username", username);

    // save review to Parse
    try {
      await review.save();
      onReviewSubmit();
      setReviewText("");
      setRating(0);
      setHoverRating(0);
    } catch (err) {
      console.error("Failed to save review:", err);
    }
  };

  const getStarFill = (index) => {
    const value = hoverRating || rating;
    if (value >= index + 1) return "full";
    if (value >= index + 0.5) return "half";
    return "empty";
  };

  // handle mouse events for star rating
  const handleMouseMove = (e, index) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    if (x < width / 2) {
      setHoverRating(index + 0.5);
    } else {
      setHoverRating(index + 1);
    }
  };

  // handle click event for star rating
  const handleClick = (e, index) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    if (x < width / 2) {
      setRating(index + 0.5);
    } else {
      setRating(index + 1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <textarea
        className="review-textarea"
        placeholder="Write your review..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />

      <div className="rating-section">
        <label>Rating:</label>
        <div className="star-container">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`star ${getStarFill(i)}`}
              onMouseMove={(e) => handleMouseMove(e, i)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={(e) => handleClick(e, i)}
            >
              ★
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-auth btn-primary">
        Submit
      </button>
    </form>
  );
};

export default ReviewForm;
