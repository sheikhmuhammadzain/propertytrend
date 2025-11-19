import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface SalesVolumeProps {
  data: {
    year: number;
    month: number;
    salesvolume: number;
  }[];
  loading: boolean
}

const monthMap: { [key: number]: string } = {
  1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
  7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
};

const lineColors = ['#8884d8', '#82ca9d', '#ffc658', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

const SalesVolume: React.FC<SalesVolumeProps> = ({ data, loading }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('all');

  useEffect(() => {
    if (!data || data.length === 0) return;

    const uniqueYears = [...new Set(data.map(item => item.year.toString()))].sort();
    setYears(uniqueYears);

    // Filter data by selected year
    const filteredData = selectedYear === 'all' 
      ? data 
      : data.filter(item => item.year.toString() === selectedYear);

    const groupedData: { [key: string]: any } = {};

    // Initialize with all months
    for (let i = 1; i <= 12; i++) {
      groupedData[monthMap[i]] = { month: monthMap[i] };
    }

    filteredData.forEach(item => {
      const monthName = monthMap[item.month];
      if (groupedData[monthName]) {
        groupedData[monthName][item.year] = item.salesvolume;
      }
    });

    const finalChartData = Object.values(groupedData);
    setChartData(finalChartData);
  }, [data, selectedYear]);

  // Get years to display in chart based on selection
  const displayYears = selectedYear === 'all' ? years : [selectedYear];

  return (
    <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-white/20 rounded-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h3 className="text-slate-800 text-lg font-semibold">Sales Volume</h3>
          <p className="text-slate-600 text-sm">Monthly sales volume by year</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Year:</label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        ) : chartData && chartData.length > 0 ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            {displayYears.map((year, index) => (
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

export default SalesVolume;
