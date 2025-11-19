import React from 'react'
import Navbar from '@/components/containers/Navbar'
import Footer from '@/components/containers/Footer'
import { Database, Filter, Layers, CalendarDays, BarChart3, ArrowRight, ArrowDown } from 'lucide-react'
import methodologyPdf from '@/assets/methodology.pdf'

const SectionTitle: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <h3 className="mt-8 mb-2 font-light uppercase tracking-[0.2em] text-[#3A3B40] text-sm">{children}</h3>
)

const P: React.FC<{children: React.ReactNode; className?: string}> = ({ children, className = '' }) => (
  <p className={`text-[#3A3B40] text-sm leading-relaxed ${className}`}>{children}</p>
)

const MethodologyPage: React.FC = () => {
  const lastUpdated = new Date().toLocaleDateString()

  return (
    <div className="min-h-screen bg-[#F1EFED]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-6 text-center">
          <h1 className="uppercase tracking-[0.35em] font-light text-2xl md:text-3xl text-[#3A3B40]">Market Summary Methodology</h1>
          <div className="mt-3 text-xs text-[#3A3B40]/80">
            <span>Last updated: {lastUpdated}</span>
            <span className="mx-2">•</span>
            <span>Data Source: Houston MLS</span>
          </div>
        </header>

        <section className="space-y-4">
          <P>
            This report summarizes key real estate market activity. It focuses on Single Family Homes and Condominiums,
            providing a clear snapshot of current market trends and performance. Each column in the table represents a
            specific measure of market activity. Here’s what each one means and how it’s calculated:
          </P>

          <div className="space-y-4">
            <div>
              <SectionTitle>1️⃣ New Listings</SectionTitle>
              <P><strong>What it means:</strong> The number of properties that came onto the market during the selected month.</P>
              <P><strong>Example:</strong> If a property was listed for sale in October 2025, it is counted as a New Listing for that month.</P>
            </div>
            <div>
              <SectionTitle>2️⃣ Pending / Signed Contract</SectionTitle>
              <P><strong>What it means:</strong> The number of properties that went under contract (accepted an offer) during the selected month.</P>
              <P><strong>Example:</strong> If a home was listed earlier and went under contract in October 2025, it’s counted here.</P>
            </div>
            <div>
              <SectionTitle>3️⃣ Sold and Closed</SectionTitle>
              <P><strong>What it means:</strong> The number of properties that completed the sale process and officially closed in the selected month.</P>
              <P><strong>Example:</strong> If a deal closed in October 2025, that sale appears in this column.</P>
            </div>
            <div>
              <SectionTitle>4️⃣ Price Increased</SectionTitle>
              <P><strong>What it means:</strong> The number of listings where the asking price was raised during the month.</P>
              <P><strong>Example:</strong> If a seller increased their listing price in October 2025, it’s counted once here.</P>
            </div>
            <div>
              <SectionTitle>5️⃣ Price Decreased</SectionTitle>
              <P><strong>What it means:</strong> The number of listings where the asking price was reduced during the month.</P>
              <P><strong>Example:</strong> If a property’s price dropped from $1.5M to $1.4M during October 2025, it’s included here.</P>
            </div>
            <div>
              <SectionTitle>6️⃣ Total Actives</SectionTitle>
              <P><strong>What it means:</strong> The total number of listings that were still on the market (active status) at the end of the month.</P>
              <P><strong>Example:</strong> If a property hadn’t sold or gone under contract by the end of October, it’s counted here.</P>
            </div>
            <div>
              <SectionTitle>7️⃣ DOM (Days on Market)</SectionTitle>
              <P><strong>What it means:</strong> The median number of days that properties took to sell during the selected month.</P>
              <P><strong>Why “median”?</strong> The median gives a more accurate reflection of the typical selling time, since a few very slow or very fast sales can distort an average.</P>
              <P><strong>Example:</strong> If half of the homes sold in 20 days or less, and half took longer, then the DOM = 20.</P>
            </div>
            <div>
              <SectionTitle>8️⃣ Last Month</SectionTitle>
              <P><strong>What it means:</strong> The number of properties that sold and closed in the previous month (the month before the one being shown).</P>
              <P><strong>Example:</strong> If October 2025 is the current month, this column shows the number of closings from September 2025.</P>
            </div>
            <div>
              <SectionTitle>9️⃣ Last Quarter</SectionTitle>
              <P><strong>What it means:</strong> The number of homes that sold in the three months prior to the current month.</P>
              <P><strong>Example:</strong> For October 2025, this covers July–September 2025.</P>
            </div>
            <div>
              <SectionTitle>🔟 Last Year</SectionTitle>
              <P><strong>What it means:</strong> The number of homes that sold in the same month last year.</P>
              <P><strong>Example:</strong> For October 2025, this compares to October 2024 sales activity.</P>
            </div>
          </div>

          <div>
            <SectionTitle>🏠 Property Types Included</SectionTitle>
            <P>We report on two categories of properties:</P>
            <ul className="list-disc ml-5 text-[#3A3B40] text-sm leading-relaxed">
              <li><strong>Single Family Homes:</strong> Detached houses and stand-alone homes (includes “Single Family” and “Detached” types).</li>
              <li><strong>Condominiums:</strong> Attached units, high-rise or low-rise condos (includes “Condo,” “Condominium,” and “High-Rise” types).</li>
            </ul>
            <P className="mt-2">Other property types (townhomes, land, rentals, etc.) are not included in these totals.</P>
          </div>

          <div>
            <SectionTitle>💰 Price Ranges</SectionTitle>
            <P>Each table row represents a price band, so you can see how activity changes at different price levels:</P>
            <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-[#3A3B40]">
              <div className="font-light uppercase tracking-[0.1em]">Price Range</div>
              <div className="font-light uppercase tracking-[0.1em]">Example</div>
              <div>1–2M</div><div>$1,000,000 – $1,999,999</div>
              <div>2–3M</div><div>$2,000,000 – $2,999,999</div>
              <div>…</div><div>…</div>
              <div>10M+</div><div>$10,000,000 and above</div>
            </div>
          </div>

          <div>
            <SectionTitle>📅 Time Period</SectionTitle>
            <P>All figures are based on the selected month.</P>
            <P>
              <strong>For example:</strong> “October 2025” means activity between Oct 1, 2025 and Oct 31, 2025. Numbers update automatically each month.
            </P>
          </div>

          <div>
            <SectionTitle>✅ Notes on Accuracy</SectionTitle>
            <ul className="list-disc ml-5 text-[#3A3B40] text-sm leading-relaxed">
              <li>“Active” properties are counted based on their current listing status.</li>
              <li>“New,” “Pending,” and “Sold” are based on the date of each event during that month.</li>
              <li>DOM uses closed sales only — unsold listings are not included.</li>
              <li>Numbers include only Single Family Homes and Condominiums in Houston.</li>
            </ul>
          </div>

          <div>
            <SectionTitle>📈 How to Interpret the Table</SectionTitle>
            <ul className="list-disc ml-5 text-[#3A3B40] text-sm leading-relaxed">
              <li>A higher “New Listings” number means more inventory is entering the market.</li>
              <li>A higher “Sold and Closed” number means more sales activity that month.</li>
              <li>A larger “Total Actives” number may indicate growing supply (potential for price pressure).</li>
              <li>DOM helps gauge how quickly homes are moving — a shorter DOM means faster sales.</li>
              <li>Last Month / Last Quarter / Last Year let you compare short-term and long-term market trends.</li>
            </ul>
          </div>

          <div>
            <SectionTitle>How the Data Flows</SectionTitle>
            <div className="mt-3 rounded-xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-5 md:p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.06)]">
              <div className="flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6 text-[#3A3B40]">
                {/* Step 1 */}
                <div className="flex items-center md:flex-col md:items-center gap-3 md:gap-2">
                  <div className="h-10 w-10 rounded-full bg-[#F1EFED] border border-gray-300 flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-light uppercase tracking-[0.15em] text-center">MLS Feed</div>
                </div>
                {/* Connector */}
                <ArrowRight className="hidden md:block w-5 h-5 text-[#3A3B40]" />
                <ArrowDown className="md:hidden w-5 h-5 text-[#3A3B40]" />

                {/* Step 2 */}
                <div className="flex items-center md:flex-col md:items-center gap-3 md:gap-2">
                  <div className="h-10 w-10 rounded-full bg-[#F1EFED] border border-gray-300 flex items-center justify-center">
                    <Filter className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-light uppercase tracking-[0.15em] text-center">Filtering (SF / Condo)</div>
                </div>
                <ArrowRight className="hidden md:block w-5 h-5 text-[#3A3B40]" />
                <ArrowDown className="md:hidden w-5 h-5 text-[#3A3B40]" />

                {/* Step 3 */}
                <div className="flex items-center md:flex-col md:items-center gap-3 md:gap-2">
                  <div className="h-10 w-10 rounded-full bg-[#F1EFED] border border-gray-300 flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-light uppercase tracking-[0.15em] text-center">Price Band Segmentation</div>
                </div>
                <ArrowRight className="hidden md:block w-5 h-5 text-[#3A3B40]" />
                <ArrowDown className="md:hidden w-5 h-5 text-[#3A3B40]" />

                {/* Step 4 */}
                <div className="flex items-center md:flex-col md:items-center gap-3 md:gap-2">
                  <div className="h-10 w-10 rounded-full bg-[#F1EFED] border border-gray-300 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-light uppercase tracking-[0.15em] text-center">Monthly Metrics</div>
                </div>
                <ArrowRight className="hidden md:block w-5 h-5 text-[#3A3B40]" />
                <ArrowDown className="md:hidden w-5 h-5 text-[#3A3B40]" />

                {/* Step 5 */}
                <div className="flex items-center md:flex-col md:items-center gap-3 md:gap-2">
                  <div className="h-10 w-10 rounded-full bg-[#F1EFED] border border-gray-300 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-light uppercase tracking-[0.15em] text-center">Refined Report Dashboard</div>
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-[#3A3B40]/80 leading-relaxed">
              Data focuses on Houston’s established luxury neighborhoods, not all MLS listings citywide. This selective scope ensures
              the report reflects the true high-end market rather than broad averages seen on HAR.com.
            </p>
          </div>

          <P className="text-xs text-[#3A3B40]/70 mt-6">
            For a full explanation of how The Refined Report compiles and validates its data,{' '}
            <a href={methodologyPdf} download className="underline">download the full methodology PDF</a>.
          </P>
        </section>
      </main>

      <div className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <h4 className="font-light uppercase tracking-[0.15em] text-[#3A3B40] text-xs">Data Integrity Statement</h4>
          <p className="mt-2 text-[#3A3B40] text-xs leading-relaxed">
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
