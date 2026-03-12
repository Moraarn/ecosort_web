// Language types for EcoSort AI
export type SupportedLanguage = 
  | 'en' 
  | 'sw' 
  | 'lg' 
  | 'ki' 
  | 'lu' 
  | 'ka' 
  | 'rn'

export interface Language {
  code: SupportedLanguage
  name: string
  flag: string
  localName?: string
}

export interface LanguageConfig {
  code: SupportedLanguage
  name: string
  flag: string
  localName: string
  rtl?: boolean
}

// USSD Language Support
export interface USSDLanguage {
  code: SupportedLanguage
  name: string
  flag: string
  greeting: string
  menuTranslations: {
    welcome: string
    mainMenu: string
    wasteGuide: string
    recyclingPoints: string
    collectionSchedule: string
    environmentalTips: string
    myPoints: string
    plastic: string
    glass: string
    metal: string
    organic: string
    paper: string
    ewaste: string
    invalidOption: string
    yourPoints: string
    redeemRewards: string
    keepRecycling: string
  }
}

// Supported Languages Configuration
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
  { code: 'lg', name: 'Luganda', flag: '🇺🇬' },
  { code: 'ki', name: 'Kikuyu', flag: '🇰🇪' },
  { code: 'lu', name: 'Luo', flag: '🇰🇪' },
  { code: 'ka', name: 'Kalenjin', flag: '🇰🇪' },
  { code: 'rn', name: 'Runyankole', flag: '🇺🇬' }
]

// USSD Language Translations
export const USSD_LANGUAGES: USSDLanguage[] = [
  {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
    greeting: 'Welcome to EcoSort AI',
    menuTranslations: {
      welcome: 'Welcome to EcoSort AI Recycling Service',
      mainMenu: 'Main Menu:',
      wasteGuide: 'Waste Disposal Guide',
      recyclingPoints: 'Recycling Points',
      collectionSchedule: 'Collection Schedule',
      environmentalTips: 'Environmental Tips',
      myPoints: 'My Points',
      plastic: 'Plastic',
      glass: 'Glass',
      metal: 'Metal',
      organic: 'Organic',
      paper: 'Paper',
      ewaste: 'E-waste',
      invalidOption: 'Invalid option. Please try again.',
      yourPoints: 'Your Points:',
      redeemRewards: 'Redeem rewards at: /rewards',
      keepRecycling: 'Keep recycling to earn more points!'
    }
  },
  {
    code: 'sw',
    name: 'Swahili',
    flag: '🇰🇪',
    greeting: 'Karibu EcoSort AI',
    menuTranslations: {
      welcome: 'Karibu EcoSort AI Recycling Service',
      mainMenu: 'Menyu Kuu:',
      wasteGuide: 'Mwongozo wa Taka',
      recyclingPoints: 'Vipande vya Taka',
      collectionSchedule: 'Harabu ya Taka',
      environmentalTips: 'Amannya ga Taka',
      myPoints: 'Nidhamu Yangu',
      plastic: 'Plastiki',
      glass: 'Gilasi',
      metal: 'Chuma',
      organic: 'Taka haiya',
      paper: 'Karatasi',
      ewaste: 'Taka ya elektroniki',
      invalidOption: 'Chaguo batili. Tafuta tena.',
      yourPoints: 'Nidhamu Yako:',
      redeemRewards: 'Chukua zawadi kwa: /rewards',
      keepRecycling: 'Endelea kurecycling kupata nidhamu zaidi!'
    }
  },
  {
    code: 'lg',
    name: 'Luganda',
    flag: '🇺🇬',
    greeting: 'Wangeeko ku EcoSort AI',
    menuTranslations: {
      welcome: 'Wangeeko ku EcoSort AI Recycling Service',
      mainMenu: 'Menyu Mukulu:',
      wasteGuide: 'Obuyambi bwa Ebimera',
      recyclingPoints: 'Ebiina Ebiri',
      collectionSchedule: 'Harabu ya Ebimera',
      environmentalTips: 'Amannya ga Ebimera',
      myPoints: 'Ebiina byange',
      plastic: 'Pulasitiki',
      glass: 'Ebiisenge',
      metal: 'Ebinyanya',
      organic: 'Ebimera bya bulimi',
      paper: 'Pepa',
      ewaste: 'Ebimera bya tekinologiya',
      invalidOption: 'Waliwo okulonda. Ogezeeko ddala.',
      yourPoints: 'Ebiina byange:',
      redeemRewards: 'Geza emikwata ku: /rewards',
      keepRecycling: 'Okola okurecycling okufuna ebibina ebisingawo!'
    }
  },
  {
    code: 'ki',
    name: 'Kikuyu',
    flag: '🇰🇪',
    greeting: 'Nĩmũhũgwo wa EcoSort AI',
    menuTranslations: {
      welcome: 'Nĩmũhũgwo wa EcoSort AI Recycling Service',
      mainMenu: 'Mũthenya wa Mũrĩrĩ:',
      wasteGuide: 'Mũhũgwo wa Tithi',
      recyclingPoints: 'Ciana cia Tithi',
      collectionSchedule: 'Harabu ya Tithi',
      environmentalTips: 'Mĩhũgwo ya Tithi',
      myPoints: 'Ndi Mabuu',
      plastic: 'Plastiki',
      glass: 'Gĩrasi',
      metal: 'Mbĩtĩ',
      organic: 'Tithi ya mũrimũ',
      paper: 'Karatasi',
      ewaste: 'Tithi cia komputa',
      invalidOption: 'Mũtwe wa mũtĩa. Tũigwo igũrũ.',
      yourPoints: 'Ndi Mabuu:',
      redeemRewards: 'Thii mabuu ta: /rewards',
      keepRecycling: 'Enda mũhũgwo wa tithi ũrĩa mabuu mangi!'
    }
  },
  {
    code: 'lu',
    name: 'Luo',
    flag: '🇰🇪',
    greeting: 'Ponyo EcoSort AI',
    menuTranslations: {
      welcome: 'Ponyo EcoSort AI Recycling Service',
      mainMenu: 'Dala Mar Koro:',
      wasteGuide: 'Konyo Lo Nyithindo',
      recyclingPoints: 'Dala Mar Nyithindo',
      collectionSchedule: 'Ber Ber Lo Nyithindo',
      environmentalTips: 'Konyo Mar Ber',
      myPoints: 'Ndalo Moko',
      plastic: 'Plastiki',
      glass: 'Dirisa',
      metal: 'Yiko',
      organic: 'Nyithindo Mar Dala',
      paper: 'Karasi',
      ewaste: 'Nyithindo Mar Kompyuta',
      invalidOption: 'Yier oloyo. Tim dhi.',
      yourPoints: 'Ndalo Moko:',
      redeemRewards: 'Nalo ndalo ta: /rewards',
      keepRecycling: 'Dhi kodhi nyithindo kuond ndalo mob!'
    }
  },
  {
    code: 'ka',
    name: 'Kalenjin',
    flag: '🇰🇪',
    greeting: 'Eko EcoSort AI',
    menuTranslations: {
      welcome: 'Eko EcoSort AI Recycling Service',
      mainMenu: 'Menu Keme:',
      wasteGuide: 'Konyo Che Mitek',
      recyclingPoints: 'Alot Che Mitek',
      collectionSchedule: 'Konyo Che Mitek',
      environmentalTips: 'Konyo Che Komen',
      myPoints: 'Alotab Ai',
      plastic: 'Plastiki',
      glass: 'Dirisa',
      metal: 'Sang',
      organic: 'Mitek Mar Konyo',
      paper: 'Karasi',
      ewaste: 'Mitek Mar Kompyuta',
      invalidOption: 'Chonchi chei. Ko to i.',
      yourPoints: 'Alotab Ai:',
      redeemRewards: 'Kobon alot ta: /rewards',
      keepRecycling: 'Ko konyo mitek kuon alot mob!'
    }
  },
  {
    code: 'rn',
    name: 'Runyankole',
    flag: '🇺🇬',
    greeting: 'Nimugye EcoSort AI',
    menuTranslations: {
      welcome: 'Nimugye EcoSort AI Recycling Service',
      mainMenu: 'Omukuru gwa Menu:',
      wasteGuide: 'Obuyambi bwa Ebimera',
      recyclingPoints: 'Ebihandi bya Ebimera',
      collectionSchedule: 'Enshu y\'Okukungura Ebimera',
      environmentalTips: 'Ebyokumanya Ebimera',
      myPoints: 'Ebihandi byange',
      plastic: 'Purasitiki',
      glass: 'Ebisashe',
      metal: 'Ebinyama',
      organic: 'Ebimera bya mirimu',
      paper: 'Pepa',
      ewaste: 'Ebimera bya tekunoroji',
      invalidOption: 'Okulonda tekiri. Ogaruke omuhango.',
      yourPoints: 'Ebihandi byange:',
      redeemRewards: 'Funa ebihandi ku: /rewards',
      keepRecycling: 'Okora okukungura ebimera ku funa ebihandi byingi!'
    }
  }
]

// Default language
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

// Helper functions
export const getLanguageByCode = (code: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code)
}

export const getUSSDLanguageByCode = (code: string): USSDLanguage | undefined => {
  return USSD_LANGUAGES.find(lang => lang.code === code)
}

export const isValidLanguage = (code: string): code is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code)
}

// Language display names
export const LANGUAGE_DISPLAY_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  sw: 'Swahili',
  lg: 'Luganda',
  ki: 'Kikuyu',
  lu: 'Luo',
  ka: 'Kalenjin',
  rn: 'Runyankole'
}

// Language flags
export const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  en: '🇬🇧',
  sw: '🇰🇪',
  lg: '🇺🇬',
  ki: '🇰🇪',
  lu: '🇰🇪',
  ka: '🇰🇪',
  rn: '🇺🇬'
}
