-- Function to update product stock
CREATE OR REPLACE FUNCTION update_product_stock(p_id UUID, quantity INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE products
    SET stock = stock - quantity,
        updated_at = NOW()
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql; 