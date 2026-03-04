import { QRLocation } from '@/lib/types/waste'

export class QRScanner {
  private static instance: QRScanner
  private scanner: any = null

  private constructor() {}

  static getInstance(): QRScanner {
    if (!QRScanner.instance) {
      QRScanner.instance = new QRScanner()
    }
    return QRScanner.instance
  }

  async initializeScanner(videoElement: HTMLVideoElement): Promise<void> {
    try {
      // Dynamically import qr-scanner to avoid SSR issues
      const QrScanner = (await import('qr-scanner')).default
      
      this.scanner = new QrScanner(
        videoElement,
        (result) => this.handleScanResult(result),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      )
      
      console.log('QR Scanner initialized')
    } catch (error) {
      console.error('Failed to initialize QR scanner:', error)
      throw error
    }
  }

  async startScanning(): Promise<void> {
    if (!this.scanner) {
      throw new Error('QR Scanner not initialized')
    }
    
    try {
      await this.scanner.start()
      console.log('QR scanning started')
    } catch (error) {
      console.error('Failed to start QR scanning:', error)
      throw error
    }
  }

  async stopScanning(): Promise<void> {
    if (this.scanner) {
      this.scanner.stop()
      console.log('QR scanning stopped')
    }
  }

  private handleScanResult(result: any): void {
    // This will be handled by the component using the scanner
    const event = new CustomEvent('qrscan', { detail: result.data })
    document.dispatchEvent(event)
  }

  async scanFromFile(file: File): Promise<string> {
    try {
      const QrScanner = (await import('qr-scanner')).default
      const result = await QrScanner.scanImage(file)
      return result
    } catch (error) {
      console.error('Failed to scan QR code from file:', error)
      throw new Error('No QR code found in image')
    }
  }

  async validateQRCode(qrData: string): Promise<QRLocation> {
    try {
      // Call API to validate QR code and get location info
      const response = await fetch('/api/qr/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qr_code: qrData }),
      })

      if (!response.ok) {
        throw new Error('Invalid QR code')
      }

      const location: QRLocation = await response.json()
      return location
    } catch (error) {
      console.error('QR code validation failed:', error)
      throw new Error('Invalid or inactive QR code')
    }
  }

  generateQRCode(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
      import('qrcode').then((QRCode) => {
        QRCode.toDataURL(data, (error: any, url: string) => {
          if (error) {
            reject(error)
          } else {
            resolve(url)
          }
        })
      }).catch(reject)
    })
  }

  destroy(): void {
    if (this.scanner) {
      this.scanner.destroy()
      this.scanner = null
    }
  }

  // Check if camera is available
  async checkCameraAvailability(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      return videoDevices.length > 0
    } catch (error) {
      console.error('Camera check failed:', error)
      return false
    }
  }

  // Request camera permissions
  async requestCameraPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop())
      return true
    } catch (error) {
      console.error('Camera permission denied:', error)
      return false
    }
  }
}
