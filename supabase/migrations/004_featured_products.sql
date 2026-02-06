-- Add Featured Products Support
-- Allows marking products as featured/top picks

ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;

-- Create index for featured products
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured, featured_order) WHERE is_featured = true;
