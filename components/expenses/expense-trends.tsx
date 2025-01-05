'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendData {
  date: string;
  amount: number;
}

interface ExpenseTrendsProps {
  period?: 'week' | 'month' | 'year';
}

interface Expense {
  id: string;
  amount: number;
  date: string;
}

export function ExpenseTrends({ period = 'month' }: ExpenseTrendsProps) {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrendData() {
      try {
        setLoading(true);
        // Get all expenses for the period
        const response = await fetch(`/api/expenses?timeframe=${period}&limit=1000`);
        if (!response.ok) {
          throw new Error('Failed to fetch expense data');
        }
        const { expenses } = await response.json();

        // Process data for visualization
        const processedData = (expenses as Expense[]).reduce((acc: { [key: string]: number }, expense) => {
          const date = new Date(expense.date);
          let key = '';
          
          switch (period) {
            case 'week':
              key = date.toLocaleDateString('en-US', { weekday: 'short' });
              break;
            case 'month':
              key = date.getDate().toString();
              break;
            case 'year':
              key = date.toLocaleDateString('en-US', { month: 'short' });
              break;
          }

          acc[key] = (acc[key] || 0) + expense.amount;
          return acc;
        }, {});

        // Convert to array format for Recharts
        const chartData: TrendData[] = Object.entries(processedData).map(([date, amount]) => ({
          date,
          amount,
        }));

        // Sort data
        chartData.sort((a, b) => {
          if (period === 'week') {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return days.indexOf(a.date) - days.indexOf(b.date);
          }
          return a.date.localeCompare(b.date);
        });

        setData(chartData);
      } catch (error) {
        setError('Failed to load trend data');
        console.error('Error fetching trend data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrendData();
  }, [period]);

  if (loading) {
    return <div className="text-center py-4">Loading trends...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (data.length === 0) {
    return <div className="text-center text-gray-500 py-4">No data available</div>;
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
