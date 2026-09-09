-- Migration: Add BAG type to ProductType enum
-- This migration adds BAG as a new product type option
-- Run this in Cloudflare D1 Console for production

-- Note: SQLite doesn't support ALTER TYPE, so we need to recreate the enum values
-- Since ProductType is stored as TEXT in SQLite, we just need to ensure
-- the application code accepts 'BAG' as a valid value.
-- The Prisma schema change is sufficient for the application.

-- For SQLite, no actual SQL migration is needed since enums are stored as TEXT
-- However, we document this change here for reference.

-- The ProductType enum now supports: WATCH, JEWELLERY, BAG
-- All existing data remains unchanged, new products can use type='BAG'
