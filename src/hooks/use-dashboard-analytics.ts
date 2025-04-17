
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
    queryFn: async () => {
      try {
        return await fetchDashboardAnalytics();
      } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        if (error instanceof Error && error.message.includes('<!DOCTYPE')) {
          throw new Error('Server returned HTML instead of JSON. Please check your API endpoint configuration.');
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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
