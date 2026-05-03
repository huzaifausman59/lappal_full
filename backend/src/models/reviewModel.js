import { db } from "../config/db_config.js";

// CREATE REVIEW
export const createReviewModel = (
  dealId,
  reviewerId,
  sellerId,
  rating,
  comment,
  cb
) => {
  const sql = `
    INSERT INTO reviews (deal_id, reviewer_id, seller_id, rating, comment)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [dealId, reviewerId, sellerId, rating, comment], cb);
};

// GET REVIEWS FOR USER (seller/profile)
export const getUserReviewsModel = (userId, cb) => {
  const sql = `
    SELECT 
      r.id,
      r.rating,
      r.comment,
      r.reviewed_at,
      u.username AS reviewer
    FROM reviews r
    JOIN users u ON r.reviewer_id = u.id
    WHERE r.seller_id = ?
    ORDER BY r.reviewed_at DESC
  `;

  db.query(sql, [userId], cb);
};