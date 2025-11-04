'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
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

export default function TamilNaduMapWorking() {
  const mapRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null)
  const [mapStatus, setMapStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  // Create district lookup map
  const districtMap = useMemo(() => {
    const map = new Map()
    tamilNaduDistricts.forEach(district => {
      map.set(district.name, district)
    })
    return map
  }, [])

  useEffect(() => {
    const initMap = async () => {
      try {
        console.log('Starting map initialization...')

        if (typeof window === 'undefined') {
          console.log('Window is undefined - SSR issue')
          return
        }

        // Wait for ref to be available with retry logic
        let retryCount = 0
        const maxRetries = 10
        
        const waitForRef = () => {
          if (mapRef.current) {
            console.log('Map container found')
            proceedWithMapInit()
          } else {
            retryCount++
            if (retryCount < maxRetries) {
              console.log(`Map ref not available yet, retry ${retryCount}/${maxRetries}`)
              setTimeout(waitForRef, 100)
            } else {
              console.error('Map container never became available')
              setMapStatus('error')
            }
          }
        }

        const proceedWithMapInit = () => {
          console.log('Proceeding with map initialization...')

          // Load Leaflet CSS
          if (!document.querySelector('link[href*="leaflet.css"]')) {
            console.log('Loading Leaflet CSS...')
            const cssLink = document.createElement('link')
            cssLink.rel = 'stylesheet'
            cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
            cssLink.onload = () => console.log('Leaflet CSS loaded successfully')
            cssLink.onerror = () => {
              console.log('Failed to load Leaflet CSS')
              setMapStatus('error')
            }
            document.head.appendChild(cssLink)
          } else {
            console.log('Leaflet CSS already loaded')
          }

          // Load Leaflet JS
          if (!(window as any).L) {
            console.log('Loading Leaflet JS...')
          const script = document.createElement('script')
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          
          script.onload = () => {
            console.log('Leaflet JS loaded successfully')
            initLeafletMap()
          }
          
          script.onerror = () => {
            console.log('Failed to load Leaflet JS')
            setMapStatus('error')
          }
          
          document.head.appendChild(script)
        } else {
          console.log('Leaflet already available')
          initLeafletMap()
        }

        function initLeafletMap() {
          try {
            console.log('Initializing Leaflet map...')
            
            const L = (window as any).L
            if (!L) {
              throw new Error('Leaflet not available')
            }

            console.log('Creating Leaflet map instance')
            const map = L.map(mapRef.current!, {
              center: [11.1271, 78.6569], // Tamil Nadu center
              zoom: 7,
              zoomControl: true,
              attributionControl: false
            })

            console.log('Adding tile layer...')
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map)

            console.log('Tile layer added successfully')

            // Fetch Tamil Nadu GeoJSON
            console.log('Fetching Tamil Nadu GeoJSON...')
            const TN_GEOJSON_URL = 'https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@main/geojson/states/tamil-nadu.geojson'
            
            fetch(TN_GEOJSON_URL)
              .then(response => {
                console.log(`GeoJSON response status: ${response.status}`)
                if (!response.ok) {
                  throw new Error(`HTTP ${response.status}: ${response.statusText}`)
                }
                return response.json()
              })
              .then(geojson => {
                console.log(`GeoJSON loaded - ${geojson.features?.length} features found`)
                
                // Add GeoJSON to map with district data
                const layer = L.geoJSON(geojson, {
                  style: (feature: any) => {
                    const props = feature.properties || {}
                    const name = (props.district || props.DIST_NAME || props.District || props.NAME_2 || 'Unknown').toString().trim()
                    
                    // Find matching district
                    let matchingDistrict = districtMap.get(name)
                    if (!matchingDistrict) {
                      for (const district of tamilNaduDistricts) {
                        if (district.name.toLowerCase().includes(name.toLowerCase()) || 
                            name.toLowerCase().includes(district.name.toLowerCase())) {
                          matchingDistrict = district
                          break
                        }
                      }
                    }

                    const fillColor = matchingDistrict ? getDistrictColor(matchingDistrict.fundingStatus) : '#3b82f6'

                    return {
                      color: '#ffffff',
                      weight: 2,
                      fillOpacity: 0.8,
                      fillColor: fillColor
                    }
                  },
                  onEachFeature: (feature: any, layer: any) => {
                    const props = feature.properties || {}
                    const name = (props.district || props.DIST_NAME || props.District || props.NAME_2 || 'Unknown').toString().trim()
                    
                    // Find matching district
                    let matchingDistrict = districtMap.get(name)
                    if (!matchingDistrict) {
                      for (const district of tamilNaduDistricts) {
                        if (district.name.toLowerCase().includes(name.toLowerCase()) || 
                            name.toLowerCase().includes(district.name.toLowerCase())) {
                          matchingDistrict = district
                          break
                        }
                      }
                    }

                    // Hover effects
                    layer.on('mouseover', () => {
                      layer.setStyle({ weight: 3, color: '#111' })
                    })
                    
                    layer.on('mouseout', () => {
                      layer.setStyle({ weight: 2, color: '#fff' })
                    })

                    // Click handler
                    layer.on('click', (e: any) => {
                      console.log('District clicked:', name, matchingDistrict)
                      
                      if (matchingDistrict) {
                        setSelectedDistrict(matchingDistrict)
                        
                        // Update side panel
                        if (panelRef.current) {
                          const coverage = getCoveragePercentage(matchingDistrict)
                          const status = getFundingStatusText(matchingDistrict.fundingStatus)
                          const statusClass = matchingDistrict.fundingStatus === 'complete' ? 'bg-green-50 border-l-4 border-green-500' :
                                            matchingDistrict.fundingStatus === 'high' ? 'bg-blue-50 border-l-4 border-blue-500' :
                                            matchingDistrict.fundingStatus === 'medium' ? 'bg-orange-50 border-l-4 border-orange-500' : 
                                            'bg-red-50 border-l-4 border-red-500'
                          
                          panelRef.current.innerHTML = `
                            <h3 class="text-xl font-bold text-gray-900 mb-2">${matchingDistrict.name}</h3>
                            <div class="text-sm text-gray-600 mb-4">Tamil Nadu District</div>
                            <div class="p-3 rounded-lg ${statusClass} mb-4">
                              <div class="font-semibold">${status}</div>
                              <div class="text-2xl font-bold">${coverage}%</div>
                              <div class="text-sm">Schools: ${matchingDistrict.coveredSchools}/${matchingDistrict.totalSchools}</div>
                              ${matchingDistrict.availableForSponsorship > 0 ? 
                                `<div class="text-sm mt-1">${matchingDistrict.availableForSponsorship} schools need sponsorship</div>` :
                                '<div class="text-sm mt-1 text-green-600">All schools funded! 🎉</div>'
                              }
                            </div>
                            <div class="text-xs text-gray-500">Click for detailed sponsorship options</div>
                          `
                        }
                      }

                      // Show popup
                      layer.bindPopup(`<strong>${name}</strong>${matchingDistrict ? `<br/>${getFundingStatusText(matchingDistrict.fundingStatus)} - ${getCoveragePercentage(matchingDistrict)}% covered` : ''}`).openPopup(e.latlng)
                    })
                  }
                }).addTo(map)

                // Fit to bounds
                map.fitBounds(layer.getBounds(), { padding: [10, 10] })
                console.log('Tamil Nadu map loaded successfully!')
                setMapStatus('loaded')
              })
              .catch(err => {
                console.error(`GeoJSON fetch error: ${err.message}`)
                setMapStatus('error')
              })

          } catch (error) {
            console.error(`Leaflet initialization error: ${error}`)
            setMapStatus('error')
          }
        }
        
        } // Close proceedWithMapInit function
        
        // Start the process by waiting for the ref
        waitForRef()

      } catch (error) {
        console.error(`General error: ${error}`)
        setMapStatus('error')
      }
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initMap, 100)
    return () => clearTimeout(timer)
  }, [districtMap])

  if (mapStatus === 'loading') {
    return (
      <div className="w-full h-96 lg:h-[600px] rounded-xl bg-blue-50 flex items-center justify-center border">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-700 font-semibold">Loading Tamil Nadu Map...</p>
          <p className="text-blue-600 text-sm mt-1">Loading real district boundaries</p>
        </div>
      </div>
    )
  }

  if (mapStatus === 'error') {
    return (
      <div className="w-full h-96 lg:h-[600px] rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
        <div className="text-center p-6">
          <h3 className="text-red-700 font-semibold mb-2">Map Loading Failed</h3>
          <p className="text-red-600 text-sm mb-4">Unable to load Tamil Nadu map</p>
          <p className="text-red-500 text-xs mb-4">Check browser console for detailed error logs</p>
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
          Interactive map with real district boundaries. Click on any district to explore school coverage details.
        </p>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3" style={{ minHeight: '600px' }}>
          {/* Map */}
          <div className="lg:col-span-2">
            <div 
              ref={mapRef} 
              className="w-full h-96 lg:h-[600px]"
              style={{ minHeight: '600px' }}
            />
          </div>
          
          {/* Side Panel */}
          <div className="border-l border-gray-200 bg-gray-50 p-4 overflow-auto">
            <div ref={panelRef} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">TN District Explorer</h3>
              <div className="text-sm text-gray-600">Click a district to see school coverage details</div>
              <p className="text-sm text-gray-700">
                This map shows real Tamil Nadu district boundaries with school funding status. 
                Each district is colored based on coverage percentage.
              </p>
              
              {/* Legend */}
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
              
              <div className="text-xs text-gray-500">
                Tip: Ctrl/Cmd + scroll to zoom the map
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* District Detail Popup */}
      <MapPopup
        district={selectedDistrict}
        onClose={() => setSelectedDistrict(null)}
      />

      {/* Instructions */}
      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 text-sm">
          🗺️ <strong>Real Tamil Nadu Map:</strong> This map uses actual district boundaries from government data. Click districts for detailed sponsorship information.
        </p>
      </div>
    </div>
  )
}