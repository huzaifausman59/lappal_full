import { db } from "../config/db_config.js";

export const getAllListingsModel = (brand, price, callback) => {
  let sql = `
    SELECT 
      l.id,
      l.title,
      l.brand,
      l.price,
      l.main_image,
      l.status,
      u.username AS seller_name,
      u.id AS seller_id
    FROM listings l
    JOIN users u ON l.user_id = u.id
    WHERE l.status = 'active'
  `;

  const values = [];

  // FILTER: brand
  if (brand) {
    sql += " AND l.brand = ? ";
    values.push(brand);
  }

  // FILTER: price
  if (price === "under1lac") {
    sql += " AND l.price < 100000"; 
  }

  if (price === "btw1and2lac") {
    sql += " AND l.price BETWEEN 100000 AND 200000";
  }

    if (price === "over2lac") {
    sql += " AND l.price > 200000";
  }
  sql += " ORDER BY l.created_at DESC";

  db.query(sql, values, callback);
};

export const createListingModel = (
  userId,
  title,
  brand,
  price,
  description,
  main_image,
  condition_rating,
  callback
) => {
  const sql = `
    INSERT INTO listings 
    (user_id, title, brand, price, description, main_image, condition_rating)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      userId,
      title,
      brand,
      price,
      description || null,
      main_image || null,
      condition_rating || 7,
    ],
    callback
  );
};

export const getListingById = (listingId, callback) => {
  const sql = "SELECT * FROM listings WHERE id = ?";
  db.query(sql, [listingId], callback);
};

export const updateListingModel = (listingId, updates, callback) => {
  const fields = [];
  const values = [];

  for (let key in updates) {
    fields.push(`${key} = ?`);
    values.push(updates[key]);
  }

  if (fields.length === 0) {
    return callback(null);
  }

  const sql = `
    UPDATE listings
    SET ${fields.join(", ")}
    WHERE id = ?
  `;

  values.push(listingId);

  db.query(sql, values, callback);
};

export const deleteListingModel = (listingId, callback) => {
  const sql = `DELETE FROM listings WHERE id = ?`;
  db.query(sql, [listingId], callback);
};

export const getListingDetailsModel = (listingId, callback) => {
  const sql = `
    SELECT 
      l.id,
      l.title,
      l.brand,
      l.price,
      l.description,
      l.main_image,
      l.condition_rating,
      l.status,

      u.id AS seller_id,
      u.username AS seller_name,

      COALESCE(us.avg_rating, 0) AS seller_avg_rating,
      COALESCE(us.total_sales, 0) AS seller_total_sales,
      COALESCE(us.is_verified, 0) AS seller_is_verified

    FROM listings l
    JOIN users u ON l.user_id = u.id
    LEFT JOIN user_stats us ON u.id = us.user_id
    WHERE l.id = ?
  `;

  db.query(sql, [listingId], (err, result) => {
    if (err) return callback(err);

    if (result.length === 0) {
      return callback(null, null);
    }

    const listing = result[0];

    // get images
    const imgSql = `SELECT image_url, sort_order FROM listing_images WHERE listing_id = ?`;

    db.query(imgSql, [listingId], (err, images) => {
      if (err) return callback(err);

      // get specs
      const specSql = `SELECT spec_key AS \`key\`, spec_value AS value FROM listing_specs WHERE listing_id = ?`;

      db.query(specSql, [listingId], (err, specs) => {
        if (err) return callback(err);

        const response = {
          ...listing,
          images,
          specs,
        };

        callback(null, response);
      });
    });
  });
};