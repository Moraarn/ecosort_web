import { SmartBin } from '@/types/smart-bins'

interface BinDetailsModalProps {
  bin: SmartBin | null
  onClose: () => void
}

export default function BinDetailsModal({ bin, onClose }: BinDetailsModalProps) {
  if (!bin) return null

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-red-500"
    if (progress >= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">{bin.name}</h2>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium">{bin.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Capacity</p>
              <p className="font-medium">{bin.progress}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Waste Type</p>
              <p className="font-medium">{bin.wasteType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Sync</p>
              <p className="font-medium">{bin.lastSync}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Location</p>
            <p className="font-medium">{bin.location}</p>
            <p className="text-sm text-gray-500">
              {bin.lat.toFixed(6)}, {bin.lng.toFixed(6)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Capacity Level</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${getProgressColor(bin.progress)}`}
                style={{ width: `${bin.progress}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-primary hover:bg-gray-900 text-white rounded-lg font-medium transition-colors">
            Configure
          </button>
        </div>
      </div>
    </div>
  )
}
