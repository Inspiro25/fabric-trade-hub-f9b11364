
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/contexts/ThemeContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

interface ShopSalesStatsProps {
  shopId: string;
}

const ShopSalesStats: React.FC<ShopSalesStatsProps> = ({ shopId }) => {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [profitData, setProfitData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('bar');
  const { isDarkMode } = useTheme();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        // Fetch sales data for the last 7 days
        const { data, error } = await supabase
          .from('shop_sales_analytics')
          .select('*')
          .eq('shop_id', shopId)
          .order('date', { ascending: true })
          .limit(7);
          
        if (error) {
          throw error;
        }
        
        const formattedData = data?.map(item => ({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sales: item.sales_amount || 0,
          orders: item.orders_count || 0
        })) || [];
        
        // Calculate profit as 25% of sales
        const profitCalculated = formattedData.map(item => ({
          ...item,
          profit: Math.round(item.sales * 0.25)
        }));
        
        setSalesData(formattedData);
        setProfitData(profitCalculated);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        // Set some default data if there's an error
        const defaultData = [
          { date: 'Mon', sales: 1200, orders: 8, profit: 300 },
          { date: 'Tue', sales: 1900, orders: 12, profit: 475 },
          { date: 'Wed', sales: 1500, orders: 10, profit: 375 },
          { date: 'Thu', sales: 2200, orders: 15, profit: 550 },
          { date: 'Fri', sales: 2700, orders: 20, profit: 675 },
          { date: 'Sat', sales: 1800, orders: 13, profit: 450 },
          { date: 'Sun', sales: 2400, orders: 17, profit: 600 }
        ];
        setSalesData(defaultData);
        setProfitData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSalesData();
  }, [shopId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-[150px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartHeight = isMobile ? 200 : 250;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg md:text-xl">Sales & Profit</CardTitle>
        <CardDescription>Last 7 days performance</CardDescription>
        <Tabs defaultValue="sales" className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="profit">Profit</TabsTrigger>
            <TabsTrigger value="both">Combined</TabsTrigger>
          </TabsList>
          <TabsContent value="sales" className="pt-4">
            <div className="h-full">
              <div className="mb-2 flex items-center justify-end gap-2">
                <button 
                  onClick={() => setActiveChart('bar')}
                  className={`p-1 rounded-md text-xs ${activeChart === 'bar' 
                    ? 'bg-vyoma-primary text-white' 
                    : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  Bar
                </button>
                <button 
                  onClick={() => setActiveChart('line')}
                  className={`p-1 rounded-md text-xs ${activeChart === 'line' 
                    ? 'bg-vyoma-primary text-white' 
                    : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  Line
                </button>
              </div>
              <div className="h-[200px] md:h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  {activeChart === 'bar' ? (
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis 
                        dataKey="date" 
                        stroke={isDarkMode ? '#9ca3af' : '#4b5563'} 
                        fontSize={isMobile ? 10 : 12}
                        tick={{fontSize: isMobile ? 10 : 12}}
                      />
                      <YAxis 
                        stroke={isDarkMode ? '#9ca3af' : '#4b5563'} 
                        fontSize={isMobile ? 10 : 12}
                        tick={{fontSize: isMobile ? 10 : 12}}
                        width={40}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                          border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                          color: isDarkMode ? '#e5e7eb' : '#111827',
                          fontSize: isMobile ? 10 : 12
                        }} 
                      />
                      <Bar dataKey="sales" name="Sales ($)" fill="#ff9800" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis 
                        dataKey="date" 
                        stroke={isDarkMode ? '#9ca3af' : '#4b5563'} 
                        fontSize={isMobile ? 10 : 12}
                        tick={{fontSize: isMobile ? 10 : 12}}
                      />
                      <YAxis 
                        stroke={isDarkMode ? '#9ca3af' : '#4b5563'} 
                        fontSize={isMobile ? 10 : 12}
                        tick={{fontSize: isMobile ? 10 : 12}}
                        width={40}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                          border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                          color: isDarkMode ? '#e5e7eb' : '#111827',
                          fontSize: isMobile ? 10 : 12
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        name="Sales ($)" 
                        stroke="#ff9800" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="profit" className="pt-4">
            <div className="h-[200px] md:h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="date" 
                    stroke={isDarkMode ? '#9ca3af' : '#4b5563'} 
                    fontSize={isMobile ? 10 : 12}
                    tick={{fontSize: isMobile ? 10 : 12}}
                  />
                  <YAxis 
                    stroke={isDarkMode ? '#9ca3af' : '#4b5563'} 
                    fontSize={isMobile ? 10 : 12}
                    tick={{fontSize: isMobile ? 10 : 12}}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                      color: isDarkMode ? '#e5e7eb' : '#111827',
                      fontSize: isMobile ? 10 : 12
                    }} 
                  />
                  <Bar dataKey="profit" name="Profit ($)" fill="#4caf50" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="both" className="pt-4">
            <div className="h-[200px] md:h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="date" 
                    stroke={isDarkMode ? '#9ca3af' : '#4b5563'} 
                    fontSize={isMobile ? 10 : 12}
                    tick={{fontSize: isMobile ? 10 : 12}}
                  />
                  <YAxis 
                    stroke={isDarkMode ? '#9ca3af' : '#4b5563'} 
                    fontSize={isMobile ? 10 : 12}
                    tick={{fontSize: isMobile ? 10 : 12}}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                      border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                      color: isDarkMode ? '#e5e7eb' : '#111827',
                      fontSize: isMobile ? 10 : 12
                    }} 
                  />
                  <Bar dataKey="sales" name="Sales ($)" fill="#ff9800" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="Profit ($)" fill="#4caf50" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
};

export default ShopSalesStats;
