'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Volume2, VolumeX, Send, Languages, Mic, MicOff } from 'lucide-react'
import { ChatMessage } from '@/types/waste'
import { translateText, getVoiceSettings } from '@/lib/translations'
import { SupportedLanguage } from '@/types/languages'
import { LanguageSelector } from '@/components/ui/language-selector'

interface ChatbotProps {
  messages: ChatMessage[]
  inputMessage: string
  selectedLanguage: SupportedLanguage
  isVoiceEnabled: boolean
  voiceSettings: any
  isListening: boolean
  recognitionError: string
  retryCount: number
  speechAvailable: boolean | null
  isRetrying: boolean
  onInputChange: (value: string) => void
  onSendMessage: () => void
  onToggleVoice: () => void
  onToggleListening: () => void
  onLanguageChange: (language: SupportedLanguage) => void
}

export default function Chatbot({
  messages,
  inputMessage,
  selectedLanguage,
  isVoiceEnabled,
  voiceSettings,
  isListening,
  recognitionError,
  retryCount,
  speechAvailable,
  isRetrying,
  onInputChange,
  onSendMessage,
  onToggleVoice,
  onToggleListening,
  onLanguageChange
}: ChatbotProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

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

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recycling Chatbot</CardTitle>
        <div className="flex items-center gap-2">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
            className="text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleVoice}
          >
            {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto space-y-3 mb-4 p-3 border rounded bg-gray-50"
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Languages className="h-12 w-12 mx-auto mb-4" />
              <p>{translateText('ask.me.anything', selectedLanguage)}!</p>
              <p className="text-sm mt-2">{translateText('examples', selectedLanguage)}:</p>
              <p className="text-sm">{translateText('where.throw.batteries', selectedLanguage)}</p>
              <p className="text-sm">{translateText('plastic.bags.recyclable', selectedLanguage)}</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-white border'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            placeholder={translateText('ask.about.recycling', selectedLanguage)}
            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
              isListening ? 'border-red-500 bg-red-50' : ''
            }`}
            disabled={isListening}
          />
          <Button
            onClick={onToggleListening}
            variant={isListening ? "destructive" : "outline"}
            size="sm"
            className={`${isListening ? 'animate-pulse' : ''} ${isRetrying ? 'opacity-50' : ''}`}
            disabled={speechAvailable === false || isRetrying}
            title={
              speechAvailable === false 
                ? "Speech recognition unavailable" 
                : isRetrying 
                ? "Retrying..." 
                : "Click to speak"
            }
          >
            {speechAvailable === false ? (
              <MicOff className="h-4 w-4 opacity-50" />
            ) : isRetrying ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
            ) : isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          <Button onClick={onSendMessage} disabled={!inputMessage.trim() || isListening}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {recognitionError && (
          <div className={`mt-2 p-2 border rounded text-sm flex items-center justify-between ${
            speechAvailable === false ? 'bg-yellow-100 border-yellow-300 text-yellow-700' : 'bg-red-100 border-red-300 text-red-700'
          }`}>
            <span>{recognitionError}</span>
            {recognitionError.includes('Network') && speechAvailable !== false && (
              <button
                onClick={onToggleListening}
                className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
              >
                Retry
              </button>
            )}
          </div>
        )}
        {speechAvailable === false && !recognitionError && (
          <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-700 text-sm flex items-center justify-between">
            <div className="flex-1">
              <span className="font-medium">🎤 Voice Input Unavailable</span>
              <p className="text-xs mt-1">Speech recognition service is having connectivity issues. You can:</p>
              <ul className="text-xs mt-1 list-disc list-inside">
                <li>Type your questions in the text field</li>
                <li>Try voice input again later</li>
                <li>Check your internet connection</li>
              </ul>
            </div>
            <button
              onClick={onToggleListening}
              className="ml-2 px-2 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600 whitespace-nowrap"
            >
              Try Again
            </button>
          </div>
        )}
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
      </CardContent>
    </Card>
  )
}
