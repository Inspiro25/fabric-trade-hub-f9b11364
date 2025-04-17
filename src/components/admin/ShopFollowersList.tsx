
import React, { useState, useEffect } from 'react';
import { fetchShopFollowers } from '@/lib/supabase/shopFollows';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Follower {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  avatar_url: string;
  followed_at: string;
}

interface ShopFollowersListProps {
  shopId: string;
}

const ShopFollowersList: React.FC<ShopFollowersListProps> = ({ shopId }) => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [filteredFollowers, setFilteredFollowers] = useState<Follower[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const loadFollowers = async () => {
      setIsLoading(true);
      try {
        const data = await fetchShopFollowers(shopId);
        setFollowers(data);
        setFilteredFollowers(data);
      } catch (error) {
        console.error('Error loading followers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFollowers();
  }, [shopId]);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFollowers(followers);
      return;
    }
    
    const filtered = followers.filter(
      follower => 
        follower.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        follower.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredFollowers(filtered);
  }, [searchQuery, followers]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }
  
  if (followers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Your shop doesn't have any followers yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search followers..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="rounded-md border">
        <div className="grid grid-cols-12 gap-2 p-3 bg-muted/50 text-sm font-medium">
          <div className="col-span-5">Follower</div>
          <div className="col-span-5 hidden md:block">Email</div>
          <div className="col-span-7 md:col-span-2">Followed On</div>
        </div>
        
        {filteredFollowers.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No followers matching your search
          </div>
        ) : (
          <div className="divide-y">
            {filteredFollowers.map((follower) => (
              <div key={follower.id} className="grid grid-cols-12 gap-2 p-3 items-center text-sm">
                <div className="col-span-5 flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={follower.avatar_url || undefined} />
                    <AvatarFallback>
                      {follower.display_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{follower.display_name || 'Anonymous User'}</span>
                </div>
                <div className="col-span-5 truncate hidden md:block">
                  {follower.email || 'No email provided'}
                </div>
                <div className="col-span-7 md:col-span-2 text-muted-foreground">
                  {new Date(follower.followed_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground">
        Total followers: {followers.length}
      </div>
    </div>
  );
};

export default ShopFollowersList;
