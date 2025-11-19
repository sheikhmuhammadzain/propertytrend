import React from 'react'
import Footer_Icon from "@/assets/Logo.png"
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='flex flex-col items-center justify-center py-10'>
      <img src={Footer_Icon} alt="Footer_Icon" className='w-[150px] h-auto' />
      <div className="mt-4 flex flex-col items-center">
        <p className="text-[#3A3B40] font-[300px] font-montserrat text-[16px] tracking-wider">
          MARK MENENDEZ
        </p>
        <p className='text-[#3A3B40] font-[300px] font-montserrat text-[14px] tracking-wider'>
          AT DOUGLAS ELLIMAN REAL ESTATE
        </p>
        <Link
          to="/methodology"
          className="mt-4 text-[#3A3B40] font-light uppercase tracking-[0.2em] text-xs hover:underline"
        >
          Methodology & Transparency
        </Link>
      </div>
    </div>
  )
}

export default Footer
