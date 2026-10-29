import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '@/components/containers/Navbar'
import Footer from '@/components/containers/Footer'
import { Button } from '@/components/ui/button'
import { Database, Filter, Layers, CalendarDays, BarChart3, ArrowRight, ArrowDown, ArrowLeft, Download } from 'lucide-react'
import methodologyPdf from '@/assets/methodology.pdf'

const MetricCard: React.FC<{
  number: string
  title: string
  description: string
  example: string
}> = ({ number, title, description, example }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center font-light text-lg">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="font-light uppercase tracking-[0.15em] text-black text-sm mb-3">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-2">
          <span className="font-medium text-black">What it means:</span> {description}
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          <span className="font-medium text-black">Example:</span> {example}
        </p>
      </div>
    </div>
  </div>
)

const MethodologyPage: React.FC = () => {
  const navigate = useNavigate()
  const lastUpdated = new Date().toLocaleDateString()

  const metrics = [
    {
      number: '1',
      title: 'New Listings',
      description: 'The number of properties that came onto the market during the selected month.',
      example: 'If a property was listed for sale in October 2025, it is counted as a New Listing for that month.'
    },
    {
      number: '2',
      title: 'Pending / Signed Contract',
      description: 'The number of properties that went under contract (accepted an offer) during the selected month.',
      example: 'If a home was listed earlier and went under contract in October 2025, it\'s counted here.'
    },
    {
      number: '3',
      title: 'Sold and Closed',
      description: 'The number of properties that completed the sale process and officially closed in the selected month.',
      example: 'If a deal closed in October 2025, that sale appears in this column.'
    },
    {
      number: '4',
      title: 'Price Adjustments',
      description: 'The total number of price changes (increases + decreases) made to active listings during the month.',
      example: 'If a seller adjusted their listing price in October 2025, it\'s counted here.'
    },
    {
      number: '5',
      title: 'Total Actives',
      description: 'The total number of listings that were still on the market (active status) at the end of the month.',
      example: 'If a property hadn\'t sold or gone under contract by the end of October, it\'s counted here.'
    },
    {
      number: '6',
      title: 'DOM (Days on Market)',
      description: 'The median number of days that properties took to sell during the selected month. The median gives a more accurate reflection of typical selling time.',
      example: 'If half of the homes sold in 20 days or less, and half took longer, then the DOM = 20.'
    },
    {
      number: '7',
      title: 'List to Close +/-',
      description: 'The percentage difference between the original list price and the final sale price.',
      example: 'A home listed at $1M that sells for $950K shows a -5% List to Close ratio.'
    },
    {
      number: '8',
      title: 'Last Month',
      description: 'The number of properties that sold and closed in the previous month.',
      example: 'If October 2025 is the current month, this shows closings from September 2025.'
    },
    {
      number: '9',
      title: 'Last Quarter',
      description: 'The number of homes that sold in the three months prior to the current month.',
      example: 'For October 2025, this covers July–September 2025.'
    },
    {
      number: '10',
      title: 'Last Year',
      description: 'The number of homes that sold in the same month last year.',
      example: 'For October 2025, this compares to October 2024 sales activity.'
    }
  ]

  return (
    <div className="min-h-screen bg-[#F1EFED]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="uppercase tracking-[0.35em] font-light text-3xl md:text-4xl text-black mb-4">
            Market Summary Methodology
          </h1>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-600 font-light tracking-[0.1em] uppercase">
            <span>Last updated: {lastUpdated}</span>
            <span className="text-gray-400">•</span>
            <span>Data Source: Houston MLS</span>
          </div>
        </header>

        {/* Introduction */}
        <section className="bg-white border border-gray-200 rounded-lg p-8 mb-12 shadow-sm">
          <p className="text-gray-700 text-base leading-relaxed font-light">
            This report summarizes key real estate market activity. It focuses on Single Family Homes and Condominiums,
            providing a clear snapshot of current market trends and performance. Each column in the table represents a
            specific measure of market activity. Here's what each one means and how it's calculated:
          </p>
        </section>

        {/* Key Metrics */}
        <section className="mb-12">
          <h2 className="font-light uppercase tracking-[0.2em] text-black text-xl mb-6">Key Metrics Explained</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.map((metric) => (
              <MetricCard key={metric.number} {...metric} />
            ))}
          </div>
        </section>

        {/* Property Types */}
        <section className="bg-white border border-gray-200 rounded-lg p-8 mb-12 shadow-sm">
          <h2 className="font-light uppercase tracking-[0.2em] text-black text-lg mb-4">Property Types Included</h2>
          <p className="text-gray-700 text-sm leading-relaxed font-light mb-4">
            We report on two categories of properties:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F1EFED] border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-black text-sm mb-2">Single Family Homes</h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                Detached houses and stand-alone homes (includes "Single Family" and "Detached" types).
              </p>
            </div>
            <div className="bg-[#F1EFED] border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-black text-sm mb-2">Condominiums</h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                Attached units, high-rise or low-rise condos (includes "Condo," "Condominium," and "High-Rise" types).
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-xs leading-relaxed mt-4 font-light">
            Other property types (townhomes, land, rentals, etc.) are not included in these totals.
          </p>
        </section>

        {/* Price Ranges */}
        <section className="bg-white border border-gray-200 rounded-lg p-8 mb-12 shadow-sm">
          <h2 className="font-light uppercase tracking-[0.2em] text-black text-lg mb-4">Price Ranges</h2>
          <p className="text-gray-700 text-sm leading-relaxed font-light mb-6">
            Each table row represents a price band, so you can see how activity changes at different price levels:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#F1EFED] border border-gray-200 rounded-lg p-3 text-center">
              <div className="font-medium text-black text-sm">1–2M</div>
              <div className="text-gray-600 text-xs mt-1">$1.0M – $1.9M</div>
            </div>
            <div className="bg-[#F1EFED] border border-gray-200 rounded-lg p-3 text-center">
              <div className="font-medium text-black text-sm">2–3M</div>
              <div className="text-gray-600 text-xs mt-1">$2.0M – $2.9M</div>
            </div>
            <div className="bg-[#F1EFED] border border-gray-200 rounded-lg p-3 text-center">
              <div className="font-medium text-black text-sm">3–5M</div>
              <div className="text-gray-600 text-xs mt-1">$3.0M – $4.9M</div>
            </div>
            <div className="bg-[#F1EFED] border border-gray-200 rounded-lg p-3 text-center">
              <div className="font-medium text-black text-sm">10M+</div>
              <div className="text-gray-600 text-xs mt-1">$10.0M and above</div>
            </div>
          </div>
        </section>

        {/* Data Flow */}
        <section className="bg-white border border-gray-200 rounded-lg p-8 mb-12 shadow-sm">
          <h2 className="font-light uppercase tracking-[0.2em] text-black text-lg mb-6">How the Data Flows</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="h-16 w-16 rounded-full bg-black text-white flex items-center justify-center">
                <Database className="w-8 h-8" />
              </div>
              <div className="text-xs font-light uppercase tracking-[0.15em] text-center text-gray-700">MLS Feed</div>
            </div>
            <ArrowRight className="hidden md:block w-6 h-6 text-gray-400" />
            <ArrowDown className="md:hidden w-6 h-6 text-gray-400" />

            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="h-16 w-16 rounded-full bg-black text-white flex items-center justify-center">
                <Filter className="w-8 h-8" />
              </div>
              <div className="text-xs font-light uppercase tracking-[0.15em] text-center text-gray-700">Property Filtering</div>
            </div>
            <ArrowRight className="hidden md:block w-6 h-6 text-gray-400" />
            <ArrowDown className="md:hidden w-6 h-6 text-gray-400" />

            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="h-16 w-16 rounded-full bg-black text-white flex items-center justify-center">
                <Layers className="w-8 h-8" />
              </div>
              <div className="text-xs font-light uppercase tracking-[0.15em] text-center text-gray-700">Price Segmentation</div>
            </div>
            <ArrowRight className="hidden md:block w-6 h-6 text-gray-400" />
            <ArrowDown className="md:hidden w-6 h-6 text-gray-400" />

            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="h-16 w-16 rounded-full bg-black text-white flex items-center justify-center">
                <CalendarDays className="w-8 h-8" />
              </div>
              <div className="text-xs font-light uppercase tracking-[0.15em] text-center text-gray-700">Monthly Metrics</div>
            </div>
            <ArrowRight className="hidden md:block w-6 h-6 text-gray-400" />
            <ArrowDown className="md:hidden w-6 h-6 text-gray-400" />

            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="h-16 w-16 rounded-full bg-black text-white flex items-center justify-center">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div className="text-xs font-light uppercase tracking-[0.15em] text-center text-gray-700">Dashboard</div>
            </div>
          </div>
          <p className="mt-6 text-xs text-gray-600 leading-relaxed font-light">
            Data focuses on Houston's established luxury neighborhoods, not all MLS listings citywide. This selective scope ensures
            the report reflects the true high-end market rather than broad averages seen on HAR.com.
          </p>
        </section>

        {/* Interpretation Guide */}
        <section className="bg-white border border-gray-200 rounded-lg p-8 mb-12 shadow-sm">
          <h2 className="font-light uppercase tracking-[0.2em] text-black text-lg mb-4">How to Interpret the Table</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-1.5 h-1.5 bg-black rounded-full mt-2"></div>
              <p className="text-gray-700 text-sm leading-relaxed font-light">
                A higher "New Listings" number means more inventory is entering the market.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-1.5 h-1.5 bg-black rounded-full mt-2"></div>
              <p className="text-gray-700 text-sm leading-relaxed font-light">
                A higher "Sold and Closed" number means more sales activity that month.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-1.5 h-1.5 bg-black rounded-full mt-2"></div>
              <p className="text-gray-700 text-sm leading-relaxed font-light">
                A larger "Total Actives" number may indicate growing supply (potential for price pressure).
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-1.5 h-1.5 bg-black rounded-full mt-2"></div>
              <p className="text-gray-700 text-sm leading-relaxed font-light">
                DOM helps gauge how quickly homes are moving — a shorter DOM means faster sales.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex-shrink-0 w-1.5 h-1.5 bg-black rounded-full mt-2"></div>
              <p className="text-gray-700 text-sm leading-relaxed font-light">
                Last Month / Last Quarter / Last Year let you compare short-term and long-term market trends.
              </p>
            </li>
          </ul>
        </section>

        {/* Download CTA */}
        <section className="text-center">
          <a
            href={methodologyPdf}
            download
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 font-light uppercase tracking-[0.1em] text-sm"
          >
            <Download className="w-4 h-4" />
            Download Full Methodology PDF
          </a>
        </section>
      </main>

      {/* Data Integrity Footer */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h4 className="font-light uppercase tracking-[0.2em] text-black text-sm mb-3">Data Integrity Statement</h4>
          <p className="text-gray-600 text-sm leading-relaxed font-light max-w-3xl mx-auto">
            The Refined Report aggregates verified Houston MLS data filtered for Single-Family and Condominium properties only. Figures
            auto-refresh monthly. Discrepancies with HAR.com reflect property-type alignment, timing of extraction, and active-status
            definitions.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default MethodologyPage
