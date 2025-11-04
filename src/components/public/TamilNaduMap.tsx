'use client'

import { useEffect, useRef, useState } from 'react'
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

export default function TamilNaduMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<any>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null)
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null)
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return

    const initMap = async () => {
      // Load Leaflet from CDN
      if (!(window as any).L) {
        // Load CSS
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)

        // Load JS
        await new Promise((resolve) => {
          const script = document.createElement('script')
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          script.onload = resolve
          document.head.appendChild(script)
        })
      }

      const L = (window as any).L

      // Initialize map centered on Tamil Nadu
      const map = L.map(mapRef.current!, {
        center: [11.1271, 78.6569], // Tamil Nadu center
        zoom: 7,
        zoomControl: true,
        scrollWheelZoom: true
      })

      leafletMapRef.current = map

      // Add base map layer (minimal style)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      // Create district markers based on coordinates
      tamilNaduDistricts.forEach(district => {
        if (!district.coordinates) return

        // Create circle marker for each district
        const marker = L.circleMarker(district.coordinates, {
          radius: 15,
          fillColor: getDistrictColor(district.fundingStatus),
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        })

        // Add hover effects
        marker.on('mouseover', (e: any) => {
          setHoveredDistrict(district.id)
          marker.setStyle({
            radius: 18,
            weight: 3,
            fillOpacity: 0.9
          })
          
          // Show tooltip
          const tooltip = L.tooltip({
            permanent: false,
            direction: 'top',
            className: 'leaflet-tooltip-custom'
          })
          marker.bindTooltip(
            `<strong>${district.name}</strong><br/>
             ${district.coveredSchools}/${district.totalSchools} schools covered<br/>
             <span style="color: ${getDistrictColor(district.fundingStatus)}">
               ${getFundingStatusText(district.fundingStatus)}
             </span>`,
            tooltip
          ).openTooltip()
        })

        marker.on('mouseout', (e: any) => {
          setHoveredDistrict(null)
          marker.setStyle({
            radius: 15,
            weight: 2,
            fillOpacity: 0.8
          })
          marker.closeTooltip()
        })

        // Add click handler for popup
        marker.on('click', (e: any) => {
          const mapContainer = mapRef.current!
          const rect = mapContainer.getBoundingClientRect()
          const point = map.latLngToContainerPoint(district.coordinates!)
          
          setPopupPosition({
            x: rect.left + point.x,
            y: rect.top + point.y
          })
          setSelectedDistrict(district)
        })

        marker.addTo(map)
      })

      // Add legend
      const legend = L.control({ position: 'bottomright' })
      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'leaflet-legend')
        div.innerHTML = `
          <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 1px 5px rgba(0,0,0,0.4);">
            <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">Funding Status</h4>
            <div style="margin: 4px 0; font-size: 12px;">
              <span style="display: inline-block; width: 12px; height: 12px; background: #10b981; margin-right: 5px; border-radius: 50%;"></span>
              Fully Funded
            </div>
            <div style="margin: 4px 0; font-size: 12px;">
              <span style="display: inline-block; width: 12px; height: 12px; background: #3b82f6; margin-right: 5px; border-radius: 50%;"></span>
              Well Funded
            </div>
            <div style="margin: 4px 0; font-size: 12px;">
              <span style="display: inline-block; width: 12px; height: 12px; background: #f59e0b; margin-right: 5px; border-radius: 50%;"></span>
              Partially Funded
            </div>
            <div style="margin: 4px 0; font-size: 12px;">
              <span style="display: inline-block; width: 12px; height: 12px; background: #ef4444; margin-right: 5px; border-radius: 50%;"></span>
              Needs Funding
            </div>
          </div>
        `
        return div
      }
      legend.addTo(map)
    }

    initMap()

    // Cleanup on unmount
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
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
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200"
        style={{ minHeight: '400px' }}
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

      {/* Map Instructions */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <MapPin className="w-4 h-4 inline mr-1" />
        Click on any district to see school coverage details and sponsorship opportunities
      </div>
    </div>
  )
}