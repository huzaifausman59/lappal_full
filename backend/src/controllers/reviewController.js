import {
  createReviewModel,
  getUserReviewsModel,
} from "../models/reviewModel.js";

// CREATE REVIEW
export const createReview = (req, res) => {
  const reviewerId = req.user.id;
  const { deal_id, seller_id, rating, comment } = req.body;

  // validation
  if (!deal_id || !seller_id || !rating) {
    return res.status(400).json({
      message: "deal_id, seller_id and rating are required",
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      message: "Rating must be between 1 and 5",
    });
  }

  createReviewModel(
    deal_id,
    reviewerId,
    seller_id,
    rating,
    comment || null,
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Review submitted successfully",
        reviewId: result.insertId,
      });
    }
  );
};

// GET REVIEWS FOR USER
export const getUserReviews = (req, res) => {
  const userId = req.params.userId;

  getUserReviewsModel(userId, (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};