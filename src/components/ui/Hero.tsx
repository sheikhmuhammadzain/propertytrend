import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="bg-[#F1EFED] flex flex-col items-center justify-center px-4">

      <Link to="/">
        <h2 className="uppercase tracking-[0.2em] md:tracking-[0.35em] font-light text-2xl md:text-4xl lg:text-5xl text-[#3A3B40] text-center leading-relaxed mb-4 md:mb-5">
          The Refined Report
        </h2>
      </Link>

      <div className="w-full py-6 md:py-8 border-y border-[#3A3B40]/40 px-4">
        <p className="font-montserrat font-medium text-[#3A3B40] text-center leading-relaxed text-sm md:text-base">
          A precision lens on Houston’s ultra-luxury real estate—translating complex market data into clear, actionable intelligence.
        </p>
        <p className="font-montserrat text-[10px] md:text-xs italic text-[#3A3B40] text-center mt-2">
          Methodology based on MLS data for Single-Family Homes and Condominiums in Houston, updated hourly.
        </p>
      </div>

    </section>
  )
}

export default Hero
