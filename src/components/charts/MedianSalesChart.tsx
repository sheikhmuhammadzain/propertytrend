import React, { useState, useEffect } from 'react';
import { formatCompactNumber } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SkeletonChart } from '../ui/SkeletonChart';

interface MedianSalesChartProps {
  data: any
  loading: boolean
}

const lineColors = ['#8884d8', '#82ca9d', '#ffc658', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

const MedianSalesChart: React.FC<MedianSalesChartProps> = ({ data, loading }) => {
  const [medianSalesChartData, setMedianSalesChartData] = useState<any>(null);
  const [years, setYears] = useState<string[]>([]);

  useEffect(() => {
    if (!data) return;

    const monthMap: { [key: string]: string } = {
      '1': 'Jan', '2': 'Feb', '3': 'Mar', '4': 'Apr', '5': 'May', '6': 'Jun',
      '7': 'Jul', '8': 'Aug', '9': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
    };

    const firstMonthData = data['1'] || {};
    const availableYears = Object.keys(firstMonthData);
    setYears(availableYears);

    const chartData = Object.entries(data).map(([month, yearData]) => {
      const dataPoint: { [key: string]: string | number | null } = { month: monthMap[month] };

      for (const year of availableYears) {
        dataPoint[year] = (yearData as any)[year];
      }

      return dataPoint;
    }).filter(d => d.month);

    setMedianSalesChartData(chartData);

  }, [data]);

  return (
    <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-white/20 rounded-lg p-6 hover:shadow-xl transition-all duration-300">
      <h3 className="text-slate-800 text-lg font-semibold">Median Sales Price</h3>
      <p className="text-slate-600 text-sm mb-4">Median home sales price by year</p>
      <ResponsiveContainer width="100%" height={400}>
        {loading ? (
          <SkeletonChart />
        ) : medianSalesChartData && medianSalesChartData.length > 0 ? (
          <LineChart data={medianSalesChartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" tickFormatter={(value) => `$${formatCompactNumber(value)}`} />
            <Tooltip formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]} />
            {years.map((year, index) => (
              <Line
                key={year}
                type="monotone"
                dataKey={year}
                stroke={lineColors[index % lineColors.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            ))}
          </LineChart>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">No data available for the selected location.</p>
          </div>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default MedianSalesChart;
