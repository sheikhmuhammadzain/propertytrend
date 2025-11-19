import React, {useState, useEffect} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface WeeklyPendingProps {
  data: any,
  loading: boolean
}

const WeeklyPending: React.FC<WeeklyPendingProps> = ({ data, loading }) => {
  const [weeklyPendingData, setWeeklyPendingData] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('all');

  useEffect(() => {
    if (!data) return;

    // Process the nested data structure
    const processedData: any[] = [];
    const weekData = data.data || {};
    const years = new Set<string>();

    // Extract all years from the data
    Object.values(weekData).forEach((weekInfo: any) => {
      Object.keys(weekInfo).forEach(year => years.add(year));
    });

    const sortedYears = Array.from(years).sort();
    setYears(sortedYears);

    // Transform data for charting
    Object.keys(weekData).forEach(week => {
      const weekInfo = weekData[week];
      const weekDataPoint: any = { week: `Week ${week}` };
      
      sortedYears.forEach(year => {
        weekDataPoint[year] = weekInfo[year] || 0;
      });
      
      processedData.push(weekDataPoint);
    });

    // Sort by week number
    processedData.sort((a, b) => {
      const weekA = parseInt(a.week.split(' ')[1]);
      const weekB = parseInt(b.week.split(' ')[1]);
      return weekA - weekB;
    });

    setWeeklyPendingData(processedData);
  }, [data]);

  // Filter data by selected year
  const filteredData = selectedYear === 'all' 
    ? weeklyPendingData 
    : weeklyPendingData.map(item => ({
        week: item.week,
        [selectedYear]: item[selectedYear] || 0
      }));

  // Get colors for different years
  const getYearColor = (year: string) => {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];
    const yearIndex = years.indexOf(year);
    return colors[yearIndex % colors.length];
  };

  return (
    <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-white/20 rounded-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h3 className="text-slate-800 text-lg font-semibold">Weekly Pending Sales</h3>
          <p className="text-slate-600 text-sm">Pending sales by week and year</p>
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
              dataKey="week" 
              stroke="#64748b"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#64748b"
              label={{ 
                value: 'Pending Sales', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#64748b' }
              }}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(255, 255, 255, 0.95)', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: any, name: any) => [
                value.toLocaleString(), 
                name === 'week' ? 'Week' : `${name} Pending Sales`
              ]}
              labelFormatter={(label) => `Week: ${label}`}
            />
            <Legend />
            {selectedYear === 'all' 
              ? years.map((year) => (
                  <Line 
                    key={year}
                    type="monotone" 
                    dataKey={year} 
                    stroke={getYearColor(year)} 
                    strokeWidth={2}
                    dot={{ fill: getYearColor(year), strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: getYearColor(year), strokeWidth: 2 }}
                    name={`${year} Pending`}
                  />
                ))
              : (
                  <Line 
                    type="monotone" 
                    dataKey={selectedYear} 
                    stroke={getYearColor(selectedYear)} 
                    strokeWidth={3}
                    dot={{ fill: getYearColor(selectedYear), strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: getYearColor(selectedYear), strokeWidth: 2 }}
                    name={`${selectedYear} Pending Sales`}
                  />
                )
            }
          </LineChart>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">No data available for the selected location.</p>
          </div>
        )}
      </ResponsiveContainer>

      {/* Weekly Pending Insights */}
      {filteredData.length > 0 && (
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#F2F1EF] border border-black p-3 rounded-lg">
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Total Pending</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              {(() => {
                const total = filteredData.reduce((sum, item) => {
                  if (selectedYear === 'all') {
                    return sum + years.reduce((yearSum, year) => yearSum + (item[year] || 0), 0);
                  }
                  return sum + (item[selectedYear] || 0);
                }, 0);
                return total.toLocaleString();
              })()}
            </div>
          </div>
          <div className="bg-[#F2F1EF] border border-black p-3 rounded-lg">
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Average Weekly</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              {(() => {
                const total = filteredData.reduce((sum, item) => {
                  if (selectedYear === 'all') {
                    return sum + years.reduce((yearSum, year) => yearSum + (item[year] || 0), 0);
                  }
                  return sum + (item[selectedYear] || 0);
                }, 0);
                return Math.round(total / filteredData.length).toLocaleString();
              })()}
            </div>
          </div>
          <div className="bg-[#F2F1EF] border border-black p-3 rounded-lg">
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Peak Week</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              {(() => {
                let maxValue = 0;
                let maxWeek = '';
                filteredData.forEach(item => {
                  if (selectedYear === 'all') {
                    years.forEach(year => {
                      if ((item[year] || 0) > maxValue) {
                        maxValue = item[year] || 0;
                        maxWeek = item.week;
                      }
                    });
                  } else {
                    if ((item[selectedYear] || 0) > maxValue) {
                      maxValue = item[selectedYear] || 0;
                      maxWeek = item.week;
                    }
                  }
                });
                return `${maxValue.toLocaleString()} (${maxWeek})`;
              })()}
            </div>
          </div>
          <div className="bg-[#F2F1EF] border border-black p-3 rounded-lg">
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Latest Week</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              {(() => {
                const latestWeek = filteredData[filteredData.length - 1];
                if (selectedYear === 'all') {
                  const latestTotal = years.reduce((sum, year) => sum + (latestWeek[year] || 0), 0);
                  return latestTotal.toLocaleString();
                }
                return (latestWeek[selectedYear] || 0).toLocaleString();
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Weekly Analysis */}
      {filteredData.length > 0 && (
        <div className="mt-4 p-4 bg-[#F2F1EF] border border-black rounded-lg">
          <h4 className="text-sm font-semibold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent mb-2">Weekly Analysis</h4>
          <div className="text-xs bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent space-y-1">
            {(() => {
              const totalPending = filteredData.reduce((sum, item) => {
                if (selectedYear === 'all') {
                  return sum + years.reduce((yearSum, year) => yearSum + (item[year] || 0), 0);
                }
                return sum + (item[selectedYear] || 0);
              }, 0);
              
              const avgWeekly = Math.round(totalPending / filteredData.length);
              const latestWeek = filteredData[filteredData.length - 1];
              const latestValue = selectedYear === 'all' 
                ? years.reduce((sum, year) => sum + (latestWeek[year] || 0), 0)
                : (latestWeek[selectedYear] || 0);
              
              const trend = latestValue > avgWeekly ? 'above' : 'below';
              const isStrong = latestValue > avgWeekly * 1.2;
              const isWeak = latestValue < avgWeekly * 0.8;
              
              return (
                <>
                  <p>• Total pending sales: {totalPending.toLocaleString()}</p>
                  <p>• Average weekly pending: {avgWeekly.toLocaleString()}</p>
                  <p>• Latest week: {latestValue.toLocaleString()} ({trend} average)</p>
                  {isStrong && <p>• Strong performance: Latest week significantly above average</p>}
                  {isWeak && <p>• Slower week: Latest week below average</p>}
                  {!isStrong && !isWeak && <p>• Stable performance: Latest week near average</p>}
                  {data.latest_week && <p>• Current week: {data.latest_week}</p>}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

export default WeeklyPending
