import React, {useState, useEffect} from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';

interface HistoricalTrendProps {
  data: any
  loading: boolean
}

const HistoricalTrend: React.FC<HistoricalTrendProps> = ({ data, loading }) => {
  const [historicalTrendData, setHistoricalTrendData] = useState<any>(null);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<string>('sales');
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  useEffect(() => {
    if (!data) return;

    const combinedData = [...(Array.isArray(data) ? data : [])];
    
    const uniqueYears = [...new Set(combinedData.map(item => item.year))].sort();
    setYears(uniqueYears.map(year => year.toString()));
    
    setHistoricalTrendData(combinedData);
  }, [data]);

  // Filter data by selected year
  const filteredData = historicalTrendData?.filter((item: any) => {
    if (selectedYear === 'all') return true;
    return item.year.toString() === selectedYear;
  }) || [];

  // Process data for chart display
  const chartData = filteredData.map((item: any) => ({
    month: new Date(item.month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    sales: item.sales_volume,
    revenue: Math.round(item.sales_volume * item.avg_price),
    avg_price: Math.round(item.avg_price),
    median_price: Math.round(item.median_price),
    avg_ppsf: Math.round(item.avg_ppsf * 100) / 100,
    avg_dom: Math.round(item.avg_dom * 10) / 10
  }));

  // Get metric configuration
  const getMetricConfig = (metric: string) => {
    const configs = {
      sales: {
        label: 'Sales Volume',
        color: '#3b82f6',
        formatter: (value: number) => `${value.toLocaleString()} units`,
        yAxisLabel: 'Sales Volume'
      },
      revenue: {
        label: 'Revenue',
        color: '#8b5cf6',
        formatter: (value: number) => `$${value.toLocaleString()}`,
        yAxisLabel: 'Revenue ($)'
      },
      avg_price: {
        label: 'Average Price',
        color: '#10b981',
        formatter: (value: number) => `$${value.toLocaleString()}`,
        yAxisLabel: 'Average Price ($)'
      },
      median_price: {
        label: 'Median Price',
        color: '#f59e0b',
        formatter: (value: number) => `$${value.toLocaleString()}`,
        yAxisLabel: 'Median Price ($)'
      },
      avg_ppsf: {
        label: 'Avg Price per Sq Ft',
        color: '#ef4444',
        formatter: (value: number) => `$${value}`,
        yAxisLabel: 'Price per Sq Ft ($)'
      },
      avg_dom: {
        label: 'Avg Days on Market',
        color: '#8b5cf6',
        formatter: (value: number) => `${value} days`,
        yAxisLabel: 'Days on Market'
      }
    };
    return configs[metric as keyof typeof configs] || configs.sales;
  };

  const metricConfig = getMetricConfig(selectedMetric);

  return (
    <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-white/20 rounded-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h3 className="text-slate-800 text-lg font-semibold">Historical Trend</h3>
          <p className="text-slate-600 text-sm">Monthly performance metrics</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Metric:</label>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales Volume</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="avg_price">Average Price</SelectItem>
                <SelectItem value="median_price">Median Price</SelectItem>
                <SelectItem value="avg_ppsf">Avg Price per Sq Ft</SelectItem>
                <SelectItem value="avg_dom">Avg Days on Market</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
              className="h-8 px-3"
            >
              Bar
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
              className="h-8 px-3"
            >
              Line
            </Button>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        ) : chartData && chartData.length > 0 ? (
          chartType === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 20, right: 40, left: 80, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#64748b"
                label={{ 
                  value: metricConfig.yAxisLabel, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any) => [metricConfig.formatter(value), metricConfig.label]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar 
                dataKey={selectedMetric} 
                fill={metricConfig.color} 
                radius={[4, 4, 0, 0]}
                name={metricConfig.label}
              />
            </BarChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 20, right: 40, left: 80, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#64748b"
                label={{ 
                  value: metricConfig.yAxisLabel, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any) => [metricConfig.formatter(value), metricConfig.label]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line 
                type="monotone"
                dataKey={selectedMetric} 
                stroke={metricConfig.color}
                strokeWidth={3}
                dot={{ fill: metricConfig.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: metricConfig.color, strokeWidth: 2 }}
                name={metricConfig.label}
              />
            </LineChart>
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">No data available for the selected location.</p>
          </div>
        )}
      </ResponsiveContainer>

      {/* Summary Stats */}
      {chartData.length > 0 && (
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#F2F1EF] border border-black p-3 rounded-lg">
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Total Sales</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              {chartData.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-[#F2F1EF] border border-black p-3 rounded-lg">
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Total Revenue</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              ${chartData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-[#F2F1EF] border border-black p-3 rounded-lg">
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Avg Price</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              ${Math.round(chartData.reduce((sum, item) => sum + item.avg_price, 0) / chartData.length).toLocaleString()}
            </div>
          </div>
          <div className="bg-[#F2F1EF] border border-black p-3 rounded-lg">
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Avg Days on Market</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              {Math.round(chartData.reduce((sum, item) => sum + item.avg_dom, 0) / chartData.length)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HistoricalTrend
