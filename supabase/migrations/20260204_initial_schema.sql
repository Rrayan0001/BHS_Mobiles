-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  addresses JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subcategories table
CREATE TABLE IF NOT EXISTS public.subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attribute_definitions table
CREATE TABLE IF NOT EXISTS public.attribute_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subcategory_id UUID NOT NULL REFERENCES public.subcategories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'number', 'select', 'textarea')),
  options JSONB,
  is_filterable BOOLEAN DEFAULT false,
  is_required BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subcategory_id UUID NOT NULL REFERENCES public.subcategories(id) ON DELETE RESTRICT,
  sku TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_at_price DECIMAL(10, 2),
  stock_quantity INTEGER DEFAULT 0,
  condition_grade TEXT NOT NULL CHECK (condition_grade IN ('A', 'B', 'C')),
  warranty_months INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_attributes table
CREATE TABLE IF NOT EXISTS public.product_attributes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  attribute_definition_id UUID NOT NULL REFERENCES public.attribute_definitions(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, attribute_definition_id)
);

-- Create product_images table
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  price_snapshot DECIMAL(10, 2) NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  product_snapshot JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicle_inquiries table
CREATE TABLE IF NOT EXISTS public.vehicle_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  preferred_contact_time TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON public.products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_condition ON public.products(condition_grade);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_product_attributes_product ON public.product_attributes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_inquiries_product ON public.vehicle_inquiries(product_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_inquiries_status ON public.vehicle_inquiries(status);

-- Create full-text search index on products
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribute_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);

-- RLS Policies for subcategories (public read)
CREATE POLICY "Anyone can view subcategories" ON public.subcategories FOR SELECT USING (true);

-- RLS Policies for attribute_definitions (public read)
CREATE POLICY "Anyone can view attribute definitions" ON public.attribute_definitions FOR SELECT USING (true);

-- RLS Policies for products (public read for published)
CREATE POLICY "Anyone can view published products" ON public.products FOR SELECT USING (status = 'published');

-- RLS Policies for product_attributes (public read)
CREATE POLICY "Anyone can view product attributes" ON public.product_attributes FOR SELECT USING (true);

-- RLS Policies for product_images (public read)
CREATE POLICY "Anyone can view product images" ON public.product_images FOR SELECT USING (true);

-- RLS Policies for cart_items
CREATE POLICY "Users can view own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cart items" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart items" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cart items" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- RLS Policies for vehicle_inquiries (anyone can create)
CREATE POLICY "Anyone can create vehicle inquiries" ON public.vehicle_inquiries FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicle_inquiries_updated_at BEFORE UPDATE ON public.vehicle_inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (name, slug, description, icon, sort_order) VALUES
  ('Electronics', 'electronics', 'Smartphones, wearables, and accessories', '📱', 1),
  ('Vehicles', 'vehicles', 'Cars and bikes', '🚗', 2)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample subcategories
INSERT INTO public.subcategories (category_id, name, slug, description, seo_description)
SELECT 
  c.id,
  'Smartphones',
  'smartphones',
  'Refurbished and tested smartphones',
  'Buy certified refurbished smartphones with warranty. Grade A, B, C devices tested and guaranteed.'
FROM public.categories c WHERE c.slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, description, seo_description)
SELECT 
  c.id,
  'Accessories',
  'accessories',
  'Phone accessories and chargers',
  'Quality phone accessories including chargers, cables, and cases at affordable prices.'
FROM public.categories c WHERE c.slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, description, seo_description)
SELECT 
  c.id,
  'Wearables',
  'wearables',
  'Smartwatches and earbuds',
  'Refurbished smartwatches and wireless earbuds with warranty and testing.'
FROM public.categories c WHERE c.slug = 'electronics'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, description, seo_description)
SELECT 
  c.id,
  'Cars',
  'cars',
  'Pre-owned cars',
  'Quality pre-owned cars with detailed inspection reports and service history.'
FROM public.categories c WHERE c.slug = 'vehicles'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.subcategories (category_id, name, slug, description, seo_description)
SELECT 
  c.id,
  'Bikes',
  'bikes',
  'Pre-owned motorcycles',
  'Pre-owned motorcycles and scooters with verified documents and inspection.'
FROM public.categories c WHERE c.slug = 'vehicles'
ON CONFLICT (slug) DO NOTHING;

-- Insert attribute definitions for smartphones
INSERT INTO public.attribute_definitions (subcategory_id, name, label, type, options, is_filterable, is_required, sort_order)
SELECT 
  s.id,
  'brand',
  'Brand',
  'select',
  '["Apple", "Samsung", "OnePlus", "Xiaomi", "Realme", "Oppo", "Vivo", "Google", "Motorola", "Nokia"]'::jsonb,
  true,
  true,
  1
FROM public.subcategories s WHERE s.slug = 'smartphones'
ON CONFLICT DO NOTHING;

INSERT INTO public.attribute_definitions (subcategory_id, name, label, type, options, is_filterable, is_required, sort_order)
SELECT 
  s.id,
  'model',
  'Model',
  'text',
  NULL,
  true,
  true,
  2
FROM public.subcategories s WHERE s.slug = 'smartphones'
ON CONFLICT DO NOTHING;

INSERT INTO public.attribute_definitions (subcategory_id, name, label, type, options, is_filterable, is_required, sort_order)
SELECT 
  s.id,
  'storage',
  'Storage',
  'select',
  '["64GB", "128GB", "256GB", "512GB", "1TB"]'::jsonb,
  true,
  true,
  3
FROM public.subcategories s WHERE s.slug = 'smartphones'
ON CONFLICT DO NOTHING;

INSERT INTO public.attribute_definitions (subcategory_id, name, label, type, options, is_filterable, is_required, sort_order)
SELECT 
  s.id,
  'ram',
  'RAM',
  'select',
  '["4GB", "6GB", "8GB", "12GB", "16GB"]'::jsonb,
  true,
  true,
  4
FROM public.subcategories s WHERE s.slug = 'smartphones'
ON CONFLICT DO NOTHING;

INSERT INTO public.attribute_definitions (subcategory_id, name, label, type, options, is_filterable, is_required, sort_order)
SELECT 
  s.id,
  'color',
  'Color',
  'select',
  '["Black", "White", "Blue", "Green", "Red", "Gold", "Silver", "Purple", "Pink"]'::jsonb,
  true,
  false,
  5
FROM public.subcategories s WHERE s.slug = 'smartphones'
ON CONFLICT DO NOTHING;

INSERT INTO public.attribute_definitions (subcategory_id, name, label, type, options, is_filterable, is_required, sort_order)
SELECT 
  s.id,
  'battery_health',
  'Battery Health (%)',
  'number',
  NULL,
  true,
  false,
  6
FROM public.subcategories s WHERE s.slug = 'smartphones'
ON CONFLICT DO NOTHING;

INSERT INTO public.attribute_definitions (subcategory_id, name, label, type, options, is_filterable, is_required, sort_order)
SELECT 
  s.id,
  'imei',
  'IMEI',
  'text',
  NULL,
  false,
  false,
  7
FROM public.subcategories s WHERE s.slug = 'smartphones'
ON CONFLICT DO NOTHING;

INSERT INTO public.attribute_definitions (subcategory_id, name, label, type, options, is_filterable, is_required, sort_order)
SELECT 
  s.id,
  'accessories_included',
  'Accessories Included',
  'text',
  NULL,
  false,
  false,
  8
FROM public.subcategories s WHERE s.slug = 'smartphones'
ON CONFLICT DO NOTHING;
