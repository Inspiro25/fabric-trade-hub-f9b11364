
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesData {
  date: string;
  sales_amount: number;
  orders_count: number;
}

interface ShopSalesChartProps {
  data: SalesData[];
}

const ShopSalesChart: React.FC<ShopSalesChartProps> = ({ data }) => {
  // Format data for the chart
  const formattedData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('default', { month: 'short', day: 'numeric' }),
    sales: Number(item.sales_amount) || 0,
    orders: Number(item.orders_count) || 0
  }));
  
  // Generate sample data if no data is available
  const chartData = formattedData.length > 0 ? formattedData : generateSampleData();
  
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Bar yAxisId="left" dataKey="sales" name="Sales ($)" fill="#8884d8" />
          <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
      
      {formattedData.length === 0 && (
        <p className="text-center text-xs text-muted-foreground mt-4">
          No sales data available yet. Sample data shown.
        </p>
      )}
    </div>
  );
};

// Helper function to generate sample data when no data is available
function generateSampleData() {
  const result = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    result.push({
      date: date.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
      sales: Math.floor(Math.random() * 500) + 100,
      orders: Math.floor(Math.random() * 10) + 1
    });
  }
  
  return result;
}

export default ShopSalesChart;
