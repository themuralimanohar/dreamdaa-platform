'use client'

import { useState } from 'react'
import { X, MapPin, School, Users, TrendingUp } from 'lucide-react'
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
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl text-gray-900">{district.name}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: getDistrictColor(district.fundingStatus) }}
          />
          <span className="font-medium text-gray-700">
            {getFundingStatusText(district.fundingStatus)}
          </span>
          <span className="ml-auto text-gray-500">
            {coveragePercentage}% covered
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <School className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">{district.totalSchools}</div>
            <div className="text-sm text-blue-600">Total Schools</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">{district.coveredSchools}</div>
            <div className="text-sm text-green-600">Covered Schools</div>
          </div>
        </div>

        {/* Available for Sponsorship */}
        {district.availableForSponsorship > 0 && (
          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-orange-900">Available for Sponsorship</span>
            </div>
            <div className="text-3xl font-bold text-orange-900 mb-1">
              {district.availableForSponsorship}
            </div>
            <div className="text-sm text-orange-600">
              Schools need your support
            </div>
          </div>
        )}

        {/* CTA Button */}
        {district.availableForSponsorship > 0 ? (
          <Button 
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold"
            onClick={() => {
              window.location.href = `/donate?district=${district.id}&type=school`
            }}
          >
            Sponsor Schools in {district.name}
          </Button>
        ) : (
          <div className="text-center py-3">
            <div className="text-green-600 font-semibold">
              ✅ All schools in {district.name} are fully funded!
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TamilNaduMapSimple() {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null)
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)

  // Group districts by region for better layout
  const regionDistricts = {
    north: tamilNaduDistricts.filter(d => ['chennai', 'thiruvallur', 'kanchipuram', 'vellore', 'tiruvannamalai'].includes(d.id)),
    central: tamilNaduDistricts.filter(d => ['salem', 'dharmapuri', 'krishnagiri', 'namakkal', 'erode'].includes(d.id)),
    south: tamilNaduDistricts.filter(d => ['madurai', 'dindigul', 'theni', 'virudhunagar', 'tirunelveli'].includes(d.id)),
    east: tamilNaduDistricts.filter(d => ['tiruchirappalli', 'thanjavur', 'nagapattinam', 'cuddalore', 'villupuram'].includes(d.id)),
    west: tamilNaduDistricts.filter(d => ['coimbatore', 'nilgiris', 'tiruppur', 'karur', 'dindigul'].includes(d.id))
  }

  const remainingDistricts = tamilNaduDistricts.filter(d => 
    ![...regionDistricts.north, ...regionDistricts.central, ...regionDistricts.south, 
      ...regionDistricts.east, ...regionDistricts.west].includes(d)
  )

  return (
    <div className="relative">
      {/* Map Container */}
      <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 border border-gray-200">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Tamil Nadu Districts</h3>
          <p className="text-gray-600">Click on any district to see school coverage details</p>
        </div>

        {/* District Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {tamilNaduDistricts.map((district) => (
            <button
              key={district.id}
              onClick={() => setSelectedDistrict(district)}
              onMouseEnter={() => setHoveredDistrict(district.id)}
              onMouseLeave={() => setHoveredDistrict(null)}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 text-center
                ${hoveredDistrict === district.id ? 'scale-105 shadow-lg' : 'hover:scale-102'}
              `}
              style={{
                backgroundColor: getDistrictColor(district.fundingStatus) + '20',
                borderColor: getDistrictColor(district.fundingStatus),
                borderWidth: hoveredDistrict === district.id ? '3px' : '2px'
              }}
            >
              <div className="font-semibold text-gray-900 text-sm mb-1">
                {district.name}
              </div>
              <div className="text-xs text-gray-600 mb-2">
                {district.coveredSchools}/{district.totalSchools} schools
              </div>
              <div 
                className="w-3 h-3 rounded-full mx-auto"
                style={{ backgroundColor: getDistrictColor(district.fundingStatus) }}
              />
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-3">Funding Status Legend</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Needs Funding</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Partially Funded</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Well Funded</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Fully Funded</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Popup */}
      <MapPopup
        district={selectedDistrict}
        onClose={() => setSelectedDistrict(null)}
      />

      {/* Map Instructions */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <MapPin className="w-4 h-4 inline mr-1" />
        Click on any district to see school coverage details and sponsorship opportunities
      </div>
    </div>
  )
}