"use client"

import { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin/AdminSidebar"
import SmartBinsStats from "@/components/admin/smart-bins/SmartBinsStats"
import SmartBinsControls from "@/components/admin/smart-bins/SmartBinsControls"
import SmartBinsListView from "@/components/admin/smart-bins/SmartBinsListView"
import SmartBinsMapView from "@/components/admin/smart-bins/SmartBinsMapView"
import AddBinModal from "@/components/admin/smart-bins/AddBinModal"
import BinDetailsModal from "@/components/admin/smart-bins/BinDetailsModal"
import { SmartBin } from '@/types/smart-bins'

export default function AdminSmartBins() {
  const [showAddBinModal, setShowAddBinModal] = useState(false)
  const [selectedBin, setSelectedBin] = useState<SmartBin | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [smartBins, setSmartBins] = useState<SmartBin[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch smart bins from API
  useEffect(() => {
    fetchSmartBins()
  }, [])

  const fetchSmartBins = async () => {
    try {
      const response = await fetch('/api/admin/smart-bins')
      const data = await response.json()
      
      if (response.ok) {
        setSmartBins(data.bins)
      } else {
        console.error('Failed to fetch smart bins:', data.error)
      }
    } catch (error) {
      console.error('Error fetching smart bins:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveBin = async (binData: any) => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/smart-bins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(binData),
      })

      const data = await response.json()

      if (response.ok) {
        // Add the new bin to the local state
        setSmartBins(prev => [data.bin, ...prev])
        setShowAddBinModal(false)
        alert('Smart bin added successfully!')
        
        // Refetch bins to ensure we have the latest data from database
        await fetchSmartBins()
      } else {
        alert(`Failed to add smart bin: ${data.error}`)
      }
    } catch (error) {
      console.error('Error adding smart bin:', error)
      alert('Failed to add smart bin. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleBinDelete = async (bin: SmartBin) => {
    if (!confirm(`Are you sure you want to delete "${bin.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/smart-bins?id=${bin.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSmartBins(prev => prev.filter(b => b.id !== bin.id))
        alert('Smart bin deleted successfully!')
      } else {
        const data = await response.json()
        alert(`Failed to delete smart bin: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting smart bin:', error)
      alert('Failed to delete smart bin. Please try again.')
    }
  }

  return (
    <AdminSidebar>
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Smart Bins Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Monitor and manage smart waste bins</p>
        </div>

        <div className="space-y-6">
          {/* Loading State */}
          {loading && (
            <div className="bg-white p-8 sm:p-12 rounded-lg border border-gray-200">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary mb-4"></div>
                <p className="text-sm sm:text-base text-gray-600">Loading smart bins...</p>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          {!loading && <SmartBinsStats smartBins={smartBins} />}

          {/* Controls */}
          {!loading && (
            <SmartBinsControls
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onAddBin={() => setShowAddBinModal(true)}
            />
          )}

          {/* Content */}
          {!loading && (
            <div>
              {viewMode === "list" ? (
                <SmartBinsListView
                  smartBins={smartBins}
                  onBinSelect={setSelectedBin}
                  onBinDelete={handleBinDelete}
                />
              ) : (
                <SmartBinsMapView
                  smartBins={smartBins}
                  onBinSelect={setSelectedBin}
                />
              )}
            </div>
          )}
        </div>

        {/* Add Bin Modal */}
        <AddBinModal
          isOpen={showAddBinModal}
          onClose={() => setShowAddBinModal(false)}
          onSave={handleSaveBin}
          saving={saving}
        />

        {/* Bin Details Modal */}
        <BinDetailsModal
          bin={selectedBin}
          onClose={() => setSelectedBin(null)}
        />
      </div>
    </AdminSidebar>
  )
}
