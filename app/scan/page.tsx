"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Scan() {
  const [scanMethod, setScanMethod] = useState<"camera" | "upload">("camera")
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)
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

  const handleQRScan = async (scanData?: File) => {
    try {
      // Simulate QR code scanning
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock successful scan
      const randomLocation = mockQRLocations[Math.floor(Math.random() * mockQRLocations.length)]
      
      setScanResult({
        success: true,
        location: randomLocation,
        timestamp: new Date().toISOString(),
        points: 15 + Math.floor(Math.random() * 10)
      })
    } catch (error) {
      setScanResult({
        success: false,
        error: "Failed to scan QR code. Please try again."
      })
    }
  }

  const handleCameraScan = () => {
    // Simulate camera QR scan
    handleQRScan()
    stopCamera()
  }

  const handleReset = () => {
    setScanResult(null)
    setFile(null)
    stopCamera()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleComplete = () => {
    // Redirect back to dashboard with success
    router.push("/dashboard?scan=success")
  }

  return (
    <div className="min-h-screen bg-gray-50">
  

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {!scanResult ? (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Scan QR Code</h1>
                <p className="text-gray-600">Scan the QR code at the disposal location to confirm your waste disposal</p>
              </div>

              {/* Scan Method Selection */}
              <div className="flex justify-center space-x-4 mb-8">
                <button
                  onClick={() => setScanMethod("camera")}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    scanMethod === "camera"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  📷 Camera
                </button>
                <button
                  onClick={() => setScanMethod("upload")}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    scanMethod === "upload"
                      ? "bg-orange-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  📁 Upload Image
                </button>
              </div>

              {/* Camera Scanner */}
              {scanMethod === "camera" && (
                <div className="space-y-6">
                  <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "1" }}>
                    {isScanning ? (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute inset-0 border-4 border-orange-500 rounded-lg opacity-50"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-48 h-48 border-2 border-orange-500 rounded-lg">
                              <div className="absolute top-0 left-0 w-full h-0.5 bg-orange-500 animate-pulse"></div>
                              <div className="absolute top-0 right-0 w-0.5 h-full bg-orange-500 animate-pulse"></div>
                              <div className="absolute bottom-0 right-0 w-full h-0.5 bg-orange-500 animate-pulse"></div>
                              <div className="absolute bottom-0 left-0 w-0.5 h-full bg-orange-500 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                          </div>
                          <p className="text-gray-600 mb-4">Camera is off</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center space-x-4">
                    {!isScanning ? (
                      <button
                        onClick={startCamera}
                        className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Start Camera
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleCameraScan}
                          className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Scan QR Code
                        </button>
                        <button
                          onClick={stopCamera}
                          className="px-8 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* File Upload */}
              {scanMethod === "upload" && (
                <div className="space-y-6">
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900 mb-2">Upload QR code image</p>
                      <p className="text-sm text-gray-600 mb-4">or drag and drop</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="qr-file-upload"
                    />
                    <label
                      htmlFor="qr-file-upload"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 cursor-pointer"
                    >
                      Select Image
                    </label>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">How to scan:</h3>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Locate the QR code at the disposal bin</li>
                  <li>2. Ensure good lighting and focus</li>
                  <li>3. Center the QR code in the scanner frame</li>
                  <li>4. Wait for automatic recognition</li>
                </ol>
              </div>
            </div>
          ) : (
            /* Scan Result */
            <div className="space-y-6">
              {scanResult.success ? (
                <>
                  {/* Success Result */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">QR Code Scanned Successfully!</h2>
                      <p className="text-gray-600 mb-6">Your disposal has been confirmed and points have been awarded.</p>
                    </div>

                    {/* Location Details */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Disposal Location</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{scanResult.location.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bin Type:</span>
                          <span className="font-medium">{scanResult.location.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">QR Code:</span>
                          <span className="font-medium">{scanResult.location.code}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">{new Date(scanResult.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Points Awarded */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center mb-6">
                      <div className="text-3xl font-bold text-yellow-600 mb-2">+{scanResult.points}</div>
                      <div className="text-gray-700 font-medium">Points Awarded!</div>
                      <div className="text-sm text-gray-600 mt-1">Added to your EcoSort account</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={handleComplete}
                        className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Back to Dashboard
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-8 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                      >
                        Scan Another
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Error Result */
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Scan Failed</h2>
                    <p className="text-gray-600 mb-6">{scanResult.error}</p>
                    <button
                      onClick={handleReset}
                      className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
