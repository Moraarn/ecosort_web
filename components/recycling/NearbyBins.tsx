'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation } from 'lucide-react'
import { translateText } from '@/lib/translations'
import { NearbyBin, LocationPermission } from '@/types/location'
import dynamic from 'next/dynamic'

// Dynamically import GoogleMapComponent to avoid SSR issues
const GoogleMapComponent = dynamic(() => import('@/components/GoogleMapComponent'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
})

interface NearbyBinsProps {
  classification: any
  selectedLanguage: string
  onLocationPermission: () => void
  onFetchNearbyBins: (latitude: number, longitude: number, wasteType?: string) => Promise<void>
}

export default function NearbyBins({ 
  classification, 
  selectedLanguage, 
  onLocationPermission, 
  onFetchNearbyBins 
}: NearbyBinsProps) {
  const [locationPermission, setLocationPermission] = useState<LocationPermission>({ granted: false })
  const [nearbyBins, setNearbyBins] = useState<NearbyBin[]>([])
  const [selectedBin, setSelectedBin] = useState<NearbyBin | null>(null)
  const [isLoadingBins, setIsLoadingBins] = useState(false)
  const [showMap, setShowMap] = useState(false)

  const handleLocationPermission = async () => {
    if (!navigator.geolocation) {
      setLocationPermission({ 
        granted: false, 
        error: 'Geolocation is not supported by your browser' 
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setLocationPermission({ 
          granted: true, 
          coordinates: { latitude, longitude } 
        })
        
        // Fetch nearby bins for the classified waste type
        if (classification) {
          setIsLoadingBins(true)
          await onFetchNearbyBins(latitude, longitude, classification.category.name)
          setIsLoadingBins(false)
        }
      },
      (error) => {
        let errorMessage = 'Unable to get your location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }
        setLocationPermission({ 
          granted: false, 
          error: errorMessage 
        })
      }
    )
  }

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

  if (!classification) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {translateText('nearby bins', selectedLanguage)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!locationPermission.granted ? (
          <div className="text-center py-6">
            <Navigation className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">
              {translateText('find nearby bins for your waste', selectedLanguage)}
            </p>
            <Button 
              onClick={handleLocationPermission}
              className="w-full"
            >
              <MapPin className="h-4 w-4 mr-2" />
              {translateText('enable location', selectedLanguage)}
            </Button>
            {locationPermission.error && (
              <p className="text-sm text-red-500 mt-2">{locationPermission.error}</p>
            )}
          </div>
        ) : isLoadingBins ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {translateText('finding nearby bins', selectedLanguage)}...
            </p>
          </div>
        ) : nearbyBins.length === 0 ? (
          <div className="text-center py-6">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">
              {translateText('no nearby bins found', selectedLanguage)}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {translateText('found', selectedLanguage)} {nearbyBins.length} {translateText('bins nearby', selectedLanguage)}
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? 'Hide Map' : 'Show Map'}
              </Button>
            </div>
            
            {/* Map View */}
            {showMap && locationPermission.coordinates && (
              <div className="h-64 rounded-lg overflow-hidden border">
                <GoogleMapComponent
                  bins={nearbyBins}
                  userLocation={locationPermission.coordinates}
                  selectedBin={selectedBin}
                  onBinSelect={setSelectedBin}
                  className="w-full h-full"
                />
              </div>
            )}
            
            {/* Bin List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {nearbyBins.map((bin) => (
                <div 
                  key={bin.id}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedBin?.id === bin.id ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedBin(bin)}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0"
                      style={{ backgroundColor: getBinColorHex(bin.bin_color) }}
                    />
                    <div>
                      <p className="font-medium text-sm">{bin.name}</p>
                      <p className="text-xs text-gray-500">{bin.address}</p>
                      <p className="text-xs text-gray-400">
                        {bin.distance}m • {bin.waste_type}
                      </p>
                    </div>
                  </div>
                  <Badge variant={bin.status === 'active' ? 'default' : 'secondary'}>
                    {bin.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
