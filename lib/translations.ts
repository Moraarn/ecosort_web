export const translations = {
  en: {
    // Common
    'start.sorting': 'Start Sorting',
    'upload.image': 'Upload Image',
    'camera.capture': 'Camera',
    'classify.waste': 'Classify Waste',
    'analyzing': 'Analyzing...',
    'clear': 'Clear',
    'ask.about.recycling': 'Ask about recycling...',
    'send': 'Send',
    
    // Recycling Assistant
    'eco.sort.assistant': 'EcoSort Recycling Assistant',
    'ai.powered.classification': 'AI-powered waste classification and recycling guidance',
    'upload.waste.image': 'Upload Waste Image',
    'upload.or.capture': 'Upload or capture an image of waste',
    'classification.result': 'Classification Result',
    'category': 'Category',
    'confidence': 'Confidence',
    'bin.color': 'Bin Color',
    'points': 'Points',
    'recycling.chatbot': 'Recycling Chatbot',
    'recycling bins guide': 'Recycling Bins Guide',
    'nearby bins': 'Nearby Bins',
    'find nearby bins for your waste': 'Find nearby bins for your waste',
    'enable location': 'Enable Location',
    'finding nearby bins': 'Finding nearby bins',
    'no nearby bins found': 'No nearby bins found',
    'found': 'Found',
    'bins nearby': 'bins nearby',
    'match your waste to the correct bin color': 'Match your waste to the correct bin color',
    'ask.me.anything': 'Ask me anything about recycling!',
    'examples': 'Examples:',
    'where.throw.batteries': '"Where should I throw batteries?"',
    'plastic.bags.recyclable': '"Can plastic bags be recycled?"',
    
    // Waste categories
    'plastic': 'Plastic',
    'paper': 'Paper',
    'metal': 'Metal',
    'glass': 'Glass',
    'organic': 'Organic',
    'e.waste': 'E-waste',
    'standard': 'Standard',
    
    // Instructions
    'follow.standard.guidelines': 'Follow standard waste disposal guidelines',
    'reusable.cloth.bags': 'reusable cloth bags',
    
    // Voice
    'voice.enabled': 'Voice Enabled',
    'voice.disabled': 'Voice Disabled',
    'classification complete': 'Classification Complete',
    'Educational Information': 'Educational Information',
    'Type': 'Type',
    'Recyclable': 'Recyclable',
    'Environmental Impact': 'Environmental Impact',
    'Fun Fact': 'Fun Fact',
    'Eco Alternatives': 'Eco Alternatives',
    'Recycling Instructions': 'Recycling Instructions'
  },
  sw: {
    // Common
    'start.sorting': 'Anza Kuainisha',
    'upload.image': 'Pakia Picha',
    'camera.capture': 'Kamera',
    'classify.waste': 'Aainisha Taka',
    'analyzing': 'Inachambuliwa...',
    'clear': 'Futa',
    'ask.about.recycling': 'Uliza kuhusu kutengeneza tena...',
    'send': 'Tuma',
    
    // Recycling Assistant
    'eco.sort.assistant': 'Msaidizi wa Kutengeneza Tena EcoSort',
    'ai.powered.classification': 'Uainishaji wa taka unaotengenezwa na AI na mwongozo wa kutengeneza tena',
    'upload.waste.image': 'Pakia Picha ya Taka',
    'upload.or.capture': 'Pakia au piga picha ya taka',
    'classification.result': 'Matokeo ya Uainishaji',
    'category': 'Aina',
    'confidence': 'Uhakika',
    'bin.color': 'Rangi ya Chombo',
    'points': 'Pointi',
    'recycling.chatbot': 'Chatbot ya Kutengeneza Tena',
    'recycling bins guide': 'Mwongozo wa Vikapu vya Kutengeneza Tena',
    'nearby bins': 'Vikapu Karibu',
    'find nearby bins for your waste': 'Tafuta vikapu vya karibu kwa taka zako',
    'enable location': 'Washa Mahali',
    'finding nearby bins': 'Inatafuta vikapu vya karibu',
    'no nearby bins found': 'Hakuna vikapu vya karibu vilivyopatikana',
    'found': 'Imepatikana',
    'bins nearby': 'vikapu karibu',
    'match your waste to the correct bin color': 'Linganisha taka zako na rangi sahihi ya chombo',
    'ask.me.anything': 'Uliza lolote kuhusu kutengeneza tena!',
    'examples': 'Mifano:',
    'where.throw.batteries': '"Nitapaswa kutupa betri wapi?"',
    'plastic.bags.recyclable': '"Mifuko ya plastiki inaweza kutengenezwa tena?"',
    
    // Waste categories
    'plastic': 'Plastiki',
    'paper': 'Karatasi',
    'metal': 'Chuma',
    'glass': 'Kioo',
    'organic': 'Kiumbe',
    'e.waste': 'Taka za Kielektroniki',
    'standard': 'Kawaida',
    
    // Instructions
    'follow.standard.guidelines': 'Fuata mwongozo wa kawaida wa kutupa taka',
    'reusable.cloth.bags': 'mikuku ya nguo inayoweza kutumika tena',
    
    // Voice
    'voice.enabled': 'Sauti Imewashwa',
    'voice.disabled': 'Sauti Imezimwa',
    'classification complete': 'Uainishaji Umekamilika',
    'Educational Information': 'Maelezo ya Elimu',
    'Type': 'Aina',
    'Recyclable': 'Inaweza Kutengenezwa Ten',
    'Environmental Impact': 'Athari za Mazingira',
    'Fun Fact': 'Ukweli wa Kustaajabisha',
    'Eco Alternatives': 'Mbadala za Kirafiki',
    'Recycling Instructions': 'Maelezo ya Kutengeneza Ten'
  }
}

export function translateText(text: string, targetLanguage: string): string {
  const lang = translations[targetLanguage as keyof typeof translations] || translations.en
  
  // First try exact matches
  if (lang[text as keyof typeof lang]) {
    return lang[text as keyof typeof lang]
  }
  
  // Then try partial matches for word replacement
  let translatedText = text
  const swTranslations = translations.sw
  
  if (targetLanguage === 'sw') {
    // Simple word-by-word translation for common terms
    Object.entries(translations.en).forEach(([key, englishValue]) => {
      if (typeof englishValue === 'string' && englishValue !== key) {
        const swahiliValue = swTranslations[key as keyof typeof swTranslations]
        if (typeof swahiliValue === 'string') {
          translatedText = translatedText.replace(
            new RegExp(englishValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
            swahiliValue
          )
        }
      }
    })
  }
  
  return translatedText
}

export function getVoiceSettings(language: string): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance()
  utterance.lang = language === 'sw' ? 'sw-TZ' : 'en-US'
  utterance.rate = 1
  utterance.pitch = 1
  utterance.volume = 1
  return utterance
}
