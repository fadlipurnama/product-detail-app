-- =============================================================
-- FILE   : seed_data.sql
-- DESC   : DML script – Initial seed data
--          Converted from prisma/seed.js
-- AUTHOR : Generated from seed.js
-- DATE   : 2026-10-10
-- =============================================================

-- Run this AFTER create_table.sql has been executed.
-- \c mini_project_5;

-- Wrap everything in a transaction so it's all-or-nothing
BEGIN;

-- -------------------------------------------------------------
-- 1. Insert product (id = 1)
-- -------------------------------------------------------------
INSERT INTO products (id, name, price, currency, description)
VALUES (
    1,
    'Adjustable Chill Pillow',
    89.00,
    'USD',
    'Adjustable cooling pillow with removable fill for a personalized loft. Features a cool-touch cover and customizable support layers for the perfect sleep experience.'
);

-- -------------------------------------------------------------
-- 2. Insert product images (6 images for product_id = 1)
--    Derived from the productImages array in seed.js
-- -------------------------------------------------------------
INSERT INTO product_images (product_id, image_url, alt_text, position, is_primary)
VALUES
    (1, '/assets/images/leesa-bedding-adjustablechillpillow-01.jpg', 'Adjustable Chill Pillow - Main',       0, TRUE),
    (1, '/assets/images/adjustable-chill-hand-press-still-02.jpg',  'Adjustable Chill Pillow - Hand Press',  1, FALSE),
    (1, '/assets/images/leesa-bedding-adjustablechillpillow-03.jpg', 'Adjustable Chill Pillow - Image 03',   2, FALSE),
    (1, '/assets/images/leesa-bedding-adjustablechillpillow-04.jpg', 'Adjustable Chill Pillow - Image 04',   3, FALSE),
    (1, '/assets/images/leesa-bedding-adjustablechillpillow-05.jpg', 'Adjustable Chill Pillow - Image 05',   4, FALSE),
    (1, '/assets/images/leesa-bedding-adjustablechillpillow-06.jpg', 'Adjustable Chill Pillow - Image 06',   5, FALSE);

-- -------------------------------------------------------------
-- 3. Insert product variants (2 variants for product_id = 1)
-- -------------------------------------------------------------
INSERT INTO product_variants (product_id, color, size, quantity)
VALUES
    (1, 'White', 'Queen', 10),
    (1, 'White', 'King',   8);

-- Reset the BIGSERIAL sequences so that the next auto-generated
-- id continues from the correct value after manual id inserts.
SELECT setval(pg_get_serial_sequence('products',        'id'), MAX(id)) FROM products;
SELECT setval(pg_get_serial_sequence('product_images',  'id'), MAX(id)) FROM product_images;
SELECT setval(pg_get_serial_sequence('product_variants','id'), MAX(id)) FROM product_variants;

COMMIT;
