'use client'

import { useEffect, useState } from 'react'
import { 
  tamilNaduDistricts, 
  getDistrictColor, 
  getFundingStatusText, 
  getCoveragePercentage 
} from '@/lib/tamilnadu-districts-data'

export default function TamilNaduMapExact() {
  const [mapStatus, setMapStatus] = useState('loading')

  useEffect(() => {
    if (typeof window === 'undefined') return

    console.log('TamilNaduMapExact: Starting initialization')

    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const css = document.createElement('link')
      css.rel = 'stylesheet'
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(css)
      console.log('Leaflet CSS loaded')
    }

    // Load Leaflet JS and initialize
    if (!(window as any).L) {
      console.log('Loading Leaflet JS...')
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = initMap
      script.onerror = () => {
        console.error('Failed to load Leaflet JS')
        setMapStatus('error')
      }
      document.head.appendChild(script)
    } else {
      console.log('Leaflet already available')
      initMap()
    }

    function initMap() {
      console.log('initMap called')
      
      // Direct DOM access like working HTML
      const mapElement = document.getElementById('tn-exact-map')
      const panel = document.getElementById('tn-exact-panel')
      
      if (!mapElement) {
        console.error('Map container #tn-exact-map not found')
        setMapStatus('error')
        return
      }

      console.log('Map container found, initializing...')
      const L = (window as any).L
      
      // Create district lookup map (EXACT copy from working HTML)
      const districtMap = new Map()
      tamilNaduDistricts.forEach(district => {
        districtMap.set(district.name, district)
      })
      console.log('District map created with', districtMap.size, 'districts')

      // Initialize map (EXACT copy from working HTML)
      const map = L.map(mapElement, { zoomControl: true })
      console.log('Leaflet map instance created')
      
      // Add tiles (EXACT copy from working HTML)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap"
      }).addTo(map)
      console.log('Tile layer added')

      // Fetch Tamil Nadu GeoJSON (EXACT copy from working HTML)
      console.log('Fetching GeoJSON...')
      fetch('https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@main/geojson/states/tamil-nadu.geojson')
        .then(r => {
          console.log('GeoJSON fetch response:', r.status)
          return r.json()
        })
        .then(geojson => {
          console.log('GeoJSON loaded:', geojson)
          
          const features = geojson.features || []
          console.log('Number of districts found:', features.length)

          const layer = L.geoJSON(geojson, {
            style: (feature: any) => {
              const properties = feature.properties || {}
              const districtName = (properties.district || properties.DIST_NAME || properties.District || properties.NAME_2 || 'Unknown').toString().trim()
              
              console.log('Styling district:', districtName)
              
              // Find matching district data (EXACT copy from working HTML)
              let matchingDistrict = districtMap.get(districtName)
              
              // Try partial matching if exact match not found (EXACT copy from working HTML)
              if (!matchingDistrict) {
                for (const district of tamilNaduDistricts) {
                  if (district.name.toLowerCase().includes(districtName.toLowerCase()) || 
                      districtName.toLowerCase().includes(district.name.toLowerCase())) {
                    matchingDistrict = district
                    console.log('Partial match found:', district.name, 'for', districtName)
                    break
                  }
                }
              }

              const fillColor = matchingDistrict ? getDistrictColor(matchingDistrict.fundingStatus) : '#cccccc'
              console.log('Color for', districtName, ':', fillColor)

              return {
                color: "#ffffff",        // stroke
                weight: 2,
                fillOpacity: 0.8,
                fillColor: fillColor
              }
            },
            onEachFeature: (feature: any, lyr: any) => {
              const properties = feature.properties || {}
              const districtName = (properties.district || properties.DIST_NAME || properties.District || properties.NAME_2 || 'Unknown').toString().trim()
              
              // Find matching district data (EXACT copy from working HTML)
              let matchingDistrict = districtMap.get(districtName)
              
              // Try partial matching if exact match not found (EXACT copy from working HTML)
              if (!matchingDistrict) {
                for (const district of tamilNaduDistricts) {
                  if (district.name.toLowerCase().includes(districtName.toLowerCase()) || 
                      districtName.toLowerCase().includes(district.name.toLowerCase())) {
                    matchingDistrict = district
                    break
                  }
                }
              }

              // Hover effects (EXACT copy from working HTML)
              lyr.on("mouseover", () => {
                lyr.setStyle({ weight: 3, color: "#111" })
              })
              lyr.on("mouseout", () => {
                lyr.setStyle({ weight: 2, color: "#fff" })
              })

              // Click handler (EXACT copy from working HTML)
              lyr.on("click", (e: any) => {
                console.log('District clicked:', districtName, matchingDistrict)
                
                if (matchingDistrict && panel) {
                  const coverage = getCoveragePercentage(matchingDistrict)
                  const status = getFundingStatusText(matchingDistrict.fundingStatus)
                  const statusClass = matchingDistrict.fundingStatus === 'complete' ? 'fully-funded' :
                                    matchingDistrict.fundingStatus === 'high' ? 'well-funded' :
                                    matchingDistrict.fundingStatus === 'medium' ? 'partial-funding' : 'needs-funding'
                  
                  const statusStyle = statusClass === 'fully-funded' ? 'background: #f0fdf4; border-left: 3px solid #10b981;' :
                                    statusClass === 'well-funded' ? 'background: #eff6ff; border-left: 3px solid #3b82f6;' :
                                    statusClass === 'partial-funding' ? 'background: #fffbeb; border-left: 3px solid #f59e0b;' : 
                                    'background: #fef2f2; border-left: 3px solid #ef4444;'
                  
                  const needsSponsorshipText = (matchingDistrict.totalSchools - matchingDistrict.coveredSchools) > 0 ? 
                    `<br><small>${matchingDistrict.totalSchools - matchingDistrict.coveredSchools} schools need sponsorship</small>` :
                    '<br><small>All schools funded! 🎉</small>'

                  panel.innerHTML = `
                    <h2 style="margin: 0 0 8px; font-size: 18px;">${matchingDistrict.name}</h2>
                    <div style="font-size: 13px; color: #6b7280; margin-bottom: 8px;">Tamil Nadu District</div>
                    <div style="margin: 8px 0; padding: 8px; border-radius: 6px; ${statusStyle}">
                      <strong>${status}</strong><br>
                      Coverage: ${coverage}%<br>
                      Schools: ${matchingDistrict.coveredSchools}/${matchingDistrict.totalSchools}
                      ${needsSponsorshipText}
                    </div>
                    <div style="margin-top:12px; font-size:12px; color:#555">Click other districts to compare coverage.</div>
                  `
                } else if (panel) {
                  panel.innerHTML = `
                    <h2 style="margin: 0 0 8px; font-size: 18px;">${districtName}</h2>
                    <div style="font-size: 13px; color: #6b7280; margin-bottom: 8px;">Tamil Nadu District</div>
                    <p>District data not available yet. We&apos;re working to include all Tamil Nadu districts.</p>
                  `
                }
                
                const popupText = matchingDistrict ? 
                  `<strong>${districtName}</strong><br/>${getFundingStatusText(matchingDistrict.fundingStatus)} - ${getCoveragePercentage(matchingDistrict)}% covered` :
                  `<strong>${districtName}</strong>`
                lyr.bindPopup(popupText).openPopup(e.latlng)
              })
            }
          }).addTo(map)

          // Fit view to Tamil Nadu bounds (EXACT copy from working HTML)
          map.fitBounds(layer.getBounds(), { padding: [10, 10] })
          console.log('Tamil Nadu map rendered successfully!')
          setMapStatus('loaded')
        })
        .catch(err => {
          console.error("Failed to load GeoJSON:", err)
          const panel = document.getElementById("tn-exact-panel")
          if (panel) {
            panel.innerHTML = `
              <h2 style="margin: 0 0 8px; font-size: 18px;">TN District Explorer</h2>
              <p>Could not load district boundaries. This might be due to network restrictions.</p>
              <p><strong>Error:</strong> ${err.message}</p>
            `
          }
          setMapStatus('error')
        })
    }
  }, [])

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
          {/* Map */}
          <div className="lg:col-span-2">
            <div 
              id="tn-exact-map"
              className="w-full h-96 lg:h-[600px]"
              style={{ minHeight: '600px' }}
            />
          </div>
          
          {/* Side Panel */}
          <div className="border-l border-gray-200 bg-gray-50 p-4 overflow-auto">
            <div id="tn-exact-panel" className="space-y-4">
              <h2 style={{ margin: '0 0 8px', fontSize: '18px' }}>TN District Explorer</h2>
              <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>Click a district to see school coverage details</div>
              <p style={{ fontSize: '14px', color: '#374151' }}>
                This map shows real Tamil Nadu district boundaries with school funding status. 
                Each district is colored based on coverage percentage.
              </p>
              
              {/* Legend */}
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#555' }}>
                <div style={{ margin: '8px 0' }}>
                  <div style={{ display: 'inline-block', width: '12px', height: '12px', background: '#ef4444', marginRight: '6px' }}></div>
                  Needs Funding (0-40%)
                </div>
                <div style={{ margin: '8px 0' }}>
                  <div style={{ display: 'inline-block', width: '12px', height: '12px', background: '#f59e0b', marginRight: '6px' }}></div>
                  Partially Funded (41-70%)
                </div>
                <div style={{ margin: '8px 0' }}>
                  <div style={{ display: 'inline-block', width: '12px', height: '12px', background: '#3b82f6', marginRight: '6px' }}></div>
                  Well Funded (71-99%)
                </div>
                <div style={{ margin: '8px 0' }}>
                  <div style={{ display: 'inline-block', width: '12px', height: '12px', background: '#10b981', marginRight: '6px' }}></div>
                  Fully Funded (100%)
                </div>
              </div>
              
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#555' }}>
                Tip: Ctrl/Cmd + scroll to zoom the map.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 text-sm">
          🗺️ <strong>Real Tamil Nadu Map:</strong> This uses the exact same approach as the working HTML file.
        </p>
      </div>
    </div>
  )
}