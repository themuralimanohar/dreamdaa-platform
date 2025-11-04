'use client'

import { useEffect, useState } from 'react'
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
    google: any
    drawTamilNaduVisualization?: () => void
  }
}

export default function TamilNaduGeoChart() {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null)
  const [mapStatus, setMapStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  useEffect(() => {
    const loadGoogleCharts = () => {
      try {
        setMapStatus('loading')

        // Create global callback function
        window.drawTamilNaduVisualization = () => {
          try {
            console.log('Drawing Tamil Nadu GeoChart...')

            // Prepare data for Google GeoChart
            const chartData: (string | number)[][] = [
              ['District Code', 'District', 'Coverage Percentage', 'Color']
            ]

            // Add Tamil Nadu districts data
            tamilNaduDistricts.forEach(district => {
              const coveragePercentage = getCoveragePercentage(district)
              // Use a simple district code format
              const districtCode = `IN-TN-${district.id.toUpperCase()}`
              
              chartData.push([
                districtCode,
                district.name,
                coveragePercentage,
                getDistrictColor(district.fundingStatus)
              ])
            })

            const data = window.google.visualization.arrayToDataTable(chartData)

            const options = {
              region: 'IN-TN', // Tamil Nadu region
              displayMode: 'regions',
              resolution: 'provinces', // Try to show state-level detail
              colorAxis: {
                colors: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'] // Red to Green scale
              },
              backgroundColor: '#f8fafc',
              datalessRegionColor: '#e5e7eb',
              defaultColor: '#f5f5f5',
              width: '100%',
              height: 500,
              tooltip: {
                trigger: 'both',
                isHtml: true
              }
            }

            const chart = new window.google.visualization.GeoChart(
              document.getElementById('tamil-nadu-geochart')
            )

            // Add select event listener
            window.google.visualization.events.addListener(chart, 'select', function() {
              const selection = chart.getSelection()
              if (selection.length > 0) {
                const row = selection[0].row
                const districtName = data.getValue(row, 1)
                const district = tamilNaduDistricts.find(d => d.name === districtName)
                if (district) {
                  setSelectedDistrict(district)
                }
              }
            })

            chart.draw(data, options)
            setMapStatus('loaded')
            console.log('Tamil Nadu GeoChart drawn successfully')

          } catch (error) {
            console.error('Error drawing GeoChart:', error)
            setMapStatus('error')
          }
        }

        // Load Google Charts
        if (!window.google || !window.google.visualization) {
          const script = document.createElement('script')
          script.src = 'https://www.gstatic.com/charts/loader.js'
          script.onload = () => {
            console.log('Google Charts loader loaded')
            window.google.charts.load('current', {
              packages: ['geochart'],
              callback: window.drawTamilNaduVisualization
            })
          }
          script.onerror = () => {
            console.error('Failed to load Google Charts')
            setMapStatus('error')
          }
          document.head.appendChild(script)
        } else {
          window.google.charts.load('current', {
            packages: ['geochart'],
            callback: window.drawTamilNaduVisualization
          })
        }

      } catch (error) {
        console.error('Error initializing Google Charts:', error)
        setMapStatus('error')
      }
    }

    loadGoogleCharts()

    return () => {
      delete window.drawTamilNaduVisualization
    }
  }, [])

  if (mapStatus === 'loading') {
    return (
      <div className="w-full h-96 lg:h-[500px] rounded-xl bg-blue-50 flex items-center justify-center border">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-700 font-semibold">Loading Tamil Nadu Map...</p>
          <p className="text-blue-600 text-sm mt-1">Initializing Google Charts visualization</p>
        </div>
      </div>
    )
  }

  if (mapStatus === 'error') {
    return (
      <div className="w-full h-96 lg:h-[500px] rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
        <div className="text-center p-6">
          <h3 className="text-red-700 font-semibold mb-2">Map Loading Failed</h3>
          <p className="text-red-600 text-sm mb-4">Unable to load the Google Charts map</p>
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
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Tamil Nadu District Map
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Interactive map showing school coverage across all Tamil Nadu districts. 
          Click on any region to view detailed information.
        </p>
      </div>

      {/* Google GeoChart Container */}
      <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div 
          id="tamil-nadu-geochart"
          className="w-full"
          style={{ minHeight: '500px' }}
        />
      </div>

      {/* District Detail Popup */}
      <MapPopup
        district={selectedDistrict}
        onClose={() => setSelectedDistrict(null)}
      />

      {/* Instructions */}
      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 text-sm">
          🗺️ <strong>Interactive Tamil Nadu Map:</strong> Click on any district region to see detailed school coverage information and sponsorship options.
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