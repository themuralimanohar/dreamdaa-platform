'use client'

import { useEffect, useRef, useState } from 'react'
import { X, School, Users, TrendingUp, AlertCircle } from 'lucide-react'
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
          Sponsor Schools
        </Button>
      </div>
    </div>
  )
}

export default function TamilNaduMapDebug() {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null)
  const [mapStatus, setMapStatus] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return

    const initMap = async () => {
      try {
        setMapStatus('loading')
        console.log('Starting map initialization...')

        // Check if Leaflet is already loaded
        if (!(window as any).L) {
          console.log('Loading Leaflet CSS...')
          
          // Load CSS
          const cssLink = document.createElement('link')
          cssLink.rel = 'stylesheet'
          cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(cssLink)

          console.log('Loading Leaflet JS...')
          
          // Load JS
          const script = document.createElement('script')
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          
          await new Promise((resolve, reject) => {
            script.onload = () => {
              console.log('Leaflet JS loaded successfully')
              resolve(true)
            }
            script.onerror = (error) => {
              console.error('Failed to load Leaflet JS:', error)
              reject(new Error('Failed to load Leaflet'))
            }
            document.head.appendChild(script)
          })

          // Wait for Leaflet to be available
          await new Promise(resolve => setTimeout(resolve, 500))
        }

        const L = (window as any).L
        if (!L) {
          throw new Error('Leaflet is not available')
        }

        console.log('Leaflet loaded, initializing map...')

        // Create map
        const map = L.map(mapRef.current!, {
          center: [11.1271, 78.6569], // Tamil Nadu center
          zoom: 7,
          zoomControl: true
        })

        leafletMapRef.current = map
        console.log('Map created successfully')

        // Add tile layer
        console.log('Adding tile layer...')
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 18
        })
        
        tileLayer.addTo(map)
        
        tileLayer.on('load', () => {
          console.log('Tiles loaded successfully')
        })
        
        tileLayer.on('tileerror', (e: any) => {
          console.error('Tile loading error:', e)
        })

        // Load GeoJSON
        console.log('Loading GeoJSON data...')
        try {
          const response = await fetch('/data/tamilnadu-districts.geojson')
          if (!response.ok) {
            throw new Error(`GeoJSON fetch failed: ${response.status} ${response.statusText}`)
          }
          
          const geojsonData = await response.json()
          console.log('GeoJSON loaded:', geojsonData)

          // Style function
          const style = (feature: any) => {
            const districtData = tamilNaduDistricts.find(d => d.id === feature.properties.id)
            const color = districtData ? getDistrictColor(districtData.fundingStatus) : '#999999'
            
            return {
              fillColor: color,
              weight: 2,
              opacity: 1,
              color: 'white',
              fillOpacity: 0.7
            }
          }

          // Event handlers
          const onEachFeature = (feature: any, layer: any) => {
            // Hover effects
            layer.on('mouseover', (e: any) => {
              layer.setStyle({
                weight: 5,
                color: '#666',
                fillOpacity: 0.9
              })
              layer.bringToFront()
              
              // Show tooltip
              const districtData = tamilNaduDistricts.find(d => d.id === feature.properties.id)
              if (districtData) {
                layer.bindTooltip(`
                  <strong>${districtData.name}</strong><br/>
                  ${districtData.coveredSchools}/${districtData.totalSchools} schools covered
                `).openTooltip()
              }
            })

            layer.on('mouseout', (e: any) => {
              const districtData = tamilNaduDistricts.find(d => d.id === feature.properties.id)
              const color = districtData ? getDistrictColor(districtData.fundingStatus) : '#999999'
              
              layer.setStyle({
                weight: 2,
                color: 'white',
                fillOpacity: 0.7,
                fillColor: color
              })
              layer.closeTooltip()
            })

            // Click handler
            layer.on('click', () => {
              const districtData = tamilNaduDistricts.find(d => d.id === feature.properties.id)
              if (districtData) {
                setSelectedDistrict(districtData)
              }
            })
          }

          // Add GeoJSON layer
          const geoLayer = L.geoJSON(geojsonData, {
            style: style,
            onEachFeature: onEachFeature
          }).addTo(map)

          console.log('GeoJSON layer added to map')

          // Fit bounds
          map.fitBounds(geoLayer.getBounds())

          // Add simple legend
          const legend = L.control({ position: 'bottomright' })
          legend.onAdd = function() {
            const div = L.DomUtil.create('div', 'info legend')
            div.innerHTML = `
              <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 0 15px rgba(0,0,0,0.2);">
                <h4>School Coverage</h4>
                <div><span style="background: #ef4444; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></span> Needs Funding</div>
                <div><span style="background: #f59e0b; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></span> Partial</div>
                <div><span style="background: #3b82f6; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></span> Good</div>
                <div><span style="background: #10b981; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></span> Complete</div>
              </div>
            `
            return div
          }
          legend.addTo(map)

        } catch (geoError) {
          console.error('GeoJSON loading error:', geoError)
          throw new Error(`Failed to load district data: ${geoError}`)
        }

        setMapStatus('loaded')
        console.log('Map initialization completed successfully')

      } catch (error) {
        console.error('Map initialization error:', error)
        setMapStatus('error')
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred')
      }
    }

    initMap()

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [])

  if (mapStatus === 'loading') {
    return (
      <div className="w-full h-96 lg:h-[500px] rounded-xl bg-blue-50 flex items-center justify-center border">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-700 font-semibold">Loading Tamil Nadu Map...</p>
          <p className="text-blue-600 text-sm mt-1">Please wait while we load the interactive map</p>
        </div>
      </div>
    )
  }

  if (mapStatus === 'error') {
    return (
      <div className="w-full h-96 lg:h-[500px] rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
        <div className="text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-red-700 font-semibold mb-2">Map Loading Failed</h3>
          <p className="text-red-600 text-sm mb-4">{errorMessage}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Retry Loading Map
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200"
        style={{ minHeight: '500px' }}
      />

      {/* Popup */}
      <MapPopup
        district={selectedDistrict}
        onClose={() => setSelectedDistrict(null)}
      />

      {/* Instructions */}
      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 text-sm">
          🗺️ <strong>Debug Map Loaded Successfully!</strong> Hover over districts for info, click for details.
        </p>
      </div>
    </div>
  )
}