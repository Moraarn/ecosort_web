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

  const simulateUSSDRequest = async (input: string) => {
    setIsLoading(true)
    
    const userMessage: USSDMessage = {
      text: input,
      type: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    setTimeout(() => {
      const fallbackResponse = getDemoResponse(input, selectedLanguage)
      const systemMessage: USSDMessage = {
        text: fallbackResponse,
        type: 'system',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, systemMessage])
      setIsLoading(false)
    }, 1000)
  }

  const getDemoResponse = (input: string, language: string): string => {
    const responses: { [key: string]: { [lang: string]: string } } = {
      "": {
        en: "Welcome to EcoSort AI Recycling Service\nMain Menu:\n1. Waste Disposal Guide\n2. Enter Recycling Bin Code\n3. Recycling Tips\n4. My Points",
        sw: "Karibu EcoSort AI Recycling Service\nMenyu Kuu:\n1. Mwongozo wa Taka\n2. Weka Nambari ya Chombo cha Taka\n3. Masharti ya Taka\n4. Nidhamu Yangu",
        lg: "Wangeeko ku EcoSort AI Recycling Service\nMenyu Mukulu:\n1. Obuyambi bwa Ebimera\n2. Yika Nambari ya Kibbo\n3. Amannya ga Taka\n4. Ebiina byange",
        ki: "Nĩmũhũgwo wa EcoSort AI Recycling Service\nMũthenya wa Mũrĩrĩ:\n1. Mũhũgwo wa Tithi\n2. Andika Namba ya Ciana cia Tithi\n3. Mĩhũgwo ya Tithi\n4. Ndi Mabuu"
      },
      "1": {
        en: "Waste Disposal Guide:\n1. Plastic\n2. Glass\n3. Metal\n4. Organic\n5. Paper\n6. E-waste",
        sw: "Mwongozo wa Taka:\n1. Plastiki\n2. Gilasi\n3. Chuma\n4. Taka haiya\n5. Karatasi\n6. Taka ya elektroniki",
        lg: "Obuyambi bwa Ebimera:\n1. Pulasitiki\n2. Ebiisenge\n3. Ebinyanya\n4. Ebimera bya bulimi\n5. Pepa\n6. Ebimera bya tekinologiya",
        ki: "Mũhũgwo wa Tithi:\n1. Plastiki\n2. Gĩrasi\n3. Mbĩtĩ\n4. Tithi ya mũrimũ\n5. Karatasi\n6. Tithi cia komputa"
      },
      "1*1": {
        en: "Plastic waste should be placed in the BLUE recycling bin.\nRinse containers and remove caps before recycling.",
        sw: "Taka za plastiki ziwekwe kwenye chombo cha rangi ya BLUU.\nSafisha vyombo na kuondoa vishika kabla ya kurecycling.",
        lg: "Ebimera bya pulasitiki biteeke mu kibbo kya BLUU.\nSangula ebibbo na kuwona amata gaba okukyusiza.",
        ki: "Tithi cia plastiki cietwo kithurei cia BLUU.\nSanguraitho ciana na gutungura thiri-ini mũno gutahi gutonya."
      },
      "4": {
        en: "Your Points: 245\nRedeem rewards at: /rewards\nKeep recycling to earn more points!",
        sw: "Nidhamu Yako: 245\nChukua zawadi kwa: /rewards\nEndelea kurecycling kupata nidhamu zaidi!",
        lg: "Ebiina byange: 245\nGeza emikwata ku: /rewards\nOkola okurecycling okufuna ebibina ebisingawo!",
        ki: "Ndi Mabuu: 245\nThii mabuu ta: /rewards\nEnda mũhũgwo wa tithi ũrĩa mabuu mangi!"
      }
    }

    const inputKey = input.toLowerCase()
    return responses[inputKey]?.[language] || responses[inputKey]?.["en"] || "Invalid option. Please try again."
  }

  const handleSend = () => {
    if (currentInput.trim()) {
      simulateUSSDRequest(currentInput.trim())
      setCurrentInput("")
    }
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
            <div className="max-w-sm mx-auto">
              {/* Phone Frame */}
              <div className="bg-gray-800 rounded-3xl p-2 shadow-2xl">
                {/* Phone Screen */}
                <div className="bg-black rounded-2xl overflow-hidden">
                  {/* Status Bar */}
                  <div className="bg-gray-900 px-4 py-1 flex justify-between items-center">
                    <span className="text-white text-xs">9:41 AM</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-3 border border-white rounded-sm">
                        <div className="w-2 h-1 bg-white rounded-sm m-0.5"></div>
                      </div>
                      <div className="w-1 h-2 bg-white rounded-sm"></div>
                    </div>
                  </div>

                  {/* USSD Display */}
                  <div className="bg-green-50 p-4 min-h-[300px] font-mono text-sm">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-3xl mb-4">📱</div>
                        <p className="text-green-800 font-semibold">USSD Service</p>
                        <p className="text-green-600 text-xs mt-2">Dial *123# to begin</p>
                        <p className="text-green-600 text-xs mt-1">Click "Dial" or use keypad</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((message, index) => (
                          <div key={index} className={`${message.type === 'user' ? 'text-green-700' : 'text-green-900'}`}>
                            <div className="flex items-start">
                              <span className="mr-2 font-bold">{message.type === 'user' ? '>' : '<'}</span>
                              <span className="whitespace-pre-wrap leading-relaxed">{message.text}</span>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="text-green-600 animate-pulse">
                            <div className="flex items-center">
                              <span className="mr-2 font-bold">{'>'}</span>
                              <span className="flex space-x-1">
                                <span className="animate-bounce">.</span>
                                <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>.</span>
                                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                              </span>
                            </div>
                          </div>
                        )}
                        {currentInput && (
                          <div className="text-green-700">
                            <div className="flex items-center">
                              <span className="mr-2 font-bold">{'>'}</span>
                              <span>{currentInput}</span>
                              <span className="animate-pulse ml-1">_</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Phone Keypad */}
                  <div className="bg-gray-100 p-4">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
                        <button
                          key={key}
                          onClick={() => {
                            if (key === '#') {
                              // # acts as Enter - send the current input
                              if (currentInput.trim()) {
                                handleSend()
                              }
                            } else if (key === '*') {
                              // * starts a new USSD session or adds to input
                              if (currentInput === '') {
                                setCurrentInput('*')
                              } else {
                                setCurrentInput(prev => prev + key)
                              }
                            } else {
                              // Numbers can be added to any existing input
                              setCurrentInput(prev => prev + key)
                            }
                          }}
                          disabled={isLoading}
                          className={`py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-md ${
                            key === '*' || key === '#'
                              ? 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                              : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {key}
                        </button>
                      ))}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          // Dial button starts with *123#
                          setCurrentInput('*123#')
                          // Auto-send after a short delay to simulate dialing
                          setTimeout(() => {
                            handleSend()
                          }, 500)
                        }}
                        disabled={isLoading}
                        className="px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl font-bold transition-colors flex items-center justify-center space-x-2 shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 00.502.861l1.498-4.493A1 1 0 018.28 3H5a2 2 0 01-2-2z" />
                        </svg>
                        <span>Dial</span>
                      </button>
                      <button
                        onClick={() => {
                          if (currentInput.length > 0) {
                            setCurrentInput(currentInput.slice(0, -1))
                          } else if (messages.length > 0) {
                            setMessages([])
                          }
                        }}
                        disabled={isLoading}
                        className="px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-xl font-bold transition-colors flex items-center justify-center space-x-2 shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586l9.172-9.172a2 2 0 00-.586-1.414L13.414 6.586a2 2 0 00-1.414-.586L3 12z" />
                        </svg>
                        <span>Back</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            {/* Language Selection */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
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
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
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
            </div>

            {/* Session Info */}
            <div className="bg-white rounded-xl shadow-sm border p-4">
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
            </div>

            {/* Instructions */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-semibold text-green-900 mb-2">📱 How to Use</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Click "Dial" to auto-dial *123#</li>
                <li>• Or manually dial: * → 1 → 2 → 3 → #</li>
                <li>• Press # to send input (acts as Enter)</li>
                <li>• Use numbers to navigate menus (1, 2, 3, 4)</li>
                <li>• Use * for nested menus (1*1, 1*2, etc.)</li>
                <li>• Try different languages</li>
                <li>• Back button clears input</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  )
}
