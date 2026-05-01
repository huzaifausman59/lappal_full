-- ============================================================
--  LAPPAL — Laptop Marketplace
--  Database Schema
--  Covers: Auth, Users/Sellers, Listings, Messaging,
--          Reviews, Price Estimator logs
-- ============================================================

-- ────────────────────────────────────────────────────────────
--  0. SETUP
-- ────────────────────────────────────────────────────────────
CREATE DATABASE IF NOT EXISTS lappal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE lappal;

-- ────────────────────────────────────────────────────────────
--  1. USERS
--     Sources: RegisterScreen, LoginScreen, ProfileScreen
-- ────────────────────────────────────────────────────────────
CREATE TABLE users (
  id            INT            UNSIGNED NOT NULL AUTO_INCREMENT,
  username      VARCHAR(50)    NOT NULL,
  email         VARCHAR(255)   NOT NULL,
  password_hash VARCHAR(255)   NOT NULL,               -- bcrypt hash
  role          ENUM('buyer','seller') NOT NULL DEFAULT 'buyer',
  full_name     VARCHAR(100)   DEFAULT NULL,
  location      VARCHAR(100)   DEFAULT NULL,
  avatar_initials CHAR(2)      DEFAULT NULL,           -- e.g. "HU"
  joined_at     TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                               ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE  KEY uq_users_email    (email),
  UNIQUE  KEY uq_users_username (username)
);

-- ────────────────────────────────────────────────────────────
--  2. AUTH TOKENS  (JWT blacklist / refresh tokens)
--     Sources: LoginScreen (localStorage token), RegisterScreen
-- ────────────────────────────────────────────────────────────
CREATE TABLE auth_tokens (
  id          INT       UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     INT       UNSIGNED NOT NULL,
  token_hash  VARCHAR(255) NOT NULL,                   -- SHA-256 of JWT
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
--  3. SELLER PROFILES
--     Sources: SellerProfileScreen, ProductDetailScreen,
--              ProfileScreen, SellerDashboard
--     Note: a user with role='seller' gets one row here
-- ────────────────────────────────────────────────────────────
CREATE TABLE seller_profiles (
  id            INT       UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       INT       UNSIGNED NOT NULL,
  display_name  VARCHAR(100) NOT NULL,                 -- "TechStore Pro"
  location      VARCHAR(100) DEFAULT NULL,
  member_since  YEAR         DEFAULT NULL,             -- e.g. 2022
  total_sales   INT UNSIGNED NOT NULL DEFAULT 0,
  is_verified   TINYINT(1)   NOT NULL DEFAULT 0,       -- "Verified Seller" badge
  avg_rating    DECIMAL(3,2) NOT NULL DEFAULT 0.00,    -- cached; updated on review
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                             ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_seller_user (user_id),
  CONSTRAINT fk_seller_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
--  4. LISTINGS
--     Sources: MarketplaceScreen, SellerDashboard (add/edit/delete),
--              ProductDetailScreen, ProfileScreen (my listings)
-- ────────────────────────────────────────────────────────────
CREATE TABLE listings (
  id            INT           UNSIGNED NOT NULL AUTO_INCREMENT,
  seller_id     INT           UNSIGNED NOT NULL,        -- FK → seller_profiles
  title         VARCHAR(150)  NOT NULL,
  brand         VARCHAR(50)   NOT NULL,                 -- filter in Marketplace
  price         DECIMAL(10,2) NOT NULL,
  description   TEXT          DEFAULT NULL,
  main_image    VARCHAR(500)  DEFAULT NULL,             -- primary thumbnail URL
  condition_rating TINYINT   UNSIGNED NOT NULL DEFAULT 7, -- 4–10 scale
  status        ENUM('active','sold','deleted') NOT NULL DEFAULT 'active',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_listing_seller (seller_id),
  INDEX idx_listing_brand  (brand),
  INDEX idx_listing_price  (price),
  INDEX idx_listing_status (status),
  CONSTRAINT fk_listing_seller FOREIGN KEY (seller_id)
    REFERENCES seller_profiles(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
--  5. LISTING IMAGES  (multi-photo gallery in ProductDetailScreen)
-- ────────────────────────────────────────────────────────────
CREATE TABLE listing_images (
  id          INT      UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id  INT      UNSIGNED NOT NULL,
  image_url   VARCHAR(500) NOT NULL,
  sort_order  TINYINT  UNSIGNED NOT NULL DEFAULT 0,     -- thumbnail ordering
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_img_listing (listing_id),
  CONSTRAINT fk_img_listing FOREIGN KEY (listing_id)
    REFERENCES listings(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
--  6. LISTING SPECS  (key-value specs shown in ProductDetailScreen)
-- ────────────────────────────────────────────────────────────
CREATE TABLE listing_specs (
  id          INT      UNSIGNED NOT NULL AUTO_INCREMENT,
  listing_id  INT      UNSIGNED NOT NULL,
  spec_key    VARCHAR(80)  NOT NULL,                    -- e.g. "CPU", "RAM"
  spec_value  VARCHAR(200) NOT NULL,                    -- e.g. "Intel i7-12th Gen"
  sort_order  TINYINT  UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (id),
  INDEX idx_spec_listing (listing_id),
  CONSTRAINT fk_spec_listing FOREIGN KEY (listing_id)
    REFERENCES listings(id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────
--  7. CONVERSATIONS
--     Sources: MessagesScreen (inbox list), ChatScreen
-- ────────────────────────────────────────────────────────────
CREATE TABLE conversations (
  id           INT      UNSIGNED NOT NULL AUTO_INCREMENT,
  buyer_id     INT      UNSIGNED NOT NULL,              -- FK → users
  seller_id    INT      UNSIGNED NOT NULL,              -- FK → seller_profiles
  listing_id   INT      UNSIGNED DEFAULT NULL,          -- optional context
  status       ENUM('active','completed','archived') NOT NULL DEFAULT 'active',
  -- "Mark as Purchased" sets this to 'completed'
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
               ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_convo (buyer_id, seller_id, listing_id),
  INDEX idx_convo_buyer  (buyer_id),
  INDEX idx_convo_seller (seller_id),
  CONSTRAINT fk_convo_buyer  FOREIGN KEY (buyer_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_convo_seller FOREIGN KEY (seller_id)
    REFERENCES seller_profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_convo_listing FOREIGN KEY (listing_id)
    REFERENCES listings(id) ON DELETE SET NULL
);

-- ────────────────────────────────────────────────────────────
--  8. MESSAGES
--     Sources: ChatScreen (send/receive, 500-char limit, timestamps)
-- ────────────────────────────────────────────────────────────
CREATE TABLE messages (
  id               INT       UNSIGNED NOT NULL AUTO_INCREMENT,
  conversation_id  INT       UNSIGNED NOT NULL,
  sender_id        INT       UNSIGNED NOT NULL,          -- FK → users
  body             VARCHAR(500) NOT NULL,                -- MAX_CHARS = 500
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
--  9. INBOX PREVIEWS (denormalised cache — MessagesScreen)
--     Stores the last message per conversation for fast inbox loads.
--     Updated via trigger after INSERT on messages.
-- ────────────────────────────────────────────────────────────
CREATE TABLE inbox_previews (
  conversation_id  INT       UNSIGNED NOT NULL,
  last_message_id  INT       UNSIGNED DEFAULT NULL,
  preview_text     VARCHAR(100) DEFAULT NULL,            -- truncated body
  last_time        TIMESTAMP    DEFAULT NULL,
  unread_count     SMALLINT  UNSIGNED NOT NULL DEFAULT 0,

  PRIMARY KEY (conversation_id),
  CONSTRAINT fk_preview_convo FOREIGN KEY (conversation_id)
    REFERENCES conversations(id) ON DELETE CASCADE
);

-- Trigger: keep inbox_previews up to date on every new message
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
--  10. DEALS  ("Mark as Purchased" in ChatScreen)
--      Records when a buyer confirms a completed transaction.
-- ────────────────────────────────────────────────────────────
CREATE TABLE deals (
  id               INT       UNSIGNED NOT NULL AUTO_INCREMENT,
  conversation_id  INT       UNSIGNED NOT NULL,
  buyer_id         INT       UNSIGNED NOT NULL,
  seller_id        INT       UNSIGNED NOT NULL,
  listing_id       INT       UNSIGNED DEFAULT NULL,
  confirmed_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_deal_convo (conversation_id),          -- one deal per chat
  CONSTRAINT fk_deal_convo   FOREIGN KEY (conversation_id)
    REFERENCES conversations(id) ON DELETE CASCADE,
  CONSTRAINT fk_deal_buyer   FOREIGN KEY (buyer_id)
    REFERENCES users(id),
  CONSTRAINT fk_deal_seller  FOREIGN KEY (seller_id)
    REFERENCES seller_profiles(id),
  CONSTRAINT fk_deal_listing FOREIGN KEY (listing_id)
    REFERENCES listings(id) ON DELETE SET NULL
);

-- Trigger: auto-mark conversation as completed when deal is inserted
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
--      Sources: ChatScreen → ReviewModal (rating + comment),
--               SellerProfileScreen, ProductDetailScreen,
--               ProfileScreen (my reviews section)
-- ────────────────────────────────────────────────────────────
CREATE TABLE reviews (
  id           INT       UNSIGNED NOT NULL AUTO_INCREMENT,
  deal_id      INT       UNSIGNED NOT NULL,             -- must complete deal first
  reviewer_id  INT       UNSIGNED NOT NULL,             -- buyer
  seller_id    INT       UNSIGNED NOT NULL,             -- seller_profiles.id
  rating       TINYINT   UNSIGNED NOT NULL,             -- 1–5 stars
  comment      TEXT      DEFAULT NULL,
  reviewed_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_review_deal (deal_id),                 -- one review per deal
  INDEX idx_review_seller   (seller_id),
  CONSTRAINT fk_review_deal     FOREIGN KEY (deal_id)
    REFERENCES deals(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id)
    REFERENCES users(id),
  CONSTRAINT fk_review_seller   FOREIGN KEY (seller_id)
    REFERENCES seller_profiles(id),
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
);

-- Trigger: recalculate seller avg_rating after every new review
DELIMITER $$
CREATE TRIGGER trg_update_seller_rating
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
  UPDATE seller_profiles
  SET avg_rating = (
    SELECT ROUND(AVG(rating), 2)
    FROM reviews
    WHERE seller_id = NEW.seller_id
  )
  WHERE id = NEW.seller_id;
END$$
DELIMITER ;

-- ────────────────────────────────────────────────────────────
--  12. PRICE ESTIMATOR LOGS
--      Sources: PriceEstimatorScreen (POST /api/ai/response)
--      Logs every estimate request for analytics / model retraining
-- ────────────────────────────────────────────────────────────
CREATE TABLE price_estimate_logs (
  id                  INT        UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id             INT        UNSIGNED DEFAULT NULL,   -- NULL = unauthenticated
  brand               VARCHAR(50)  NOT NULL,
  product_name        VARCHAR(150) NOT NULL,
  cpu                 VARCHAR(100) NOT NULL,
  ram                 VARCHAR(20)  NOT NULL,              -- "8GB", "16GB" …
  storage             VARCHAR(50)  NOT NULL,              -- "256GB SSD" …
  gpu                 VARCHAR(100) NOT NULL,
  age_years           TINYINT   UNSIGNED NOT NULL,        -- 0–5
  condition_score     TINYINT   UNSIGNED NOT NULL,        -- 4–10
  battery_health_pct  TINYINT   UNSIGNED NOT NULL,        -- 60–100
  predicted_price_pkr DECIMAL(12,2) DEFAULT NULL,        -- returned by AI
  requested_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_est_user    (user_id),
  INDEX idx_est_brand   (brand),
  CONSTRAINT fk_est_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE SET NULL
);

-- ────────────────────────────────────────────────────────────
--  SAMPLE / SEED DATA
-- ────────────────────────────────────────────────────────────

-- Seed: two users (one buyer, one seller)
INSERT INTO users (username, email, password_hash, role, full_name, location, avatar_initials) VALUES
  ('huzaifa_u',   'huzaifa@example.com',  '$2b$12$PLACEHOLDER_HASH_A', 'seller', 'Huzaifa Usman', 'Lahore', 'HU'),
  ('buyer_demo',  'buyer@example.com',    '$2b$12$PLACEHOLDER_HASH_B', 'buyer',  'Demo Buyer',    'Karachi', 'DB');

-- Seed: seller profile for huzaifa
INSERT INTO seller_profiles (user_id, display_name, location, member_since, total_sales, is_verified) VALUES
  (1, 'TechStore Pro', 'Lahore', 2022, 47, 1);

-- Seed: one listing
INSERT INTO listings (seller_id, title, brand, price, description, main_image, condition_rating) VALUES
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