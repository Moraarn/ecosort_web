"use client"

import { useEffect, useRef } from "react"

// Type declarations for Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any
        Marker: new (options?: any) => any
        InfoWindow: new (options?: any) => any
        Size: new (width: number, height: number) => any
      }
    }
  }
}

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
}

export default function GoogleMap({ markers, onMarkerClick, onMapClick }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.google) return

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.0060 }, // New York coordinates
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
              <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> ${markerData.status}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Progress:</strong> ${markerData.progress}%</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Waste Type:</strong> ${markerData.wasteType}</p>
            </div>
          `
        })

        marker.addListener("click", () => {
          infoWindow.open(map, marker)
          if (onMarkerClick) {
            onMarkerClick(markerData)
          }
        })

        markersRef.current.push(marker)
      })
    }

    // Load Google Maps script
    const loadGoogleMapsScript = () => {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCg9nrprZjMhLasAxyXucyH61DcspTjVuA&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initMap
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

  return (
    <div 
      ref={mapRef} 
      className="w-full h-64 rounded-lg"
      style={{ minHeight: "256px" }}
    />
  )
}
