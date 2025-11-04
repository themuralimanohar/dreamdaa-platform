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
          Sponsor Schools in {district.name}
        </Button>
      </div>
    </div>
  )
}

declare global {
  interface Window {
    initGoogleMap?: () => void
    showDistrictDetails?: (districtId: string) => void
    google: any
  }
}

export default function TamilNaduGoogleMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<any>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null)
  const [mapStatus, setMapStatus] = useState<'loading' | 'loaded' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const initializeGoogleMap = () => {
      try {
        console.log('Initializing Google Map...')
        
        if (!window.google || !window.google.maps) {
          throw new Error('Google Maps API not loaded')
        }

        if (!mapRef.current) {
          throw new Error('Map container not found')
        }

        // Tamil Nadu center coordinates
        const tamilNaduCenter = { lat: 11.1271, lng: 78.6569 }

        // Initialize map
        const map = new window.google.maps.Map(mapRef.current, {
          center: tamilNaduCenter,
          zoom: 7,
          mapTypeId: 'terrain',
          styles: [
            {
              featureType: 'administrative.country',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#4b5563' }, { weight: 2 }]
            },
            {
              featureType: 'administrative.province',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#6b7280' }, { weight: 1 }]
            }
          ]
        })

        googleMapRef.current = map
        console.log('Google Map initialized successfully')

        // Add markers for each district
        tamilNaduDistricts.forEach(district => {
          if (district.coordinates) {
            const [lat, lng] = district.coordinates
            
            // Create custom marker with color based on funding status
            const marker = new window.google.maps.Marker({
              position: { lat, lng },
              map: map,
              title: district.name,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: getDistrictColor(district.fundingStatus),
                fillOpacity: 0.8,
                strokeColor: '#ffffff',
                strokeWeight: 2
              }
            })

            // Create info window content
            const infoWindowContent = `
              <div style="padding: 10px; max-width: 250px; font-family: Arial, sans-serif;">
                <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: bold;">
                  ${district.name} District
                </h3>
                <div style="margin: 5px 0; font-size: 14px;">
                  <span style="display: inline-block; width: 12px; height: 12px; background: ${getDistrictColor(district.fundingStatus)}; border-radius: 50%; margin-right: 5px;"></span>
                  <strong>${getFundingStatusText(district.fundingStatus)}</strong>
                </div>
                <div style="margin: 5px 0; font-size: 13px; color: #374151;">
                  Schools: <strong>${district.coveredSchools}</strong> of <strong>${district.totalSchools}</strong> covered
                </div>
                <div style="margin: 5px 0; font-size: 13px; color: #374151;">
                  Coverage: <strong>${getCoveragePercentage(district)}%</strong>
                </div>
                ${district.availableForSponsorship > 0 ? `
                  <div style="margin: 8px 0; padding: 6px; background: #fef3c7; border-radius: 4px; border-left: 3px solid #f59e0b;">
                    <strong style="color: #92400e;">${district.availableForSponsorship} schools</strong> need sponsorship
                  </div>
                ` : `
                  <div style="margin: 8px 0; padding: 6px; background: #d1fae5; border-radius: 4px; border-left: 3px solid #10b981;">
                    <strong style="color: #065f46;">All schools funded!</strong>
                  </div>
                `}
                <button 
                  onclick="window.showDistrictDetails('${district.id}')" 
                  style="margin-top: 8px; padding: 6px 12px; background: linear-gradient(135deg, #f97316, #dc2626); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 600;"
                >
                  View Details & Sponsor
                </button>
              </div>
            `

            const infoWindow = new window.google.maps.InfoWindow({
              content: infoWindowContent
            })

            // Add click listener to marker
            marker.addListener('click', () => {
              // Close all other info windows first
              if ((window as any).currentInfoWindow) {
                (window as any).currentInfoWindow.close()
              }
              
              infoWindow.open(map, marker)
              ;(window as any).currentInfoWindow = infoWindow
            })

            // Store marker reference
            ;(marker as any).districtId = district.id
          }
        })

        // Add function to show district details
        window.showDistrictDetails = (districtId: string) => {
          const district = tamilNaduDistricts.find(d => d.id === districtId)
          if (district) {
            setSelectedDistrict(district)
          }
        }

        // Add legend
        const legend = document.createElement('div')
        legend.style.cssText = `
          background: white;
          border: 2px solid #ccc;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          font-family: Arial, sans-serif;
          margin: 10px;
          padding: 10px;
          text-align: left;
        `
        
        legend.innerHTML = `
          <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">School Coverage Status</h4>
          <div style="margin: 4px 0; font-size: 12px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 14px; height: 14px; background: #ef4444; border-radius: 50%; margin-right: 6px;"></span>
            Needs Funding (0-40%)
          </div>
          <div style="margin: 4px 0; font-size: 12px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 14px; height: 14px; background: #f59e0b; border-radius: 50%; margin-right: 6px;"></span>
            Partially Funded (41-70%)
          </div>
          <div style="margin: 4px 0; font-size: 12px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 14px; height: 14px; background: #3b82f6; border-radius: 50%; margin-right: 6px;"></span>
            Well Funded (71-99%)
          </div>
          <div style="margin: 4px 0; font-size: 12px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 14px; height: 14px; background: #10b981; border-radius: 50%; margin-right: 6px;"></span>
            Fully Funded (100%)
          </div>
        `

        map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(legend)

        setMapStatus('loaded')

      } catch (error) {
        console.error('Google Maps initialization error:', error)
        setMapStatus('error')
        setErrorMessage(error instanceof Error ? error.message : 'Failed to initialize Google Maps')
      }
    }

    // Set up global callback
    window.initGoogleMap = initializeGoogleMap

    // Load Google Maps API
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY'}&callback=initGoogleMap&libraries=geometry`
      script.async = true
      script.defer = true
      script.onerror = () => {
        setMapStatus('error')
        setErrorMessage('Failed to load Google Maps API. This might be due to API key issues or network problems.')
      }
      document.head.appendChild(script)
    } else {
      initializeGoogleMap()
    }

    return () => {
      // Cleanup
      delete window.initGoogleMap
      delete window.showDistrictDetails
      delete (window as any).currentInfoWindow
    }
  }, [])

  if (mapStatus === 'loading') {
    return (
      <div className="w-full h-96 lg:h-[500px] rounded-xl bg-blue-50 flex items-center justify-center border">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-700 font-semibold">Loading Tamil Nadu Google Map...</p>
          <p className="text-blue-600 text-sm mt-1">Initializing interactive district view</p>
        </div>
      </div>
    )
  }

  if (mapStatus === 'error') {
    return (
      <div className="w-full h-96 lg:h-[500px] rounded-xl bg-yellow-50 border border-yellow-200 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-yellow-800 font-semibold mb-2">Google Maps Not Available</h3>
          <p className="text-yellow-700 text-sm mb-4">
            {errorMessage}
          </p>
          <div className="text-yellow-600 text-xs mb-4 space-y-2">
            <p><strong>Note:</strong> This map requires a Google Maps API key to display properly.</p>
            <p><strong>Setup Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1 text-left">
              <li>Get an API key from <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="underline">Google Cloud Console</a></li>
              <li>Enable the &quot;Maps JavaScript API&quot; for your project</li>
              <li>Copy .env.example to .env.local and add your API key</li>
              <li>Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here</li>
            </ol>
          </div>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Google Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200"
        style={{ minHeight: '500px' }}
      />

      {/* District Detail Popup */}
      <MapPopup
        district={selectedDistrict}
        onClose={() => setSelectedDistrict(null)}
      />

      {/* Instructions */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          🗺️ <strong>Interactive Google Map:</strong> Click on the colored markers to see district information. Each marker represents a district colored by funding status.
        </p>
      </div>
    </div>
  )
}