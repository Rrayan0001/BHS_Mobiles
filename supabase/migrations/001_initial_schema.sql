-- BHS Mobiles Database Schema
-- Run this in Supabase SQL Editor after setting up your project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CATEGORIES TABLE
-- =====================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, display_name, slug, description) VALUES
    ('phones', 'Phones (All Brands)', 'phones', 'Mobile phones from all brands'),
    ('watches', 'Watches', 'watches', 'Smartwatches and fitness trackers'),
    ('laptops', 'Laptops', 'laptops', 'Laptops and notebooks'),
    ('airpods', 'AirPods', 'airpods', 'Wireless earbuds and headphones'),
    ('chargers', 'Chargers', 'chargers', 'Mobile and laptop chargers'),
    ('screen-protectors', 'Screen Protectors', 'screen-protectors', 'Screen protectors including bulletproof types'),
    ('back-skins', 'Back Skins & Printing', 'back-skins', 'Custom back skins and printing services');

-- =====================================================
-- 2. PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sku TEXT UNIQUE,
    price NUMERIC(10, 2) NOT NULL,
    compare_price NUMERIC(10, 2),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    condition TEXT CHECK (condition IN ('A', 'B', 'C')) DEFAULT 'A',
    status TEXT CHECK (status IN ('active', 'draft', 'out_of_stock')) DEFAULT 'active',
    images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);

-- =====================================================
-- 3. PRODUCT SPECIFICATIONS TABLE
-- =====================================================
CREATE TABLE product_specifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    spec_name TEXT NOT NULL,
    spec_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_specs_product ON product_specifications(product_id);

-- =====================================================
-- 4. USER PROFILES TABLE (extends auth.users)
-- =====================================================
CREATE TABLE users_profile (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    role TEXT CHECK (role IN ('customer', 'admin')) DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. ORDERS TABLE
-- =====================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping NUMERIC(10, 2) DEFAULT 0,
    tax NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    payment_method TEXT CHECK (payment_method IN ('cod', 'online')) DEFAULT 'cod',
    payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);

-- =====================================================
-- 6. ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_title TEXT NOT NULL,
    product_sku TEXT,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- =====================================================
-- 7. INQUIRIES TABLE
-- =====================================================
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT CHECK (status IN ('new', 'contacted', 'resolved')) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_inquiries_status ON inquiries(status);

-- =====================================================
-- DATABASE FUNCTIONS
-- =====================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to products
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to users_profile
CREATE TRIGGER update_users_profile_updated_at
    BEFORE UPDATE ON users_profile
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to orders
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    count INTEGER;
BEGIN
    SELECT COUNT(*) INTO count FROM orders;
    new_number := 'ORD-' || LPAD((count + 1)::TEXT, 5, '0');
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- CATEGORIES: Public read, admin write
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT TO public USING (true);
CREATE POLICY "Only admins can insert categories" ON categories FOR INSERT TO authenticated 
    WITH CHECK ((SELECT role FROM users_profile WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Only admins can update categories" ON categories FOR UPDATE TO authenticated 
    USING ((SELECT role FROM users_profile WHERE id = auth.uid()) = 'admin');

-- PRODUCTS: Public read, admin write
CREATE POLICY "Anyone can view active products" ON products FOR SELECT TO public 
    USING (status = 'active' OR auth.uid() IS NOT NULL);
CREATE POLICY "Only admins can insert products" ON products FOR INSERT TO authenticated 
    WITH CHECK ((SELECT role FROM users_profile WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Only admins can update products" ON products FOR UPDATE TO authenticated 
    USING ((SELECT role FROM users_profile WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Only admins can delete products" ON products FOR DELETE TO authenticated 
    USING ((SELECT role FROM users_profile WHERE id = auth.uid()) = 'admin');

-- PRODUCT SPECIFICATIONS: Follow product permissions
CREATE POLICY "Anyone can view specs" ON product_specifications FOR SELECT TO public USING (true);
CREATE POLICY "Only admins can manage specs" ON product_specifications FOR ALL TO authenticated 
    USING ((SELECT role FROM users_profile WHERE id = auth.uid()) = 'admin')
    WITH CHECK ((SELECT role FROM users_profile WHERE id = auth.uid()) = 'admin');

-- USERS PROFILE: Users see own, admins see all
CREATE POLICY "Users can view own profile" ON users_profile FOR SELECT TO authenticated 
    USING (auth.uid() = id OR (SELECT role FROM users_profile WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Users can update own profile" ON users_profile FOR UPDATE TO authenticated 
    USING (auth.uid() = id);
CREATE POLICY "Anyone can create profile on signup" ON users_profile FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = id);

-- ORDERS: Users see own, admins see all
CREATE POLICY "Users can view own orders" ON orders FOR SELECT TO authenticated 
    USING (auth.uid() = user_id OR (SELECT role FROM users_profile WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Authenticated users can create orders" ON orders FOR INSERT TO authenticated 
    WITH CHECK (true);
CREATE POLICY "Only admins can update orders" ON orders FOR UPDATE TO authenticated 
    USING ((SELECT role FROM users_profile WHERE id = auth.uid()) = 'admin');

-- ORDER ITEMS: Follow order permissions
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND (orders.user_id = auth.uid() OR (SELECT role FROM users_profile WHERE id = auth.uid()) = 'admin')
        )
    );
CREATE POLICY "Authenticated users can insert order items" ON order_items FOR INSERT TO authenticated 
    WITH CHECK (true);

-- INQUIRIES: Admins only
CREATE POLICY "Only admins can view inquiries" ON inquiries FOR SELECT TO authenticated 
    USING ((SELECT role FROM users_profile WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Anyone can submit inquiries" ON inquiries FOR INSERT TO public 
    WITH CHECK (true);

-- =====================================================
-- STORAGE SETUP
-- =====================================================

-- Create product-images bucket (do this in Supabase Dashboard > Storage)
-- Bucket name: product-images
-- Public: true
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
-- Max file size: 5MB

-- Storage policy for product images (run after creating bucket)
-- CREATE POLICY "Public can view product images" ON storage.objects FOR SELECT TO public 
--     USING (bucket_id = 'product-images');
-- CREATE POLICY "Authenticated users can upload product images" ON storage.objects FOR INSERT TO authenticated 
--     USING (bucket_id = 'product-images');
-- CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE TO authenticated 
--     USING (bucket_id = 'product-images' AND (SELECT role FROM users_profile WHERE id = auth.uid()) = 'admin');

-- =====================================================
-- NOTES
-- =====================================================
-- 1. After running this migration, create the storage bucket manually in Supabase Dashboard
-- 2. Make sure to set your admin user role to 'admin' in users_profile table
-- 3. Test RLS policies with different user roles
