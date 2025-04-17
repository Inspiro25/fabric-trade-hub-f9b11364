import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate } from '@/lib/utils';
import { User } from 'lucide-react';
import { getShopFollowers } from '@/services/shopFollowService';

interface Follower {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  followed_at: string;
}

interface ShopFollowersProps {
  shopId: string;
}

export function ShopFollowers({ shopId }: ShopFollowersProps) {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFollowers() {
      try {
        setLoading(true);
        const data = await getShopFollowers(shopId);
        setFollowers(data);
      } catch (err) {
        console.error('Error fetching followers:', err);
        setError('Failed to load followers');
      } finally {
        setLoading(false);
      }
    }

    fetchFollowers();
  }, [shopId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (followers.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4">
        No followers yet
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] rounded-md border">
      <div className="p-4">
        <div className="space-y-4">
          {followers.map((follower) => (
            <div
              key={follower.id}
              className="flex items-center space-x-4 p-4 rounded-lg border bg-card"
            >
              <Avatar>
                <AvatarImage src={follower.avatar_url || undefined} />
                <AvatarFallback>
                  {follower.display_name ? follower.display_name[0].toUpperCase() : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {follower.display_name || 'Anonymous User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {follower.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  Following since {formatDate(follower.followed_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
} 