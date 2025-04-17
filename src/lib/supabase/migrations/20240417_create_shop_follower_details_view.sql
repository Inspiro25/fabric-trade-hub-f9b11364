-- Drop existing table or view if they exist
DROP TABLE IF EXISTS shop_follower_details;
DROP VIEW IF EXISTS shop_follower_details;

-- Create security definer functions first
CREATE OR REPLACE FUNCTION is_shop_owner(shop_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM shops s
    WHERE s.id = shop_id
    AND s.owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_own_follow(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the shop_follower_details view with RLS enabled
CREATE VIEW shop_follower_details WITH (security_barrier=true) AS
SELECT 
  sf.id,
  sf.shop_id,
  sf.user_id,
  u.raw_user_meta_data->>'full_name' as display_name,
  u.email,
  u.raw_user_meta_data->>'avatar_url' as avatar_url,
  sf.created_at as followed_at
FROM shop_follows sf
LEFT JOIN auth.users u ON sf.user_id = u.id
WHERE 
  is_shop_owner(sf.shop_id) OR 
  is_own_follow(sf.user_id);

-- Enable RLS on shop_follows table
ALTER TABLE shop_follows ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for shop_follows
CREATE POLICY "Users can view their own follows and shop owners can view their shop's follows"
ON shop_follows FOR SELECT
TO authenticated
USING (
  is_shop_owner(shop_id) OR 
  is_own_follow(user_id)
);

CREATE POLICY "Users can follow shops"
ON shop_follows FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
);

CREATE POLICY "Users can unfollow their own follows"
ON shop_follows FOR DELETE
TO authenticated
USING (
  user_id = auth.uid()
);

-- Grant necessary permissions
GRANT SELECT ON shop_follower_details TO authenticated;
GRANT ALL ON shop_follows TO authenticated; 