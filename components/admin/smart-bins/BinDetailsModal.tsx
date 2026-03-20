import { SmartBin } from '@/types/smart-bins'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg mx-auto max-h-[80vh] flex flex-col border border-gray-200/50 animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-8 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold text-gray-900">{bin.name}</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-gray-100"
            >
              ✕
            </Button>
          </div>
        </div>
        
        <div className="p-8 space-y-6 overflow-y-auto flex-1">
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Status</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(bin.status)}`}>
                      {bin.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Capacity</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">{bin.progress}%</span>
                    <div className={`w-2 h-2 rounded-full ${getProgressColor(bin.progress)}`}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Waste Type</p>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {bin.wasteType}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Last Sync</p>
                  <p className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">
                    {bin.lastSync}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-700">Location</p>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{bin.location}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded-lg">
                      {bin.lat.toFixed(6)}, {bin.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">Capacity Level</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    bin.progress >= 90 ? 'bg-red-100 text-red-800' : 
                    bin.progress >= 75 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {bin.progress >= 90 ? 'Critical' : bin.progress >= 75 ? 'Warning' : 'Normal'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor(bin.progress)}`}
                      style={{ width: `${bin.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span className="font-medium">{bin.progress}% Full</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="p-8 border-t border-gray-100 flex justify-end space-x-3 flex-shrink-0 bg-gray-50/50">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200"
          >
            Close
          </Button>
          <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
            Configure
          </Button>
        </div>
      </div>
    </div>
  )
}
