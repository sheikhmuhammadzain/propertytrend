import React, {useState, useEffect} from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';

interface SLPRData {
  Year: number;
  Month: number;
  SLPR: number;
}

interface SalesListRatioProps {
  data: SLPRData[], 
  loading: boolean
}

const SalesListRatio: React.FC<SalesListRatioProps> = ({ data, loading }) => {
  const [salesListRatioData, setSalesListRatioData] = useState<SLPRData[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [chartType, setChartType] = useState<'bar' | 'line'>('line')

  useEffect(() => {
    setSalesListRatioData(data || [])
  }, [data])

  // Get unique years from data with null check
  const years = [...new Set((salesListRatioData || []).map(item => item.Year))].sort()

  // Filter data based on selected year with null check
  const filteredData = selectedYear === 'all' 
    ? (salesListRatioData || [])
    : (salesListRatioData || []).filter(item => item.Year === parseInt(selectedYear))

  // Format data for chart
  const chartData = filteredData.map(item => ({
    month: `${item.Year}-${item.Month.toString().padStart(2, '0')}`,
    SLPR: item.SLPR,
    year: item.Year,
    monthNum: item.Month
  })).sort((a, b) => a.year - b.year || a.monthNum - b.monthNum)

  // Get metric configuration
  const metricConfig = {
    label: 'Sales List Price Ratio',
    color: '#3b82f6',
    formatter: (value: number) => `${value.toFixed(2)}%`,
    yAxisLabel: 'SLPR (%)'
  }

  // Calculate summary stats with null checks
  const currentSLPR = chartData.length > 0 ? chartData[chartData.length - 1].SLPR : 0
  const avgSLPR = chartData.length > 0 ? chartData.reduce((sum, item) => sum + item.SLPR, 0) / chartData.length : 0
  const maxSLPR = chartData.length > 0 ? Math.max(...chartData.map(item => item.SLPR)) : 0
  const minSLPR = chartData.length > 0 ? Math.min(...chartData.map(item => item.SLPR)) : 0

  return (
    <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-white/20 rounded-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h3 className="text-slate-800 text-lg font-semibold">Sales List Price Ratio (SLPR)</h3>
          <p className="text-slate-600 text-sm">Market performance indicator over time</p>
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
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
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
                domain={[95, 100]}
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
                labelFormatter={(label) => `Period: ${label}`}
              />
              <Bar 
                dataKey="SLPR" 
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
                domain={[95, 100]}
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
                labelFormatter={(label) => `Period: ${label}`}
              />
              <Line 
                type="monotone"
                dataKey="SLPR" 
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
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Current SLPR</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              {currentSLPR.toFixed(2)}%
            </div>
          </div>
          <div className="bg-[#F2F1EF] border border-black p-3 rounded-lg">
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Average SLPR</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              {avgSLPR.toFixed(2)}%
            </div>
          </div>
          <div className="bg-[#F2F1EF] border border-black p-3 rounded-lg">
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Highest SLPR</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              {maxSLPR.toFixed(2)}%
            </div>
          </div>
          <div className="bg-[#F2F1EF] border border-black p-3 rounded-lg">
            <div className="text-sm bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent font-medium">Lowest SLPR</div>
            <div className="text-lg font-bold bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              {minSLPR.toFixed(2)}%
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalesListRatio
