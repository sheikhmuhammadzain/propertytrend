import React, {useState, useEffect} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface BeroMetricProps {
  data: any
  loading: boolean
}

const BeroMetric: React.FC<BeroMetricProps> = ({ data, loading }) => {
  const [marketData, setMarketData] = useState<any>(null);

  useEffect(() => {
    if (!data) return;
    setMarketData(data);
  }, [data]);

  if (loading || !marketData) {
    return (
      <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-white/20 rounded-lg p-6 hover:shadow-xl transition-all duration-300 relative">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <div className="h-5 bg-slate-200 rounded w-40 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-56"></div>
            </div>
            <div className="h-6 bg-slate-200 rounded-full w-24"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gauge Chart Skeleton */}
            <div className="lg:col-span-1">
              <div className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-white rounded-lg p-6">
                <div className="h-6 bg-slate-200 rounded w-32 mx-auto mb-4"></div>
                <div className="flex flex-col items-center">
                  <div className="w-48 h-48 bg-slate-200 rounded-full mb-4"></div>
                  <div className="flex justify-between w-full">
                    <div className="h-3 bg-slate-200 rounded w-8"></div>
                    <div className="h-3 bg-slate-200 rounded w-12"></div>
                    <div className="h-3 bg-slate-200 rounded w-6"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics Skeleton */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="border-0 shadow-md rounded-lg p-4 bg-gradient-to-br from-slate-50 to-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="h-3 bg-slate-200 rounded w-20 mb-2"></div>
                        <div className="h-6 bg-slate-200 rounded w-16"></div>
                      </div>
                      <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Market Analysis Skeleton */}
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <div className="h-4 bg-slate-200 rounded w-32 mb-3"></div>
                <div className="space-y-2">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="h-3 bg-slate-200 rounded w-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Loading Indicator */}
          <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-sm text-slate-600 font-medium">Loading market data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate market health based on barometer index
  const getMarketHealth = (index: number) => {
    if (index >= 0.8) return { status: 'Hot Market', color: 'bg-red-500', textColor: 'text-red-600', bgColor: 'bg-red-50' };
    if (index >= 0.6) return { status: 'Strong Market', color: 'bg-orange-500', textColor: 'text-orange-600', bgColor: 'bg-orange-50' };
    if (index >= 0.4) return { status: 'Balanced Market', color: 'bg-yellow-500', textColor: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    if (index >= 0.2) return { status: 'Buyer\'s Market', color: 'bg-blue-500', textColor: 'text-blue-600', bgColor: 'bg-blue-50' };
    return { status: 'Cold Market', color: 'bg-purple-500', textColor: 'text-purple-600', bgColor: 'bg-purple-50' };
  };

  const marketHealth = getMarketHealth(marketData.BarometerIndex);
  const percentage = Math.round(marketData.BarometerIndex * 100);

  // Calculate additional metrics
  const daysOnMarket = Math.round(365 / (marketData.ClosedSales / 12)); // Estimated days on market
  const monthsOfInventory = Math.round((marketData.ActiveListings / marketData.ClosedSales) * 12);
  const absorptionRate = Math.round((marketData.ClosedSales / marketData.ActiveListings) * 100);

  return (
    <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-white/20 rounded-lg p-6 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h3 className="text-slate-800 text-lg font-semibold">Market Barometer</h3>
          <p className="text-slate-600 text-sm">Real estate market health indicators</p>
        </div>
        <Badge className="bg-gradient-to-r from-black via-gray-700 to-gray-500 text-white border-0 shadow-lg">
          {marketHealth.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gauge Chart */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-slate-700">Market Index</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {/* Gauge Visualization */}
              <div className="relative w-48 h-48 mb-4">
                {/* Gauge Background */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={marketHealth.color.replace('bg-', '#')}
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - marketData.BarometerIndex)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  {/* Center text */}
                  <text x="60" y="30" textAnchor="middle" className="text-2xl font-bold fill-slate-700" transform="rotate(90 50 40)">
                    {percentage}%
                  </text>
                  <text x="40" y="80" textAnchor="middle" className="text-xs fill-slate-500" transform="rotate(90 50 62)">
                    Index
                  </text>
                </svg>
                
                {/* Market health indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full ${marketHealth.color} shadow-lg`}></div>
                </div>
              </div>
              
              {/* Gauge labels */}
              <div className="flex justify-between w-full text-xs text-slate-500">
                <span>Cold</span>
                <span>Balanced</span>
                <span>Hot</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Active Listings */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-black via-gray-800 to-gray-600 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-300 font-medium">Active Listings</p>
                    <p className="text-2xl font-bold text-white">
                      {marketData.ActiveListings.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* New Listings */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-900 via-gray-700 to-black hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-300 font-medium">New Listings</p>
                    <p className="text-2xl font-bold text-white">
                      {marketData.NewListings.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pending Sales */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-black via-gray-600 to-gray-800 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-300 font-medium">Pending Sales</p>
                    <p className="text-2xl font-bold text-white">
                      {marketData.PendingSales.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Closed Sales */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-800 via-black to-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-300 font-medium">Closed Sales</p>
                    <p className="text-2xl font-bold text-white">
                      {marketData.ClosedSales.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Analysis */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Market Analysis</h4>
            <div className="text-xs text-slate-600 space-y-2">
              <p>• <strong>Market Type:</strong> {marketHealth.status}</p>
              <p>• <strong>Barometer Index:</strong> {percentage}% ({marketData.BarometerIndex.toFixed(2)})</p>
              <p>• <strong>Supply Level:</strong> {monthsOfInventory} months of inventory available</p>
              <p>• <strong>Demand Indicator:</strong> {marketData.PendingSales} properties under contract</p>
              <p>• <strong>Market Activity:</strong> {marketData.NewListings} new listings vs {marketData.ClosedSales} closed sales</p>
              {marketData.BarometerIndex < 0.3 && <p>• <strong>Opportunity:</strong> Buyer's market - favorable conditions for buyers</p>}
              {marketData.BarometerIndex > 0.7 && <p>• <strong>Challenge:</strong> Seller's market - competitive conditions for buyers</p>}
              {marketData.BarometerIndex >= 0.3 && marketData.BarometerIndex <= 0.7 && <p>• <strong>Balance:</strong> Balanced market - fair conditions for both buyers and sellers</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeroMetric;
