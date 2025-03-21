
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { fetchDashboardAnalytics, DashboardAnalytics } from '@/lib/analytics/service';

export const useDashboardAnalytics = () => {
  // Query to fetch dashboard analytics
  const { 
    data: analytics,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['dashboardAnalytics'],
    queryFn: fetchDashboardAnalytics,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  // Return the query results
  return {
    analytics: analytics as DashboardAnalytics,
    isLoading,
    isError,
    error,
    refetch
  };
};
