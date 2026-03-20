import { getUSSDLanguageByCode, type SupportedLanguage } from '@/types/languages'
import { WasteClassifier } from '@/lib/ai/classifier'

export interface USSDRequest {
  sessionId: string
  serviceCode: string
  phoneNumber: string
  text: string
  language: SupportedLanguage
}

export interface USSDSession {
  sessionId: string
  phoneNumber: string
  language: SupportedLanguage
  currentLevel: string
  data: Record<string, any>
}

export class USSDMenuService {
  private classifier: WasteClassifier

  constructor() {
    this.classifier = WasteClassifier.getInstance()
  }

  async processRequest(request: USSDRequest): Promise<string> {
    const { text, language } = request
    const lang = getUSSDLanguageByCode(language) || getUSSDLanguageByCode('en')!

    // Parse user input path
    const inputPath = text.split('*').filter(step => step !== '')
    
    // Route based on input path
    if (text === '') {
      return this.getWelcomeMenu(lang)
    }

    // Main menu routing
    switch (inputPath[0]) {
      case '1':
        return this.handleWasteGuide(inputPath, lang)
      case '2':
        return this.handleRecyclingPoints(inputPath, lang)
      case '3':
        return this.handleCollectionSchedule(inputPath, lang)
      case '4':
        return this.handleEnvironmentalTips(inputPath, lang)
      case '5':
        return this.handleMyPoints(inputPath, lang)
      case '99':
        return this.handleLanguageSelection(inputPath, lang)
      default:
        return this.getInvalidOption(lang)
    }
  }

  private getWelcomeMenu(lang: any): string {
    return `CON ${lang.menuTranslations.welcome}
${lang.menuTranslations.mainMenu}
1. ${lang.menuTranslations.wasteGuide}
2. ${lang.menuTranslations.recyclingPoints}
3. ${lang.menuTranslations.collectionSchedule}
4. ${lang.menuTranslations.environmentalTips}
5. ${lang.menuTranslations.myPoints}
99. Change Language`
  }

  private handleWasteGuide(inputPath: string[], lang: any): string {
    if (inputPath.length === 1) {
      return `CON ${lang.menuTranslations.wasteGuide}:
1. ${lang.menuTranslations.plastic}
2. ${lang.menuTranslations.glass}
3. ${lang.menuTranslations.metal}
4. ${lang.menuTranslations.organic}
5. ${lang.menuTranslations.paper}
6. E-waste
0. Back`
    }

    const wasteType = inputPath[1]
    
    switch (wasteType) {
      case '1': // Plastic
        return this.getWasteInfoSync('plastic', lang)
      case '2': // Glass
        return this.getWasteInfoSync('glass', lang)
      case '3': // Metal
        return this.getWasteInfoSync('metal', lang)
      case '4': // Organic
        return this.getWasteInfoSync('organic', lang)
      case '5': // Paper
        return this.getWasteInfoSync('paper', lang)
      case '6': // E-waste
        return this.getWasteInfoSync('ewaste', lang)
      case '0': // Back
        return this.getWelcomeMenu(lang)
      default:
        return `CON ${lang.menuTranslations.invalidOption}
0. Back`
    }
  }

  private getWasteInfoSync(wasteType: string, lang: any): string {
    // Get category information
    const categoryMap: Record<string, { name: string; binColor: string; points: number; instructions: string }> = {
      'plastic': { 
        name: 'Plastic', 
        binColor: 'Blue', 
        points: 10, 
        instructions: 'Clean and dry plastics. Remove caps and rings. Check recycling number 1-7.' 
      },
      'glass': { 
        name: 'Glass', 
        binColor: 'Red', 
        points: 15, 
        instructions: 'Rinse and remove lids. Separate by color if required. No broken glass.' 
      },
      'metal': { 
        name: 'Metal', 
        binColor: 'Yellow', 
        points: 12, 
        instructions: 'Rinse containers. Crush cans to save space. Remove food residue.' 
      },
      'organic': { 
        name: 'Organic', 
        binColor: 'Brown', 
        points: 5, 
        instructions: 'Compost food scraps and yard waste. No meat or dairy in home compost.' 
      },
      'paper': { 
        name: 'Paper', 
        binColor: 'Green', 
        points: 8, 
        instructions: 'Keep dry and clean. Remove plastic windows from envelopes. Flatten cardboard boxes.' 
      },
      'ewaste': { 
        name: 'E-waste', 
        binColor: 'Purple', 
        points: 20, 
        instructions: 'Take to special e-waste facilities. Remove batteries. Do not put in regular trash.' 
      }
    }

    const category = categoryMap[wasteType]

    if (!category) {
      return `END ${wasteType} waste information not available. Please try again later.`
    }

    // Format disposal instructions for USSD (keep it short)
    const instructions = category.instructions.substring(0, 140) + '...'
    
    return `END ${category.name} waste:
${instructions}
Bin: ${category.binColor}
Points: ${category.points}`
  }

  private handleRecyclingPoints(inputPath: string[], lang: any): string {
    if (inputPath.length === 1) {
      return `CON ${lang.menuTranslations.recyclingPoints}:
1. Find nearest center
2. Points balance
3. Redeem rewards
0. Back`
    }

    switch (inputPath[1]) {
      case '1':
        return `END Nearest recycling center:
City Center Mall
Open: 8AM-6PM daily
Distance: 2.3km`
      case '2':
        return this.getPointsInfo(lang)
      case '3':
        return `END Redeem rewards:
Visit: ecosort.ai/rewards
Use your phone number to claim rewards`
      case '0':
        return this.getWelcomeMenu(lang)
      default:
        return `CON ${lang.menuTranslations.invalidOption}
0. Back`
    }
  }

  private handleCollectionSchedule(inputPath: string[], lang: any): string {
    if (inputPath.length === 1) {
      return `CON ${lang.menuTranslations.collectionSchedule}:
1. Residential areas
2. Commercial areas
3. Special collections
0. Back`
    }

    switch (inputPath[1]) {
      case '1':
        return `END Residential collection:
Mon/Wed/Fri - General waste
Tue/Thu - Recycling
Sat - Organic waste
6AM-8AM`
      case '2':
        return `END Commercial collection:
Daily - General waste
Mon/Wed/Fri - Recycling
5AM-7AM`
      case '3':
        return `END Special collections:
E-waste: First Saturday monthly
Bulk items: By appointment
Call: 0800-ECOSORT`
      case '0':
        return this.getWelcomeMenu(lang)
      default:
        return `CON ${lang.menuTranslations.invalidOption}
0. Back`
    }
  }

  private handleEnvironmentalTips(inputPath: string[], lang: any): string {
    if (inputPath.length === 1) {
      return `CON ${lang.menuTranslations.environmentalTips}:
1. Daily tips
2. Recycling guide
3. Composting tips
4. Energy saving
0. Back`
    }

    switch (inputPath[1]) {
      case '1':
        return `END Daily tip:
Rinse plastic containers before recycling to prevent contamination.
Clean recycling = better recycling!`
      case '2':
        return `END Recycling guide:
1. Sort waste at home
2. Clean and dry items
3. Check recycling numbers
4. Use correct bins`
      case '3':
        return `END Composting tips:
- Fruit/vegetable scraps only
- No meat or dairy
- Turn pile weekly
- Keep moist but not wet`
      case '4':
        return `END Energy saving:
- Use reusable bags
- Buy products with less packaging
- Choose glass over plastic when possible
- Recycle electronics properly`
      case '0':
        return this.getWelcomeMenu(lang)
      default:
        return `CON ${lang.menuTranslations.invalidOption}
0. Back`
    }
  }

  private handleMyPoints(inputPath: string[], lang: any): string {
    return this.getPointsInfo(lang)
  }

  private getPointsInfo(lang: any): string {
    // In a real implementation, this would fetch from database
    const mockPoints = 245
    return `END ${lang.menuTranslations.yourPoints} ${mockPoints}
${lang.menuTranslations.redeemRewards}
${lang.menuTranslations.keepRecycling}`
  }

  private handleLanguageSelection(inputPath: string[], lang: any): string {
    if (inputPath.length === 1) {
      return `CON Select Language:
1. English
2. Swahili
3. Luganda
4. Kikuyu
5. Luo
6. Kalenjin
7. Runyankole
0. Back`
    }

    const languageMap: Record<string, SupportedLanguage> = {
      '1': 'en',
      '2': 'sw', 
      '3': 'lg',
      '4': 'ki',
      '5': 'lu',
      '6': 'ka',
      '7': 'rn'
    }

    const selectedLang = languageMap[inputPath[1]]
    
    if (selectedLang) {
      const newLang = getUSSDLanguageByCode(selectedLang)
      if (newLang) {
        return `END Language changed to ${newLang.name}
Dial *123# to continue in ${newLang.name}`
      }
    }

    if (inputPath[1] === '0') {
      return this.getWelcomeMenu(lang)
    }

    return `CON ${lang.menuTranslations.invalidOption}
0. Back`
  }

  private getInvalidOption(lang: any): string {
    return `END ${lang.menuTranslations.invalidOption}`
  }
}
