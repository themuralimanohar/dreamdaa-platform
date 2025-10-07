'use client'

import { useEffect, useRef, useState } from 'react'
import { X, School, Users, TrendingUp, Info } from 'lucide-react'
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
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-6 w-96 mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl text-gray-900">{district.name} District</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: getDistrictColor(district.fundingStatus) }}
          />
          <span className="font-medium text-gray-700">
            {getFundingStatusText(district.fundingStatus)}
          </span>
          <span className="ml-auto text-gray-500 font-semibold">
            {coveragePercentage}% Coverage
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg border">
            <School className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">{district.totalSchools}</div>
            <div className="text-sm text-blue-600">Total Schools</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border">
            <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">{district.coveredSchools}</div>
            <div className="text-sm text-green-600">Schools Covered</div>
          </div>
        </div>

        {/* Available for Sponsorship */}
        {district.availableForSponsorship > 0 && (
          <div className="bg-orange-50 rounded-lg p-4 mb-6 border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-900">Sponsorship Needed</span>
            </div>
            <div className="text-3xl font-bold text-orange-900 mb-1">
              {district.availableForSponsorship}
            </div>
            <div className="text-sm text-orange-600">
              Schools need your support to provide AI-powered English learning
            </div>
          </div>
        )}

        {/* CTA Button */}
        {district.availableForSponsorship > 0 ? (
          <Button 
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold text-lg py-3"
            onClick={() => {
              window.location.href = `/donate?district=${district.id}&type=school`
            }}
          >
            Sponsor {district.availableForSponsorship} Schools in {district.name}
          </Button>
        ) : (
          <div className="text-center py-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-green-700 font-semibold">
              ✅ All schools in {district.name} are fully sponsored!
            </div>
            <div className="text-green-600 text-sm mt-1">
              Thank you to all our generous donors
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TamilNaduChoroplethMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return

    let mounted = true

    const initMap = async () => {
      try {
        // Load Leaflet from CDN
        if (!(window as any).L) {
          // Load CSS
          const cssLink = document.createElement('link')
          cssLink.rel = 'stylesheet'
          cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
          cssLink.crossOrigin = ''
          document.head.appendChild(cssLink)

          // Load JavaScript
          await new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
            script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
            script.crossOrigin = ''
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })

          // Wait for Leaflet to initialize
          await new Promise(resolve => setTimeout(resolve, 200))
        }

        if (!mounted) return

        const L = (window as any).L
        if (!L) {
          throw new Error('Leaflet failed to load')
        }

        // Initialize map
        const map = L.map(mapRef.current!, {
          center: [11.1271, 78.6569], // Tamil Nadu center
          zoom: 6,
          minZoom: 5,
          maxZoom: 10,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: false,
          attributionControl: true
        })

        if (!mounted) return
        leafletMapRef.current = map

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map)

        // Define style function based on funding status
        const getFeatureStyle = (feature: any) => {
          const districtData = tamilNaduDistricts.find(d => d.id === feature.properties.id)
          if (!districtData) {
            return {
              fillColor: '#999999',
              weight: 2,
              opacity: 1,
              color: '#ffffff',
              fillOpacity: 0.7
            }
          }

          return {
            fillColor: getDistrictColor(districtData.fundingStatus),
            weight: 2,
            opacity: 1,
            color: '#ffffff',
            dashArray: '3',
            fillOpacity: 0.8
          }
        }

        // Highlight feature on hover
        const highlightFeature = (e: any) => {
          const layer = e.target
          
          layer.setStyle({
            weight: 4,
            color: '#333333',
            dashArray: '',
            fillOpacity: 0.9
          })

          if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront()
          }

          // Update info control
          const districtData = tamilNaduDistricts.find(d => d.id === layer.feature.properties.id)
          if (districtData && (window as any).info) {
            (window as any).info.update(districtData)
          }
        }

        // Reset highlight
        const resetHighlight = (e: any) => {
          if ((window as any).geojsonLayer) {
            (window as any).geojsonLayer.resetStyle(e.target)
          }
          
          if ((window as any).info) {
            (window as any).info.update()
          }
        }

        // Click to show popup
        const onFeatureClick = (e: any) => {
          const districtData = tamilNaduDistricts.find(d => d.id === e.target.feature.properties.id)
          if (districtData) {
            setSelectedDistrict(districtData)
          }
        }

        // Add event listeners to each feature
        const onEachFeature = (feature: any, layer: any) => {
          layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: onFeatureClick
          })
        }

        // Load GeoJSON data
        const response = await fetch('/data/tamilnadu-districts.geojson')
        if (!response.ok) {
          throw new Error(`Failed to load GeoJSON: ${response.status}`)
        }
        
        const geojsonData = await response.json()
        
        if (!mounted) return

        // Create GeoJSON layer
        const geojsonLayer = L.geoJSON(geojsonData, {
          style: getFeatureStyle,
          onEachFeature: onEachFeature
        }).addTo(map)

        // Store reference for reset function
        ;(window as any).geojsonLayer = geojsonLayer

        // Add info control
        const info = L.control({ position: 'topright' })
        info.onAdd = function () {
          this._div = L.DomUtil.create('div', 'info')
          this.update()
          return this._div
        }
        
        info.update = function (district?: DistrictData) {
          const contents = district
            ? `<div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); min-width: 200px; font-family: 'Arial', sans-serif;">
                <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">${district.name}</h4>
                <div style="margin: 4px 0; font-size: 13px; color: #374151;">
                  <strong>${district.coveredSchools}</strong> of <strong>${district.totalSchools}</strong> schools covered
                </div>
                <div style="margin: 4px 0; font-size: 13px;">
                  <span style="color: ${getDistrictColor(district.fundingStatus)}; font-weight: 600;">
                    ${getFundingStatusText(district.fundingStatus)}
                  </span>
                </div>
                <div style="margin-top: 8px; font-size: 11px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 6px;">
                  Click for sponsorship details
                </div>
              </div>`
            : `<div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); font-family: 'Arial', sans-serif;">
                <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #1f2937;">Tamil Nadu School Coverage</h4>
                <div style="font-size: 12px; color: #6b7280;">
                  Hover over districts for details
                </div>
              </div>`
          
          this._div.innerHTML = contents
        }
        
        info.addTo(map)
        ;(window as any).info = info

        // Add legend
        const legend = L.control({ position: 'bottomright' })
        legend.onAdd = function () {
          const div = L.DomUtil.create('div', 'legend')
          div.innerHTML = `
            <div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); font-family: 'Arial', sans-serif;">
              <h4 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #1f2937;">Funding Status</h4>
              <div style="margin: 6px 0; font-size: 12px; display: flex; align-items: center;">
                <span style="display: inline-block; width: 16px; height: 16px; background: #ef4444; margin-right: 8px; border-radius: 3px;"></span>
                Needs Funding (0-40%)
              </div>
              <div style="margin: 6px 0; font-size: 12px; display: flex; align-items: center;">
                <span style="display: inline-block; width: 16px; height: 16px; background: #f59e0b; margin-right: 8px; border-radius: 3px;"></span>
                Partially Funded (41-70%)
              </div>
              <div style="margin: 6px 0; font-size: 12px; display: flex; align-items: center;">
                <span style="display: inline-block; width: 16px; height: 16px; background: #3b82f6; margin-right: 8px; border-radius: 3px;"></span>
                Well Funded (71-99%)
              </div>
              <div style="margin: 6px 0; font-size: 12px; display: flex; align-items: center;">
                <span style="display: inline-block; width: 16px; height: 16px; background: #10b981; margin-right: 8px; border-radius: 3px;"></span>
                Fully Funded (100%)
              </div>
            </div>
          `
          return div
        }
        legend.addTo(map)

        // Fit bounds to show all districts
        if (geojsonLayer.getBounds().isValid()) {
          map.fitBounds(geojsonLayer.getBounds(), { padding: [20, 20] })
        }

        if (mounted) {
          setMapLoaded(true)
        }

      } catch (error) {
        console.error('Error initializing map:', error)
        if (mounted) {
          setMapError(error instanceof Error ? error.message : 'Failed to load map')
        }
      }
    }

    initMap()

    // Cleanup
    return () => {
      mounted = false
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
      // Clean up global references
      delete (window as any).geojsonLayer
      delete (window as any).info
    }
  }, [])

  if (mapError) {
    return (
      <div className="w-full h-96 lg:h-[500px] rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-red-600 mb-4">
            <Info className="w-12 h-12 mx-auto mb-2" />
            <p className="font-semibold">Map Loading Error</p>
          </div>
          <p className="text-red-700 text-sm">{mapError}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Loading state */}
      {!mapLoaded && (
        <div className="w-full h-96 lg:h-[500px] rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center border border-blue-200">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-blue-700 font-semibold">Loading Tamil Nadu Interactive Map...</p>
            <p className="text-blue-600 text-sm mt-2">Fetching district data and boundaries</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div 
        ref={mapRef} 
        className={`w-full h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200 transition-opacity duration-500 ${
          !mapLoaded ? 'opacity-0 absolute' : 'opacity-100'
        }`}
        style={{ minHeight: '500px' }}
      />

      {/* District Detail Popup */}
      <MapPopup
        district={selectedDistrict}
        onClose={() => setSelectedDistrict(null)}
      />

      {/* Instructions */}
      {mapLoaded && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-blue-800 font-semibold text-sm mb-1">How to Use the Map</p>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• <strong>Hover</strong> over districts to see basic coverage information</li>
                <li>• <strong>Click</strong> on any district to view detailed sponsorship opportunities</li>
                <li>• Districts are color-coded by funding status - red districts need the most support</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}