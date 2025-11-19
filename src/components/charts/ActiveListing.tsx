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

interface ActiveListingProps {
  data: any,
  loading: boolean
}

const ActiveListing: React.FC<ActiveListingProps> = ({ data, loading }) => {
  const [activeListingData, setActiveListingData] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('all');

  useEffect(() => {
    if (!data) return;

    // Process the data to add month names and format for charting
    const processedData = data.map((item: any) => ({
      ...item,
      monthName: new Date(item.Year, item.Month - 1).toLocaleDateString('en-US', { month: 'short' }),
      period: `${item.Year}-${item.Month.toString().padStart(2, '0')}`,
      year: item.Year,
      month: item.Month,
      activeListings: item.ActiveListings
    }));

    setActiveListingData(processedData);
    
    // Extract unique years
    const uniqueYears = [...new Set(processedData.map(item => item.Year))].sort();
    setYears(uniqueYears.map(year => year.toString()));
  }, [data]);

  // Filter data by selected year
  const filteredData = selectedYear === 'all' 
    ? activeListingData 
    : activeListingData.filter(item => item.Year.toString() === selectedYear);

  return (
    <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-white/20 rounded-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h3 className="text-slate-800 text-lg font-semibold">Active Listings Trend</h3>
          <p className="text-slate-600 text-sm">Monthly active listings over time</p>
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
              stroke="#10b981"
              label={{ 
                value: 'Active Listings', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#10b981' }
              }}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(255, 255, 255, 0.95)', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: any) => [`${value.toLocaleString()} listings`, 'Active Listings']}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="activeListings" 
              stroke="#10b981" 
              fill="url(#colorActiveListings)" 
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="colorActiveListings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">No data available for the selected location.</p>
          </div>
        )}
      </ResponsiveContainer>

      {/* Active Listings Insights */}
      {filteredData.length > 0 && (
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#F2F1EF] border border-black p-3 rounded-lg">
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Total Active</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              {filteredData.reduce((sum, item) => sum + item.activeListings, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-[#F2F1EF] border border-black p-3 rounded-lg">
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Average Monthly</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              {Math.round(filteredData.reduce((sum, item) => sum + item.activeListings, 0) / filteredData.length).toLocaleString()}
            </div>
          </div>
          <div className="bg-[#F2F1EF] border border-black p-3 rounded-lg">
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Peak Month</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              {Math.max(...filteredData.map(item => item.activeListings)).toLocaleString()}
            </div>
          </div>
          <div className="bg-[#F2F1EF] border border-black p-3 rounded-lg">
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Growth Rate</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              {(() => {
                if (filteredData.length < 2) return 'N/A';
                const first = filteredData[0].activeListings;
                const last = filteredData[filteredData.length - 1].activeListings;
                const growth = ((last - first) / first * 100);
                return `${growth > 0 ? '+' : ''}${Math.round(growth)}%`;
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Growth Analysis */}
      {filteredData.length > 0 && (
        <div className="mt-4 p-4 bg-[#F2F1EF] border border-black rounded-lg">
          <h4 className="text-sm font-semibold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent mb-2">Growth Analysis</h4>
          <div className="text-xs bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent space-y-1">
            {(() => {
              const totalListings = filteredData.reduce((sum, item) => sum + item.activeListings, 0);
              const avgMonthly = Math.round(totalListings / filteredData.length);
              const peakMonth = Math.max(...filteredData.map(item => item.activeListings));
              const recentData = filteredData.slice(-3);
              const recentAvg = Math.round(recentData.reduce((sum, item) => sum + item.activeListings, 0) / recentData.length);
              const overallAvg = Math.round(filteredData.reduce((sum, item) => sum + item.activeListings, 0) / filteredData.length);
              
              const growthTrend = recentAvg > overallAvg ? 'accelerating' : 'decelerating';
              const isGrowing = recentAvg > overallAvg;
              
              return (
                <>
                  <p>• Total active listings: {totalListings.toLocaleString()}</p>
                  <p>• Average monthly listings: {avgMonthly.toLocaleString()}</p>
                  <p>• Peak month: {peakMonth.toLocaleString()} listings</p>
                  <p>• Recent trend: Growth is {growthTrend}</p>
                  {isGrowing && <p>• Strong growth: Recent months above average</p>}
                  {!isGrowing && <p>• Stabilizing: Recent months at or below average</p>}
                  {peakMonth > 1000 && <p>• High volume: Peak month exceeded 1,000 listings</p>}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

export default ActiveListing
