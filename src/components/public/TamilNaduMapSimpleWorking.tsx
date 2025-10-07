'use client'

import { useEffect, useRef, useState } from 'react'
import { X, School, Users, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  tamilNaduDistricts, 
  getDistrictColor, 
  getFundingStatusText, 
  getCoveragePercentage,
  type DistrictData 
} from '@/lib/tamilnadu-districts-data'

interface MapPopupProps {
  district: DistrictData | null
  onClose: () => void
}

function MapPopup({ district, onClose }: MapPopupProps) {
  if (!district) return null
  const coveragePercentage = getCoveragePercentage(district)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-6 w-96 mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl text-gray-900">{district.name} District</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: getDistrictColor(district.fundingStatus) }}
          />
          <span className="font-medium text-gray-700">
            {getFundingStatusText(district.fundingStatus)} - {coveragePercentage}% Coverage
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <School className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">{district.totalSchools}</div>
            <div className="text-sm text-blue-600">Total Schools</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">{district.coveredSchools}</div>
            <div className="text-sm text-green-600">Covered</div>
          </div>
        </div>

        {district.availableForSponsorship > 0 && (
          <div className="bg-orange-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-900">Need Sponsorship</span>
            </div>
            <div className="text-2xl font-bold text-orange-900">{district.availableForSponsorship}</div>
            <div className="text-xs text-orange-600">Schools need support</div>
          </div>
        )}

        <Button 
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold"
          onClick={() => window.location.href = `/donate?district=${district.id}&type=school`}
        >
          Sponsor Schools in {district.name}
        </Button>
      </div>
    </div>
  )
}

export default function TamilNaduMapSimpleWorking() {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null)
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)

  // Create SVG-based map representation
  const getSVGPath = (districtId: string) => {
    // Simple SVG paths representing Tamil Nadu districts (approximate shapes)
    const paths: { [key: string]: string } = {
      'chennai': 'M450,100 L500,100 L500,150 L450,150 Z',
      'thiruvallur': 'M400,80 L450,80 L450,130 L400,130 Z',
      'kanchipuram': 'M400,150 L450,150 L450,200 L400,200 Z',
      'vellore': 'M350,120 L400,120 L400,170 L350,170 Z',
      'tiruvannamalai': 'M350,170 L400,170 L400,220 L350,220 Z',
      'villupuram': 'M400,200 L450,200 L450,250 L400,250 Z',
      'cuddalore': 'M450,200 L500,200 L500,250 L450,250 Z',
      'salem': 'M300,150 L350,150 L350,200 L300,200 Z',
      'namakkal': 'M300,200 L350,200 L350,250 L300,250 Z',
      'dharmapuri': 'M300,100 L350,100 L350,150 L300,150 Z',
      'krishnagiri': 'M250,100 L300,100 L300,150 L250,150 Z',
      'erode': 'M250,150 L300,150 L300,200 L250,200 Z',
      'coimbatore': 'M200,180 L250,180 L250,230 L200,230 Z',
      'nilgiris': 'M180,130 L230,130 L230,180 L180,180 Z',
      'tiruppur': 'M230,180 L280,180 L280,230 L230,230 Z',
      'karur': 'M300,250 L350,250 L350,300 L300,300 Z',
      'tiruchirappalli': 'M350,280 L400,280 L400,330 L350,330 Z',
      'perambalur': 'M350,220 L400,220 L400,270 L350,270 Z',
      'ariyalur': 'M400,250 L450,250 L450,300 L400,300 Z',
      'thanjavur': 'M400,300 L450,300 L450,350 L400,350 Z',
      'thiruvarur': 'M450,300 L500,300 L500,350 L450,350 Z',
      'nagapattinam': 'M450,350 L500,350 L500,400 L450,400 Z',
      'pudukkottai': 'M350,330 L400,330 L400,380 L350,380 Z',
      'dindigul': 'M280,280 L330,280 L330,330 L280,330 Z',
      'madurai': 'M280,330 L330,330 L330,380 L280,380 Z',
      'theni': 'M230,330 L280,330 L280,380 L230,380 Z',
      'sivagangai': 'M330,380 L380,380 L380,430 L330,430 Z',
      'ramanathapuram': 'M380,380 L430,380 L430,430 L380,430 Z',
      'virudhunagar': 'M280,380 L330,380 L330,430 L280,430 Z',
      'tirunelveli': 'M230,430 L280,430 L280,480 L230,480 Z',
      'thoothukudi': 'M280,430 L330,430 L330,480 L280,480 Z',
      'kanniyakumari': 'M180,480 L230,480 L230,530 L180,530 Z'
    }
    return paths[districtId] || 'M0,0 L50,0 L50,50 L0,50 Z'
  }

  return (
    <div className="relative">
      {/* SVG Map Container */}
      <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 border border-gray-200">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Tamil Nadu Districts Map</h3>
          <p className="text-gray-600">Interactive district map showing school coverage status</p>
        </div>

        {/* SVG Map */}
        <div className="flex justify-center">
          <svg
            viewBox="0 0 600 600"
            className="w-full max-w-2xl h-auto border border-gray-300 bg-white rounded-lg shadow-sm"
          >
            {/* Background */}
            <rect width="600" height="600" fill="#f8fafc" />
            
            {/* Districts */}
            {tamilNaduDistricts.map((district) => (
              <path
                key={district.id}
                d={getSVGPath(district.id)}
                fill={getDistrictColor(district.fundingStatus)}
                stroke="#ffffff"
                strokeWidth="2"
                opacity={hoveredDistrict === district.id ? 0.9 : 0.7}
                className="cursor-pointer transition-all duration-200 hover:stroke-gray-600"
                onMouseEnter={() => setHoveredDistrict(district.id)}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => setSelectedDistrict(district)}
              />
            ))}
            
            {/* District Labels */}
            {tamilNaduDistricts.slice(0, 10).map((district, index) => {
              const x = 100 + (index % 5) * 100
              const y = 100 + Math.floor(index / 5) * 100
              return (
                <text
                  key={`label-${district.id}`}
                  x={x + 25}
                  y={y + 30}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#374151"
                  className="pointer-events-none"
                >
                  {district.name.length > 10 ? district.name.substring(0, 8) + '...' : district.name}
                </text>
              )
            })}
            
            {/* Title */}
            <text x="300" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1f2937">
              Tamil Nadu - School Coverage Map
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-3 text-center">Funding Status Legend</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-700">Needs Funding</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm text-gray-700">Partially Funded</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-700">Well Funded</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-700">Fully Funded</span>
            </div>
          </div>
        </div>

        {/* District List for Mobile */}
        <div className="mt-6 lg:hidden">
          <h4 className="font-semibold text-gray-900 mb-3">All Districts</h4>
          <div className="grid grid-cols-2 gap-2">
            {tamilNaduDistricts.map((district) => (
              <button
                key={district.id}
                onClick={() => setSelectedDistrict(district)}
                className="text-left p-2 rounded border hover:bg-gray-50 text-sm"
                style={{ 
                  borderLeftColor: getDistrictColor(district.fundingStatus),
                  borderLeftWidth: '4px'
                }}
              >
                {district.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Popup */}
      <MapPopup
        district={selectedDistrict}
        onClose={() => setSelectedDistrict(null)}
      />

      {/* Instructions */}
      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 text-sm">
          🗺️ <strong>Interactive Map:</strong> Click on districts (colored shapes) or use the district list below on mobile to see sponsorship details.
        </p>
      </div>
    </div>
  )
}