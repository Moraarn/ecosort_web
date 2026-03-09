"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Dispose() {
  const [scanMethod, setScanMethod] = useState<"camera" | "upload">("camera")
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)
  const [wasteLogId, setWasteLogId] = useState<string>("")
  const [wasteType, setWasteType] = useState<string>("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Mock QR locations
  const mockQRLocations = [
    { id: "1", code: "ECOSORT-BIN-001", location: "Main Street - Recycling Center", type: "Mixed Waste", status: "active" },
    { id: "2", code: "ECOSORT-BIN-002", location: "City Park - Organic Waste", type: "Organic", status: "active" },
    { id: "3", code: "ECOSORT-BIN-003", location: "Shopping Mall - Plastic Collection", type: "Plastic", status: "active" },
    { id: "4", code: "ECOSORT-BIN-004", location: "School Campus - Paper Recycling", type: "Paper", status: "active" }
  ]

  // Points calculation
  const pointsMap: { [key: string]: number } = {
    "Plastic": 15,
    "Organic": 10,
    "Metal": 20,
    "Glass": 18,
    "Paper": 12,
    "E-waste": 25
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsScanning(true)
    } catch (error) {
      console.error("Camera access denied:", error)
      alert("Camera access denied. Please use file upload instead.")
      setScanMethod("upload")
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      handleQRScan(selectedFile)
    }
  }

  const handleQRScan = async (qrFile?: File) => {
    // Simulate QR code processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock QR code detection
    const mockQRCode = "ECOSORT-BIN-003"
    const location = mockQRLocations.find(loc => loc.code === mockQRCode)
    
    if (location) {
      setScanResult({
        success: true,
        location: location,
        points: pointsMap[wasteType] || 10,
        timestamp: new Date().toISOString(),
        disposalId: `DISPOSAL-${Date.now()}`
      })
    } else {
      setScanResult({
        success: false,
        error: "Invalid QR code"
      })
    }
  }

  const simulateQRScan = async () => {
    if (!wasteLogId || !wasteType) {
      alert("Please complete waste classification first")
      router.push("/classify")
      return
    }

    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockQRCode = "ECOSORT-BIN-003"
    const location = mockQRLocations.find(loc => loc.code === mockQRCode)
    
    if (location) {
      const points = pointsMap[wasteType] || 10
      
      // Mock API call to log disposal
      try {
        const response = await fetch("/api/scan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            qrCode: mockQRCode,
            userId: "demo_user", // Get from auth context
            wasteType: wasteType,
            wasteLogId: wasteLogId
          }),
        })
        
        const result = await response.json()
        
        if (result.success) {
          setScanResult({
            success: true,
            location: location,
            points: points,
            timestamp: new Date().toISOString(),
            disposalId: result.disposalId
          })
        }
      } catch (error) {
        console.error("Error logging disposal:", error)
        // Fallback to mock result
        setScanResult({
          success: true,
          location: location,
          points: points,
          timestamp: new Date().toISOString(),
          disposalId: `DISPOSAL-${Date.now()}`
        })
      }
    }
  }

  const handleComplete = () => {
    // Redirect to wallet to show updated points
    router.push("/wallet")
  }

  const handleReset = () => {
    setScanResult(null)
    setWasteLogId("")
    setWasteType("")
    stopCamera()
  }

  // Check if coming from classification
  useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const logId = urlParams.get('wasteLogId')
      const type = urlParams.get('wasteType')
      
      if (logId && type) {
        setWasteLogId(logId)
        setWasteType(type)
      }
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/dashboard" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirm Disposal</h1>
            <p className="text-gray-600">Scan the QR code on the disposal bin to confirm</p>
          </div>

          {/* Waste Information */}
          {wasteLogId && wasteType && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Waste Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium text-gray-900">{wasteType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Potential Points</p>
                  <p className="font-medium text-green-600">+{pointsMap[wasteType] || 10}</p>
                </div>
              </div>
            </div>
          )}

          {!scanResult ? (
            <>
              {/* Scan Method Selection */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Scan Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setScanMethod("camera")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      scanMethod === "camera"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">📷</div>
                    <div className="font-medium">Camera</div>
                    <div className="text-sm text-gray-500">Use device camera</div>
                  </button>
                  
                  <button
                    onClick={() => setScanMethod("upload")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      scanMethod === "upload"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">📁</div>
                    <div className="font-medium">Upload</div>
                    <div className="text-sm text-gray-500">Upload QR image</div>
                  </button>
                </div>
              </div>

              {/* Camera Scanner */}
              {scanMethod === "camera" && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan QR Code</h3>
                  
                  {!isScanning ? (
                    <div className="text-center py-8">
                      <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">📷</span>
                      </div>
                      <button
                        onClick={startCamera}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
                      >
                        Start Camera
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-64 bg-black rounded-lg"
                        />
                        <div className="absolute inset-0 border-2 border-green-500 rounded-lg pointer-events-none"></div>
                      </div>
                      
                      <div className="flex gap-4">
                        <button
                          onClick={simulateQRScan}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
                        >
                          Simulate Scan
                        </button>
                        <button
                          onClick={stopCamera}
                          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* File Upload */}
              {scanMethod === "upload" && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload QR Code Image</h3>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="text-4xl mb-4">📁</div>
                    <p className="text-gray-600 mb-4">Upload an image of the QR code</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
                    >
                      Choose File
                    </button>
                  </div>
                </div>
              )}

              {/* Demo Button */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Demo Mode</h3>
                <p className="text-blue-700 mb-4">
                  Don't have a QR code? Try our demo simulation.
                </p>
                <button
                  onClick={simulateQRScan}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Simulate QR Scan
                </button>
              </div>
            </>
          ) : (
            /* Scan Result */
            <div className="bg-white rounded-xl shadow-sm p-6">
              {scanResult.success ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✅</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Disposal Confirmed!</h3>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      +{scanResult.points} Points
                    </div>
                    <div className="text-green-700">Added to your account</div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium">{scanResult.location.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Bin Type:</span>
                      <span className="font-medium">{scanResult.location.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Time:</span>
                      <span className="font-medium">
                        {new Date(scanResult.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ID:</span>
                      <span className="font-medium text-sm">{scanResult.disposalId}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={handleComplete}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
                    >
                      View Rewards
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium"
                    >
                      New Disposal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">❌</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Scan Failed</h3>
                  <p className="text-gray-600 mb-6">{scanResult.error}</p>
                  
                  <button
                    onClick={handleReset}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
