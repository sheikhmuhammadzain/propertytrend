import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Navbar from "@/components/containers/Navbar";
import { apiService } from '@/services/apiServices';
import { useAuth } from '@/context';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MedianSalesChart from '@/components/charts/MedianSalesChart';
import SalesVolume from '@/components/charts/SalesVolume';
import HistoricalTrend from '@/components/charts/HistoricalTrend';
import DomTrend from '@/components/charts/DomTrend';
import ActiveListing from '@/components/charts/ActiveListing';
import WeeklyPending from '@/components/charts/WeeklyPending';
import WeeklyPriceReduction from '@/components/charts/WeeklyPriceReduction';
import BeroMetric from '@/components/charts/BeroMetric';
import SalesListRatio from '@/components/charts/SalesListRatio';
import MioChart from '@/components/charts/MioChart';
import PriceSqftChart from '@/components/charts/PriceSqftChart';
import { Particles } from '@/components/ui/particles';

const Home = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("Houston");
  const [allLocations, setAllLocations] = useState<any>([]);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [beroMetricData, setBeroMetricData] = useState<any>(null);
  const [beroMetricDataLoading, setBeroMetricDataLoading] = useState<boolean>(false);

  const [historicalTrendData, setHistoricalTrendData] = useState<any>(null);
  const [historicalTrendDataLoading, setHistoricalTrendDataLoading] = useState<boolean>(false);

  const [medianSalesChartData, setMedianSalesChartData] = useState<any>(null);
  const [medianSalesChartDataLoading, setMedianSalesChartDataLoading] = useState<boolean>(false);

  const [domTrendData, setDomTrendData] = useState<any>(null);
  const [domTrendDataLoading, setDomTrendDataLoading] = useState<boolean>(false);

  const [salesVolumeChartData, setSalesVolumeChartData] = useState<any>(null);
  const [salesVolumeChartDataLoading, setSalesVolumeChartDataLoading] = useState<boolean>(false);

  const [activeListingData, setActiveListingData] = useState<any>(null);
  const [activeListingDataLoading, setActiveListingDataLoading] = useState<boolean>(false);

  const [weeklyPendingData, setWeeklyPendingData] = useState<any>(null);
  const [weeklyPendingDataLoading, setWeeklyPendingDataLoading] = useState<boolean>(false);

  const [weeklyPriceReductionData, setWeeklyPriceReductionData] = useState<any>(null);
  const [weeklyPriceReductionDataLoading, setWeeklyPriceReductionDataLoading] = useState<boolean>(false);

  const [salesListRatioData, setSalesListRatioData] = useState<any>(null);
  const [salesListRatioDataLoading, setSalesListRatioDataLoading] = useState<boolean>(false);

  const [moiData, setMoiData] = useState<any>(null);
  const [moiDataLoading, setMoiDataLoading] = useState<boolean>(false);

  const [priceSQFTData, setPriceSQFTData] = useState<any>(null);
  const [priceSQFTDataLoading, setPriceSQFTDataLoading] = useState<boolean>(false);


  useEffect(() => {
    if (!getToken()) {
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    getAllLocationsHandler();
  }, []);

  useEffect(() => {
    fetchAllChartData();
  }, [selectedLocation]);

  const fetchAllChartData = async () => {
    // Set all loading states to true
    setBeroMetricDataLoading(true);
    setHistoricalTrendDataLoading(true);
    setMedianSalesChartDataLoading(true);
    setDomTrendDataLoading(true);
    setSalesVolumeChartDataLoading(true);
    setActiveListingDataLoading(true);
    setWeeklyPendingDataLoading(true);
    setWeeklyPriceReductionDataLoading(true);
    setSalesListRatioDataLoading(true);
    setMoiDataLoading(true);
    setPriceSQFTDataLoading(true);

    const endpoints = [
      { key: 'bero', url: `GET-Barometer?city=${selectedLocation}`, setter: setBeroMetricData, loader: setBeroMetricDataLoading },
      { key: 'history', url: `historical-trend-11?city=${selectedLocation}`, setter: setHistoricalTrendData, loader: setHistoricalTrendDataLoading },
      { key: 'median', url: `median-sales-1?city=${selectedLocation}`, setter: setMedianSalesChartData, loader: setMedianSalesChartDataLoading },
      { key: 'dom', url: `dom-trend-2?city=${selectedLocation}`, setter: setDomTrendData, loader: setDomTrendDataLoading },
      { key: 'volume', url: `sales-volume-3?city=${selectedLocation}`, setter: setSalesVolumeChartData, loader: setSalesVolumeChartDataLoading },
      { key: 'active', url: `get-active-listing-7?city=${selectedLocation}`, setter: setActiveListingData, loader: setActiveListingDataLoading },
      { key: 'pending', url: `weekly-pending-4?city=${selectedLocation}`, setter: setWeeklyPendingData, loader: setWeeklyPendingDataLoading },
      { key: 'reduction', url: `weekly-price-reductions-5?city=${selectedLocation}`, setter: setWeeklyPriceReductionData, loader: setWeeklyPriceReductionDataLoading },
      { key: 'ratio', url: `sale-list-ratio-8?city=${selectedLocation}`, setter: setSalesListRatioData, loader: setSalesListRatioDataLoading },
      { key: 'moi', url: `moi-6?city=${selectedLocation}`, setter: setMoiData, loader: setMoiDataLoading },
      { key: 'priceSqft', url: `price-sqft-9?city=${selectedLocation}`, setter: setPriceSQFTData, loader: setPriceSQFTDataLoading }
    ];

    await Promise.allSettled(
      endpoints.map(async ({ url, setter, loader }) => {
        try {
          const response = await apiService.getChartData(url);
          if (response.success) {
            setter(response.data);
          } else {
            setter(null);
          }
        } catch (error) {
          console.error(`Error fetching data for ${url}:`, error);
          setter(null);
        } finally {
          loader(false);
        }
      })
    );
  };


  const getAllLocationsHandler = async () => {
    const response = await apiService.getAllLocations()
    if (response.success) {
      setAllLocations(response.data?.locations)
    }
  }



  return (
    <div className="min-h-screen relative bg-[#F2F1EF]">
      {/* Particles Background */}
      <Particles
        className="fixed inset-0 z-0"
        quantity={50}
        staticity={30}
        ease={50}
        size={0.8}
        color="#3b82f6"
        vx={0.1}
        vy={0.1}
      />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 relative z-10">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="bg-white/70 backdrop-blur-md border border-gray-200/60 text-black hover:bg-black hover:text-white transition-all duration-300 font-light uppercase tracking-[0.1em]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-light uppercase tracking-[0.2em] text-black mb-6">
            Houston Luxury Market Visualization
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light tracking-[0.05em] leading-relaxed">
            Visualize market intelligence through refined, data-driven insights revealing pricing behavior, absorption trends, and long-range performance.
          </p>
        </div>

        {/* Dropdown for city selection */}
        <div className="flex justify-center mb-4">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[280px] shadow-lg">
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Houston">Houston</SelectItem>
              {allLocations.filter((location: string) => location !== "Houston").map((location: string) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Median Sales and Sales Volume Charts */}
        <div className="grid grid-cols-1 gap-8 my-8">
          <BeroMetric data={beroMetricData} loading={beroMetricDataLoading} city={selectedLocation} />
          <HistoricalTrend data={historicalTrendData} loading={historicalTrendDataLoading} />
          <MedianSalesChart data={medianSalesChartData} loading={medianSalesChartDataLoading} />
          <DomTrend data={domTrendData} loading={domTrendDataLoading} />
          <SalesVolume data={salesVolumeChartData} loading={salesVolumeChartDataLoading} />
          <ActiveListing data={activeListingData} loading={activeListingDataLoading} />
          <WeeklyPending data={weeklyPendingData} loading={weeklyPendingDataLoading} />
          <WeeklyPriceReduction data={weeklyPriceReductionData} loading={weeklyPriceReductionDataLoading} />
          <SalesListRatio data={salesListRatioData} loading={salesListRatioDataLoading} />
          <MioChart data={moiData} loading={moiDataLoading} />
          <PriceSqftChart data={priceSQFTData} loading={priceSQFTDataLoading} />
        </div>
      </div>
    </div>
  );
};

export default Home;
