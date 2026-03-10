"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminSettings() {
  const [activeSettingsTab, setActiveSettingsTab] = useState("system")

  const settings = {
    system: {
      maintenanceMode: false,
      debugMode: false,
      logLevel: "info",
      backupFrequency: "daily"
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
      weeklyReports: true
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordPolicy: "strong",
      loginAttempts: 5
    },
    rewards: {
      autoApproveRewards: false,
      pointsPerScan: 10,
      bonusPointsThreshold: 100,
      expiryReminderDays: 7
    },
    bins: {
      autoSyncEnabled: true,
      syncFrequency: "hourly",
      alertThreshold: 80,
      maintenanceAlerts: true
    }
  }

  const renderSettingsContent = () => {
    switch (activeSettingsTab) {
      case "system":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">System Configuration</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Maintenance Mode</label>
                  <button className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                    settings.system.maintenanceMode ? 'bg-primary' : 'bg-gray-200'
                  }`}>
                    <span className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      settings.system.maintenanceMode ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Debug Mode</label>
                  <button className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                    settings.system.debugMode ? 'bg-primary' : 'bg-gray-200'
                  }`}>
                    <span className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      settings.system.debugMode ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Log Level</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Debug</option>
                    <option selected>Info</option>
                    <option>Warning</option>
                    <option>Error</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Hourly</option>
                    <option selected>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case "notifications":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Email Alerts</label>
                  <button className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                    settings.notifications.emailAlerts ? 'bg-primary' : 'bg-gray-200'
                  }`}>
                    <span className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications.emailAlerts ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">SMS Alerts</label>
                  <button className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                    settings.notifications.smsAlerts ? 'bg-primary' : 'bg-gray-200'
                  }`}>
                    <span className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications.smsAlerts ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Push Notifications</label>
                  <button className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                    settings.notifications.pushNotifications ? 'bg-primary' : 'bg-gray-200'
                  }`}>
                    <span className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications.pushNotifications ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Weekly Reports</label>
                  <button className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                    settings.notifications.weeklyReports ? 'bg-primary' : 'bg-gray-200'
                  }`}>
                    <span className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications.weeklyReports ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case "security":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Two-Factor Auth</label>
                  <button className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                    settings.security.twoFactorAuth ? 'bg-primary' : 'bg-gray-200'
                  }`}>
                    <span className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      settings.security.twoFactorAuth ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Session Timeout (min)</label>
                  <input 
                    type="number" 
                    defaultValue={settings.security.sessionTimeout}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Password Policy</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Weak</option>
                    <option>Medium</option>
                    <option selected>Strong</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                  <input 
                    type="number" 
                    defaultValue={settings.security.loginAttempts}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case "rewards":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Reward System Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Auto-Approve Rewards</label>
                  <button className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                    settings.rewards.autoApproveRewards ? 'bg-primary' : 'bg-gray-200'
                  }`}>
                    <span className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      settings.rewards.autoApproveRewards ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Points Per Scan</label>
                  <input 
                    type="number" 
                    defaultValue={settings.rewards.pointsPerScan}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Bonus Points Threshold</label>
                  <input 
                    type="number" 
                    defaultValue={settings.rewards.bonusPointsThreshold}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Expiry Reminder Days</label>
                  <input 
                    type="number" 
                    defaultValue={settings.rewards.expiryReminderDays}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case "bins":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Smart Bin Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Auto-Sync Enabled</label>
                  <button className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                    settings.bins.autoSyncEnabled ? 'bg-primary' : 'bg-gray-200'
                  }`}>
                    <span className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      settings.bins.autoSyncEnabled ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Sync Frequency</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Real-time</option>
                    <option selected>Hourly</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Alert Threshold (%)</label>
                  <input 
                    type="number" 
                    defaultValue={settings.bins.alertThreshold}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-medium text-gray-700">Maintenance Alerts</label>
                  <button className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                    settings.bins.maintenanceAlerts ? 'bg-primary' : 'bg-gray-200'
                  }`}>
                    <span className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      settings.bins.maintenanceAlerts ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AdminSidebar>
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-sm sm:text-base text-gray-600">Configure system settings and preferences</p>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
          {/* Settings Navigation */}
          <div className="xl:w-64">
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
              <nav className="space-y-1">
                {[
                  { id: "system", label: "System", icon: <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
                  { id: "notifications", label: "Notifications", icon: <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> },
                  { id: "security", label: "Security", icon: <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
                  { id: "rewards", label: "Rewards", icon: <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg> },
                  { id: "bins", label: "Smart Bins", icon: <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSettingsTab(tab.id)}
                    className={`w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      activeSettingsTab === tab.id
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {tab.icon}
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {renderSettingsContent()}
            
            <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors text-sm">
                Cancel
              </button>
              <button className="w-full sm:w-auto px-4 py-2 bg-primary hover:bg-gray-900 text-white rounded-lg font-medium transition-colors text-sm">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebar>
  )
}
