import { WasteCategory, ClassificationResult } from '@/types/waste'

// OpenAI-powered waste classification
// Uses GPT-4 Vision API for accurate waste categorization

export class WasteClassifier {
  private static instance: WasteClassifier
  private model: any = null
  private categories: WasteCategory[] = []

  private constructor() {}

  static getInstance(): WasteClassifier {
    if (!WasteClassifier.instance) {
      WasteClassifier.instance = new WasteClassifier()
    }
    return WasteClassifier.instance
  }

  async initialize() {
    try {
      // Load waste categories from database
      const response = await fetch('/api/waste/categories')
      const data = await response.json()
      this.categories = data.categories || []
      
      if (this.categories.length === 0) {
        console.warn('No waste categories loaded from database. Using default categories.')
        // Create default categories if database is empty
        this.categories = [
          {
            id: 1,
            name: 'Plastic',
            description: 'Plastic bottles, containers, bags, and packaging materials',
            bin_color: 'Blue',
            disposal_instructions: 'Clean and dry plastics. Remove caps and rings. Check recycling number 1-7.',
            environmental_impact: 'Takes 450+ years to decompose, harms marine life',
            points_value: 10,
            icon_url: '/icons/plastic.png',
            created_at: new Date().toISOString()
          },
          {
            id: 2,
            name: 'Paper',
            description: 'Newspapers, cardboard, office paper, and paper products',
            bin_color: 'Green',
            disposal_instructions: 'Keep dry and clean. Remove plastic windows from envelopes. Flatten cardboard boxes.',
            environmental_impact: 'Saves trees, reduces landfill space',
            points_value: 8,
            icon_url: '/icons/paper.png',
            created_at: new Date().toISOString()
          },
          {
            id: 3,
            name: 'Metal',
            description: 'Aluminum cans, steel cans, foil, and metal containers',
            bin_color: 'Yellow',
            disposal_instructions: 'Rinse containers. Crush cans to save space. Remove food residue.',
            environmental_impact: 'Infinitely recyclable, saves energy vs new production',
            points_value: 12,
            icon_url: '/icons/metal.png',
            created_at: new Date().toISOString()
          },
          {
            id: 4,
            name: 'Glass',
            description: 'Glass bottles, jars, and other glass containers',
            bin_color: 'Red',
            disposal_instructions: 'Rinse and remove lids. Separate by color if required. No broken glass.',
            environmental_impact: '100% recyclable, can be recycled endlessly',
            points_value: 15,
            icon_url: '/icons/glass.png',
            created_at: new Date().toISOString()
          },
          {
            id: 5,
            name: 'Organic',
            description: 'Food waste, yard waste, and compostable materials',
            bin_color: 'Brown',
            disposal_instructions: 'Compost food scraps and yard waste. No meat or dairy in home compost.',
            environmental_impact: 'Reduces methane, creates nutrient-rich soil',
            points_value: 5,
            icon_url: '/icons/organic.png',
            created_at: new Date().toISOString()
          },
          {
            id: 6,
            name: 'E-waste',
            description: 'Electronic devices, batteries, and electrical equipment',
            bin_color: 'Purple',
            disposal_instructions: 'Take to special e-waste facilities. Remove batteries. Do not put in regular trash.',
            environmental_impact: 'Contains toxic materials, valuable for recycling',
            points_value: 20,
            icon_url: '/icons/ewaste.png',
            created_at: new Date().toISOString()
          }
        ]
      }
      
      console.log(`Waste classifier initialized with ${this.categories.length} categories`)
    } catch (error) {
      console.error('Failed to initialize classifier:', error)
      throw error
    }
  }

  async classifyImage(imageFile: File): Promise<ClassificationResult> {
    const startTime = Date.now()

    try {
      // Convert image to base64 for OpenAI API
      const base64Image = await this.fileToBase64(imageFile)
      
      // Ensure categories are loaded
      if (this.categories.length === 0) {
        await this.initialize()
      }
      
      // Use OpenAI API for classification
      const result = await this.classifyWithOpenAI(base64Image)
      
      const processingTime = Date.now() - startTime
      
      return {
        category: result.category,
        confidence: result.confidence,
        processing_time: processingTime,
        image_url: URL.createObjectURL(imageFile),
        educationalContent: result.educationalContent
      }
    } catch (error) {
      console.error('Classification failed:', error)
      throw new Error('Failed to classify waste image')
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  private async classifyWithOpenAI(base64Image: string): Promise<{category: WasteCategory, confidence: number, educationalContent?: any}> {
    try {
      const response = await fetch('/api/ai/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          categories: this.categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            description: cat.description
          }))
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }

      const result = await response.json()
      
      // Find the matching category
      const category = this.categories.find(cat => cat.id === result.categoryId)
      if (!category) {
        throw new Error(`Invalid category ID ${result.categoryId} returned from AI`)
      }

      return {
        category,
        confidence: result.confidence || 0.8,
        educationalContent: result.educationalContent
      }
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw error // Re-throw to let the caller handle the error
    }
  }

  private fallbackClassification(): {category: WasteCategory, confidence: number} {
    // Fallback classification if OpenAI fails
    if (this.categories.length === 0) {
      // Create a default category if none are loaded
      const defaultCategory: WasteCategory = {
        id: 1,
        name: 'Mixed Waste',
        description: 'General waste that doesn\'t fit specific categories',
        bin_color: 'Black',
        disposal_instructions: 'Dispose in general waste bin',
        environmental_impact: 'Varies by composition',
        points_value: 5,
        icon_url: null,
        created_at: new Date().toISOString()
      }
      return {
        category: defaultCategory,
        confidence: 0.7
      }
    }
    
    // Select a random category from available ones
    const randomCategory = this.categories[Math.floor(Math.random() * this.categories.length)]
    const confidence = 0.7 + Math.random() * 0.3 // 70-100% confidence
    
    return {
      category: randomCategory,
      confidence: Math.round(confidence * 10000) / 10000
    }
  }

  // TensorFlow.js implementation (placeholder)
  async loadTensorFlowModel() {
    try {
      // @tensorflow/tfjs would be loaded here
      // const model = await tf.loadLayersModel('/models/waste-classification/model.json')
      // this.model = model
      console.log('TensorFlow model loaded')
    } catch (error) {
      console.error('Failed to load TensorFlow model:', error)
    }
  }

  // Replicate API implementation (placeholder)
  async classifyWithReplicate(imageBase64: string): Promise<{category: WasteCategory, confidence: number}> {
    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: 'your-model-version',
          input: {
            image: imageBase64,
          },
        }),
      })

      const prediction = await response.json()
      
      // Process Replicate response
      // This would depend on the specific model output format
      return this.processReplicateOutput(prediction)
    } catch (error) {
      console.error('Replicate API error:', error)
      throw error
    }
  }

  private processReplicateOutput(prediction: any): {category: WasteCategory, confidence: number} {
    // Process the prediction output based on your model's format
    // This is a placeholder implementation
    const mockCategory = this.categories[0]
    const mockConfidence = 0.85
    
    return {
      category: mockCategory,
      confidence: mockConfidence
    }
  }

  // Get all waste categories
  getCategories(): WasteCategory[] {
    return this.categories
  }

  // Get category by ID
  getCategoryById(id: number): WasteCategory | undefined {
    return this.categories.find(cat => cat.id === id)
  }

  // Validate classification confidence
  isConfidenceAcceptable(confidence: number): boolean {
    return confidence >= 0.7 // 70% confidence threshold
  }

  // Get disposal instructions for category
  getDisposalInstructions(categoryId: number): string {
    const category = this.getCategoryById(categoryId)
    return category?.disposal_instructions || 'Follow standard waste disposal guidelines'
  }
}
