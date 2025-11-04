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
  position: { x: number; y: number } | null
}

function MapPopup({ district, onClose, position }: MapPopupProps) {
  if (!district || !position) return null

  const coveragePercentage = getCoveragePercentage(district)

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-80 transform -translate-x-1/2 -translate-y-full"
      style={{
        left: position.x,
        top: position.y - 10,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg text-gray-900">{district.name}</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-3">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: getDistrictColor(district.fundingStatus) }}
        />
        <span className="text-sm font-medium text-gray-700">
          {getFundingStatusText(district.fundingStatus)}
        </span>
        <span className="ml-auto text-sm text-gray-500">
          {coveragePercentage}% covered
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <School className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <div className="text-xl font-bold text-blue-900">{district.totalSchools}</div>
          <div className="text-xs text-blue-600">Total Schools</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <div className="text-xl font-bold text-green-900">{district.coveredSchools}</div>
          <div className="text-xs text-green-600">Covered Schools</div>
        </div>
      </div>

      {/* Available for Sponsorship */}
      {district.availableForSponsorship > 0 && (
        <div className="bg-orange-50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span className="font-medium text-orange-900">Available for Sponsorship</span>
          </div>
          <div className="text-2xl font-bold text-orange-900 mb-1">
            {district.availableForSponsorship}
          </div>
          <div className="text-xs text-orange-600">
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
        <div className="text-center py-2">
          <div className="text-green-600 font-semibold text-sm">
            ✅ All schools in {district.name} are fully funded!
          </div>
        </div>
      )}
    </div>
  )
}

export default function TamilNaduInteractiveMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null)
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return

    const initMap = async () => {
      try {
        // Load Leaflet from CDN
        if (!(window as any).L) {
          // Load CSS first
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

          // Wait a bit for Leaflet to initialize
          await new Promise(resolve => setTimeout(resolve, 100))
        }

        const L = (window as any).L
        if (!L) {
          console.error('Leaflet failed to load')
          return
        }

        // Initialize map centered on Tamil Nadu
        const map = L.map(mapRef.current!, {
          center: [11.1271, 78.6569],
          zoom: 7,
          zoomControl: true,
          scrollWheelZoom: true,
          attributionControl: true
        })

        leafletMapRef.current = map

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map)

        // Style function based on funding status
        const style = (feature: any) => {
          const districtData = tamilNaduDistricts.find(d => d.id === feature.properties.id)
          const color = districtData ? getDistrictColor(districtData.fundingStatus) : '#999999'
          
          return {
            fillColor: color,
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
          }
        }

        // Highlight feature on mouseover
        const highlightFeature = (e: any) => {
          const layer = e.target
          
          layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.9
          })

          layer.bringToFront()

          // Show tooltip
          const districtData = tamilNaduDistricts.find(d => d.id === layer.feature.properties.id)
          if (districtData) {
            const tooltip = `<strong>${districtData.name}</strong><br/>
              ${districtData.coveredSchools}/${districtData.totalSchools} schools covered<br/>
              <span style="color: ${getDistrictColor(districtData.fundingStatus)}">
                ${getFundingStatusText(districtData.fundingStatus)}
              </span>`
            
            layer.bindTooltip(tooltip, {
              permanent: false,
              direction: 'top',
              className: 'leaflet-tooltip-custom'
            }).openTooltip()
          }
        }

        // Reset highlight on mouseout
        const resetHighlight = (e: any) => {
          const layer = e.target
          const districtData = tamilNaduDistricts.find(d => d.id === layer.feature.properties.id)
          const color = districtData ? getDistrictColor(districtData.fundingStatus) : '#999999'
          
          layer.setStyle({
            weight: 2,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
            fillColor: color
          })
          
          layer.closeTooltip()
        }

        // Handle click events
        const onFeatureClick = (e: any) => {
          const districtData = tamilNaduDistricts.find(d => d.id === e.target.feature.properties.id)
          if (districtData) {
            const mapContainer = mapRef.current!
            const rect = mapContainer.getBoundingClientRect()
            const bounds = e.target.getBounds()
            const center = bounds.getCenter()
            const point = map.latLngToContainerPoint(center)
            
            setPopupPosition({
              x: rect.left + point.x,
              y: rect.top + point.y
            })
            setSelectedDistrict(districtData)
          }
        }

        // Add events to each feature
        const onEachFeature = (feature: any, layer: any) => {
          layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: onFeatureClick
          })
        }

        // Load and add GeoJSON data
        try {
          const response = await fetch('/data/tamilnadu-simple.geojson')
          const geojsonData = await response.json()
          
          L.geoJSON(geojsonData, {
            style: style,
            onEachFeature: onEachFeature
          }).addTo(map)
        } catch (error) {
          console.error('Failed to load GeoJSON:', error)
        }

        // Add info control (legend)
        const info = L.control({ position: 'topright' })
        info.onAdd = function () {
          const div = L.DomUtil.create('div', 'info legend')
          div.innerHTML = `
            <div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 1px 5px rgba(0,0,0,0.4); font-family: 'Arial', sans-serif;">
              <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #333;">Funding Status</h4>
              <div style="margin: 6px 0; font-size: 12px; display: flex; align-items: center;">
                <span style="display: inline-block; width: 16px; height: 16px; background: #10b981; margin-right: 8px; border-radius: 3px;"></span>
                Fully Funded
              </div>
              <div style="margin: 6px 0; font-size: 12px; display: flex; align-items: center;">
                <span style="display: inline-block; width: 16px; height: 16px; background: #3b82f6; margin-right: 8px; border-radius: 3px;"></span>
                Well Funded
              </div>
              <div style="margin: 6px 0; font-size: 12px; display: flex; align-items: center;">
                <span style="display: inline-block; width: 16px; height: 16px; background: #f59e0b; margin-right: 8px; border-radius: 3px;"></span>
                Partially Funded
              </div>
              <div style="margin: 6px 0; font-size: 12px; display: flex; align-items: center;">
                <span style="display: inline-block; width: 16px; height: 16px; background: #ef4444; margin-right: 8px; border-radius: 3px;"></span>
                Needs Funding
              </div>
              <div style="margin-top: 8px; font-size: 11px; color: #666; border-top: 1px solid #eee; padding-top: 6px;">
                Click districts for details
              </div>
            </div>
          `
          return div
        }
        info.addTo(map)

        setMapLoaded(true)

      } catch (error) {
        console.error('Error initializing map:', error)
      }
    }

    initMap()

    // Cleanup
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [])

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedDistrict && mapRef.current && !mapRef.current.contains(event.target as Node)) {
        setSelectedDistrict(null)
        setPopupPosition(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [selectedDistrict])

  return (
    <div className="relative">
      {/* Loading state */}
      {!mapLoaded && (
        <div className="w-full h-96 lg:h-[500px] rounded-xl bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading interactive map...</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div 
        ref={mapRef} 
        className={`w-full h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200 ${!mapLoaded ? 'opacity-0' : 'opacity-100'}`}
        style={{ minHeight: '500px' }}
      />

      {/* Custom Popup */}
      <MapPopup
        district={selectedDistrict}
        position={popupPosition}
        onClose={() => {
          setSelectedDistrict(null)
          setPopupPosition(null)
        }}
      />

      {/* Instructions */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>🗺️ Hover over districts to see basic info • Click for detailed sponsorship opportunities</p>
      </div>
    </div>
  )
}