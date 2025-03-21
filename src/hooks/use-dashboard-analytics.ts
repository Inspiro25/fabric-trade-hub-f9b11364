
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
  });

  // Handle query errors
  if (isError && error) {
    console.error('Error fetching dashboard analytics:', error);
    toast({
      title: "Error fetching analytics",
      description: "Could not load dashboard data.",
      variant: "destructive",
    });
  }

  return {
    analytics: analytics as DashboardAnalytics,
    isLoading,
    isError,
    refetch
  };
};
