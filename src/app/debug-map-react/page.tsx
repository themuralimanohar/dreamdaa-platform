'use client'

import { useEffect, useRef, useState } from 'react'

export default function DebugMapReactPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [logs, setLogs] = useState<string[]>(['Starting map initialization...'])
  const [mapStatus, setMapStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  const addLog = (message: string) => {
    console.log(message)
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    const initMap = async () => {
      try {
        addLog('useEffect started')

        if (typeof window === 'undefined') {
          addLog('Window is undefined - SSR issue')
          return
        }

        addLog('Client side detected')

        if (!mapRef.current) {
          addLog('Map ref not available yet')
          return
        }

        addLog('Map container found')

        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          addLog('Loading Leaflet CSS...')
          const cssLink = document.createElement('link')
          cssLink.rel = 'stylesheet'
          cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          cssLink.onload = () => addLog('Leaflet CSS loaded successfully')
          cssLink.onerror = () => addLog('Failed to load Leaflet CSS')
          document.head.appendChild(cssLink)
        } else {
          addLog('Leaflet CSS already loaded')
        }

        const initLeafletMap = () => {
          try {
            addLog('Initializing Leaflet map...')
            
            const L = (window as any).L
            if (!L) {
              throw new Error('Leaflet not available')
            }

            addLog('Creating Leaflet map instance')
            const map = L.map(mapRef.current!, {
              center: [11.1271, 78.6569], // Tamil Nadu center
              zoom: 7
            })

            addLog('Adding tile layer...')
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map)

            addLog('Tile layer added successfully')

            // Test GeoJSON fetch
            addLog('Fetching Tamil Nadu GeoJSON...')
            const TN_GEOJSON_URL = 'https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@main/geojson/states/tamil-nadu.geojson'
            
            fetch(TN_GEOJSON_URL)
              .then(response => {
                addLog(`GeoJSON response status: ${response.status}`)
                if (!response.ok) {
                  throw new Error(`HTTP ${response.status}: ${response.statusText}`)
                }
                return response.json()
              })
              .then(geojson => {
                addLog(`GeoJSON loaded - ${geojson.features?.length} features found`)
                
                // Add GeoJSON to map
                const layer = L.geoJSON(geojson, {
                  style: {
                    color: '#ffffff',
                    weight: 2,
                    fillOpacity: 0.7,
                    fillColor: '#3b82f6'
                  }
                }).addTo(map)

                // Fit to bounds
                map.fitBounds(layer.getBounds())
                addLog('Map completed successfully!')
                setMapStatus('loaded')
              })
              .catch(err => {
                addLog(`GeoJSON fetch error: ${err.message}`)
                setMapStatus('error')
              })

          } catch (error) {
            addLog(`Leaflet initialization error: ${error}`)
            setMapStatus('error')
          }
        }

        // Load Leaflet JS
        if (!(window as any).L) {
          addLog('Loading Leaflet JS...')
          const script = document.createElement('script')
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          
          script.onload = () => {
            addLog('Leaflet JS loaded successfully')
            initLeafletMap()
          }
          
          script.onerror = () => {
            addLog('Failed to load Leaflet JS')
            setMapStatus('error')
          }
          
          document.head.appendChild(script)
        } else {
          addLog('Leaflet already available')
          initLeafletMap()
        }

      } catch (error) {
        addLog(`General error: ${error}`)
        setMapStatus('error')
      }
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initMap, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">React Leaflet Debug Page</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Map */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Map Container</h2>
            <div className="relative">
              <div 
                ref={mapRef} 
                className="w-full h-96 bg-gray-100 border border-gray-300 rounded"
              />
              {mapStatus === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-50 rounded">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-blue-700 font-semibold">Loading...</p>
                  </div>
                </div>
              )}
              {mapStatus === 'error' && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded">
                  <div className="text-center">
                    <p className="text-red-700 font-semibold">Error loading map</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Debug Logs */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Debug Logs</h2>
            <div className="bg-black text-green-400 p-4 rounded text-sm font-mono h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Map Status */}
        <div className={`p-4 rounded-lg ${
          mapStatus === 'loading' ? 'bg-blue-50 border border-blue-200' :
          mapStatus === 'loaded' ? 'bg-green-50 border border-green-200' :
          'bg-red-50 border border-red-200'
        }`}>
          <div className={`font-semibold ${
            mapStatus === 'loading' ? 'text-blue-700' :
            mapStatus === 'loaded' ? 'text-green-700' :
            'text-red-700'
          }`}>
            Status: {mapStatus.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  )
}