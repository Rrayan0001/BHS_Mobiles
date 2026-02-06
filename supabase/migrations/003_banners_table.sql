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
