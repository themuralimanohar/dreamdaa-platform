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

declare global {
  interface Window {
    Highcharts: any
  }
}

export default function TamilNaduHighchartsMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null)
  const [mapStatus, setMapStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  useEffect(() => {
    const loadHighcharts = async () => {
      try {
        setMapStatus('loading')

        // Load Highcharts Maps
        if (!window.Highcharts) {
          const script = document.createElement('script')
          script.src = 'https://code.highcharts.com/maps/highmaps.js'
          
          await new Promise((resolve, reject) => {
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })
        }

        // Prepare data in Highcharts format
        const mapData = tamilNaduDistricts.map((district, index) => ({
          'hc-key': district.id,
          name: district.name,
          value: getCoveragePercentage(district),
          color: getDistrictColor(district.fundingStatus),
          district: district
        }))

        // Create custom Tamil Nadu map paths (simplified geometric representation)
        const customMapData = {
          'title': 'Tamil Nadu Districts',
          'version': '1.0.0',
          'type': 'FeatureCollection',
          'features': tamilNaduDistricts.map((district, index) => {
            // Create simple rectangular regions positioned roughly like Tamil Nadu
            const col = index % 6
            const row = Math.floor(index / 6)
            const x = 100 + col * 80
            const y = 100 + row * 60
            
            return {
              'type': 'Feature',
              'properties': {
                'hc-key': district.id,
                'name': district.name,
                'value': getCoveragePercentage(district)
              },
              'geometry': {
                'type': 'Polygon',
                'coordinates': [[
                  [x, y],
                  [x + 70, y],
                  [x + 70, y + 50],
                  [x, y + 50],
                  [x, y]
                ]]
              }
            }
          })
        }

        // Create the Highcharts map
        if (containerRef.current) {
          window.Highcharts.mapChart(containerRef.current, {
            chart: {
              backgroundColor: '#f8fafc',
              borderRadius: 12
            },
            title: {
              text: 'Tamil Nadu School Coverage Map',
              style: {
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#1f2937'
              }
            },
            subtitle: {
              text: 'Click on districts to view detailed information',
              style: {
                color: '#6b7280'
              }
            },
            legend: {
              enabled: false
            },
            tooltip: {
              enabled: true,
              formatter: function(this: any) {
                const point = this.point
                const district = point.district
                if (district) {
                  return `<b>${district.name}</b><br/>
                         Coverage: ${getCoveragePercentage(district)}%<br/>
                         Schools: ${district.coveredSchools}/${district.totalSchools}<br/>
                         Status: ${getFundingStatusText(district.fundingStatus)}`
                }
                return ''
              },
              backgroundColor: 'white',
              borderColor: '#e5e7eb',
              borderRadius: 8,
              shadow: true
            },
            credits: {
              enabled: false
            },
            navigation: {
              buttonOptions: {
                enabled: false
              }
            },
            plotOptions: {
              series: {
                cursor: 'pointer',
                states: {
                  hover: {
                    brightness: 0.1
                  },
                  select: {
                    brightness: -0.2,
                    borderWidth: 3,
                    borderColor: '#374151'
                  }
                },
                events: {
                  click: function(e: any) {
                    const district = e.point.district
                    if (district) {
                      setSelectedDistrict(district)
                    }
                  }
                },
                allowPointSelect: true,
                borderColor: '#ffffff',
                borderWidth: 2
              }
            },
            series: [{
              type: 'map',
              mapData: customMapData,
              data: mapData,
              name: 'School Coverage',
              dataLabels: {
                enabled: true,
                format: '{point.name}',
                style: {
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: '#000000',
                  textOutline: '1px contrast'
                }
              }
            }]
          })

          setMapStatus('loaded')
        }

      } catch (error) {
        console.error('Error loading Highcharts map:', error)
        setMapStatus('error')
      }
    }

    loadHighcharts()
  }, [])

  if (mapStatus === 'loading') {
    return (
      <div className="w-full h-96 lg:h-[500px] rounded-xl bg-blue-50 flex items-center justify-center border">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-700 font-semibold">Loading Tamil Nadu Map...</p>
          <p className="text-blue-600 text-sm mt-1">Initializing Highcharts visualization</p>
        </div>
      </div>
    )
  }

  if (mapStatus === 'error') {
    return (
      <div className="w-full h-96 lg:h-[500px] rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
        <div className="text-center p-6">
          <h3 className="text-red-700 font-semibold mb-2">Map Loading Failed</h3>
          <p className="text-red-600 text-sm mb-4">Unable to load the interactive map</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Highcharts Map Container */}
      <div 
        ref={containerRef} 
        className="w-full h-96 lg:h-[600px] rounded-xl overflow-hidden shadow-lg"
        style={{ minHeight: '600px' }}
      />

      {/* District Detail Popup */}
      <MapPopup
        district={selectedDistrict}
        onClose={() => setSelectedDistrict(null)}
      />

      {/* Instructions */}
      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 text-sm">
          🗺️ <strong>Interactive Tamil Nadu Map:</strong> Click on any district to see detailed school coverage information and sponsorship options.
        </p>
      </div>

      {/* Legend */}
      <div className="mt-4 bg-white rounded-lg p-4 shadow-sm border">
        <h4 className="font-semibold text-gray-900 mb-3">Funding Status Legend</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-gray-700">Needs Funding (0-40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm text-gray-700">Partially Funded (41-70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700">Well Funded (71-99%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">Fully Funded (100%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}