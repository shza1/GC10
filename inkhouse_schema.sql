-- Inkhouse Database Setup
-- This file contains the base structure for the Inkhouse e-commerce database.
-- It includes all foundational tables, starter data, and quick checks to verify relationships.

-- 1) Create and select the database
CREATE DATABASE IF NOT EXISTS inkhouse
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
USE inkhouse;

SELECT DATABASE() AS current_db;

-- 2) Users & Carts
-- These two tables serve as the core user system.
-- Each registered user will have a single active cart linked to their account.

CREATE TABLE IF NOT EXISTS users (
  user_id     BIGINT PRIMARY KEY AUTO_INCREMENT,
  email       VARCHAR(255) NOT NULL UNIQUE,
  full_name   VARCHAR(120),
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS carts (
  cart_id     BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id     BIGINT NOT NULL UNIQUE,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_cart_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- Insert a test user and automatically create their cart
INSERT INTO users (email, full_name)
VALUES ('ariel@example.com', 'Ariel Martinez')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

INSERT INTO carts (user_id)
SELECT u.user_id
FROM users u
LEFT JOIN carts c ON c.user_id = u.user_id
WHERE u.email = 'ariel@example.com' AND c.cart_id IS NULL;

-- Quick check to verify the user and their linked cart exist
SELECT * FROM users;
SELECT * FROM carts;

-- 3) Products (Catalog)
-- This table holds all pre-made posters and general catalog items.
-- Prices are stored in cents for precision. “is_active” allows products to be toggled on/off.

CREATE TABLE IF NOT EXISTS products (
  product_id        BIGINT PRIMARY KEY AUTO_INCREMENT,
  title             VARCHAR(200) NOT NULL,
  description       TEXT,
  image_url         VARCHAR(500),               -- URL for the product image
  base_price_cents  INT NOT NULL,               -- stored in cents to avoid rounding errors
  qty_available     INT NOT NULL DEFAULT 0,
  is_active         TINYINT(1) NOT NULL DEFAULT 1,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Index to speed up product filtering by active status
CREATE INDEX idx_products_active ON products (is_active);

-- Add a sample catalog product for testing
INSERT INTO products (title, description, image_url, base_price_cents, qty_available)
SELECT 'Premade UTSA Skyline', 'Popular premade poster', 'https://example.com/utsa-skyline.jpg', 1999, 50
WHERE NOT EXISTS (
  SELECT 1 FROM products WHERE title = 'Premade UTSA Skyline'
);

-- Quick check to confirm product was inserted
SELECT product_id, title, base_price_cents, qty_available FROM products LIMIT 5;

-- 4) Product Variants
-- Each catalog product can have multiple versions (different sizes or finishes).
-- Variants inherit from the base product but have their own pricing and quantity.
CREATE TABLE IF NOT EXISTS product_variants (
  variant_id     BIGINT PRIMARY KEY AUTO_INCREMENT,
  product_id     BIGINT NOT NULL,
  size_label     VARCHAR(50) NOT NULL,     -- example: '12x18', '18x24'
  finish_label   VARCHAR(50) NOT NULL,     -- example: 'Matte', 'Glossy'
  price_cents    INT NOT NULL,             -- variant-specific price
  qty_available  INT NOT NULL DEFAULT 0,
  is_active      TINYINT(1) NOT NULL DEFAULT 1,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(product_id, size_label, finish_label),
  CONSTRAINT fk_variant_product
    FOREIGN KEY (product_id) REFERENCES products(product_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- Index for quick lookups of variants tied to a specific product
CREATE INDEX idx_variants_product ON product_variants (product_id);

-- Add a sample variant for the seeded product
INSERT INTO product_variants (product_id, size_label, finish_label, price_cents, qty_available)
SELECT p.product_id, '18x24', 'Matte', 2499, 20
FROM products p
WHERE p.title = 'Premade UTSA Skyline'
  AND NOT EXISTS (
    SELECT 1 FROM product_variants v
    WHERE v.product_id = p.product_id AND v.size_label='18x24' AND v.finish_label='Matte'
  )
LIMIT 1;

-- Quick check to verify the variant exists for the product
SELECT * FROM product_variants
WHERE product_id = (SELECT product_id FROM products WHERE title='Premade UTSA Skyline' LIMIT 1);


-- 5) Custom Designs (Customer Uploads)
-- This table handles all custom poster uploads from users.
-- Each entry represents a user-submitted design that includes an image URL, 
-- chosen size, finish type, and price determined by the application.
-- The “status” column tracks whether a design is pending, approved, or rejected by an administrator.

CREATE TABLE IF NOT EXISTS custom_designs (
  design_id     BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id       BIGINT NOT NULL,
  image_url     VARCHAR(500) NOT NULL,        -- URL or key to the uploaded image (stored on S3 or server)
  size_label    VARCHAR(50) NOT NULL,         -- example: '18x24'
  finish_label  VARCHAR(50) NOT NULL,         -- example: 'Matte' or 'Glossy'
  price_cents   INT NOT NULL,                 -- price stored in cents, calculated by the system
  status        ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_design_user
    FOREIGN KEY (user_id) REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- Indexes to help the admin side quickly review and filter designs by status or user
CREATE INDEX idx_custom_designs_status ON custom_designs (status, created_at);
CREATE INDEX idx_custom_designs_user   ON custom_designs (user_id, created_at);

-- Add a sample custom design tied to our test user
INSERT INTO custom_designs (user_id, image_url, size_label, finish_label, price_cents, status)
SELECT u.user_id, 'https://example.com/upload/ariel_design.png', '18x24', 'Matte', 2799, 'pending'
FROM users u
WHERE u.email='ariel@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM custom_designs d
    WHERE d.user_id = u.user_id AND d.image_url='https://example.com/upload/ariel_design.png'
  )
LIMIT 1;

-- Quick check to verify the design was inserted successfully
SELECT design_id, user_id, size_label, finish_label, price_cents, status
FROM custom_designs ORDER BY design_id DESC LIMIT 5;



-- 6) Discount Codes (Promotions)
-- This table stores discount or promotional codes that can be applied at checkout.
-- Two types of discounts are supported: 
--   - 'percent'  → percentage-based discounts (basis points, e.g., 1000 = 10%)
--   - 'fixed'    → flat amount in cents
-- Each code can have optional start/end dates, usage limits, and activation status.

CREATE TABLE IF NOT EXISTS discount_codes (
  discount_id   BIGINT PRIMARY KEY AUTO_INCREMENT,
  code          VARCHAR(64) NOT NULL UNIQUE,
  type          ENUM('percent','fixed') NOT NULL,
  value_basis   INT NOT NULL,         -- percentage: basis points (1000 = 10.00%), fixed: cents
  starts_at     DATETIME NULL,
  ends_at       DATETIME NULL,
  max_uses      INT NULL,
  used_count    INT NOT NULL DEFAULT 0,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Add an example promotion: “WELCOME10” gives 10% off all orders
INSERT INTO discount_codes (code, type, value_basis, starts_at)
SELECT 'WELCOME10','percent',1000, NOW()
WHERE NOT EXISTS (SELECT 1 FROM discount_codes WHERE code='WELCOME10');

-- Quick check: confirm discount was added
SELECT discount_id, code, type, value_basis, is_active FROM discount_codes;



-- 7) Cart Items
-- This table represents each item a user has added to their shopping cart.
-- Each row links to exactly one of the following sources:
--   - a base product (product_id)
--   - a specific variant (variant_id)
--   - a custom design (design_id)
-- Quantity and price are recorded as snapshots to preserve the exact cost at the time of addition.

CREATE TABLE IF NOT EXISTS cart_items (
  cart_item_id    BIGINT PRIMARY KEY AUTO_INCREMENT,
  cart_id         BIGINT NOT NULL,
  product_id      BIGINT NULL,
  variant_id      BIGINT NULL,
  design_id       BIGINT NULL,
  qty             INT NOT NULL,
  unit_price_cents_snapshot INT NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_ci_cart    FOREIGN KEY (cart_id)    REFERENCES carts(cart_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_ci_product FOREIGN KEY (product_id) REFERENCES products(product_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_ci_variant FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_ci_design  FOREIGN KEY (design_id)  REFERENCES custom_designs(design_id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Currently using MySQL 8.0.13, which doesn’t enforce CHECK constraints, 
-- Use of triggers to ensure that exactly one source (product, variant, or design) is always set.
DELIMITER $$

CREATE TRIGGER trg_cart_items_validate_ins
BEFORE INSERT ON cart_items
FOR EACH ROW
BEGIN
  DECLARE v_sources INT;

  -- Quantity must always be greater than zero
  IF NEW.qty <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Quantity must be greater than 0';
  END IF;

  -- Count which IDs are populated and ensure exactly one source is provided
  SET v_sources = (NEW.product_id IS NOT NULL) + (NEW.variant_id IS NOT NULL) + (NEW.design_id IS NOT NULL);
  IF v_sources <> 1 THEN
    SIGNAL SQLSTATE '45000' 
      SET MESSAGE_TEXT = 'Each cart item must reference exactly one source: product_id, variant_id, or design_id';
  END IF;
END$$


-- Update Trigger
-- Ensures that updates to cart items follow the same validation rules as inserts.
-- Each row must still reference exactly one source, and the quantity must always be greater than zero.

CREATE TRIGGER trg_cart_items_validate_upd
BEFORE UPDATE ON cart_items
FOR EACH ROW
BEGIN
  DECLARE v_sources INT;

  -- Quantity must always be greater than zero
  IF NEW.qty <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Quantity must be greater than 0';
  END IF;

  -- Check that exactly one of the three possible source IDs is provided
  SET v_sources = (NEW.product_id IS NOT NULL) + (NEW.variant_id IS NOT NULL) + (NEW.design_id IS NOT NULL);
  IF v_sources <> 1 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Each cart item must reference exactly one source: product_id, variant_id, or design_id';
  END IF;
END$$

DELIMITER ;



-- Example Inserts for Testing
-- These inserts demonstrate the three possible types of cart entries:
--  1) A catalog product variant
--  2) A custom user design
--  3) A base product (no variant)

-- Add a product variant to the user’s cart
INSERT INTO cart_items (cart_id, variant_id, qty, unit_price_cents_snapshot)
SELECT c.cart_id, v.variant_id, 2, v.price_cents
FROM carts c
JOIN users u ON u.user_id = c.user_id AND u.email='ariel@example.com'
JOIN product_variants v ON v.size_label='18x24' AND v.finish_label='Matte'
LIMIT 1;

-- Add a custom design to the user’s cart
INSERT INTO cart_items (cart_id, design_id, qty, unit_price_cents_snapshot)
SELECT c.cart_id, d.design_id, 1, d.price_cents
FROM carts c
JOIN users u ON u.user_id = c.user_id AND u.email='ariel@example.com'
JOIN custom_designs d ON d.user_id = u.user_id
ORDER BY d.design_id DESC
LIMIT 1;

-- Add a base product (no variant)
INSERT INTO cart_items (cart_id, product_id, qty, unit_price_cents_snapshot)
SELECT c.cart_id, p.product_id, 1, p.base_price_cents
FROM carts c
JOIN users u ON u.user_id = c.user_id AND u.email='ariel@example.com'
JOIN products p ON p.title='Premade UTSA Skyline'
LIMIT 1;

-- Quick check to verify all cart items
SELECT * FROM cart_items;



-- 8) Orders
-- This table represents finalized customer purchases.
-- Once a user places an order, the system records totals, applied discounts, taxes, and status.

CREATE TABLE IF NOT EXISTS orders (
  order_id        BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id         BIGINT NOT NULL,
  discount_id     BIGINT NULL,
  subtotal_cents  INT NOT NULL,
  discount_cents  INT NOT NULL DEFAULT 0,
  tax_rate_basis  INT NOT NULL DEFAULT 825,  -- 8.25% = 825 basis points
  tax_cents       INT NOT NULL,
  total_cents     INT NOT NULL,
  status          ENUM('placed','fulfilled','cancelled') NOT NULL DEFAULT 'placed',
  placed_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_o_user     FOREIGN KEY (user_id)     REFERENCES users(user_id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_o_discount FOREIGN KEY (discount_id) REFERENCES discount_codes(discount_id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;



-- 9) Order Items
-- Each record in this table represents a specific item within an order.
-- It captures a snapshot of the product details (title, size, finish, price, quantity)
-- at the time the order was placed, preserving historical accuracy even if catalog data changes later.

CREATE TABLE IF NOT EXISTS order_items (
  order_item_id       BIGINT PRIMARY KEY AUTO_INCREMENT,
  order_id            BIGINT NOT NULL,
  product_id          BIGINT NULL,
  variant_id          BIGINT NULL,
  design_id_snapshot  BIGINT NULL,          -- Stores the ID of the custom design for admin reference
  title_snapshot      VARCHAR(200) NOT NULL,
  size_label          VARCHAR(50) NULL,
  finish_label        VARCHAR(50) NULL,
  unit_price_cents    INT NOT NULL,
  qty                 INT NOT NULL,
  CONSTRAINT fk_oi_order   FOREIGN KEY (order_id)   REFERENCES orders(order_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_oi_product FOREIGN KEY (product_id) REFERENCES products(product_id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_oi_variant FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;



-- 10) Stored Procedure: sp_place_order
-- Full checkout flow, end to end. What this does:
--   • Finds the user’s cart
--   • Calculates subtotal, applies discount (percent or fixed), then 8.25% tax
--   • Creates the order record
--   • Copies cart items into order_items with snapshots (title, size, finish, price)
--   • Decrements inventory for products/variants (custom designs don’t use stock)
--   • Clears the cart on success

DELIMITER $$

CREATE PROCEDURE sp_place_order(IN p_user_id BIGINT, IN p_code VARCHAR(64))
BEGIN
  DECLARE v_cart_id BIGINT;
  DECLARE v_discount_id BIGINT;
  DECLARE v_disc_type ENUM('percent','fixed');
  DECLARE v_value_basis INT;
  DECLARE v_now DATETIME;
  DECLARE v_subtotal INT DEFAULT 0;
  DECLARE v_discount INT DEFAULT 0;
  DECLARE v_tax INT DEFAULT 0;
  DECLARE v_total INT DEFAULT 0;
  DECLARE v_tax_basis INT DEFAULT 825; -- 8.25%

  SET v_now = NOW();

  -- 1) Locate the user’s cart
  SELECT cart_id INTO v_cart_id FROM carts WHERE user_id = p_user_id;
  IF v_cart_id IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cart not found for user';
  END IF;

  -- 2) Subtotal based on cart snapshots
  SELECT COALESCE(SUM(qty * unit_price_cents_snapshot), 0)
    INTO v_subtotal
  FROM cart_items
  WHERE cart_id = v_cart_id;

  IF v_subtotal <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cart is empty';
  END IF;

  -- 3) Optional discount lookup (percent in basis points or fixed in cents)
  IF p_code IS NOT NULL AND LENGTH(TRIM(p_code)) > 0 THEN
    SELECT discount_id, type, value_basis
      INTO v_discount_id, v_disc_type, v_value_basis
    FROM discount_codes
    WHERE code = p_code
      AND is_active = 1
      AND (starts_at IS NULL OR starts_at <= v_now)
      AND (ends_at   IS NULL OR ends_at   >= v_now)
      AND (max_uses IS NULL OR used_count < max_uses)
    LIMIT 1;

    IF v_discount_id IS NOT NULL THEN
      IF v_disc_type = 'percent' THEN
        -- basis points math: 1000 = 10.00%
        SET v_discount = FLOOR( (v_subtotal * v_value_basis) / 10000 );
      ELSE
        SET v_discount = v_value_basis;
      END IF;

      -- cap at subtotal
      IF v_discount > v_subtotal THEN SET v_discount = v_subtotal; END IF;
    END IF;
  END IF;

  -- 4) Tax and total
  SET v_tax  = ROUND( (v_subtotal - v_discount) * (v_tax_basis / 10000.0) );
  SET v_total = v_subtotal - v_discount + v_tax;

  START TRANSACTION;

    -- 5) Create the order header
    INSERT INTO orders (user_id, discount_id, subtotal_cents, discount_cents, tax_rate_basis, tax_cents, total_cents, placed_at, status)
    VALUES (p_user_id, v_discount_id, v_subtotal, v_discount, v_tax_basis, v_tax, v_total, v_now, 'placed');

    -- 6) Copy cart lines to order_items with snapshots
    INSERT INTO order_items (
      order_id, product_id, variant_id, design_id_snapshot,
      title_snapshot, size_label, finish_label, unit_price_cents, qty
    )
    SELECT
      LAST_INSERT_ID() AS order_id,
      -- keep real FKs for product/variant; for custom, store the design id as a snapshot only
      ci.product_id,
      ci.variant_id,
      ci.design_id,
      -- prefer a catalog title; fallback to variant’s parent title; else “Custom Poster”
      COALESCE(p.title, pv_title.title_for_variant, 'Custom Poster') AS title_snapshot,
      COALESCE(pv.size_label, d.size_label) AS size_label,
      COALESCE(pv.finish_label, d.finish_label) AS finish_label,
      ci.unit_price_cents_snapshot,
      ci.qty
    FROM cart_items ci
    LEFT JOIN products p ON p.product_id = ci.product_id
    LEFT JOIN product_variants pv ON pv.variant_id = ci.variant_id
    LEFT JOIN custom_designs d ON d.design_id = ci.design_id
    -- helper: find the base product title for a variant
    LEFT JOIN (
      SELECT v.variant_id, p2.title AS title_for_variant
      FROM product_variants v
      JOIN products p2 ON p2.product_id = v.product_id
    ) pv_title ON pv_title.variant_id = ci.variant_id
    WHERE ci.cart_id = v_cart_id;

    -- 7) Decrement inventory (variants first)
    UPDATE product_variants v
    JOIN (
      SELECT variant_id, SUM(qty) AS total_qty
      FROM cart_items
      WHERE cart_id = v_cart_id AND variant_id IS NOT NULL
      GROUP BY variant_id
    ) x ON x.variant_id = v.variant_id
    SET v.qty_available = v.qty_available - x.total_qty;

    -- Then base products without variants
    UPDATE products p
    JOIN (
      SELECT product_id, SUM(qty) AS total_qty
      FROM cart_items
      WHERE cart_id = v_cart_id AND product_id IS NOT NULL
      GROUP BY product_id
    ) y ON y.product_id = p.product_id
    SET p.qty_available = p.qty_available - y.total_qty;

    -- Guardrails: no negative stock
    IF EXISTS (SELECT 1 FROM product_variants WHERE qty_available < 0) THEN
      ROLLBACK;
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient variant stock';
    END IF;
    IF EXISTS (SELECT 1 FROM products WHERE qty_available < 0) THEN
      ROLLBACK;
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient product stock';
    END IF;

    -- 8) Bump discount usage (if a code was applied)
    IF v_discount_id IS NOT NULL THEN
      UPDATE discount_codes
      SET used_count = used_count + 1
      WHERE discount_id = v_discount_id;
    END IF;

    -- 9) Clear the cart
    DELETE FROM cart_items WHERE cart_id = v_cart_id;

  COMMIT;
END$$

DELIMITER ;

-- Quick end-to-end test: place an order for the test user using WELCOME10
CALL sp_place_order(
  (SELECT user_id FROM users WHERE email='ariel@example.com'),
  'WELCOME10'
);

-- Inspect results
SELECT * FROM orders ORDER BY placed_at DESC LIMIT 5;
SELECT * FROM order_items ORDER BY order_id DESC, order_item_id ASC;

-- Inventory snapshots after checkout
SELECT title, qty_available FROM products;
SELECT size_label, finish_label, qty_available
FROM product_variants
WHERE product_id = (SELECT product_id FROM products WHERE title='Premade UTSA Skyline' LIMIT 1);









