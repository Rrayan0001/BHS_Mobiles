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

-- Test the trigger
-- UPDATE products SET stock = 0 WHERE id = 'some-product-id';
-- Should automatically set status to 'out_of_stock'
