import { db } from "../config/db_config.js";

export const findOrCreateConversation = (
  buyerId,
  sellerId,
  listingId,
  callback
) => {
  const checkSql = `
    SELECT * FROM conversations
    WHERE buyer_id = ? AND seller_id = ? AND listing_id = ?
  `;

  db.query(checkSql, [buyerId, sellerId, listingId], (err, result) => {
    if (err) return callback(err);

    // if exists → return it
    if (result.length > 0) {
      return callback(null, { id: result[0].id, exists: true });
    }

    // else create new
    const insertSql = `
      INSERT INTO conversations (buyer_id, seller_id, listing_id)
      VALUES (?, ?, ?)
    `;

    db.query(insertSql, [buyerId, sellerId, listingId], (err2, res2) => {
      if (err2) return callback(err2);

      callback(null, { id: res2.insertId, exists: false });
    });
  });
};

export const getConversationsModel = (userId, callback) => {
  const sql = `
    SELECT 
      c.id,
      c.status,
      c.listing_id,

      CASE 
        WHEN c.buyer_id = ? THEN seller.username
        ELSE buyer.username
      END AS other_user_name,

      CASE 
        WHEN c.buyer_id = ? THEN seller.id
        ELSE buyer.id
      END AS other_user_id,

      l.title AS listing_title,

      ip.preview_text,
      ip.last_time,
      ip.unread_count

    FROM conversations c
    JOIN users buyer ON c.buyer_id = buyer.id
    JOIN users seller ON c.seller_id = seller.id
    LEFT JOIN listings l ON c.listing_id = l.id
    LEFT JOIN inbox_previews ip ON c.id = ip.conversation_id

    WHERE c.buyer_id = ? OR c.seller_id = ?
    ORDER BY ip.last_time DESC
  `;

  db.query(sql, [userId, userId, userId, userId], callback);
};

export const getMessagesModel = (conversationId, userId, callback) => {
  // Step 1: check user is part of conversation
  const checkSql = `
    SELECT * FROM conversations
    WHERE id = ? AND (buyer_id = ? OR seller_id = ?)
  `;

  db.query(checkSql, [conversationId, userId, userId], (err, convo) => {
    if (err) return callback(err);

    if (convo.length === 0) {
      return callback(null, null); // unauthorized
    }

    // Step 2: fetch messages
    const msgSql = `
      SELECT 
        id,
        sender_id,
        body,
        is_read,
        sent_at
      FROM messages
      WHERE conversation_id = ?
      ORDER BY sent_at ASC
    `;

    db.query(msgSql, [conversationId], (err2, messages) => {
      if (err2) return callback(err2);

      callback(null, messages);
    });
  });
};

export const sendMessageModel = (
  conversationId,
  userId,
  body,
  callback
) => {
  // Step 1: check user belongs to conversation
  const checkSql = `
    SELECT * FROM conversations
    WHERE id = ? AND (buyer_id = ? OR seller_id = ?)
  `;

  db.query(checkSql, [conversationId, userId, userId], (err, convo) => {
    if (err) return callback(err);

    if (convo.length === 0) {
      return callback(null, null); // unauthorized
    }

    // Step 2: insert message
    const insertSql = `
      INSERT INTO messages (conversation_id, sender_id, body)
      VALUES (?, ?, ?)
    `;

    db.query(insertSql, [conversationId, userId, body], callback);
  });
};

export const markAsReadModel = (conversationId, userId, callback) => {
  // Step 1: verify user is part of conversation
  const checkSql = `
    SELECT * FROM conversations
    WHERE id = ? AND (buyer_id = ? OR seller_id = ?)
  `;

  db.query(checkSql, [conversationId, userId, userId], (err, convo) => {
    if (err) return callback(err);

    if (convo.length === 0) {
      return callback(null); // unauthorized but silent
    }

    // Step 2: mark messages as read (only those NOT sent by current user)
    const updateSql = `
      UPDATE messages
      SET is_read = 1
      WHERE conversation_id = ?
      AND sender_id != ?
    `;

    db.query(updateSql, [conversationId, userId], (err2) => {
      if (err2) return callback(err2);

      // Step 3: reset unread_count in inbox
      const resetSql = `
        UPDATE inbox_previews
        SET unread_count = 0
        WHERE conversation_id = ?
      `;

      db.query(resetSql, [conversationId], callback);
    });
  });
};