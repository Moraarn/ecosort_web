import { NextRequest, NextResponse } from 'next/server'

// IoT Simulation Service
// This endpoint simulates real-time IoT data from smart bins
// In production, this would be replaced by actual IoT device data

interface IoTBinData {
  binId: string
  location: string
  fillLevel: number
  weight: number
  temperature: number
  batteryLevel: number
  lastSeen: string
  status: 'normal' | 'warning' | 'critical' | 'offline'
}

// Simulated IoT devices
const iotDevices: IoTBinData[] = [
  {
    binId: "BIN001",
    location: "Main Street - Recycling Center",
    fillLevel: 45,
    weight: 125.5,
    temperature: 22.5,
    batteryLevel: 87,
    lastSeen: new Date().toISOString(),
    status: 'normal'
  },
  {
    binId: "BIN002", 
    location: "City Park - Organic Waste",
    fillLevel: 78,
    weight: 89.2,
    temperature: 24.1,
    batteryLevel: 92,
    lastSeen: new Date().toISOString(),
    status: 'warning'
  },
  {
    binId: "BIN003",
    location: "Shopping Mall - Plastic Collection", 
    fillLevel: 23,
    weight: 45.8,
    temperature: 21.8,
    batteryLevel: 78,
    lastSeen: new Date().toISOString(),
    status: 'normal'
  },
  {
    binId: "BIN004",
    location: "School Campus - Paper Recycling",
    fillLevel: 91,
    weight: 156.3,
    temperature: 23.2,
    batteryLevel: 65,
    lastSeen: new Date().toISOString(),
    status: 'critical'
  },
  {
    binId: "BIN005",
    location: "Industrial Area - Metal Collection",
    fillLevel: 67,
    weight: 234.7,
    temperature: 25.6,
    batteryLevel: 83,
    lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
    status: 'normal'
  }
]

// Simulate IoT data changes
function simulateIoTDataChange(device: IoTBinData): IoTBinData {
  // Random fill level change (more realistic patterns)
  const hour = new Date().getHours()
  let fillChange = 0
  
  // Different patterns based on time of day
  if (hour >= 6 && hour <= 9) {
    // Morning rush - more waste
    fillChange = Math.random() * 8 + 2
  } else if (hour >= 12 && hour <= 14) {
    // Lunch time - moderate waste
    fillChange = Math.random() * 5 + 1
  } else if (hour >= 17 && hour <= 20) {
    // Evening - moderate waste
    fillChange = Math.random() * 6 + 1
  } else {
    // Night/early morning - minimal waste
    fillChange = Math.random() * 2 - 1 // Can be negative (compaction)
  }
  
  device.fillLevel = Math.max(0, Math.min(100, device.fillLevel + fillChange))
  device.weight = Math.max(0, device.weight + fillChange * 2.8)
  
  // Temperature fluctuation
  device.temperature += (Math.random() - 0.5) * 0.5
  device.temperature = Math.max(15, Math.min(35, device.temperature))
  
  // Battery drain (very slow)
  device.batteryLevel = Math.max(0, device.batteryLevel - 0.01)
  
  // Update status based on fill level
  if (device.fillLevel >= 90) {
    device.status = 'critical'
  } else if (device.fillLevel >= 75) {
    device.status = 'warning'
  } else {
    device.status = 'normal'
  }
  
  // Random offline simulation (rare)
  if (Math.random() < 0.01) { // 1% chance
    device.status = 'offline'
    device.lastSeen = new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 mins ago
  }
  
  device.lastSeen = new Date().toISOString()
  
  return device
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    deviceId = searchParams.get('deviceId')
    const action = searchParams.get('action')
    
    if (action === 'simulate') {
      // Run simulation for all devices
      const simulatedDevices = iotDevices.map(device => simulateIoTDataChange(device))
      
      // Check for collection alerts
      const criticalBins = simulatedDevices.filter(device => device.status === 'critical')
      const offlineDevices = simulatedDevices.filter(device => device.status === 'offline')
      const lowBatteryDevices = simulatedDevices.filter(device => device.batteryLevel < 20)
      
      // Generate alerts
      const alerts = []
      
      if (criticalBins.length > 0) {
        alerts.push({
          type: 'collection_needed',
          severity: 'high',
          message: `${criticalBins.length} bin(s) need immediate collection`,
          bins: criticalBins.map(bin => ({ binId: bin.binId, location: bin.location, fillLevel: bin.fillLevel }))
        })
      }
      
      if (offlineDevices.length > 0) {
        alerts.push({
          type: 'device_offline',
          severity: 'medium',
          message: `${offlineDevices.length} device(s) are offline`,
          devices: offlineDevices.map(device => ({ binId: device.binId, location: device.location, lastSeen: device.lastSeen }))
        })
      }
      
      if (lowBatteryDevices.length > 0) {
        alerts.push({
          type: 'low_battery',
          severity: 'low',
          message: `${lowBatteryDevices.length} device(s) have low battery`,
          devices: lowBatteryDevices.map(device => ({ binId: device.binId, location: device.location, batteryLevel: device.batteryLevel }))
        })
      }
      
      return NextResponse.json({
        success: true,
        devices: simulatedDevices,
        alerts: alerts,
        summary: {
          totalDevices: simulatedDevices.length,
          normalBins: simulatedDevices.filter(d => d.status === 'normal').length,
          warningBins: simulatedDevices.filter(d => d.status === 'warning').length,
          criticalBins: criticalBins.length,
          offlineDevices: offlineDevices.length,
          averageFillLevel: simulatedDevices.reduce((sum, d) => sum + d.fillLevel, 0) / simulatedDevices.length,
          totalWeight: simulatedDevices.reduce((sum, d) => sum + d.weight, 0)
        },
        timestamp: new Date().toISOString()
      })
    }
    
    if (deviceId) {
      // Get specific device data
      const device = iotDevices.find(d => d.binId === deviceId)
      if (!device) {
        return NextResponse.json({ error: 'Device not found' }, { status: 404 })
      }
      
      return NextResponse.json({
        success: true,
        device: simulateIoTDataChange({ ...device }),
        timestamp: new Date().toISOString()
      })
    }
    
    // Get all devices data
    const currentDevices = iotDevices.map(device => simulateIoTDataChange({ ...device }))
    
    return NextResponse.json({
      success: true,
      devices: currentDevices,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('IoT simulation error:', error)
    return NextResponse.json(
      { error: 'Failed to run IoT simulation' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { binId, command, parameters } = await request.json()
    
    if (!binId || !command) {
      return NextResponse.json({ error: 'Bin ID and command are required' }, { status: 400 })
    }
    
    const deviceIndex = iotDevices.findIndex(d => d.binId === binId)
    if (deviceIndex === -1) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 })
    }
    
    const device = iotDevices[deviceIndex]
    
    switch (command) {
      case 'reset_fill_level':
        device.fillLevel = 0
        device.weight = 0
        device.lastSeen = new Date().toISOString()
        break
        
      case 'set_fill_level':
        if (parameters?.fillLevel !== undefined) {
          device.fillLevel = Math.max(0, Math.min(100, parameters.fillLevel))
          device.weight = device.fillLevel * 2.8
          device.lastSeen = new Date().toISOString()
        }
        break
        
      case 'calibrate':
        // Simulate calibration process
        device.temperature = 22.0
        device.batteryLevel = 100
        device.lastSeen = new Date().toISOString()
        break
        
      case 'restart':
        // Simulate device restart
        device.lastSeen = new Date(Date.now() - 2 * 60 * 1000).toISOString()
        device.status = 'normal'
        break
        
      default:
        return NextResponse.json({ error: 'Invalid command' }, { status: 400 })
    }
    
    // Update status based on new fill level
    if (device.fillLevel >= 90) {
      device.status = 'critical'
    } else if (device.fillLevel >= 75) {
      device.status = 'warning'
    } else {
      device.status = 'normal'
    }
    
    console.log(`IoT Command executed:`, { binId, command, result: device })
    
    return NextResponse.json({
      success: true,
      device: device,
      message: `Command '${command}' executed successfully on ${binId}`
    })
    
  } catch (error) {
    console.error('IoT command error:', error)
    return NextResponse.json(
      { error: 'Failed to execute IoT command' },
      { status: 500 }
    )
  }
}
