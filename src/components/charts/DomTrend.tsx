import React, {useState, useEffect} from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface DomTrendProps {
  data: any
  loading: boolean
}

const DomTrend: React.FC<DomTrendProps> = ({ data, loading }) => {
  const [domTrendData, setDomTrendData] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<string>('mediandom');

  useEffect(() => {
    if (!data) return;

    // Process the data to add month names and format for charting
    const processedData = data.map((item: any) => ({
      ...item,
      monthName: new Date(item.year, item.month - 1).toLocaleDateString('en-US', { month: 'short' }),
      period: `${item.year}-${item.month.toString().padStart(2, '0')}`,
      mediandom: Math.round(item.mediandom * 10) / 10
    }));

    setDomTrendData(processedData);
    
    // Extract unique years
    const uniqueYears = [...new Set(processedData.map(item => item.year))].sort();
    setYears(uniqueYears.map(year => year.toString()));
  }, [data]);

  // Filter data by selected year
  const filteredData = selectedYear === 'all' 
    ? domTrendData 
    : domTrendData.filter(item => item.year.toString() === selectedYear);

  // Get metric configuration
  const getMetricConfig = (metric: string) => {
    const configs = {
      mediandom: {
        label: 'Median Days on Market',
        color: '#ef4444',
        formatter: (value: number) => `${value} days`,
        yAxisLabel: 'Days on Market'
      },
      listings: {
        label: 'Listings',
        color: '#3b82f6',
        formatter: (value: number) => `${value.toLocaleString()} listings`,
        yAxisLabel: 'Number of Listings'
      }
    };
    return configs[metric as keyof typeof configs] || configs.mediandom;
  };

  const metricConfig = getMetricConfig(selectedMetric);

  const handleMetricChange = (value: string) => {
    setSelectedMetric(value as 'mediandom' | 'listings');
  };

  return (
    <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-white/20 rounded-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h3 className="text-slate-800 text-lg font-semibold">Market Trends</h3>
          <p className="text-slate-600 text-sm">Median Days on Market & Listings</p>
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
            <Select value={selectedMetric} onValueChange={handleMetricChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mediandom">Days on Market</SelectItem>
                <SelectItem value="listings">Listings</SelectItem>
              </SelectContent>
            </Select>
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
        ) : filteredData && filteredData.length > 0 ? (
          <AreaChart data={filteredData} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="monthName" 
              stroke="#64748b"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke={metricConfig.color}
              label={{ 
                value: metricConfig.yAxisLabel, 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: metricConfig.color }
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
            <Area 
              type="monotone" 
              dataKey={selectedMetric} 
              stroke={metricConfig.color} 
              fill={`url(#color${selectedMetric})`} 
              strokeWidth={2}
            />
            <defs>
              <linearGradient id={`color${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={metricConfig.color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={metricConfig.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">No data available for the selected location.</p>
          </div>
        )}
      </ResponsiveContainer>

      {/* Market Insights */}
      {filteredData.length > 0 && (
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#F2F1EF] border border-black p-3 rounded-lg">
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Total Listings</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              {filteredData.reduce((sum, item) => sum + item.listings, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-[#F2F1EF] border border-black p-3 rounded-lg">
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Avg Days on Market</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              {Math.round(filteredData.reduce((sum, item) => sum + item.mediandom, 0) / filteredData.length)}
            </div>
          </div>
          <div className="bg-[#F2F1EF] border border-black p-3 rounded-lg">
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Peak Listings</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              {Math.max(...filteredData.map(item => item.listings)).toLocaleString()}
            </div>
          </div>
          <div className="bg-[#F2F1EF] border border-black p-3 rounded-lg">
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Fastest Market</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              {Math.min(...filteredData.map(item => item.mediandom))} days
            </div>
          </div>
        </div>
      )}

      {/* Market Trends Analysis */}
      {filteredData.length > 0 && (
        <div className="mt-4 p-4 bg-[#F2F1EF] border border-black rounded-lg">
          <h4 className="text-sm font-semibold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent mb-2">Market Trends</h4>
          <div className="text-xs bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent space-y-1">
            {(() => {
              const avgListings = filteredData.reduce((sum, item) => sum + item.listings, 0) / filteredData.length;
              const avgDOM = filteredData.reduce((sum, item) => sum + item.mediandom, 0) / filteredData.length;
              const recentData = filteredData.slice(-3);
              const recentAvgListings = recentData.reduce((sum, item) => sum + item.listings, 0) / recentData.length;
              const recentAvgDOM = recentData.reduce((sum, item) => sum + item.mediandom, 0) / recentData.length;
              
              const listingTrend = recentAvgListings > avgListings ? 'increasing' : 'decreasing';
              const domTrend = recentAvgDOM > avgDOM ? 'slowing' : 'accelerating';
              
              return (
                <>
                  <p>• Average listings: {Math.round(avgListings).toLocaleString()} per month</p>
                  <p>• Average days on market: {Math.round(avgDOM)} days</p>
                  <p>• Recent trend: Listings are {listingTrend}, market is {domTrend}</p>
                  {recentAvgDOM < 30 && <p>• Hot market: Properties selling quickly (under 30 days)</p>}
                  {recentAvgDOM > 60 && <p>• Slow market: Properties taking longer to sell</p>}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

export default DomTrend
