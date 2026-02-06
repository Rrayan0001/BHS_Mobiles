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
