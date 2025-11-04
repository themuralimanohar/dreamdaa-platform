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

export default function TamilNaduMapDirect() {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null)
  const [mapStatus, setMapStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mapContainer = document.getElementById('tn-map-container')
    if (!mapContainer) return

    const script = document.createElement('script')
    script.innerHTML = `
      console.log('Direct script execution started')
      
      // Load CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const css = document.createElement('link')
        css.rel = 'stylesheet'
        css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(css)
      }

      // Load and init map
      if (!window.L) {
        const leafletScript = document.createElement('script')
        leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        leafletScript.onload = function() {
          initTNMap()
        }
        document.head.appendChild(leafletScript)
      } else {
        initTNMap()
      }

      function initTNMap() {
        const mapEl = document.getElementById('tn-map-container')
        if (!mapEl) return
        
        const map = L.map(mapEl, {
          center: [11.1271, 78.6569],
          zoom: 7,
          zoomControl: true
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

        fetch('https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@main/geojson/states/tamil-nadu.geojson')
          .then(r => r.json())
          .then(geojson => {
            const layer = L.geoJSON(geojson, {
              style: { fillColor: '#3b82f6', weight: 2, opacity: 1, color: 'white', fillOpacity: 0.8 },
              onEachFeature: function(feature, layer) {
                layer.on('click', function() {
                  console.log('District clicked:', feature.properties)
                })
              }
            }).addTo(map)
            map.fitBounds(layer.getBounds())
            window.dispatchEvent(new CustomEvent('mapLoaded'))
          })
      }
    `
    document.head.appendChild(script)

    const handleMapLoaded = () => setMapStatus('loaded')
    window.addEventListener('mapLoaded', handleMapLoaded)
    
    return () => {
      window.removeEventListener('mapLoaded', handleMapLoaded)
    }
  }, [])

  if (mapStatus === 'loading') {
    return (
      <div className="w-full h-96 lg:h-[600px] rounded-xl bg-blue-50 flex items-center justify-center border">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-700 font-semibold">Loading Tamil Nadu Map...</p>
          <p className="text-blue-600 text-sm mt-1">Direct initialization approach</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Tamil Nadu District Map
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Interactive map with real district boundaries. Click on any district to explore school coverage details.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3" style={{ minHeight: '600px' }}>
          <div className="lg:col-span-2">
            <div 
              id="tn-map-container"
              className="w-full h-96 lg:h-[600px]"
              style={{ minHeight: '600px' }}
            />
          </div>
          
          <div className="border-l border-gray-200 bg-gray-50 p-4 overflow-auto">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">TN District Explorer</h3>
              <div className="text-sm text-gray-600">Click a district to see school coverage details</div>
              <p className="text-sm text-gray-700">
                This map uses a direct initialization approach to bypass React ref timing issues.
              </p>
              
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-700">Legend:</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Needs Funding (0-40%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span>Partially Funded (41-70%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Well Funded (71-99%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Fully Funded (100%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MapPopup
        district={selectedDistrict}
        onClose={() => setSelectedDistrict(null)}
      />
    </div>
  )
}