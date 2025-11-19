import {useState, useEffect} from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import methodologyPdf from '@/assets/methodology.pdf'

interface PropertyData {
  pricerange: string;
  "Pending/ Signed Contract": number | null;
  "Price Adjustments": number | null;
  "Sold and Closed": number | null;
  "New Listings": number | null;
  "DOM": number | null;
  "List to Close +/-": number | null;
  "Total Actives": number | null;
  "Last Month": number | string | null;
  "Last Quarter": number | string | null;
  "Last Year": number | string | null;
  "Trending < >": string;
}

interface SFProps {
  data: PropertyData[],
  loading?: boolean,
  city: string
}

const SF = ({ data, loading = false, city }: SFProps) => {
  const [sfData, setSFData] = useState(data)

  useEffect(() => {
    console.log(data)
    setSFData(data)
  }, [data])

  const getTrendingIcon = (trend: string) => {
    switch (trend) {
      case "↑":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "↓":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  }

  const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return 'text-green-600';
    if (change.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  }

  const exportToCSV = () => {
    if (!sfData || sfData.length === 0) {
      alert('No data to export');
      return;
    }

    // Define headers for CSV
    const headers = [
      'Price Range',
      'Pending/Signed Contract',
      'Price Adjustments',
      'Sold and Closed',
      'New Listings',
      'DOM',
      'List to Close +/-',
      'Total Actives',
      'Last Month',
      'Last Quarter',
      'Last Year',
      'Trending'
    ];

    // Convert data to CSV format
    const csvContent = [
      headers.join(','),
      ...sfData.map(item => [
        `"${item.pricerange}"`,
        item["Pending/ Signed Contract"] !== null ? item["Pending/ Signed Contract"] : '',
        item["Price Adjustments"] !== null ? item["Price Adjustments"] : '',
        item["Sold and Closed"] !== null ? item["Sold and Closed"] : '',
        item["New Listings"] !== null ? item["New Listings"] : '',
        item["DOM"] !== null ? item["DOM"] : '',
        item["List to Close +/-"] !== null ? item["List to Close +/-"] : '',
        item["Total Actives"] !== null ? item["Total Actives"] : '',
        `${item["Last Month"] ?? ''}`,
        `${item["Last Quarter"] ?? ''}`,
        `${item["Last Year"] ?? ''}`,
        `"${item["Trending < >"]}"`
      ].join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `property-market-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  const headerTooltips: Record<string, string> = {
    "PRICE RANGE": "Listing price band for the properties summarized in this row.",
    "PENDING": "Pending / Signed Contract — Properties under contract during the selected month. Indicates real-time demand and market velocity.",
    "ACTIVE": "Active listings during the selected month. Indicates available inventory and competition.",
    "CLOSED": "Sold and closed during the selected month. Reflects realized demand.",
    "NEW": "New listings added during the selected month. Signals fresh supply.",
    "CHANGED": "Listings with price adjustments during the selected month. Indicates pricing pressure/negotiability.",
    "DOM": "Average days on market (DOM) for properties in this price range.",
    "LAST MONTH": "Closings in the previous month (lookback count).",
    "LAST QUARTER": "Closings over the previous three months (lookback count).",
    "LAST YEAR": "Closings in the same month last year (lookback count)."
  }

  const renderHeader = (label: string) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>{label}</span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-center leading-snug">
        {headerTooltips[label]}
      </TooltipContent>
    </Tooltip>
  )

  return (
    <>
    <Card className="mb-6 bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] rounded-xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-[12px] font-light font-montserrat text-slate-800 uppercase tracking-wide">{city} | <span className='font-bold'>Single Family Homes</span></CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-black via-gray-700 to-gray-500 hover:from-gray-800 hover:via-gray-600 hover:to-gray-400 text-white transition-all duration-200 rounded-lg px-4 py-2"
              onClick={exportToCSV}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
              <p className="text-slate-600 font-medium">Loading property market data...</p>
            </div>
          </div>
        ) : sfData && sfData.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="max-h-[600px] overflow-y-auto">
              <Table className="w-full">
                <TooltipProvider>
                  <TableHeader className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b">
                    <TableRow className="border-b border-[#3A3B40]/50 hover:bg-transparent">
                      <TableHead className="font-light text-[12px] text-slate-700 text-left py-4 px-4 uppercase tracking-[0.2em]">{renderHeader("PRICE RANGE")}</TableHead>
                      <TableHead className="font-light text-[12px] text-slate-700 text-center py-4 px-2 uppercase tracking-[0.2em]">{renderHeader("PENDING")}</TableHead>
                      <TableHead className="font-light text-[12px] text-slate-700 text-center py-4 px-2 uppercase tracking-[0.2em]">{renderHeader("ACTIVE")}</TableHead>
                      <TableHead className="font-light text-[12px] text-slate-700 text-center py-4 px-2 uppercase tracking-[0.2em]">{renderHeader("CLOSED")}</TableHead>
                      <TableHead className="font-light text-[12px] text-slate-700 text-center py-4 px-2 uppercase tracking-[0.2em]">{renderHeader("NEW")}</TableHead>
                      <TableHead className="font-light text-[12px] text-slate-700 text-center py-4 px-2 uppercase tracking-[0.2em]">{renderHeader("CHANGED")}</TableHead>
                      <TableHead className="font-light text-[12px] text-slate-700 text-center py-4 px-2 uppercase tracking-[0.2em]">{renderHeader("DOM")}</TableHead>
                      <TableHead className="font-light text-[12px] text-slate-700 text-center py-4 px-2 uppercase tracking-[0.2em]">{renderHeader("LAST MONTH")}</TableHead>
                      <TableHead className="font-light text-[12px] text-slate-700 text-center py-4 px-2 uppercase tracking-[0.2em]">{renderHeader("LAST QUARTER")}</TableHead>
                      <TableHead className="font-light text-[12px] text-slate-700 text-center py-4 px-2 uppercase tracking-[0.2em]">{renderHeader("LAST YEAR")}</TableHead>
                    </TableRow>
                  </TableHeader>
                </TooltipProvider>
                <TableBody>
                  {sfData.map((item, index) => (
                    <TableRow
                      key={index}
                      className={`hover:bg-gray-50/50 transition-colors duration-200 border-b border-[#3A3B40]/50 ${index === sfData.length - 1 ? '!border-b !border-[#3A3B40]/50' : ''}`}
                    >
                      <TableCell
                        className={
                          `font-montserrat font-light tracking-[0.1em] text-[12px] text-slate-800 text-left py-3 px-4 uppercase`
                        }
                      >
                        {item.pricerange}
                      </TableCell>
                      <TableCell
                        className={
                          `font-montserrat font-light tracking-[0.1em] text-[12px] text-slate-700 text-center py-3 px-2 uppercase`
                        }
                      >
                        {item["Pending/ Signed Contract"] !== null ? item["Pending/ Signed Contract"] : '-'}
                      </TableCell>
                      <TableCell
                        className={
                          `font-montserrat font-light tracking-[0.1em] text-[12px] text-slate-700 text-center py-3 px-2 uppercase`
                        }
                      >
                        {item["Total Actives"] !== null ? item["Total Actives"] : '-'}
                      </TableCell>
                      <TableCell
                        className={
                          `font-montserrat font-light tracking-[0.1em] text-[12px] text-slate-700 text-center py-3 px-2 uppercase`
                        }
                      >
                        {item["Sold and Closed"] !== null ? item["Sold and Closed"] : '-'}
                      </TableCell>
                      <TableCell
                        className={
                          `font-montserrat font-light tracking-[0.1em] text-[12px] text-slate-700 text-center py-3 px-2 uppercase`
                        }
                      >
                        {item["New Listings"] !== null ? item["New Listings"] : '-'}
                      </TableCell>
                      <TableCell
                        className={
                          `font-montserrat font-light tracking-[0.1em] text-[12px] text-slate-700 text-center py-3 px-2 uppercase`
                        }
                      >
                        {item["Price Adjustments"] !== null ? item["Price Adjustments"] : '-'}
                      </TableCell>
                      <TableCell
                        className={
                          `font-montserrat font-light tracking-[0.1em] text-[12px] text-slate-700 text-center py-3 px-2 uppercase`
                        }
                      >
                        {item["DOM"] !== null ? item["DOM"] : '-'}
                      </TableCell>
                      <TableCell
                        className={
                          `font-montserrat font-light tracking-[0.1em] text-[12px] text-slate-700 text-center py-3 px-2 uppercase`
                        }
                      >
                        {item["Last Month"] ?? '-'}
                      </TableCell>
                      <TableCell
                        className={
                          `font-montserrat font-light tracking-[0.1em] text-[12px] text-slate-700 text-center py-3 px-2 uppercase`
                        }
                      >
                        {item["Last Quarter"] ?? '-'}
                      </TableCell>
                      <TableCell
                        className={
                          `font-montserrat font-light tracking-[0.1em] text-[12px] text-slate-700 text-center py-3 px-2 uppercase`
                        }
                      >
                        {item["Last Year"] ?? '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-slate-500 text-lg">No property market data available</p>
              <p className="text-slate-400 text-sm mt-2">Try selecting different filters</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>

    <div className="mb-12">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="methodology">
          <AccordionTrigger className="px-4 font-light uppercase tracking-[0.2em] text-[#3A3B40]">
            <div className="text-left">
              <div>Market Summary Methodology</div>
              <div className="mt-1 text-xs normal-case not-italic tracking-normal text-[#3A3B40]/80">
                Data reflects monthly market activity for Single-Family Homes and Condominiums priced above $1M.
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4">
            <div className="space-y-2 text-[#3A3B40] text-sm leading-relaxed">
              <p><strong>New Listings</strong> = properties that came to market this month.</p>
              <p><strong>Pending</strong> = under contract this month.</p>
              <p><strong>Sold</strong> = closed transactions this month.</p>
              <p><strong>DOM</strong> = median days on market for closed sales only.</p>
              <p><strong>Last Month / Quarter / Year</strong> = comparative lookback metrics.</p>
              <p>Data sourced from Houston MLS; differences from HAR.com reflect narrower property filters, price banding, and snapshot timing.</p>
              <p className="text-xs text-[#3A3B40]/70 mt-3">
                For a full explanation of how The Refined Report compiles and validates its data, <a href={methodologyPdf} download className="underline">download the full methodology PDF</a>.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
    </>
  )
}

export default SF
