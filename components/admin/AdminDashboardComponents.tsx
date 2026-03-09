"use client"

import { ReactNode } from "react"

interface StatsCardProps {
  label: string
  value: string
  change: string
  trend: "up" | "down"
}

export function StatsCard({ label, value, change, trend }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-sm font-medium text-gray-600">{label}</h3>
      <div className="flex items-baseline justify-between mt-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <span className={`text-sm font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
          {change}
        </span>
      </div>
    </div>
  )
}

interface AdminPageCardProps {
  title: string
  description: string
  icon: ReactNode
  href: string
  color: string
}

export function AdminPageCard({ title, description, icon, href, color }: AdminPageCardProps) {
  return (
    <a
      href={href}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer group"
    >
      <div className="flex items-center space-x-4 mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
        <span className="text-sm font-medium">Manage</span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  )
}

interface ActivityItemProps {
  type: "user" | "bin" | "system" | "reward"
  message: string
  timestamp: string
}

export function ActivityItem({ type, message, timestamp }: ActivityItemProps) {
  const getColor = (type: string) => {
    switch (type) {
      case "user": return "bg-blue-500"
      case "bin": return "bg-green-500"
      case "system": return "bg-purple-500"
      case "reward": return "bg-yellow-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getColor(type)}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{message}</p>
        <p className="text-xs text-gray-500">{timestamp}</p>
      </div>
    </div>
  )
}

interface QuickActionProps {
  icon: ReactNode
  label: string
  href: string
}

export function QuickAction({ icon, label, href }: QuickActionProps) {
  return (
    <a
      href={href}
      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-medium text-gray-900">{label}</span>
        </div>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  )
}

interface StatsOverviewProps {
  stats: Array<{
    label: string
    value: string
    change: string
    trend: "up" | "down"
  }>
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          label={stat.label}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
        />
      ))}
    </div>
  )
}

interface AdminPagesGridProps {
  pages: Array<{
    id: string
    title: string
    description: string
    icon: ReactNode
    href: string
    color: string
  }>
}

export function AdminPagesGrid({ pages }: AdminPagesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pages.map((page) => (
        <AdminPageCard
          key={page.id}
          title={page.title}
          description={page.description}
          icon={page.icon}
          href={page.href}
          color={page.color}
        />
      ))}
    </div>
  )
}

interface RecentActivityProps {
  activities: Array<{
    id: number
    type: "user" | "bin" | "system" | "reward"
    message: string
    timestamp: string
  }>
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            type={activity.type}
            message={activity.message}
            timestamp={activity.timestamp}
          />
        ))}
      </div>
    </div>
  )
}

interface QuickActionsProps {
  actions: Array<{
    id: string
    icon: ReactNode
    label: string
    href: string
  }>
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <QuickAction
            key={action.id}
            icon={action.icon}
            label={action.label}
            href={action.href}
          />
        ))}
      </div>
    </div>
  )
}
