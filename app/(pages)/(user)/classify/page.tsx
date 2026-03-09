"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Classify() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isClassifying, setIsClassifying] = useState(false)
  const [result, setResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const wasteCategories = [
    { name: "Plastic", color: "blue", icon: "🍶", points: 15, instructions: "Rinse and place in blue bin. Remove caps.", impact: "Takes 450+ years to decompose" },
    { name: "Organic", color: "green", icon: "🍃", points: 10, instructions: "Place in green compost bin. No plastic bags.", impact: "Reduces methane emissions" },
    { name: "Metal", color: "yellow", icon: "🥫", points: 20, instructions: "Rinse and place in yellow bin. Crush cans to save space.", impact: "Infinitely recyclable" },
    { name: "Glass", color: "red", icon: "🍾", points: 18, instructions: "Rinse and place in red bin. Separate by color if possible.", impact: "100% recyclable without quality loss" },
    { name: "Paper", color: "blue", icon: "📄", points: 12, instructions: "Keep dry and place in blue bin. No waxed paper.", impact: "Saves trees and reduces energy" },
    { name: "E-waste", color: "purple", icon: "📱", points: 25, instructions: "Take to special e-waste collection point. Do not put in regular bins.", impact: "Contains hazardous materials" }
  ]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClassify = async () => {
    if (!selectedFile) return

    setIsClassifying(true)
    
    try {
      // Simulate AI classification
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock result - in production, this would call your AI model
      const mockCategory = wasteCategories[Math.floor(Math.random() * wasteCategories.length)]
      const confidence = 75 + Math.floor(Math.random() * 20)
      
      setResult({
        category: mockCategory,
        confidence: confidence,
        processingTime: 1.2
      })
    } catch (error) {
      console.error("Classification failed:", error)
    } finally {
      setIsClassifying(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleProceedToScan = () => {
    // Store result and redirect to scan page
    router.push("recycling-assistant")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-xl">EcoSort</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">AI Classification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Waste Classification</h1>
            <p className="text-gray-600">Upload or capture a photo of your waste item for instant categorization</p>
          </div>

          {!result ? (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Upload Area */}
              <div className="mb-8">
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    preview ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {preview ? (
                    <div className="space-y-4">
                      <img
                        src={preview}
                        alt="Waste item preview"
                        className="max-w-sm mx-auto rounded-lg shadow-md"
                      />
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Image selected</p>
                        <button
                          onClick={handleReset}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Choose different image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900 mb-2">Upload waste image</p>
                        <p className="text-sm text-gray-600 mb-4">or drag and drop</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 cursor-pointer"
                      >
                        Select Image
                      </label>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleClassify}
                  disabled={!selectedFile || isClassifying}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isClassifying ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Analyzing...</span>
                    </span>
                  ) : (
                    "Classify Waste"
                  )}
                </button>
                {selectedFile && (
                  <button
                    onClick={handleReset}
                    className="px-8 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Waste Categories Reference */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Waste Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {wasteCategories.map((category) => (
                    <div key={category.name} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-10 h-10 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                        <span className="text-lg">{category.icon}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{category.name}</div>
                        <div className="text-xs text-gray-600">{category.points} points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Results */
            <div className="space-y-6">
              {/* Classification Result */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                    <span className="text-3xl">{result.category.icon}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {result.category.name} Waste
                  </h2>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <span>Confidence: {result.confidence}%</span>
                    <span>•</span>
                    <span>Processing time: {result.processingTime}s</span>
                  </div>
                </div>

                {/* Category Details */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Disposal Instructions</h3>
                    <p className="text-gray-600 text-sm">{result.category.instructions}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Environmental Impact</h3>
                    <p className="text-gray-600 text-sm">{result.category.impact}</p>
                  </div>
                </div>

                {/* Points Awarded */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">+{result.category.points}</div>
                  <div className="text-gray-700 font-medium">Points Earned!</div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Next Steps</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">1</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Dispose of the item</div>
                      <div className="text-sm text-gray-600">Follow the instructions above</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">2</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Scan the QR code</div>
                      <div className="text-sm text-gray-600">At the disposal location to confirm</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white">3</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Earn your rewards</div>
                      <div className="text-sm text-gray-600">Points added to your account</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 mt-6">
                  <button
                    onClick={handleProceedToScan}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Scan QR Code →
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-8 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Classify Another Item
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
