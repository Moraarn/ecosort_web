import GoogleMap from "@/components/GoogleMap"
import { SmartBin } from '@/types/smart-bins'

interface SmartBinsMapViewProps {
  smartBins: SmartBin[]
  onBinSelect: (bin: SmartBin) => void
}

export default function SmartBinsMapView({ smartBins, onBinSelect }: SmartBinsMapViewProps) {
  // Calculate center point for Kenya/Uganda region or use first bin location
  const defaultCenter = { lat: -1.2921, lng: 36.8219 } // Nairobi, Kenya
  
  const mapCenter = smartBins.length > 0 
    ? { 
        lat: smartBins.reduce((sum, bin) => sum + bin.lat, 0) / smartBins.length,
        lng: smartBins.reduce((sum, bin) => sum + bin.lng, 0) / smartBins.length
      }
    : defaultCenter

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="h-96 rounded-lg overflow-hidden">
        <GoogleMap 
          markers={smartBins}
          onMarkerClick={(marker) => {
            const bin = smartBins.find(b => b.id === marker.id)
            if (bin) onBinSelect(bin)
          }}
          center={mapCenter}
        />
      </div>
      {smartBins.length === 0 && (
        <div className="mt-4 text-center text-gray-500">
          <p className="text-sm">No smart bins available. Add your first bin to see it on the map.</p>
        </div>
      )}
    </div>
  )
}
