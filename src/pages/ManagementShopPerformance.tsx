
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useDashboardAnalytics } from '@/hooks/use-dashboard-analytics';

const ManagementShopPerformance = () => {
  const navigate = useNavigate();
  const { analytics, isLoading } = useDashboardAnalytics();

  return (
    <div className="flex-1 space-y-4 p-3 md:p-8 pt-4 md:pt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/management/dashboard')}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Shop Performance</h2>
        </div>
        <div className="text-xs md:text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading shop performance data...</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {analytics?.shopPerformance.map((shop) => (
            <Card key={shop.name}>
              <CardHeader className="pb-2 md:pb-4">
                <CardTitle className="text-base md:text-lg">{shop.name}</CardTitle>
                <CardDescription className="text-xs md:text-sm">Performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-xs md:text-sm">
                  <div className="flex items-center justify-between">
                    <span>Total Sales:</span>
                    <span className="font-medium">${shop.sales.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Orders:</span>
                    <span className="font-medium">{shop.orders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Profit:</span>
                    <span className="font-medium">${shop.profit.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Conversion Rate:</span>
                    <span className="font-medium">{Math.round((shop.orders / 1200) * 100)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagementShopPerformance;
