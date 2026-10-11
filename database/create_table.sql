-- =============================================================
-- FILE   : create_table.sql
-- DESC   : DDL script – Database & table creation
--          Converted from Prisma schema (PostgreSQL)
-- AUTHOR : Generated from schema.prisma
-- DATE   : 2026-10-10
-- =============================================================

-- -------------------------------------------------------------
-- 1. Create Database
-- -------------------------------------------------------------
CREATE DATABASE mini_project_5;

-- Connect to the database before running the rest of this script.
-- \c mini_project_5;

-- -------------------------------------------------------------
-- 2. Table: products
--    Prisma model: Product
-- -------------------------------------------------------------
CREATE TABLE products (
    id          BIGSERIAL                   PRIMARY KEY,
    name        VARCHAR(120)                NOT NULL,
    price       DECIMAL(12, 2)              NOT NULL,
    currency    CHAR(3)                     NOT NULL DEFAULT 'USD',
    description TEXT                        NOT NULL,
    created_at  TIMESTAMPTZ(6)              NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ(6)              NOT NULL DEFAULT NOW()
);

-- Index on name for faster search/filter queries
CREATE INDEX products_name_idx ON products (name);

-- -------------------------------------------------------------
-- 3. Table: product_images
--    Prisma model: ProductImage
-- -------------------------------------------------------------
CREATE TABLE product_images (
    id          BIGSERIAL                   PRIMARY KEY,
    product_id  BIGINT                      NOT NULL,
    image_url   TEXT                        NOT NULL,
    alt_text    VARCHAR(255),
    position    SMALLINT                    NOT NULL DEFAULT 0,
    is_primary  BOOLEAN                     NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ(6)              NOT NULL DEFAULT NOW(),

    -- Foreign key → cascade delete when parent product is removed
    CONSTRAINT fk_product_images_product
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,

    -- A product cannot have two images at the same position
    CONSTRAINT uq_product_images_product_position
        UNIQUE (product_id, position)
);

-- Index for fast lookup by product_id
CREATE INDEX product_images_product_id_idx ON product_images (product_id);

-- -------------------------------------------------------------
-- 4. Table: product_variants
--    Prisma model: ProductVariant
-- -------------------------------------------------------------
CREATE TABLE product_variants (
    id          BIGSERIAL                   PRIMARY KEY,
    product_id  BIGINT                      NOT NULL,
    color       VARCHAR(50),
    size        VARCHAR(50),
    quantity    INT                         NOT NULL,
    created_at  TIMESTAMPTZ(6)              NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ(6)              NOT NULL DEFAULT NOW(),

    -- Foreign key → cascade delete when parent product is removed
    CONSTRAINT fk_product_variants_product
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,

    -- A product cannot have duplicate color + size combination
    CONSTRAINT product_variants_product_color_size_key
        UNIQUE (product_id, color, size)
);

-- Index for fast lookup by product_id
CREATE INDEX product_variants_product_id_idx ON product_variants (product_id);
