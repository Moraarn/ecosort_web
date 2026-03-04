import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Mock rewards data - replace with actual database queries
    const mockRewards = [
      { id: "1", userId: userId, points: 15, transactionType: "earned", description: "Plastic waste classification", timestamp: "2024-01-15T10:30:00Z" },
      { id: "2", userId: userId, points: 10, transactionType: "earned", description: "Organic waste classification", timestamp: "2024-01-15T14:20:00Z" },
      { id: "3", userId: userId, points: 18, transactionType: "earned", description: "Glass waste classification", timestamp: "2024-01-15T16:45:00Z" },
      { id: "4", userId: userId, points: 20, transactionType: "earned", description: "Metal waste classification", timestamp: "2024-01-16T09:15:00Z" },
      { id: "5", userId: userId, points: 25, transactionType: "earned", description: "E-waste classification", timestamp: "2024-01-16T11:30:00Z" }
    ]

    const mockAchievements = [
      { id: 1, name: "First Sort", description: "Successfully classify your first waste item", icon: "🌟", earned: true, earnedAt: "2024-01-15T10:30:00Z" },
      { id: 2, name: "Eco Warrior", description: "Classify 50 waste items correctly", icon: "🏆", earned: true, earnedAt: "2024-01-20T15:20:00Z" },
      { id: 3, name: "Week Streak", description: "Dispose waste for 7 consecutive days", icon: "🔥", earned: true, earnedAt: "2024-01-22T12:00:00Z" },
      { id: 4, name: "Top Recycler", description: "Reach top 10 on leaderboard", icon: "👑", earned: false, earnedAt: null }
    ]

    const mockLeaderboard = [
      { rank: 1, name: "Sarah Chen", points: 3450, trend: "up" },
      { rank: 2, name: "Mike Johnson", points: 3120, trend: "up" },
      { rank: 3, name: "Emma Davis", points: 2890, trend: "down" },
      { rank: 4, name: "John Smith", points: 2670, trend: "up" },
      { rank: 5, name: "Lisa Wang", points: 2450, trend: "same" },
      { rank: 12, name: "You", points: 2450, trend: "up", isUser: true }
    ]

    // Calculate totals
    const totalPoints = mockRewards.reduce((sum, reward) => sum + reward.points, 0)
    const weeklyPoints = mockRewards
      .filter(r => new Date(r.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .reduce((sum, reward) => sum + reward.points, 0)
    const monthlyPoints = mockRewards
      .filter(r => new Date(r.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, reward) => sum + reward.points, 0)

    const result = {
      success: true,
      wallet: {
        totalPoints,
        weeklyPoints,
        monthlyPoints,
        totalDisposals: mockRewards.length
      },
      rewards: mockRewards,
      achievements: mockAchievements,
      leaderboard: mockLeaderboard
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Rewards API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rewards data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, points, transactionType, description, wasteLogId } = await request.json()

    if (!userId || !points) {
      return NextResponse.json({ error: 'User ID and points are required' }, { status: 400 })
    }

    // In production, you would:
    // 1. Insert reward record into database
    // 2. Update user total points
    // 3. Check for new achievements
    // 4. Update leaderboard

    const reward = {
      id: `REWARD-${Date.now()}`,
      userId,
      points,
      transactionType: transactionType || "earned",
      description: description || "Points awarded",
      wasteLogId,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({ success: true, reward })
  } catch (error) {
    console.error('Reward creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create reward' },
      { status: 500 }
    )
  }
}
