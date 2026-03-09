interface SmartBinsControlsProps {
  viewMode: "list" | "map"
  onViewModeChange: (mode: "list" | "map") => void
  onAddBin: () => void
}

export default function SmartBinsControls({ viewMode, onViewModeChange, onAddBin }: SmartBinsControlsProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onViewModeChange("list")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "list"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            List View
          </button>
          <button
            onClick={() => onViewModeChange("map")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === "map"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Map View
          </button>
        </div>
        <button
          onClick={onAddBin}
          className="px-4 py-2 bg-primary hover:bg-gray-900 text-white rounded-lg font-medium transition-colors"
        >
          Add Smart Bin
        </button>
      </div>
    </div>
  )
}
