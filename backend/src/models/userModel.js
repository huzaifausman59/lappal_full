import { db } from "../config/db_config.js";

// CREATE USER
export const createUser = (username, email, password, callback) => {
const sql =
  "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";

  db.query(sql, [username, email, password], callback);
};

// FIND USER BY EMAIL
export const findUserByEmail = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], callback);
};

// FIND USER BY EMAIL OR USERNAME 
export const findUserByEmailOrUsername = (email, username, callback) => {
  const sql = "SELECT * FROM users WHERE email = ? OR username = ?";
  db.query(sql, [email, username], callback);
};

// FIND USER BY ID
export const findUserById = (id, callback) => {
  const sql = "SELECT id, username, email FROM users WHERE id = ?";
  db.query(sql, [id], callback);
};

export const getUserProfile = (userId, callback) => {
  const sql = `
    SELECT 
      u.id,
      u.username,
      u.full_name,
      u.location,
      u.avatar_initials,
      u.joined_at,
      COALESCE(us.total_sales, 0) AS total_sales,
      COALESCE(us.avg_rating, 0) AS avg_rating,
      COALESCE(us.is_verified, 0) AS is_verified
    FROM users u
    LEFT JOIN user_stats us ON u.id = us.user_id
    WHERE u.id = ?
  `;

  db.query(sql, [userId], callback);
};

export const updateUserProfile = (
  userId,
  full_name,
  location,
  avatar_initials,
  callback
) => {
  const sql = `
    UPDATE users
    SET 
      full_name = ?,
      location = ?,
      avatar_initials = ?
    WHERE id = ?
  `;

  db.query(sql, [full_name, location, avatar_initials, userId], callback);
};

export const getPublicUserProfile = (userId, callback) => {
  const userQuery = `
    SELECT 
      u.id,
      u.username,
      u.full_name,
      u.location,
      u.joined_at,
      COALESCE(us.total_sales, 0) AS total_sales,
      COALESCE(us.avg_rating, 0) AS avg_rating,
      COALESCE(us.is_verified, 0) AS is_verified
    FROM users u
    LEFT JOIN user_stats us ON u.id = us.user_id
    WHERE u.id = ?
  `;

  const reviewsQuery = `
    SELECT 
      r.id,
      u.username AS reviewer,
      r.rating,
      r.comment,
      r.reviewed_at
    FROM reviews r
    JOIN users u ON r.reviewer_id = u.id
    WHERE r.seller_id = ?
    ORDER BY r.reviewed_at DESC
  `;

  db.query(userQuery, [userId], (err, userResult) => {
    if (err) return callback(err);

    if (userResult.length === 0) {
  return callback(null, null);
}

    db.query(reviewsQuery, [userId], (err, reviewsResult) => {
      if (err) return callback(err);

      const response = {
        ...userResult[0],
        reviews: reviewsResult,
      };

      callback(null, response);
    });
  });
};


export const getListingsByUser = (userId, callback) => {
  const sql = `
    SELECT 
      id,
      title,
      price,
      main_image,
      status
    FROM listings
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [userId], callback);
};