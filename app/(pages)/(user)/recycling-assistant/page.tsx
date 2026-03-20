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
  
  // Speech recognition state
  const [isListening, setIsListening] = useState(false)
  const [recognitionError, setRecognitionError] = useState<string>('')
  const [retryCount, setRetryCount] = useState(0)
  const [speechAvailable, setSpeechAvailable] = useState<boolean | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const recognitionRef = useRef<any>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const classifier = WasteClassifier.getInstance()

  useEffect(() => {
    classifier.initialize()
    // Request user location on component mount
    requestUserLocation()
    // Initialize speech recognition
    initializeSpeechRecognition()
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

  const initializeSpeechRecognition = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      
      if (!SpeechRecognitionAPI) {
        console.warn('Speech recognition not supported in this browser')
        setRecognitionError('Speech recognition is not supported in your browser')
        setSpeechAvailable(false)
        return
      }
      
      // If we're just checking availability (from periodic check), don't show errors
      const isCheckingAvailability = speechAvailable === false
      
      const recognition = new SpeechRecognitionAPI()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = selectedLanguage === 'sw' ? 'sw-KE' : 'en-US'
      
      recognition.onstart = () => {
        setIsListening(true)
        setRecognitionError('')
        setRetryCount(0) // Reset retry count when starting new session
        setSpeechAvailable(true)
        setIsRetrying(false)
      }
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
        setRetryCount(0) // Reset retry count on success
        setRecognitionError('') // Clear any existing errors
        setSpeechAvailable(true) // Re-enable speech on successful recognition
        setIsRetrying(false)
        
        // Auto-send message after speech recognition
        setTimeout(() => {
          if (transcript.trim()) {
            sendMessage()
          }
        }, 500)
      }
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        
        // Handle specific error types with user-friendly messages
        let errorMessage = 'Speech recognition error'
        
        switch (event.error) {
          case 'network':
            // Immediately disable speech recognition on network error
            if (!isCheckingAvailability) {
              errorMessage = 'Speech recognition service is currently unavailable. Using text input instead.'
            }
            setSpeechAvailable(false)
            setRetryCount(0)
            setIsRetrying(false)
            break
          case 'not-allowed':
            if (!isCheckingAvailability) {
              errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings.'
            }
            setSpeechAvailable(false)
            setRetryCount(0)
            setIsRetrying(false)
            break
          case 'no-speech':
            if (!isCheckingAvailability) {
              errorMessage = 'No speech detected. Please try speaking clearly.'
            }
            setRetryCount(0)
            setIsRetrying(false)
            break
          case 'audio-capture':
            if (!isCheckingAvailability) {
              errorMessage = 'No microphone found. Please ensure a microphone is connected.'
            }
            setSpeechAvailable(false)
            setRetryCount(0)
            setIsRetrying(false)
            break
          case 'aborted':
            errorMessage = 'Speech recognition was stopped.'
            setRetryCount(0)
            setIsRetrying(false)
            break
          case 'service-not-allowed':
            if (!isCheckingAvailability) {
              errorMessage = 'Speech recognition service is not available. Using text input instead.'
            }
            setSpeechAvailable(false)
            setRetryCount(0)
            setIsRetrying(false)
            break
          default:
            if (!isCheckingAvailability) {
              errorMessage = `Speech recognition error: ${event.error}`
            }
            setRetryCount(0)
            setIsRetrying(false)
        }
        
        if (!isCheckingAvailability) {
          setRecognitionError(errorMessage)
          
          // Auto-clear error after 5 seconds for non-critical errors
          if (speechAvailable === true) {
            setTimeout(() => {
              setRecognitionError('')
            }, 5000)
          }
        }
      }
      
      recognition.onend = () => {
        setIsListening(false)
        setIsRetrying(false)
      }
      
      recognitionRef.current = recognition
      
      // Only set speechAvailable to true if we're not in a checking state
      if (!isCheckingAvailability) {
        setSpeechAvailable(true)
      }
    }
  }

  const toggleListening = () => {
    // If speech was marked as unavailable, try to re-initialize it
    if (speechAvailable === false) {
      setSpeechAvailable(null)
      setRetryCount(0)
      setRecognitionError('')
      setIsRetrying(false)
      initializeSpeechRecognition()
      return
    }
    
    if (!recognitionRef.current) {
      initializeSpeechRecognition()
      return
    }
    
    if (isRetrying) {
      // Don't allow toggle while retrying
      return
    }
    
    if (isListening) {
      recognitionRef.current.stop()
    } else {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error('Start failed:', error)
        // Re-initialize if start fails
        initializeSpeechRecognition()
      }
    }
  }

  const updateRecognitionLanguage = () => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage === 'sw' ? 'sw-KE' : 'en-US'
    }
  }

  useEffect(() => {
    updateRecognitionLanguage()
  }, [selectedLanguage])

  // Periodic check for speech availability recovery
  useEffect(() => {
    if (speechAvailable === false) {
      const interval = setInterval(() => {
        // Try to re-initialize speech recognition every 30 seconds
        console.log('Checking if speech recognition is available again...')
        setSpeechAvailable(null) // Reset to null to re-check
        initializeSpeechRecognition()
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [speechAvailable])

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
              isListening={isListening}
              recognitionError={recognitionError}
              retryCount={retryCount}
              speechAvailable={speechAvailable}
              isRetrying={isRetrying}
              onInputChange={setInputMessage}
              onSendMessage={sendMessage}
              onToggleVoice={toggleVoice}
              onToggleListening={toggleListening}
              onLanguageChange={setSelectedLanguage}
            />
          </div>
        </div>

        {/* Full Width Section - Educational Content, Nearby Bins, Bin Guide, and Classification History */}
        {classification && (
          <div className="mt-6 space-y-6">
            {/* Horizontal Layout for Educational Content and Nearby Bins */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {isListening && (
                <div className="mt-2 p-2 bg-blue-100 border border-blue-300 rounded text-blue-700 text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Listening... Speak now!
                  {retryCount > 0 && (
                    <span className="text-xs bg-blue-200 px-2 py-1 rounded">
                      Retry {retryCount}/3
                    </span>
                  )}
                </div>
              )}
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
