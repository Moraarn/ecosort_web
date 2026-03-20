'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WasteClassifier } from '@/lib/ai/classifier'
import { ClassificationResult, ChatMessage, VoiceSettings } from '@/types/waste'
import { translateText, getVoiceSettings, translations } from '@/lib/translations'
import { getRandomAnimation } from '@/lib/animations'
import { SupportedLanguage } from '@/types/languages'
import DashboardLayout from '@/components/DashboardLayout'

// Import components
import ImageUpload from '@/components/recycling/ImageUpload'
import ClassificationResultCard from '@/components/recycling/ClassificationResultCard'
import EducationalContent from '@/components/recycling/EducationalContent'
import BinGuide from '@/components/recycling/BinGuide'
import NearbyBins from '@/components/recycling/NearbyBins'
import Chatbot from '@/components/recycling/Chatbot'
import AnimationOverlay from '@/components/recycling/AnimationOverlay'

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
  
  // Animation state
  const [showAnimation, setShowAnimation] = useState(false)
  const [animationUrl, setAnimationUrl] = useState('')
  
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
  }, [])

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
      
      // Show celebration animation
      const animation = getRandomAnimation('trashThrowing')
      setAnimationUrl(animation)
      setShowAnimation(true)
      
      // Hide animation after 3 seconds
      setTimeout(() => {
        setShowAnimation(false)
      }, 3000)
      
      // Add assistant message with classification result
      const categoryName = result.category?.name || 'Unknown Waste'
      const instructions = translateText(result.category?.disposal_instructions || 'Follow standard waste disposal guidelines', selectedLanguage)
      
      // Create educational message content
      let messageContent = `${translateText('I classified this as', selectedLanguage)} ${categoryName} ${translateText('with', selectedLanguage)} ${Math.round(result.confidence * 100)}% ${translateText('confidence', selectedLanguage)}. ${instructions}`
      
      // Add educational content if available
      if (result.educationalContent) {
        const edu = result.educationalContent
        messageContent += `\n\n📚 ${translateText('Educational Information', selectedLanguage)}:\n`
        messageContent += `• ${translateText('Type', selectedLanguage)}: ${edu.wasteType}\n`
        messageContent += `• ${translateText('Recyclable', selectedLanguage)}: ${edu.recyclable ? '✅ Yes' : '❌ No'}\n`
        messageContent += `• ${translateText('Environmental Impact', selectedLanguage)}: ${edu.environmentalImpact}\n`
        messageContent += `• ${translateText('Fun Fact', selectedLanguage)}: ${edu.funFact}\n`
        messageContent += `• ${translateText('Eco Alternatives', selectedLanguage)}: ${edu.alternatives}`
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
      
      const utterance = getVoiceSettings(selectedLanguage)
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

  const initializeSpeechRecognition = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      
      if (!SpeechRecognitionAPI) {
        console.warn('Speech recognition not supported in this browser')
        setRecognitionError('Speech recognition is not supported in your browser')
        setSpeechAvailable(false)
        return
      }
      
      const isCheckingAvailability = speechAvailable === false
      
      const recognition = new SpeechRecognitionAPI()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = selectedLanguage === 'sw' ? 'sw-KE' : 'en-US'
      
      recognition.onstart = () => {
        setIsListening(true)
        setRecognitionError('')
        setRetryCount(0)
        setSpeechAvailable(true)
        setIsRetrying(false)
      }
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
        setRetryCount(0)
        setRecognitionError('')
        setSpeechAvailable(true)
        setIsRetrying(false)
      }
      
      recognition.onerror = (event: any) => {
        setIsListening(false)
        let errorMessage = 'Speech recognition error'
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.'
            break
          case 'audio-capture':
            errorMessage = 'Microphone not found. Please check your microphone.'
            setSpeechAvailable(false)
            break
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone access.'
            setSpeechAvailable(false)
            break
          case 'network':
            errorMessage = 'Network error. Please check your connection.'
            setSpeechAvailable(false)
            break
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service not available.'
            setSpeechAvailable(false)
            break
          default:
            errorMessage = `Speech recognition error: ${event.error}`
        }
        
        if (!isCheckingAvailability) {
          setRecognitionError(errorMessage)
          
          if (speechAvailable === true) {
            setTimeout(() => {
              setRecognitionError('')
            }, 5000)
          }
        }
      }
      
      recognitionRef.current = recognition
      
      if (!isCheckingAvailability) {
        setSpeechAvailable(true)
      }
    }
  }

  const toggleListening = () => {
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
      return
    }
    
    if (isListening) {
      recognitionRef.current.stop()
    } else {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error('Start failed:', error)
        initializeSpeechRecognition()
      }
    }
  }

  const resetSession = () => {
    setSelectedImage(null)
    setImagePreview('')
    setClassification(null)
    setMessages([])
    setInputMessage('')
    setShowAnimation(false)
    stopSpeaking()
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
      console.log('Nearby bins fetched:', data.bins)
    } catch (error) {
      console.error('Failed to fetch nearby bins:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Animation Overlay */}
        <AnimationOverlay 
          showAnimation={showAnimation} 
          selectedLanguage={selectedLanguage} 
        />

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            {translateText('eco.sort.assistant', selectedLanguage)}
          </h1>
          <p className="text-gray-600">
            {translateText('ai.powered.classification', selectedLanguage)}
          </p>
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

        {/* Full Width Section - Educational Content, Nearby Bins, and Bin Guide */}
        {classification && (
          <div className="mt-6 space-y-6">
            {/* Horizontal Layout for Educational Content and Nearby Bins */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EducationalContent classification={classification} />
              
              <NearbyBins
                classification={classification}
                selectedLanguage={selectedLanguage}
                userLocation={null}
                nearbyBins={[]}
                locationError=""
                isLocationLoading={false}
                onRequestLocation={() => {}}
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
