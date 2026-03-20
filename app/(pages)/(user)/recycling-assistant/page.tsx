'use client'

import { useState, useRef, useEffect } from 'react'
import { WasteClassifier } from '@/lib/ai/classifier'
import { type ClassificationResult, ChatMessage, VoiceSettings } from '@/types/waste'
import { translateText, getVoiceSettings, translations } from '@/lib/translations'
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '@/types/languages'
import DashboardLayout from '@/components/DashboardLayout'

// Import components
import ImageUpload from '@/components/recycling/ImageUpload'
import ClassificationResultCard from '@/components/recycling/ClassificationResultCard'
import EducationalContent from '@/components/recycling/EducationalContent'
import BinGuide from '@/components/recycling/BinGuide'
import NearbyBins from '@/components/recycling/NearbyBins'
import Chatbot from '@/components/recycling/Chatbot'
import { LanguageSelector } from '@/components/ui/language-selector'


export default function RecyclingAssistant() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [classification, setClassification] = useState<ClassificationResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en')
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: true,
    language: 'en',
    rate: 1,
    pitch: 1,
    volume: 1
  })
  
  // Location state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string>('')
  const [nearbyBins, setNearbyBins] = useState<any[]>([])
  const [isLocationLoading, setIsLocationLoading] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const classifier = WasteClassifier.getInstance()

  useEffect(() => {
    classifier.initialize()
    // Request user location on component mount
    requestUserLocation()
  }, [])

  // Refetch nearby bins when classification changes
  useEffect(() => {
    if (userLocation && classification?.category?.name) {
      fetchNearbyBins(userLocation.lat, userLocation.lng, classification.category.name)
    }
  }, [classification, userLocation])

  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleImageSelect(file)
  }

  const handleCameraCapture = () => {
    fileInputRef.current?.click()
  }

  const classifyImage = async () => {
    if (!selectedImage) return

    setIsProcessing(true)
    try {
      const result = await classifier.classifyImage(selectedImage)
      setClassification(result)
      
      // Add assistant message with classification result
      const categoryName = result.category?.name || 'Unknown Waste'
      const instructions = translateText(result.category?.disposal_instructions || 'Follow standard waste disposal guidelines', selectedLanguage as SupportedLanguage)
      
      // Create educational message content
      let messageContent = `${translateText('I classified this as', selectedLanguage as SupportedLanguage)} ${categoryName} ${translateText('with', selectedLanguage as SupportedLanguage)} ${Math.round(result.confidence * 100)}% ${translateText('confidence', selectedLanguage as SupportedLanguage)}. ${instructions}`
      
      // Add educational content if available
      if (result.educationalContent) {
        const edu = result.educationalContent
        messageContent += `\n\n📚 ${translateText('Educational Information', selectedLanguage as SupportedLanguage)}:\n`
        messageContent += `• ${translateText('Type', selectedLanguage as SupportedLanguage)}: ${edu.wasteType}\n`
        messageContent += `• ${translateText('Recyclable', selectedLanguage as SupportedLanguage)}: ${edu.recyclable ? '✅ Yes' : '❌ No'}\n`
        messageContent += `• ${translateText('Environmental Impact', selectedLanguage as SupportedLanguage)}: ${edu.environmentalImpact}\n`
        messageContent += `• ${translateText('Fun Fact', selectedLanguage as SupportedLanguage)}: ${edu.funFact}\n`
        messageContent += `• ${translateText('Eco Alternatives', selectedLanguage as SupportedLanguage)}: ${edu.alternatives}`
      }
      
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: messageContent,
        timestamp: new Date(),
        language: selectedLanguage
      }
      setMessages([assistantMessage])

      // Speak the instructions if voice is enabled
      if (isVoiceEnabled) {
        speakText(instructions)
      }
    } catch (error) {
      console.error('Classification failed:', error)
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I had trouble analyzing that image. Please try again.',
        timestamp: new Date()
      }
      setMessages([errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const speakText = (text: string) => {
    // Don't speak if voice is disabled
    if (!isVoiceEnabled) {
      return
    }
    
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel()
      
      const utterance = getVoiceSettings(selectedLanguage as SupportedLanguage)
      utterance.text = text
      utterance.rate = voiceSettings.rate
      utterance.pitch = voiceSettings.pitch
      utterance.volume = voiceSettings.volume
      
      // Add event listeners for better error handling
      utterance.onstart = () => {
        console.log('Speech started')
      }
      
      utterance.onend = () => {
        console.log('Speech ended')
      }
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event)
      }
      
      // Make sure voices are loaded
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', () => {
          speechSynthesis.speak(utterance)
        }, { once: true })
        // Trigger voiceschanged event
        speechSynthesis.getVoices()
      } else {
        speechSynthesis.speak(utterance)
      }
    } else {
      console.warn('Speech synthesis not supported in this browser')
    }
  }

  const toggleVoice = () => {
    const newVoiceState = !isVoiceEnabled
    setIsVoiceEnabled(newVoiceState)
    
    // If turning off voice, stop any ongoing speech
    if (!newVoiceState) {
      stopSpeaking()
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    try {
      const response = await fetch('/api/chatbot/recycling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          language: selectedLanguage,
          context: classification?.category.name
        })
      })

      const data = await response.json()
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        language: selectedLanguage
      }
      setMessages(prev => [...prev, assistantMessage])

      if (isVoiceEnabled) {
        speakText(data.response)
      }
    } catch (error) {
      console.error('Chatbot error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I had trouble understanding. Could you rephrase that?',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }

    setInputMessage('')
  }

  const resetSession = () => {
    setSelectedImage(null)
    setImagePreview('')
    setClassification(null)
    setMessages([])
    setInputMessage('')
    stopSpeaking()
  }

  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }

    setIsLocationLoading(true)
    setLocationError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ lat: latitude, lng: longitude })
        setIsLocationLoading(false)
        
        // Fetch nearby bins when location is obtained
        fetchNearbyBins(latitude, longitude)
      },
      (error) => {
        setIsLocationLoading(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location access to find nearby bins.')
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.')
            break
          case error.TIMEOUT:
            setLocationError('Location request timed out.')
            break
          default:
            setLocationError('An unknown error occurred while requesting location.')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  const fetchNearbyBins = async (latitude: number, longitude: number, wasteType?: string) => {
    try {
      const response = await fetch('/api/bins/nearby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude,
          longitude,
          radius: 5000, // 5km radius
          wasteType: wasteType || 'all'
        })
      })

      const data = await response.json()
      // Update the nearby bins state in the component
      setNearbyBins(data.bins || [])
      console.log('Nearby bins fetched:', data.bins)
    } catch (error) {
      console.error('Failed to fetch nearby bins:', error)
      setNearbyBins([])
    }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 max-w-7xl">

        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-green-800 mb-2">
                {translateText('eco.sort.assistant', selectedLanguage as SupportedLanguage)}
              </h1>
              <p className="text-gray-600">
                {translateText('ai.powered.classification', selectedLanguage as SupportedLanguage)}
              </p>
            </div>
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Image Upload and Classification */}
          <div className="space-y-4">
            <ImageUpload
              selectedImage={selectedImage}
              imagePreview={imagePreview}
              isProcessing={isProcessing}
              onImageSelect={handleImageSelect}
              onFileInput={handleFileInput}
              onCameraCapture={handleCameraCapture}
              onClassifyImage={classifyImage}
              fileInputRef={fileInputRef}
              selectedLanguage={selectedLanguage}
            />

            <ClassificationResultCard classification={classification} />
          </div>

          {/* Right Column - Chat Interface */}
          <div className="space-y-4">
            <Chatbot
              messages={messages}
              inputMessage={inputMessage}
              selectedLanguage={selectedLanguage}
              isVoiceEnabled={isVoiceEnabled}
              voiceSettings={voiceSettings}
              onInputChange={setInputMessage}
              onSendMessage={sendMessage}
              onToggleVoice={toggleVoice}
              onLanguageChange={setSelectedLanguage}
            />
          </div>
        </div>

        {/* Full Width Section - Educational Content, Nearby Bins, Bin Guide, and Classification History */}
        {classification && (
          <div className="mt-6 space-y-6">
            {/* Horizontal Layout for Educational Content and Nearby Bins */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EducationalContent classification={classification} />
              
              <NearbyBins
                classification={classification}
                selectedLanguage={selectedLanguage}
                userLocation={userLocation}
                nearbyBins={nearbyBins}
                locationError={locationError}
                isLocationLoading={isLocationLoading}
                onRequestLocation={requestUserLocation}
              />
            </div>
            
            {/* Full Width Bin Guide */}
            <BinGuide selectedLanguage={selectedLanguage} />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
