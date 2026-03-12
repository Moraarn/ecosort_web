'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Volume2, VolumeX, Send, Languages } from 'lucide-react'
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
  onInputChange: (value: string) => void
  onSendMessage: () => void
  onToggleVoice: () => void
  onLanguageChange: (language: SupportedLanguage) => void
}

export default function Chatbot({
  messages,
  inputMessage,
  selectedLanguage,
  isVoiceEnabled,
  voiceSettings,
  onInputChange,
  onSendMessage,
  onToggleVoice,
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
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Button onClick={onSendMessage} disabled={!inputMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
