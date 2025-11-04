'use client'

import { useEffect, useRef, useState } from 'react'

export default function TestMapSimple() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<string>('Initializing...')

  useEffect(() => {
    console.log('useEffect started')
    setStatus('useEffect started')
    
    if (typeof window === 'undefined') {
      setStatus('Server-side rendering, skipping')
      return
    }

    setStatus('Client-side detected')
    console.log('Client-side detected')

    const checkAndInit = () => {
      console.log('checkAndInit called')
      console.log('mapRef.current:', mapRef.current)
      
      if (!mapRef.current) {
        setStatus('Waiting for DOM element...')
        setTimeout(checkAndInit, 100)
        return
      }

      setStatus('DOM element ready, loading Leaflet...')
      console.log('DOM element ready')

      // Load Leaflet
      if (!(window as any).L) {
        const css = document.createElement('link')
        css.rel = 'stylesheet' 
        css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(css)

        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = () => {
          console.log('Leaflet loaded')
          setStatus('Leaflet loaded, creating map...')
          createMap()
        }
        script.onerror = () => {
          console.error('Failed to load Leaflet')
          setStatus('Error: Failed to load Leaflet')
        }
        document.head.appendChild(script)
      } else {
        setStatus('Leaflet already available, creating map...')
        createMap()
      }
    }

    const createMap = () => {
      try {
        console.log('Creating map...')
        setStatus('Creating Leaflet map...')
        
        const L = (window as any).L
        const map = L.map(mapRef.current!, {
          center: [11.1271, 78.6569],
          zoom: 7
        })

        console.log('Map created, adding tiles...')
        setStatus('Map created, adding tiles...')

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

        console.log('Tiles added, fetching GeoJSON...')  
        setStatus('Tiles added, fetching Tamil Nadu data...')

        fetch('https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@main/geojson/states/tamil-nadu.geojson')
          .then(r => {
            console.log('GeoJSON response status:', r.status)
            if (!r.ok) throw new Error(`HTTP ${r.status}`)
            return r.json()
          })
          .then(data => {
            console.log('GeoJSON loaded:', data.features?.length, 'features')
            setStatus(`GeoJSON loaded: ${data.features?.length} districts`)
            
            L.geoJSON(data, {
              style: { fillColor: '#3b82f6', weight: 2, color: 'white', fillOpacity: 0.7 }
            }).addTo(map)
            
            setStatus('SUCCESS: Tamil Nadu map loaded!')
            console.log('Map complete!')
          })
          .catch(err => {
            console.error('GeoJSON error:', err)
            setStatus(`Error loading GeoJSON: ${err.message}`)
          })

      } catch (error) {
        console.error('Map creation error:', error)
        setStatus(`Error creating map: ${error}`)
      }
    }

    checkAndInit()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Simple Map Test</h1>
        
        <div className="bg-white p-4 rounded mb-4">
          <h3 className="font-semibold mb-2">Status:</h3>
          <div className="text-sm bg-gray-100 p-2 rounded font-mono">{status}</div>
        </div>

        <div className="bg-white p-4 rounded">
          <div 
            ref={mapRef}
            className="w-full h-96 bg-gray-200 border rounded"
          />
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          Check browser console for detailed logs
        </div>
      </div>
    </div>
  )
}