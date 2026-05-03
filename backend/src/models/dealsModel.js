import { db } from "../config/db_config.js";

export const createDealModel = (conversationId, buyerId, sellerId, listingId, cb) => {
  const sql = `
    INSERT INTO deals (conversation_id, buyer_id, seller_id, listing_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [conversationId, buyerId, sellerId, listingId], cb);
};
