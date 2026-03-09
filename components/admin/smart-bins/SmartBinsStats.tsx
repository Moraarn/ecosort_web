import { SmartBin } from '@/types/smart-bins'

interface SmartBinsStatsProps {
  smartBins: SmartBin[]
}

export default function SmartBinsStats({ smartBins }: SmartBinsStatsProps) {
  const totalBins = smartBins.length
  const activeBins = smartBins.filter(b => b.status === "Active").length
  const totalAlerts = smartBins.reduce((sum, b) => sum + b.alerts, 0)
  const avgCapacity = totalBins > 0 ? Math.round(smartBins.reduce((sum, b) => sum + b.progress, 0) / totalBins) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-600">Total Bins</h3>
        <p className="text-2xl font-bold text-gray-900 mt-2">{totalBins}</p>
        <p className="text-sm text-green-600 mt-1">All operational</p>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-600">Active Bins</h3>
        <p className="text-2xl font-bold text-gray-900 mt-2">{activeBins}</p>
        <p className="text-sm text-gray-500 mt-1">Currently online</p>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-600">Alerts</h3>
        <p className="text-2xl font-bold text-gray-900 mt-2">{totalAlerts}</p>
        <p className="text-sm text-yellow-600 mt-1">Requires attention</p>
      </div>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-600">Avg Capacity</h3>
        <p className="text-2xl font-bold text-gray-900 mt-2">{avgCapacity}%</p>
        <p className="text-sm text-gray-500 mt-1">Overall usage</p>
      </div>
    </div>
  )
}
