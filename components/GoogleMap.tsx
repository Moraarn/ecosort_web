"use client"

import { useEffect, useRef } from "react"

interface MapMarker {
  id: number
  name: string
  lat: number
  lng: number
  status: string
  progress: number
  wasteType: string
}

interface GoogleMapProps {
  markers: MapMarker[]
  onMarkerClick?: (marker: MapMarker) => void
  onMapClick?: (location: { lat: number; lng: number }) => void
  center?: { lat: number; lng: number }
}

export default function GoogleMap({ markers, onMarkerClick, onMapClick, center = { lat: 40.7128, lng: -74.0060 } }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.google) return

      const map = new window.google.maps.Map(mapRef.current, {
        center: center, // Use provided center or default
        zoom: 12,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      })

      mapInstanceRef.current = map

      // Add map click listener for location selection
      if (onMapClick) {
        map.addListener('click', (event: any) => {
          const lat = event.latLng.lat()
          const lng = event.latLng.lng()
          onMapClick({ lat, lng })
        })
      }

      // Add markers for smart bins
      markers.forEach((markerData) => {
        const marker = new window.google.maps.Marker({
          position: { lat: markerData.lat, lng: markerData.lng },
          map: map,
          title: markerData.name,
          icon: {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="14" fill="#ea580c" stroke="#ffffff" stroke-width="2"/>
                <circle cx="16" cy="16" r="3" fill="#ffffff"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32)
          }
        })

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${markerData.name}</h3>
              <p style="margin: 0 0 4px 0; font-size: 12px;">Status: ${markerData.status}</p>
              <p style="margin: 0 0 4px 0; font-size: 12px;">Fill Level: ${markerData.progress}%</p>
              <p style="margin: 0 0 4px 0; font-size: 12px;">Waste Type: ${markerData.wasteType}</p>
            </div>
          `
        })

        marker.addListener('click', () => {
          infoWindow.open(map, marker)
          if (onMarkerClick) {
            onMarkerClick(markerData)
          }
        })

        markersRef.current.push(marker)
      })
    }

    // Check API key availability immediately
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    
    if (!apiKey) {
      console.warn('Google Maps API key not configured. Map functionality will be limited.')
      // Show fallback immediately
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f3f4f6; border-radius: 8px; text-align: center; padding: 20px;">
            <div>
              <div style="font-size: 48px; margin-bottom: 16px;">🗺️</div>
              <h3 style="margin: 0 0 8px 0; color: #374151;">Map Unavailable</h3>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Google Maps API key not configured.<br>
                Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.
              </p>
            </div>
          </div>
        `
      }
      return // Exit early, don't attempt to load Google Maps
    }

    const loadGoogleMapsScript = () => {
      // Double-check API key before loading
      if (!apiKey) {
        console.warn('Google Maps API key not configured. Skipping script load.')
        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initMap
      script.onerror = () => {
        console.error('Failed to load Google Maps script')
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f3f4f6; border-radius: 8px; text-align: center; padding: 20px;">
              <div>
                <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
                <h3 style="margin: 0 0 8px 0; color: #374151;">Map Loading Error</h3>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  Unable to load Google Maps.<br>
                  Please check your internet connection and API key.
                </p>
              </div>
            </div>
          `
        }
      }
      document.head.appendChild(script)
    }

    if (!window.google) {
      loadGoogleMapsScript()
    } else {
      initMap()
    }

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current = []
    }
  }, [markers, onMarkerClick])

  useEffect(() => {
    // Update map center when center prop changes
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(center)
    }
  }, [center])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-64 rounded-lg"
      style={{ minHeight: "256px" }}
    />
  )
}
