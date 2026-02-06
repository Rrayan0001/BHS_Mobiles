-- ============================================================================
-- COMBINED MIGRATIONS: 002 through 005
-- Run this entire file in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- HELPER FUNCTION: Update updated_at timestamp
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- MIGRATION 002: Auto Stock Status Trigger
-- ============================================================================

-- Auto Stock Status Trigger
-- This trigger automatically updates product status based on stock level

CREATE OR REPLACE FUNCTION auto_stock_status()
RETURNS TRIGGER AS $$
BEGIN
    -- When stock becomes 0, mark as out_of_stock
    IF NEW.stock = 0 AND OLD.stock > 0 THEN
        NEW.status = 'out_of_stock';
    -- When stock increases from 0, mark as active (if it was out_of_stock)
    ELSIF NEW.stock > 0 AND OLD.stock = 0 AND OLD.status = 'out_of_stock' THEN
        NEW.status = 'active';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on products table
DROP TRIGGER IF EXISTS products_auto_stock_trigger ON products;

CREATE TRIGGER products_auto_stock_trigger
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION auto_stock_status();


-- ============================================================================
-- MIGRATION 003: Banners Table
-- ============================================================================

-- Banners Table for Hero Section Management
-- Allows admin to upload and manage hero/banner images

CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    button_text TEXT DEFAULT 'Shop Now',
    is_active BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Public can view active banners
CREATE POLICY "Anyone can view active banners" ON banners FOR SELECT TO public
    USING (is_active = true);

-- Admins can manage all banners
CREATE POLICY "Admins can insert banners" ON banners FOR INSERT TO authenticated
    WITH CHECK ((SELECT role FROM users_profile WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update banners" ON banners FOR UPDATE TO authenticated
    USING ((SELECT role FROM users_profile WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can delete banners" ON banners FOR DELETE TO authenticated
    USING ((SELECT role FROM users_profile WHERE id = auth.uid()) = 'admin');

-- Trigger for updated_at
CREATE TRIGGER banners_updated_at
    BEFORE UPDATE ON banners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Create index for faster queries
CREATE INDEX idx_banners_active ON banners(is_active, display_order);


-- ============================================================================
-- MIGRATION 004: Featured Products
-- ============================================================================

-- Add Featured Products Support
-- Allows marking products as featured/top picks

ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;

-- Create index for featured products
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured, featured_order) WHERE is_featured = true;


-- ============================================================================
-- MIGRATION 005: Product Reviews Table
-- ============================================================================

-- Product Reviews Table
-- Customer reviews with star ratings and admin moderation

CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    customer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Add rating fields to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Enable RLS
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view approved reviews
CREATE POLICY "Anyone can view approved reviews" ON product_reviews FOR SELECT TO public
    USING (status = 'approved');

-- Authenticated users can submit reviews
CREATE POLICY "Authenticated users can submit reviews" ON product_reviews FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can view their own reviews
CREATE POLICY "Users can view own reviews" ON product_reviews FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR status = 'approved');

-- Admins can moderate reviews
CREATE POLICY "Admins can update reviews" ON product_reviews FOR UPDATE TO authenticated
    USING ((SELECT role FROM users_profile WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can delete reviews" ON product_reviews FOR DELETE TO authenticated
    USING ((SELECT role FROM users_profile WHERE id = auth.uid()) = 'admin');

-- Trigger for updated_at
CREATE TRIGGER reviews_updated_at
    BEFORE UPDATE ON product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Function to update product rating when review is approved
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Recalculate average rating and count for the product
    UPDATE products
    SET 
        avg_rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM product_reviews
            WHERE product_id = NEW.product_id AND status = 'approved'
        ),
        review_count = (
            SELECT COUNT(*)
            FROM product_reviews
            WHERE product_id = NEW.product_id AND status = 'approved'
        )
    WHERE id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update rating when review status changes to approved
CREATE TRIGGER update_rating_on_approval
    AFTER INSERT OR UPDATE ON product_reviews
    FOR EACH ROW
    WHEN (NEW.status = 'approved')
    EXECUTE FUNCTION update_product_rating();

-- Create indexes
CREATE INDEX idx_reviews_product ON product_reviews(product_id, status);
CREATE INDEX idx_reviews_status ON product_reviews(status);


-- ============================================================================
-- MIGRATIONS COMPLETE
-- All Option A and Option B database changes are now applied!
-- ============================================================================
