-- ============================================================
--  LAPPAL — Laptop Marketplace
--  Database Schema (Updated — no buyer/seller role distinction)
-- ============================================================

CREATE DATABASE IF NOT EXISTS lappal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE lappal;

-- ────────────────────────────────────────────────────────────
--  1. USERS
--     Role column removed — every user can browse AND list
-- ────────────────────────────────────────────────────────────
CREATE TABLE users (
  id               INT          UNSIGNED NOT NULL AUTO_INCREMENT,
  username         VARCHAR(50)  NOT NULL,
  email            VARCHAR(255) NOT NULL,
  password_hash    VARCHAR(255) NOT NULL,
  full_name        VARCHAR(100) DEFAULT NULL,
  location         VARCHAR(100) DEFAULT NULL,
  avatar_initials  CHAR(2)      DEFAULT NULL,
  joined_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                                ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email    (email),
  UNIQUE KEY uq_users_username (username)
);

-- ────────────────────────────────────────────────────────────
--  2. AUTH TOKENS
-- ────────────────────────────────────────────────────────────
CREATE TABLE auth_tokens (
  id          INT          UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     INT          UNSIGNED NOT NULL,
  token_hash  VARCHAR(255) NOT NULL,
  expires_at  TIMESTAMP    NOT NULL,
  revoked     TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_auth_token_hash (token_hash),
  INDEX idx_auth_user       (user_id),
  CONSTRAINT fk_auth_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
--  3. LISTINGS
--     Now FK goes directly to users — no separate seller_profiles
--     table needed since every user can list
-- ────────────────────────────────────────────────────────────
CREATE TABLE listings (
  id               INT           UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id          INT           UNSIGNED NOT NULL,
  title            VARCHAR(150)  NOT NULL,
  brand            VARCHAR(50)   NOT NULL,
  price            DECIMAL(10,2) NOT NULL,
  description      TEXT          DEFAULT NULL,
  main_image       VARCHAR(500)  DEFAULT NULL,
  condition_rating TINYINT       UNSIGNED NOT NULL DEFAULT 7,
  status           ENUM('active','sold','deleted') NOT NULL DEFAULT 'active',
  created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                 ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_listing_user   (user_id),
  INDEX idx_listing_brand  (brand),
  INDEX idx_listing_price  (price),
  INDEX idx_listing_status (status),
  CONSTRAINT fk_listing_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
--  4. LISTING IMAGES
-- ────────────────────────────────────────────────────────────
CREATE TABLE listing_images (
  id          INT          UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id  INT          UNSIGNED NOT NULL,
  image_url   VARCHAR(500) NOT NULL,
  sort_order  TINYINT      UNSIGNED NOT NULL DEFAULT 0,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_img_listing (listing_id),
  CONSTRAINT fk_img_listing FOREIGN KEY (listing_id)
    REFERENCES listings(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
--  5. LISTING SPECS
-- ────────────────────────────────────────────────────────────
CREATE TABLE listing_specs (
  id          INT          UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id  INT          UNSIGNED NOT NULL,
  spec_key    VARCHAR(80)  NOT NULL,
  spec_value  VARCHAR(200) NOT NULL,
  sort_order  TINYINT      UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),
  INDEX idx_spec_listing (listing_id),
  CONSTRAINT fk_spec_listing FOREIGN KEY (listing_id)
    REFERENCES listings(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
--  6. USER STATS
--     Replaces seller_profiles — tracks stats for any user
--     who has listings. Created automatically when a user
--     creates their first listing.
-- ────────────────────────────────────────────────────────────
CREATE TABLE user_stats (
  id           INT          UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id      INT          UNSIGNED NOT NULL,
  total_sales  INT          UNSIGNED NOT NULL DEFAULT 0,
  avg_rating   DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  is_verified  TINYINT(1)   NOT NULL DEFAULT 0,
  updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                            ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_stats_user (user_id),
  CONSTRAINT fk_stats_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
--  7. CONVERSATIONS
--     buyer_id and seller_id are both just users now
-- ────────────────────────────────────────────────────────────
CREATE TABLE conversations (
  id          INT          UNSIGNED NOT NULL AUTO_INCREMENT,
  buyer_id    INT          UNSIGNED NOT NULL,
  seller_id   INT          UNSIGNED NOT NULL,
  listing_id  INT          UNSIGNED DEFAULT NULL,
  status      ENUM('active','completed','archived') NOT NULL DEFAULT 'active',
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
              ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_convo (buyer_id, seller_id, listing_id),
  INDEX idx_convo_buyer  (buyer_id),
  INDEX idx_convo_seller (seller_id),
  CONSTRAINT fk_convo_buyer   FOREIGN KEY (buyer_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_convo_seller  FOREIGN KEY (seller_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_convo_listing FOREIGN KEY (listing_id)
    REFERENCES listings(id) ON DELETE SET NULL
);

-- ────────────────────────────────────────────────────────────
--  8. MESSAGES
-- ────────────────────────────────────────────────────────────
CREATE TABLE messages (
  id               INT          UNSIGNED NOT NULL AUTO_INCREMENT,
  conversation_id  INT          UNSIGNED NOT NULL,
  sender_id        INT          UNSIGNED NOT NULL,
  body             VARCHAR(500) NOT NULL,
  is_read          TINYINT(1)   NOT NULL DEFAULT 0,
  sent_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_msg_conversation (conversation_id),
  INDEX idx_msg_sender       (sender_id),
  INDEX idx_msg_sent_at      (sent_at),
  CONSTRAINT fk_msg_conversation FOREIGN KEY (conversation_id)
    REFERENCES conversations(id) ON DELETE CASCADE,
  CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id)
    REFERENCES users(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
--  9. INBOX PREVIEWS
-- ────────────────────────────────────────────────────────────
CREATE TABLE inbox_previews (
  conversation_id  INT          UNSIGNED NOT NULL,
  last_message_id  INT          UNSIGNED DEFAULT NULL,
  preview_text     VARCHAR(100) DEFAULT NULL,
  last_time        TIMESTAMP    DEFAULT NULL,
  unread_count     SMALLINT     UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (conversation_id),
  CONSTRAINT fk_preview_convo FOREIGN KEY (conversation_id)
    REFERENCES conversations(id) ON DELETE CASCADE
);

DELIMITER $$
CREATE TRIGGER trg_update_inbox
AFTER INSERT ON messages
FOR EACH ROW
BEGIN
  INSERT INTO inbox_previews
    (conversation_id, last_message_id, preview_text, last_time, unread_count)
  VALUES
    (NEW.conversation_id, NEW.id, LEFT(NEW.body, 100), NEW.sent_at, 1)
  ON DUPLICATE KEY UPDATE
    last_message_id = NEW.id,
    preview_text    = LEFT(NEW.body, 100),
    last_time       = NEW.sent_at,
    unread_count    = unread_count + 1;
END$$
DELIMITER ;

-- ────────────────────────────────────────────────────────────
--  10. DEALS
-- ────────────────────────────────────────────────────────────
CREATE TABLE deals (
  id               INT       UNSIGNED NOT NULL AUTO_INCREMENT,
  conversation_id  INT       UNSIGNED NOT NULL,
  buyer_id         INT       UNSIGNED NOT NULL,
  seller_id        INT       UNSIGNED NOT NULL,
  listing_id       INT       UNSIGNED DEFAULT NULL,
  confirmed_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_deal_convo (conversation_id),
  CONSTRAINT fk_deal_convo   FOREIGN KEY (conversation_id)
    REFERENCES conversations(id) ON DELETE CASCADE,
  CONSTRAINT fk_deal_buyer   FOREIGN KEY (buyer_id)
    REFERENCES users(id),
  CONSTRAINT fk_deal_seller  FOREIGN KEY (seller_id)
    REFERENCES users(id),
  CONSTRAINT fk_deal_listing FOREIGN KEY (listing_id)
    REFERENCES listings(id) ON DELETE SET NULL
);

DELIMITER $$
CREATE TRIGGER trg_deal_complete
AFTER INSERT ON deals
FOR EACH ROW
BEGIN
  UPDATE conversations
  SET status = 'completed', updated_at = NOW()
  WHERE id = NEW.conversation_id;
END$$
DELIMITER ;

-- ────────────────────────────────────────────────────────────
--  11. REVIEWS
-- ────────────────────────────────────────────────────────────
CREATE TABLE reviews (
  id           INT       UNSIGNED NOT NULL AUTO_INCREMENT,
  deal_id      INT       UNSIGNED NOT NULL,
  reviewer_id  INT       UNSIGNED NOT NULL,
  seller_id    INT       UNSIGNED NOT NULL,
  rating       TINYINT   UNSIGNED NOT NULL,
  comment      TEXT      DEFAULT NULL,
  reviewed_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_review_deal (deal_id),
  INDEX idx_review_seller   (seller_id),
  CONSTRAINT fk_review_deal     FOREIGN KEY (deal_id)
    REFERENCES deals(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id)
    REFERENCES users(id),
  CONSTRAINT fk_review_seller   FOREIGN KEY (seller_id)
    REFERENCES users(id),
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
);

DELIMITER $$
CREATE TRIGGER trg_update_avg_rating
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
  INSERT INTO user_stats (user_id, avg_rating)
  VALUES (NEW.seller_id, NEW.rating)
  ON DUPLICATE KEY UPDATE
    avg_rating = (
      SELECT ROUND(AVG(rating), 2)
      FROM reviews
      WHERE seller_id = NEW.seller_id
    );
END$$
DELIMITER ;

-- ────────────────────────────────────────────────────────────
--  SEED DATA
-- ────────────────────────────────────────────────────────────
INSERT INTO users (username, email, password_hash, full_name, location, avatar_initials) VALUES
  ('huzaifa_u',  'huzaifa@example.com', '$2b$12$PLACEHOLDER_HASH_A', 'Huzaifa Usman', 'Lahore',  'HU'),
  ('demo_user',  'demo@example.com',    '$2b$12$PLACEHOLDER_HASH_B', 'Demo User',     'Karachi', 'DU');

INSERT INTO user_stats (user_id, total_sales, is_verified) VALUES
  (1, 47, 1),
  (2, 3,  0);

INSERT INTO listings (user_id, title, brand, price, description, main_image, condition_rating) VALUES
  (1, 'Dell XPS 15 (2023)', 'Dell', 189999.00,
   'Lightly used Dell XPS 15 in excellent condition. Comes with original box and charger.',
   '/images/dell-xps15.jpg', 9);

INSERT INTO listing_specs (listing_id, spec_key, spec_value, sort_order) VALUES
  (1, 'CPU',     'Intel Core i7-13700H', 1),
  (1, 'RAM',     '16GB DDR5',            2),
  (1, 'Storage', '512GB NVMe SSD',       3),
  (1, 'GPU',     'Nvidia RTX 4060',      4),
  (1, 'Display', '15.6" OLED 3.5K',     5),
  (1, 'Battery', '86 Wh',               6);