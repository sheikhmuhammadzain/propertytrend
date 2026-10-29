import * as React from 'react';
import { useGauge } from 'use-gauge';

interface GaugeProps {
  value: number;
  value90daysAgo: number;
}

function getMarketStatus(value: number) {
  if (value <= 3) return "Strong Seller's Market";
  if (value <= 5) return "Seller's Market";
  if (value <= 7) return "Balanced Market";
  if (value <= 9) return "Buyer's Market";
  return "Strong Buyer's Market";
}

const arcColors = [
  '#F44336', // Red
  '#FF9800', // Orange
  '#FFEB3B', // Yellow
  '#8BC34A', // Light Green
  '#4CAF50', // Green
];

export function MarketGauge({ value, value90daysAgo }: GaugeProps) {
  const {
    getSVGProps,
    getArcProps,
    valueToAngle,
  } = useGauge({
    domain: [0, 12],
    startAngle: -90,
    endAngle: 90,
    numTicks: 5,
    diameter: 200,
  });

  const marketStatus = getMarketStatus(value);

  return (
    <div className="p-4 w-full flex flex-col items-center">
        <h3 className="text-2xl font-semibold text-slate-800">{marketStatus}</h3>
        <p className="text-slate-600">{value} Months Inventory</p>
      <svg {...getSVGProps()} className="w-full h-auto max-w-sm">
        <g>
          {/* Gauge Background */}
          <path
            {...getArcProps({
              offset: 30,
              startAngle: 180,
              endAngle: 360,
            })}
            fill="none"
            className="stroke-gray-200"
            strokeWidth={20}
          />
          
          {/* Colored Arcs */}
          <path {...getArcProps({ offset: 30, startAngle: valueToAngle(0), endAngle: valueToAngle(3) })} fill="none" stroke="#ef4444" strokeWidth={20} />
          <path {...getArcProps({ offset: 30, startAngle: valueToAngle(3), endAngle: valueToAngle(5) })} fill="none" stroke="#f97316" strokeWidth={20} />
          <path {...getArcProps({ offset: 30, startAngle: valueToAngle(5), endAngle: valueToAngle(7) })} fill="none" stroke="#facc15" strokeWidth={20} />
          <path {...getArcProps({ offset: 30, startAngle: valueToAngle(7), endAngle: valueToAngle(9) })} fill="none" stroke="#84cc16" strokeWidth={20} />
          <path {...getArcProps({ offset: 30, startAngle: valueToAngle(9), endAngle: valueToAngle(12) })} fill="none" stroke="#22c55e" strokeWidth={20} />

          {/* Ticks & Labels */}
          <g id="ticks">
            {/* Custom ticks and labels */}
            <text x="24%" y="82%" textAnchor="middle" className="fill-gray-500 text-sm">3</text>
            <text x="50%" y="38%" textAnchor="middle" className="fill-gray-500 text-sm">6</text>
            <text x="76%" y="82%" textAnchor="middle" className="fill-gray-500 text-sm">9</text>
          </g>

          {/* Market Labels */}
           <text x="15%" y="98%" textAnchor="middle" className="font-semibold fill-gray-700 text-sm md:text-base">Seller's Market</text>
           <text x="85%" y="98%" textAnchor="middle" className="font-semibold fill-gray-700 text-sm md:text-base">Buyer's Market</text>

          {/* Needle */}
          <g id="needle" className="transition-transform duration-500 ease-out" style={{ transform: `rotate(${valueToAngle(value)}deg)`, transformOrigin: '100px 100px' }}>
            <circle className="fill-black" cx="100" cy="100" r="4" />
            <path d="M 100 100 L 100 30" className="stroke-black" strokeWidth="2" />
          </g>
          
          {/* 90 days ago marker */}
          <g className="transition-transform duration-500 ease-out" style={{ transform: `rotate(${valueToAngle(value90daysAgo)}deg)`, transformOrigin: '100px 100px' }}>
             <path d="M 100 42 L 97 49 L 103 49 Z" fill="gray" />
             <line x1="100" y1="49" x2="100" y2="65" stroke="gray" strokeWidth="1.5" />
             <g style={{ transform: `rotate(${-valueToAngle(value90daysAgo)}deg)`, transformOrigin: '100px 32px' }}>
                <text x="100" y="38" textAnchor="middle" fill="gray" className="text-xs">90 days ago</text>
             </g>
           </g>

        </g>
      </svg>
    </div>
  );
} 