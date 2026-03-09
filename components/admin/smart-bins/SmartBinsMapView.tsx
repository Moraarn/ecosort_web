import GoogleMap from "@/components/GoogleMap"
import { SmartBin } from '@/types/smart-bins'

interface SmartBinsMapViewProps {
  smartBins: SmartBin[]
  onBinSelect: (bin: SmartBin) => void
}

export default function SmartBinsMapView({ smartBins, onBinSelect }: SmartBinsMapViewProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="h-96 rounded-lg overflow-hidden">
        <GoogleMap 
          markers={smartBins}
          onMarkerClick={(marker) => {
            const bin = smartBins.find(b => b.id === marker.id)
            if (bin) onBinSelect(bin)
          }}
        />
      </div>
    </div>
  )
}
