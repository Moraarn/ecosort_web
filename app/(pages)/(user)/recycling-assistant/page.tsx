'use client'

import { useState, useRef, useEffect } from 'react'
import { WasteClassifier } from '@/lib/ai/classifier'
import { type ClassificationResult, ChatMessage, SUPPORTED_LANGUAGES, VoiceSettings } from '@/types/waste'
import { translateText, getVoiceSettings, translations } from '@/lib/translations'
import { uploadImage } from '@/lib/storage'
import DashboardLayout from '@/components/DashboardLayout'

// Import components
import ImageUpload from '@/components/recycling/ImageUpload'
import ClassificationResultCard from '@/components/recycling/ClassificationResultCard'
import EducationalContent from '@/components/recycling/EducationalContent'
import BinGuide from '@/components/recycling/BinGuide'
import NearbyBins from '@/components/recycling/NearbyBins'
import Chatbot from '@/components/recycling/Chatbot'
import ClassificationHistory from '@/components/recycling/ClassificationHistory'

export default function RecyclingAssistant() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [classification, setClassification] = useState<ClassificationResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    enabled: true,
    language: 'en',
    rate: 1,
    pitch: 1,
    volume: 1
  })
  
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
      
      // Upload image to Supabase storage
      const imageUrl = await uploadImage(selectedImage, 'current-user') // You'll need to get actual user ID
      
      // Save classification to database
      await fetch('/api/user/classification-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          classification_result: result
        })
      })
      
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
              onInputChange={setInputMessage}
              onSendMessage={sendMessage}
              onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
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
                onLocationPermission={() => {}}
                onFetchNearbyBins={fetchNearbyBins}
              />
            </div>
            
            {/* Full Width Bin Guide */}
            <BinGuide selectedLanguage={selectedLanguage} />
            
            {/* Classification History */}
            <ClassificationHistory 
              selectedLanguage={selectedLanguage}
              onClassificationSelect={(classification) => {
                // Handle classification selection if needed
                console.log('Selected classification:', classification)
              }}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
