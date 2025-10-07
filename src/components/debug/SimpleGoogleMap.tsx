'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    google: any
    initDebugMap?: () => void
  }
}

export default function SimpleGoogleMap() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadGoogleMaps = () => {
      // Log API key for debugging
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      console.log('API Key exists:', !!apiKey)
      console.log('API Key length:', apiKey?.length)
      
      if (!apiKey) {
        console.error('Google Maps API key not found')
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initDebugMap`
      script.async = true
      script.defer = true
      
      script.onload = () => {
        console.log('Google Maps script loaded successfully')
      }
      
      script.onerror = (error) => {
        console.error('Failed to load Google Maps script:', error)
      }

      window.initDebugMap = () => {
        console.log('initDebugMap called')
        
        if (!window.google || !window.google.maps) {
          console.error('Google Maps API not available')
          return
        }

        if (!mapRef.current) {
          console.error('Map container not found')
          return
        }

        try {
          const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 11.1271, lng: 78.6569 },
            zoom: 7,
            mapTypeId: 'roadmap'
          })
          
          console.log('Map created successfully:', map)
          
          // Add a simple marker
          new window.google.maps.Marker({
            position: { lat: 13.0827, lng: 80.2707 }, // Chennai
            map: map,
            title: 'Chennai - Test Marker'
          })
          
        } catch (error) {
          console.error('Error creating map:', error)
        }
      }

      document.head.appendChild(script)
    }

    loadGoogleMaps()

    return () => {
      delete window.initDebugMap
    }
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Google Maps Debug Test</h2>
      <div 
        ref={mapRef} 
        className="w-full h-96 bg-gray-200 border border-gray-300 rounded"
        style={{ minHeight: '400px' }}
      />
      <div className="mt-4 text-sm text-gray-600">
        <p>Check the browser console for debugging information.</p>
        <p>API Key: {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 'Set' : 'Not Set'}</p>
      </div>
    </div>
  )
}