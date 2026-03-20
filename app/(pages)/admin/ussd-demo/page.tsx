"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/types/languages"

interface USSDMessage {
  text: string
  type: 'user' | 'system'
  timestamp: Date
}

interface USSDSession {
  phoneNumber: string
  sessionId: string
  language: SupportedLanguage
}

export default function USSDDemo() {
  const [messages, setMessages] = useState<USSDMessage[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [session, setSession] = useState<USSDSession>({
    phoneNumber: "+254712345678",
    sessionId: "demo-session-123",
    language: "en"
  })
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("en")
  const [conversationState, setConversationState] = useState<'start' | 'language_selected' | 'waste_type'>('start')

  const simulateUSSDRequest = async (input: string, languageOverride?: string) => {
    setIsLoading(true)
    
    const userMessage: USSDMessage = {
      text: input,
      type: 'user',
      timestamp: new Date()
    }
    setMessages([userMessage]) // Replace all messages with just the user input

    setTimeout(() => {
      const languageToUse = languageOverride || selectedLanguage
      const fallbackResponse = getDemoResponse(input, languageToUse, conversationState)
      const systemMessage: USSDMessage = {
        text: fallbackResponse,
        type: 'system',
        timestamp: new Date()
      }
      setMessages([systemMessage]) // Replace with just the system response
      setIsLoading(false)
    }, 1000)
  }

  const getDemoResponse = (input: string, language: string, currentState: string): string => {
    const responses: { [key: string]: { [lang: string]: string } } = {
      "*384*44042#": {
        en: "Welcome to EcoSort AI Recycling Service\nPlease select your language:\n1. English\n2. Swahili\n3. Luganda\n4. Kikuyu\n5. Luhya\n6. Kinyarwanda\n7. Rundi",
        sw: "Karibu EcoSort AI Recycling Service\nTafadhali chagua lugha yako:\n1. Kiingereza\n2. Kiswahili\n3. Luganda\n4. Gikuyu\n5. Luluhya\n6. Ikinyarwanda\n7. Ikirundi",
        lg: "Wangeeko ku EcoSort AI Recycling Service\nMunsaba omulala olulimi lwo:\n1. Lungereza\n2. Swahiri\n3. Luganda\n4. Gikuyu\n5. Luluhya\n6. Ikinyarwanda\n7. Ikirundi",
        ki: "Nĩmũhũgwo wa EcoSort AI Recycling Service\nHarĩwo mũthenya wa gũthũura mũrĩrĩ wakwo:\n1. Gĩthũngũ\n2. Swahiri\n3. Luganda\n4. Gĩkũyũ\n5. Luluhya\n6. Ikinyarwanda\n7. Ikirundi"
      },
      "1": {
        en: "English selected.\nWhat type of waste do you have?\n1. Plastic\n2. Glass\n3. Metal\n4. Organic\n5. Paper\n6. E-waste",
        sw: "Kiingereza imechaguliwa.\nUna aina gani ya taka?\n1. Plastiki\n2. Gilasi\n3. Chuma\n4. Taka haiya\n5. Karatasi\n6. Taka ya elektroniki",
        lg: "Lungereza londeetwa.\nOw'ebimera bya ki?\n1. Pulasitiki\n2. Ebiisenge\n3. Ebinyanya\n4. Ebimera bya bulimi\n5. Pepa\n6. Ebimera bya tekinologiya",
        ki: "Gĩthũngũ githondeketwo.\nNĩwĩra na tithi cia andũ?\n1. Plastiki\n2. Gĩrasi\n3. Mbĩtĩ\n4. Tithi ya mũrimũ\n5. Karatasi\n6. Tithi cia komputa"
      },
      "2": {
        en: "Swahili selected.\nUna aina gani ya taka?\n1. Plastiki\n2. Gilasi\n3. Chuma\n4. Taka haiya\n5. Karatasi\n6. Taka ya elektroniki",
        sw: "Kiswahili imechaguliwa.\nUna aina gani ya taka?\n1. Plastiki\n2. Gilasi\n3. Chuma\n4. Taka haiya\n5. Karatasi\n6. Taka ya elektroniki",
        lg: "Swahiri londeetwa.\nOw'ebimera bya ki?\n1. Pulasitiki\n2. Ebiisenge\n3. Ebinyanya\n4. Ebimera bya bulimi\n5. Pepa\n6. Ebimera bya tekinologiya",
        ki: "Swahiri githondeketwo.\nNĩwĩra na tithi cia andũ?\n1. Plastiki\n2. Gĩrasi\n3. Mbĩtĩ\n4. Tithi ya mũrimũ\n5. Karatasi\n6. Tithi cia komputa"
      },
      "3": {
        en: "Luganda selected.\nOw'ebimera bya ki?\n1. Pulasitiki\n2. Ebiisenge\n3. Ebinyanya\n4. Ebimera bya bulimi\n5. Pepa\n6. Ebimera bya tekinologiya",
        sw: "Luganda imechaguliwa.\nUna aina gani ya taka?\n1. Plastiki\n2. Gilasi\n3. Chuma\n4. Taka haiya\n5. Karatasi\n6. Taka ya elektroniki",
        lg: "Luganda londeetwa.\nOw'ebimera bya ki?\n1. Pulasitiki\n2. Ebiisenge\n3. Ebinyanya\n4. Ebimera bya bulimi\n5. Pepa\n6. Ebimera bya tekinologiya",
        ki: "Luganda githondeketwo.\nNĩwĩra na tithi cia andũ?\n1. Plastiki\n2. Gĩrasi\n3. Mbĩtĩ\n4. Tithi ya mũrimũ\n5. Karatasi\n6. Tithi cia komputa"
      },
      "4": {
        en: "Kikuyu selected.\nNĩwĩra na tithi cia andũ?\n1. Plastiki\n2. Gĩrasi\n3. Mbĩtĩ\n4. Tithi ya mũrimũ\n5. Karatasi\n6. Tithi cia komputa",
        sw: "Gikuyu imechaguliwa.\nUna aina gani ya taka?\n1. Plastiki\n2. Gilasi\n3. Chuma\n4. Taka haiya\n5. Karatasi\n6. Taka ya elektroniki",
        lg: "Gikuyu londeetwa.\nOw'ebimera bya ki?\n1. Pulasitiki\n2. Ebiisenge\n3. Ebinyanya\n4. Ebimera bya bulimi\n5. Pepa\n6. Ebimera bya tekinologiya",
        ki: "Gĩkũyũ githondeketwo.\nNĩwĩra na tithi cia andũ?\n1. Plastiki\n2. Gĩrasi\n3. Mbĩtĩ\n4. Tithi ya mũrimũ\n5. Karatasi\n6. Tithi cia komputa"
      },
      "5": {
        en: "Luhya selected.\nWhat type of waste do you have?\n1. Plastiki\n2. Gilasi\n3. Chuma\n4. Taka haiya\n5. Karatasi\n6. Taka ya elektroniki",
        sw: "Luluhya imechaguliwa.\nUna aina gani ya taka?\n1. Plastiki\n2. Gilasi\n3. Chuma\n4. Taka haiya\n5. Karatasi\n6. Taka ya elektroniki",
        lg: "Luluhya londeetwa.\nOw'ebimera bya ki?\n1. Pulasitiki\n2. Ebiisenge\n3. Ebinyanya\n4. Ebimera bya bulimi\n5. Pepa\n6. Ebimera bya tekinologiya",
        ki: "Luluhya githondeketwo.\nNĩwĩra na tithi cia andũ?\n1. Plastiki\n2. Gĩrasi\n3. Mbĩtĩ\n4. Tithi ya mũrimũ\n5. Karatasi\n6. Tithi cia komputa"
      },
      "6": {
        en: "Kinyarwanda selected.\nWhat type of waste do you have?\n1. Plastiki\n2. Gilasi\n3. Chuma\n4. Taka haiya\n5. Karatasi\n6. Taka ya elektroniki",
        sw: "Ikinyarwanda imechaguliwa.\nUna aina gani ya taka?\n1. Plastiki\n2. Gilasi\n3. Chuma\n4. Taka haiya\n5. Karatasi\n6. Taka ya elektroniki",
        lg: "Ikinyarwanda londeetwa.\nOw'ebimera bya ki?\n1. Pulasitiki\n2. Ebiisenge\n3. Ebinyanya\n4. Ebimera bya bulimi\n5. Pepa\n6. Ebimera bya tekinologiya",
        ki: "Ikinyarwanda githondeketwo.\nNĩwĩra na tithi cia andũ?\n1. Plastiki\n2. Gĩrasi\n3. Mbĩtĩ\n4. Tithi ya mũrimũ\n5. Karatasi\n6. Tithi cia komputa"
      },
      "7": {
        en: "Rundi selected.\nWhat type of waste do you have?\n1. Plastiki\n2. Gilasi\n3. Chuma\n4. Taka haiya\n5. Karatasi\n6. Taka ya elektroniki",
        sw: "Ikirundi imechaguliwa.\nUna aina gani ya taka?\n1. Plastiki\n2. Gilasi\n3. Chuma\n4. Taka haiya\n5. Karatasi\n6. Taka ya elektroniki",
        lg: "Ikirundi londeetwa.\nOw'ebimera bya ki?\n1. Pulasitiki\n2. Ebiisenge\n3. Ebinyanya\n4. Ebimera bya bulimi\n5. Pepa\n6. Ebimera bya tekinologiya",
        ki: "Ikirundi githondeketwo.\nNĩwĩra na tithi cia andũ?\n1. Plastiki\n2. Gĩrasi\n3. Mbĩtĩ\n4. Tithi ya mũrimũ\n5. Karatasi\n6. Tithi cia komputa"
      }
    }

    // Handle waste classification based on conversation state BEFORE language selection
    if (currentState === 'language_selected' && ['1', '2', '3', '4', '5', '6'].includes(input)) {
      const wasteResponses: { [key: string]: { [lang: string]: string } } = {
        "1": {
          en: "♻️ Use the BLUE recycling bin\nPlastic goes in the blue bin.\nYou earned 1 point! 🎉\n\nDial *384*44042# to sort more waste",
          sw: "♻️ Tumia chombo cha rangi ya BLUU\nPlastiki huwekwa kwenye chombo cha bluu.\nUmechukua pointi 1! 🎉\n\nPiga *384*44042# kusaka zaidi",
          lg: "♻️ Kozesa kibbo kya BLUU\nPulasitiki eeteeka mu kibbo kya bluu.\nOfuna ebibibiri 1! 🎉\n\nPiga *384*44042# okusaka ebimera ebirala",
          ki: "♻️ Thirĩ kithurei kĩa BLUU\nPlastiki cietwo kithurei kĩa bluu.\nWĩigire mabuu 1! 🎉\n\nPiga *384*44042# wĩrĩra tithi ingĩ"
        },
        "2": {
          en: "♻️ Use the GREEN recycling bin\nGlass goes in the green bin.\nYou earned 1 point! 🎉\n\nDial *384*44042# to sort more waste",
          sw: "♻️ Tumia chombo cha rangi ya KIJANI\nGilasi huwekwa kwenye chombo cha kijani.\nUmechukua pointi 1! 🎉\n\nPiga *384*44042# kusaka zaidi",
          lg: "♻️ Kozesa kibbo kya KIJANI\nEbiisenge eeteeka mu kibbo kya kijani.\nOfuna ebibibiri 1! 🎉\n\nPiga *384*44042# okusaka ebimera ebirala",
          ki: "♻️ Thirĩ kithurei kĩa KIJANI\nGĩrasi cietwo kithurei kĩa kijani.\nWĩigire mabuu 1! 🎉\n\nPiga *384*44042# wĩrĩra tithi ingĩ"
        },
        "3": {
          en: "♻️ Use the YELLOW recycling bin\nMetal goes in the yellow bin.\nYou earned 1 point! 🎉\n\nDial *384*44042# to sort more waste",
          sw: "♻️ Tumia chombo cha rangi ya MANJANO\nChuma huwekwa kwenye chombo cha manjano.\nUmechukua pointi 1! 🎉\n\nPiga *384*44042# kusaka zaidi",
          lg: "♻️ Kozesa kibbo kya MANJANO\nEbinyanya eeteeka mu kibbo kya manjano.\nOfuna ebibibiri 1! 🎉\n\nPiga *384*44042# okusaka ebimera ebirala",
          ki: "♻️ Thirĩ kithurei kĩa MANJANO\nMbĩtĩ cietwo kithurei kĩa manjano.\nWĩigire mabuu 1! 🎉\n\nPiga *384*44042# wĩrĩra tithi ingĩ"
        },
        "4": {
          en: "♻️ Use the BROWN recycling bin\nOrganic waste goes in the brown bin.\nYou earned 1 point! 🎉\n\nDial *384*44042# to sort more waste",
          sw: "♻️ Tumia chombo cha rangi ya CHOKA\nTaka haiya huwekwa kwenye chombo cha choka.\nUmechukua pointi 1! 🎉\n\nPiga *384*44042# kusaka zaidi",
          lg: "♻️ Kozesa kibbo kya CHOKA\nEbimera bya bulimi eeteeka mu kibbo kya choka.\nOfuna ebibibiri 1! 🎉\n\nPiga *384*44042# okusaka ebimera ebirala",
          ki: "♻️ Thirĩ kithurei kĩa CHOKA\nTithi ya mũrimũ cietwo kithurei kĩa choka.\nWĩigire mabuu 1! 🎉\n\nPiga *384*44042# wĩrĩra tithi ingĩ"
        },
        "5": {
          en: "♻️ Use the RED recycling bin\nPaper goes in the red bin.\nYou earned 1 point! 🎉\n\nDial *384*44042# to sort more waste",
          sw: "♻️ Tumia chombo cha rangi ya NYEKUNDU\nKaratasi huwekwa kwenye chombo cha nyekundu.\nUmechukua pointi 1! 🎉\n\nPiga *384*44042# kusaka zaidi",
          lg: "♻️ Kozesa kibbo kya NYEKUNDU\nPepa eeteeka mu kibbo kya nyekundu.\nOfuna ebibibiri 1! 🎉\n\nPiga *384*44042# okusaka ebimera ebirala",
          ki: "♻️ Thirĩ kithurei kĩa NYEKUNDU\nKaratasi cietwo kithurei kĩa nyekundu.\nWĩigire mabuu 1! 🎉\n\nPiga *384*44042# wĩrĩra tithi ingĩ"
        },
        "6": {
          en: "♻️ Use the BLACK recycling bin\nE-waste goes in the black bin.\nYou earned 1 point! 🎉\n\nDial *384*44042# to sort more waste",
          sw: "♻️ Tumia chombo cha rangi ya NYEUSI\nTaka ya elektroniki huwekwa kwenye chombo cha nyeusi.\nUmechukua pointi 1! 🎉\n\nPiga *384*44042# kusaka zaidi",
          lg: "♻️ Kozesa kibbo kya NYEUSI\nEbimera bya tekinologiya eeteeka mu kibbo kya nyeusi.\nOfuna ebibibiri 1! 🎉\n\nPiga *384*44042# okusaka ebimera ebirala",
          ki: "♻️ Thirĩ kithurei kĩa NYEUSI\nTithi cia komputa cietwo kithurei kĩa nyeusi.\nWĩigire mabuu 1! 🎉\n\nPiga *384*44042# wĩrĩra tithi ingĩ"
        }
      }
      
      const inputKey = input.toLowerCase()
      return wasteResponses[inputKey]?.[language] || wasteResponses[inputKey]?.["en"] || "Invalid option. Please try again."
    }

    const inputKey = input.toLowerCase()
    return responses[inputKey]?.[language] || responses[inputKey]?.["en"] || "Invalid option. Please try again."
  }

  const handleSend = () => {
    if (currentInput.trim()) {
      let languageToUse = selectedLanguage
      let shouldUpdateState = false
      
      // Update language and state based on input
      if (currentInput === '1') {
        languageToUse = 'en'
        setSelectedLanguage('en')
        setConversationState('language_selected')
        shouldUpdateState = true
      } else if (currentInput === '2') {
        languageToUse = 'sw'
        setSelectedLanguage('sw')
        setConversationState('language_selected')
        shouldUpdateState = true
      } else if (currentInput === '3') {
        languageToUse = 'lg'
        setSelectedLanguage('lg')
        setConversationState('language_selected')
        shouldUpdateState = true
      } else if (currentInput === '4') {
        languageToUse = 'ki'
        setSelectedLanguage('ki')
        setConversationState('language_selected')
        shouldUpdateState = true
      } else if (currentInput === '5') {
        languageToUse = 'lu'
        setSelectedLanguage('lu')
        setConversationState('language_selected')
        shouldUpdateState = true
      } else if (currentInput === '6') {
        languageToUse = 'ka'
        setSelectedLanguage('ka')
        setConversationState('language_selected')
        shouldUpdateState = true
      } else if (currentInput === '7') {
        languageToUse = 'rn'
        setSelectedLanguage('rn')
        setConversationState('language_selected')
        shouldUpdateState = true
      } else if (currentInput === '*384*44042#') {
        setConversationState('start')
        // Keep the current language when starting fresh session
        languageToUse = selectedLanguage
      }
      
      // Send the request with the correct language
      simulateUSSDRequest(currentInput.trim(), languageToUse)
      setCurrentInput("")
      
      // Update state after sending if it's a waste type selection
      if (conversationState === 'language_selected' && ['1', '2', '3', '4', '5', '6'].includes(currentInput)) {
        setConversationState('waste_type')
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow USSD-valid characters: digits, *, #
    const validInput = value.replace(/[^0-9*#]/g, '')
    setCurrentInput(validInput)
  }

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang)
    setSession(prev => ({ ...prev, language: lang }))
    
    const language = SUPPORTED_LANGUAGES.find(l => l.code === lang)
    const languageMessage: USSDMessage = {
      text: `Language changed to ${language?.name || lang}`,
      type: 'system',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, languageMessage])
  }

  const startSession = () => {
    setMessages([])
    setCurrentInput("")
    
    setTimeout(() => {
      simulateUSSDRequest("")
    }, 500)
  }

  const clearSession = () => {
    setMessages([])
    setCurrentInput("")
    setSession({
      phoneNumber: "+254712345678",
      sessionId: "demo-session-" + Date.now(),
      language: selectedLanguage
    })
  }

  return (
    <AdminSidebar>
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">USSD Demo</h1>
          <p className="text-sm sm:text-base text-gray-600">Interactive phone simulation for EcoSort AI USSD Service</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Phone Simulator */}
          <div className="lg:col-span-2">
            <div className="max-w-xs mx-auto">
              {/* Phone Frame */}
              <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                {/* Phone Notch */}
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-full z-10"></div>
                
                {/* Phone Screen */}
                <div className="bg-black rounded-[2.5rem] overflow-hidden pt-10">
                  {/* Status Bar */}
                  <div className="bg-white px-6 py-2 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {/* Wifi icon */}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.6667 4C13.8417 3.175 11.9667 1.5 8.00004 1.5C4.03337 1.5 2.15837 3.175 1.33337 4" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 6.66667C11.3583 6.025 9.96671 4.83334 8.00004 4.83334C6.03337 4.83334 4.64171 6.025 4.00004 6.66667" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9.33337 9.33334C8.89171 8.89167 8.27504 8.5 8.00004 8.5C7.72504 8.5 7.10837 8.89167 6.66671 9.33334" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 12.5C8.27614 12.5 8.5 12.2761 8.5 12C8.5 11.7239 8.27614 11.5 8 11.5C7.72386 11.5 7.5 11.7239 7.5 12" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </div>

                  {/* USSD Display */}
                  <div className="bg-white p-4 min-h-[200px]">
                    <div className="text-center">
                      {messages.length === 0 ? (
                        <div>
                          <div className="text-3xl font-bold text-black mb-2">
                            {currentInput || "Enter number"}
                          </div>
                          <div className="text-sm text-gray-600">
                            Dial *384*44042# to begin
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 text-left">
                          {messages.map((message, index) => (
                            <div key={index} className={`text-sm ${message.type === 'user' ? 'text-blue-600' : 'text-gray-800'}`}>
                              <div className="whitespace-pre-wrap leading-relaxed">{message.text}</div>
                            </div>
                          ))}
                          {isLoading && (
                            <div className="text-gray-600 animate-pulse">
                              <div className="flex space-x-1">
                                <span className="animate-bounce">.</span>
                                <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
                                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                              </div>
                            </div>
                          )}
                          {currentInput && (
                            <div className="text-blue-600 font-semibold">
                              {currentInput}
                              <span className="animate-pulse ml-1">_</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Phone Keypad */}
                  <div className="bg-gray-100 p-4">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { number: '1', letters: '' },
                        { number: '2', letters: 'ABC' },
                        { number: '3', letters: 'DEF' },
                        { number: '4', letters: 'GHI' },
                        { number: '5', letters: 'JKL' },
                        { number: '6', letters: 'MNO' },
                        { number: '7', letters: 'PQRS' },
                        { number: '8', letters: 'TUV' },
                        { number: '9', letters: 'WXYZ' },
                        { number: '*', letters: '' },
                        { number: '0', letters: '+' },
                        { number: '#', letters: '' }
                      ].map((key) => (
                        <button
                          key={key.number}
                          onClick={() => {
                            setCurrentInput(prev => prev + key.number)
                          }}
                          disabled={isLoading}
                          className="bg-white rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="text-xl font-semibold text-black">{key.number}</span>
                          {key.letters && (
                            <span className="text-xs text-gray-500">{key.letters}</span>
                          )}
                        </button>
                      ))}
                    </div>
                    
                    {/* Call Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          if (currentInput.trim()) {
                            handleSend()
                          }
                        }}
                        disabled={isLoading || !currentInput.trim()}
                        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 rounded-full w-20 h-20 flex items-center justify-center shadow-lg transition-colors"
                      >
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Home Indicator */}
                <div className="flex justify-center pb-2">
                  <div className="w-32 h-1 bg-gray-700 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Language Selection */}
            {/* <div className="bg-white rounded-xl shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Language</h3>
              <div className="space-y-2">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                      selectedLanguage === lang.code
                        ? 'border-green-500 bg-green-50 text-green-900'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div> */}

            {/* Quick Actions */}
            {/* <div className="bg-white rounded-xl shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => simulateUSSDRequest("")}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  🏠 Main Menu
                </button>
                <button
                  onClick={() => simulateUSSDRequest("1")}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  🗑️ Waste Guide
                </button>
                <button
                  onClick={() => simulateUSSDRequest("4")}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  ⭐ My Points
                </button>
                <button
                  onClick={() => simulateUSSDRequest("1*1")}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  ♻️ Plastic Info
                </button>
              </div>
            </div> */}

            {/* Session Info */}
            {/* <div className="bg-white rounded-xl shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Session Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-mono">{session.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-mono">*123#</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Session:</span>
                  <span className="font-mono text-xs">{session.sessionId.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span>{SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.flag} {selectedLanguage.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Messages:</span>
                  <span>{messages.length}</span>
                </div>
              </div>
            </div> */}

            {/* Instructions */}
            {/* <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-semibold text-green-900 mb-2">📱 How to Use</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Type USSD code directly in the input field</li>
                <li>• Press Enter to send your input</li>
                <li>• Use the on-screen keypad to type</li>
                <li>• # is just a character, not an enter key</li>
                <li>• Use numbers to navigate menus (1, 2, 3, 4)</li>
                <li>• Use * for nested menus (1*1, 1*2, etc.)</li>
                <li>• "Clear" button clears current input</li>
                <li>• "Send" button executes the USSD command</li>
                <li>• Try different languages</li>
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </AdminSidebar>
  )
}
