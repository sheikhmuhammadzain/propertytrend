import React, {useState, useEffect} from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface MioChartProps {
  data: any,
  loading: boolean
}

const MioChart: React.FC<MioChartProps> = ({ data, loading }) => {
  const [mioData, setMioData] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('all');

  

  useEffect(() => {
    if (!data || !data.data) return;

    // Process the new data structure where months are keys in data.data
    const processedData: any[] = [];
    const allYears = new Set<string>();

    // Extract all years from the data first
    Object.values(data.data).forEach((monthData: any) => {
      Object.keys(monthData).forEach(year => allYears.add(year));
    });

    const sortedYears = Array.from(allYears).sort();
    setYears(sortedYears);

    // Transform data for charting
    Object.entries(data.data).forEach(([month, yearData]: [string, any]) => {
      const dataPoint: any = { month: month };
      
      sortedYears.forEach(year => {
        dataPoint[year] = yearData[year] || 0;
      });
      
      processedData.push(dataPoint);
    });

    // Sort by month order
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    processedData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

    setMioData(processedData);
  }, [data]);

  // Filter data by selected year
  const filteredData = selectedYear === 'all' 
    ? mioData 
    : mioData.map(item => ({
        month: item.month,
        [selectedYear]: item[selectedYear] || 0
      }));

  // Get years to display in chart based on selection
  const displayYears = selectedYear === 'all' ? years : [selectedYear];

  return (
    <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-white/20 rounded-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h3 className="text-slate-800 text-lg font-semibold">Months of Inventory (MOI)</h3>
          <p className="text-slate-600 text-sm">Months of inventory over time</p>
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

      <ResponsiveContainer width="100%" height={350}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        ) : filteredData && filteredData.length > 0 ? (
          <LineChart data={filteredData} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              stroke="#64748b"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#06b6d4"
              label={{ 
                value: 'MIO Index', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#06b6d4' }
              }}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(255, 255, 255, 0.95)', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: any, name: any) => [value != null ? value.toFixed(2) : '0.00', `${name} MOI`]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            {displayYears.map((year, index) => {
              const colors = ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
              const color = colors[index % colors.length];
              return (
                <Line
                  key={year}
                  type="monotone"
                  dataKey={year}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: color, strokeWidth: 2 }}
                  name={year}
                />
              );
            })}
          </LineChart>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">No data available for the selected location.</p>
          </div>
        )}
      </ResponsiveContainer>


    </div>
  )
}

export default MioChart
