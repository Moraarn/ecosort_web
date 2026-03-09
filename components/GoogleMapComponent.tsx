'use client'

import { useEffect, useRef, useState } from 'react'
import { NearbyBin } from '@/types/location'

interface GoogleMapComponentProps {
  bins: NearbyBin[]
  userLocation: { latitude: number; longitude: number }
  selectedBin?: NearbyBin | null
  onBinSelect: (bin: NearbyBin) => void
  className?: string
}

export default function GoogleMapComponent({ 
  bins, 
  userLocation, 
  selectedBin, 
  onBinSelect,
  className = '' 
}: GoogleMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true)
        return
      }

      const script = document.createElement('script')
      script.async = true
      script.defer = true
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.onload = () => {
        setIsLoaded(true)
      }
      script.onerror = () => {
        console.error('Failed to load Google Maps')
      }
      document.head.appendChild(script)
    }

    loadGoogleMaps()
  }, [])

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google?.maps) return

    // Initialize map
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: userLocation.latitude, lng: userLocation.longitude },
      zoom: 13,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    })

    mapInstanceRef.current = map

    // Add user location marker
    new window.google.maps.Marker({
      position: { lat: userLocation.latitude, lng: userLocation.longitude },
      map,
      title: 'Your Location',
      icon: {
        path: 'M-1.547 12l-6.562-6.562a5.5 5.5 0 1 1 7.778 0z',
        scale: 2,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2
      }
    })

  }, [isLoaded, userLocation])

  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded || !window.google?.maps) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    // Add bin markers
    bins.forEach(bin => {
      const marker = new window.google.maps.Marker({
        position: { lat: bin.latitude, lng: bin.longitude },
        map: mapInstanceRef.current,
        title: bin.name,
        icon: {
          path: 'M0 0C0 0 0-8 0-8c0-4.418 3.582-8 8-8s8 3.582 8 8c0 0 0 8 0 8s-8 8-8 8-8-8-8-8z',
          scale: 1.5,
          fillColor: getBinColorHex(bin.bin_color),
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      })

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${bin.name}</h3>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${bin.address}</p>
            <p style="margin: 0 0 4px 0; font-size: 12px;">
              <strong>Type:</strong> ${bin.waste_type}
            </p>
            <p style="margin: 0 0 4px 0; font-size: 12px;">
              <strong>Distance:</strong> ${bin.distance}m
            </p>
            <p style="margin: 0 0 4px 0; font-size: 12px;">
              <strong>Status:</strong> <span style="color: ${bin.status === 'active' ? 'green' : 'red'}">${bin.status}</span>
            </p>
            ${bin.fill_level !== undefined ? `
              <p style="margin: 0; font-size: 12px;">
                <strong>Fill Level:</strong> ${bin.fill_level}%
              </p>
            ` : ''}
          </div>
        `
      })

      marker.addListener('click', () => {
        onBinSelect(bin)
        infoWindow.open(mapInstanceRef.current, marker)
      })

      markersRef.current.push(marker)
    })

  }, [bins, isLoaded, onBinSelect])

  const getBinColorHex = (color: string): string => {
    const colorMap: Record<string, string> = {
      'Blue': '#3B82F6',
      'Green': '#10B981',
      'Yellow': '#EAB308',
      'Red': '#EF4444',
      'Brown': '#92400E',
      'Purple': '#9333EA',
      'Gray': '#6B7280'
    }
    return colorMap[color] || '#6B7280'
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className={className} />
}
