import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../ui/select';
import { apiService } from '@/services/apiServices';
import { Building2, Plus, FileSignature, CheckCircle2, Info, Loader2 } from 'lucide-react';

interface BeroMetricProps {
  data: any
  loading: boolean
  city?: string
}

const PROPERTY_TYPE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'sfh', label: 'Single Family' },
  { value: 'condo_hirise', label: 'Condo Hi Rise' },
]

const currency = (v: any) => {
  const n = Number(v)
  if (!isFinite(n) || v == null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(n)
}

const num = (v: any) => (v == null || isNaN(Number(v)) ? '—' : Number(v).toLocaleString())

// Market-type -> badge styling. Seller = hot/red, Balanced = neutral, Buyer = cool/blue.
const marketTypeStyle = (mt: string | null) => {
  switch (mt) {
    case "Seller's Market":
      return { badge: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' }
    case 'Buyer\'s Market':
      return { badge: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' }
    case 'Balanced Market':
      return { badge: 'bg-slate-200 text-slate-700 border-slate-300', dot: 'bg-slate-500' }
    default:
      return { badge: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' }
  }
}

const BeroMetric: React.FC<BeroMetricProps> = ({ data, loading, city }) => {
  // Property-type filter: 'all' uses the parent-provided data; a specific type
  // triggers a self-contained re-fetch with ?property_type=...
  const [ptFilter, setPtFilter] = useState<string>('all')
  const [localData, setLocalData] = useState<any>(null)
  const [localLoading, setLocalLoading] = useState<boolean>(false)
  const [ptError, setPtError] = useState<boolean>(false)

  // Drill-down modal state
  const [drill, setDrill] = useState<{ bucket: string; label: string } | null>(null)
  const [drillData, setDrillData] = useState<any>(null)
  const [drillLoading, setDrillLoading] = useState<boolean>(false)

  // Reset the filter whenever the parent supplies new data (e.g. city changed)
  useEffect(() => {
    setPtFilter('all')
    setLocalData(null)
    setPtError(false)
  }, [data])

  const handlePtChange = useCallback(async (value: string) => {
    setPtFilter(value)
    setPtError(false)
    if (value === 'all') {
      setLocalData(null)
      return
    }
    if (!city) return
    setLocalLoading(true)
    try {
      const res = await apiService.getChartData(
        `GET-Barometer?city=${encodeURIComponent(city)}&property_type=${value}`,
      )
      if (res.success && res.data) {
        setLocalData(res.data)
      } else {
        setLocalData(null)
        setPtError(true)
      }
    } catch {
      setLocalData(null)
      setPtError(true)
    } finally {
      setLocalLoading(false)
    }
  }, [city])

  const openDrill = useCallback(async (bucket: string, label: string) => {
    if (!city) return
    setDrill({ bucket, label })
    setDrillData(null)
    setDrillLoading(true)
    try {
      const ptParam = ptFilter !== 'all' ? `&property_type=${ptFilter}` : ''
      const res = await apiService.getChartData(
        `GET-Barometer-Transactions?city=${encodeURIComponent(city)}&bucket=${bucket}${ptParam}`,
      )
      setDrillData(res.success ? res.data : { transactions: [], count: 0 })
    } catch {
      setDrillData({ transactions: [], count: 0 })
    } finally {
      setDrillLoading(false)
    }
  }, [city, ptFilter])

  const marketData = ptFilter === 'all' ? data : localData
  const isLoading = loading || localLoading

  // Property-type dropdown — rendered in the header in every state.
  const PropertyTypeSelect = (
    <Select value={ptFilter} onValueChange={handlePtChange} disabled={!city || isLoading}>
      <SelectTrigger className="w-[170px] h-9 bg-white shadow-sm text-xs">
        <SelectValue placeholder="Property type" />
      </SelectTrigger>
      <SelectContent>
        {PROPERTY_TYPE_OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  const mt = marketData?.MarketType ?? null
  const mtStyle = marketTypeStyle(mt)

  // MoS marker position on a 0–10 scale (zones: <4 seller, 4–7 balanced, ≥7 buyer)
  const mos = marketData?.MonthsOfSupply
  const markerPct = mos == null ? null : Math.max(0, Math.min(100, (Number(mos) / 10) * 100))

  const windowRange = (w: any) => (w?.from && w?.to ? `Range: ${w.from} → ${w.to}` : 'Recent activity')

  const counters = marketData ? [
    {
      key: 'active', bucket: 'active', label: 'Active Listings', value: marketData.ActiveListings,
      icon: Building2, gradient: 'from-black via-gray-800 to-gray-600',
      tip: `Point-in-time, as of ${marketData.as_of ?? 'today'}`,
    },
    {
      key: 'new', bucket: 'new', label: 'New Listings', value: marketData.NewListings,
      icon: Plus, gradient: 'from-gray-900 via-gray-700 to-black',
      tip: windowRange(marketData.new_listings_window),
    },
    {
      key: 'pending', bucket: 'pending', label: 'Pending Sales', value: marketData.PendingSales,
      icon: FileSignature, gradient: 'from-black via-gray-600 to-gray-800',
      tip: `Point-in-time, as of ${marketData.as_of ?? 'today'}`,
    },
    {
      key: 'closed', bucket: 'closed', label: 'Closed Sales', value: marketData.ClosedSales,
      icon: CheckCircle2, gradient: 'from-gray-800 via-black to-gray-700',
      tip: windowRange(marketData.closed_sales_window),
    },
  ] : []

  return (
    <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm border-white/20 rounded-lg p-6 hover:shadow-xl transition-all duration-300">
      {/* Header (always rendered, includes property-type dropdown) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h3 className="text-slate-800 text-lg font-semibold">Market Barometer</h3>
          <p className="text-slate-600 text-sm">Real estate market health indicators</p>
        </div>
        <div className="flex items-center gap-3">
          {mt && <Badge className={`border ${mtStyle.badge} shadow-sm`}>{mt}</Badge>}
          {PropertyTypeSelect}
        </div>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 h-64 bg-slate-200 rounded-lg" />
          <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-slate-200 rounded-lg" />)}
          </div>
        </div>
      ) : !marketData ? (
        <div className="py-16 text-center text-slate-500 text-sm">
          {ptError
            ? 'No data for this property type in this area.'
            : 'No barometer data available for this area.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Months of Supply — primary headline */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-white h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-slate-700 text-base flex items-center justify-center gap-1.5">
                  Months of Supply
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-[220px] text-xs">
                        Active listings ÷ average monthly closings (trailing 12 months).
                        {marketData.moi_window?.from && ` ${windowRange(marketData.moi_window)}`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <div className="text-5xl font-bold text-slate-800 leading-none mt-2">
                  {mos == null ? '—' : Number(mos).toFixed(1)}
                </div>
                <div className="text-sm text-slate-500 mt-1">months of supply</div>

                {mt && (
                  <Badge className={`mt-3 border ${mtStyle.badge}`}>
                    <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${mtStyle.dot}`} />
                    {mt}
                  </Badge>
                )}

                {/* Market-type scale */}
                {markerPct != null && (
                  <div className="w-full mt-5">
                    <div className="relative h-2 rounded-full overflow-hidden flex">
                      <div className="bg-red-400" style={{ width: '40%' }} />
                      <div className="bg-amber-300" style={{ width: '30%' }} />
                      <div className="bg-blue-400" style={{ width: '30%' }} />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-slate-700 shadow"
                        style={{ left: `${markerPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between w-full text-[10px] text-slate-400 mt-1">
                      <span>Seller</span>
                      <span>Balanced</span>
                      <span>Buyer</span>
                    </div>
                  </div>
                )}

                {marketData.as_of && (
                  <div className="text-xs text-slate-400 mt-4">Data as of {marketData.as_of}</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Counters + analysis */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {counters.map(({ key, bucket, label, value, icon: Icon, gradient, tip }) => (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => openDrill(bucket, label)}
                      className="text-left"
                    >
                      <Card className={`border-0 shadow-xl bg-gradient-to-br ${gradient} hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-gray-300 font-medium">{label}</p>
                              <p className="text-2xl font-bold text-white">{num(value)}</p>
                            </div>
                            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{tip}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Click to view transactions</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Market Analysis */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Market Analysis</h4>
              <div className="text-xs text-slate-600 space-y-2">
                {mt && <p>• <strong>Market Type:</strong> {mt}</p>}
                <p>• <strong>Months of Supply:</strong> {mos == null ? 'Not enough data' : `${Number(mos).toFixed(1)} months`}</p>
                <p>• <strong>Demand:</strong> {num(marketData.PendingSales)} under contract · {num(marketData.ClosedSales)} closed{marketData.window_days ? ` (last ${marketData.window_days} days)` : ''}</p>
                <p>• <strong>Activity:</strong> {num(marketData.NewListings)} new listings{marketData.window_days ? ` (last ${marketData.window_days} days)` : ''}</p>
              </div>
              {Array.isArray(marketData.property_types_applied) && marketData.property_types_applied.length > 0 && (
                <p className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-200">
                  Showing: {marketData.property_types_applied.join(', ')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Transaction drill-down modal */}
      <Dialog open={!!drill} onOpenChange={(open) => { if (!open) setDrill(null) }}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-slate-800">
              {drill?.label} {drillData?.count != null && !drillLoading ? `· ${drillData.count}` : ''}
            </DialogTitle>
          </DialogHeader>

          {drillLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading transactions…
            </div>
          ) : !drillData?.transactions?.length ? (
            <div className="py-16 text-center text-slate-500 text-sm">No transactions found.</div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-white border-b border-slate-200">
                  <tr className="text-slate-500">
                    <th className="px-3 py-2 font-medium">MLS ID</th>
                    <th className="px-3 py-2 font-medium">Address</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">On-Market</th>
                    <th className="px-3 py-2 font-medium">Close</th>
                    <th className="px-3 py-2 font-medium text-right">List Price</th>
                    <th className="px-3 py-2 font-medium text-right">Close Price</th>
                  </tr>
                </thead>
                <tbody>
                  {drillData.transactions.map((t: any, i: number) => (
                    <tr key={`${t.mls_id}-${i}`} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-3 py-2 text-slate-700">{t.mls_id ?? '—'}</td>
                      <td className="px-3 py-2 text-slate-700">{t.address ?? '—'}</td>
                      <td className="px-3 py-2 text-slate-600">{t.status ?? '—'}</td>
                      <td className="px-3 py-2 text-slate-600">{t.onmarketdate ?? '—'}</td>
                      <td className="px-3 py-2 text-slate-600">{t.closedate ?? '—'}</td>
                      <td className="px-3 py-2 text-right text-slate-700">{currency(t.listprice)}</td>
                      <td className="px-3 py-2 text-right text-slate-700">{currency(t.closeprice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BeroMetric;
