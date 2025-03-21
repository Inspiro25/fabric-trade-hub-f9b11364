
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { fetchDashboardAnalytics, DashboardAnalytics, seedAnalyticsData } from '@/lib/analytics/service';

export const useDashboardAnalytics = () => {
  const [shouldSeedData, setShouldSeedData] = useState(false);

  // Run once on component mount to seed data if needed
  useEffect(() => {
    // This is a helper for development/testing purposes
    if (import.meta.env.DEV && shouldSeedData) {
      seedAnalyticsData()
        .then(() => {
          toast({
            title: "Analytics data seeded",
            description: "Sample analytics data has been added to the database.",
          });
          setShouldSeedData(false);
        })
        .catch((error) => {
          console.error('Error seeding data:', error);
          toast({
            title: "Error seeding data",
            description: "Failed to seed analytics data.",
            variant: "destructive",
          });
        });
    }
  }, [shouldSeedData]);

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
  useEffect(() => {
    if (isError && error) {
      console.error('Error fetching dashboard analytics:', error);
      toast({
        title: "Error fetching analytics",
        description: "Could not load dashboard data. Using fallback data.",
        variant: "destructive",
      });
    }
  }, [isError, error]);

  return {
    analytics: analytics as DashboardAnalytics,
    isLoading,
    isError,
    refetch,
    seedData: () => setShouldSeedData(true),
  };
};
