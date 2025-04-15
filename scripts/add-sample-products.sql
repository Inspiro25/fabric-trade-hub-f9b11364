
-- Add 10 detailed products for each shop
-- This script assumes shops already exist in the database

-- Get all existing shop IDs
WITH shops AS (
  SELECT id FROM shops
)
-- For each shop, insert 10 products
INSERT INTO products (
  name,
  description,
  price,
  sale_price,
  images,
  category_id,
  colors,
  sizes,
  tags,
  stock,
  is_new,
  is_trending,
  rating,
  review_count,
  shop_id
)
SELECT
  'Product ' || s.id::text || '-' || p.num AS name,
  CASE 
    WHEN p.num % 3 = 0 THEN 'This premium quality product offers excellent durability and performance.'
    WHEN p.num % 3 = 1 THEN 'Handcrafted with attention to detail and made from sustainable materials.'
    ELSE 'Designed for comfort and style, this product is a must-have for your collection.'
  END AS description,
  (1000 + (p.num * 500))::numeric AS price,
  CASE 
    WHEN p.num % 3 = 0 THEN (800 + (p.num * 400))::numeric
    ELSE NULL
  END AS sale_price,
  ARRAY[
    'https://placehold.co/600x400?text=Shop+' || s.id::text || '+Product+' || p.num,
    'https://placehold.co/600x400?text=Shop+' || s.id::text || '+Product+' || p.num || '+Alt'
  ]::text[] AS images,
  CASE 
    WHEN p.num % 5 = 0 THEN 'clothing'
    WHEN p.num % 5 = 1 THEN 'electronics'
    WHEN p.num % 5 = 2 THEN 'footwear'
    WHEN p.num % 5 = 3 THEN 'accessories'
    ELSE 'home-decor'
  END AS category_id,
  CASE 
    WHEN p.num % 4 = 0 THEN ARRAY['red', 'blue', 'black']::text[]
    WHEN p.num % 4 = 1 THEN ARRAY['green', 'yellow', 'white']::text[]
    WHEN p.num % 4 = 2 THEN ARRAY['purple', 'orange', 'pink']::text[]
    ELSE ARRAY['gray', 'brown', 'navy']::text[]
  END AS colors,
  CASE 
    WHEN p.num % 3 = 0 THEN ARRAY['S', 'M', 'L', 'XL']::text[]
    WHEN p.num % 3 = 1 THEN ARRAY['XS', 'S', 'M', 'L']::text[]
    ELSE ARRAY['M', 'L', 'XL', 'XXL']::text[]
  END AS sizes,
  CASE 
    WHEN p.num % 3 = 0 THEN ARRAY['trending', 'featured']::text[]
    WHEN p.num % 3 = 1 THEN ARRAY['new', 'seasonal']::text[]
    ELSE ARRAY['popular', 'limited-edition']::text[]
  END AS tags,
  (50 + (p.num * 10)) AS stock,
  CASE WHEN p.num <= 3 THEN true ELSE false END AS is_new,
  CASE WHEN p.num >= 7 THEN true ELSE false END AS is_trending,
  3.5 + (p.num % 3) * 0.5 AS rating,
  10 + (p.num * 5) AS review_count,
  s.id AS shop_id
FROM 
  shops s,
  generate_series(1, 10) AS p(num);
