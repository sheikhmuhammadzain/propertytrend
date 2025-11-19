import {useEffect, useState} from 'react'
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
    getAllLocationsHandler()
    getBeroMetricDataHandler();
    getHistoricalTrendDataHandler();
    getMedianSalesDataHandler();
    getDomTrendDataHandler();
    getSalesVolumeDataHandler();
    getActiveListingDataHandler();
    getWeeklyPendingDataHandler();
    getWeeklyPriceReductionDataHandler();
    getSalesListRatioDataHandler();
    getMoiDataHandler();
    getPriceSQFTDataHandler();
  }, [selectedLocation]);


  const getAllLocationsHandler = async () => {
    const response = await apiService.getAllLocations()
    if (response.success) {
      setAllLocations(response.data?.locations)
    }
  }

  const getBeroMetricDataHandler = async () => {
    setBeroMetricDataLoading(true)
    const response = await apiService.getChartData(`GET-Barometer?city=${selectedLocation}`)
    if (response.success) {
      setBeroMetricData(response.data)
    }else {
      setBeroMetricData(null)
    }
    setBeroMetricDataLoading(false)
  }


  const getHistoricalTrendDataHandler = async () => {
    setHistoricalTrendDataLoading(true)
    const response = await apiService.getChartData(`historical-trend-11?city=${selectedLocation}`)
    if (response.success) {
      setHistoricalTrendData(response.data)
    }else {
      setHistoricalTrendData(null)
    }
    setHistoricalTrendDataLoading(false)
  }

  const getMedianSalesDataHandler = async () => {
    setMedianSalesChartDataLoading(true)
    const response = await apiService.getChartData(`median-sales-1?city=${selectedLocation}`)
    if (response.success) {
      setMedianSalesChartData(response.data)
    }
    else {
      setMedianSalesChartData(null)
    }
    setMedianSalesChartDataLoading(false)
  }

  const getDomTrendDataHandler = async () => {
    setDomTrendDataLoading(true)
    const response = await apiService.getChartData(`dom-trend-2?city=${selectedLocation}`)
    if (response.success) {
      setDomTrendData(response.data)
    }else {
      setDomTrendData(null)
    }
    setDomTrendDataLoading(false)
  }

  const getSalesVolumeDataHandler = async () => {
    setSalesVolumeChartDataLoading(true)
    const response = await apiService.getChartData(`sales-volume-3?city=${selectedLocation}`)
    if (response.success) {
      setSalesVolumeChartData(response.data)
    }else {
      setSalesVolumeChartData(null)
    }
    setSalesVolumeChartDataLoading(false)
  }

  const getActiveListingDataHandler = async () => {
    setActiveListingDataLoading(true)
    const response = await apiService.getChartData(`get-active-listing-7?city=${selectedLocation}`)
    if (response.success) {
      setActiveListingData(response.data)
    }else {
      setActiveListingData(null)
    }
    setActiveListingDataLoading(false)
  }

  const getWeeklyPendingDataHandler = async () => {
    setWeeklyPendingDataLoading(true)
    const response = await apiService.getChartData(`weekly-pending-4?city=${selectedLocation}`)
    if (response.success) {
      setWeeklyPendingData(response.data)
    }else {
      setWeeklyPendingData(null)
    }
    setWeeklyPendingDataLoading(false)
  }

  const getWeeklyPriceReductionDataHandler = async () => {
    setWeeklyPriceReductionDataLoading(true)
    const response = await apiService.getChartData(`weekly-price-reductions-5?city=${selectedLocation}`)
    if (response.success) {
      setWeeklyPriceReductionData(response.data)
    }else {
      setWeeklyPriceReductionData(null)
    }
    setWeeklyPriceReductionDataLoading(false)
  }

  const getSalesListRatioDataHandler = async () => {
    setSalesListRatioDataLoading(true)
    const response = await apiService.getChartData(`sale-list-ratio-8?city=${selectedLocation}`)
    if (response.success) {
      setSalesListRatioData(response.data)
    }else {
      setSalesListRatioData(null)
    }
    setSalesListRatioDataLoading(false)
  }

  const getMoiDataHandler = async () => {
    setMoiDataLoading(true)
    const response = await apiService.getChartData(`moi-6?city=${selectedLocation}`)
    if (response.success) {
      setMoiData(response.data)
    }else {
      setMoiData(null)
    }
    setMoiDataLoading(false)
  }

  const getPriceSQFTDataHandler = async () => {
    setPriceSQFTDataLoading(true)
    const response = await apiService.getChartData(`price-sqft-9?city=${selectedLocation}`)
    if (response.success) {
      setPriceSQFTData(response.data)
    }else {
      setPriceSQFTData(null)
    }
    setPriceSQFTDataLoading(false)
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
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
            Housing Market
            <span className="block bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
              Visualization
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore the housing market with interactive charts and data visualizations
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
          <BeroMetric data={beroMetricData} loading={beroMetricDataLoading} />
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
