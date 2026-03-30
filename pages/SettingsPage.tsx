// ==========================================
// Afflosaur - Settings Page
// ==========================================

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useCoin } from '../context/CoinContext';
import { Bell, Moon, Sun, Shield, User, Key, Trash2, LogOut, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { useSound } from '../hooks/useSound';

export function SettingsPage() {
  const { theme, toggleTheme, logout, setPage } = useApp();
  const { balance: _coinBalance, currentRank: _currentRank } = useCoin();
  const { playSound, setVolume, setEnabled, settings: soundSettings } = useSound();
  const isDark = theme === 'dark';

  const [notifications, setNotifications] = useState({
    deals: true,
    reviews: true,
    updates: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    activityVisible: false,
  });

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      setPage('home');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion
      alert('Account deletion is not implemented yet.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button onClick={() => setPage('home')} className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl transition-colors ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      {/* Header */}
      <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          ⚙️ Settings
        </h1>
        <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Manage your account preferences and privacy settings
        </p>
      </div>

      {/* Theme Settings */}
      <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Sun className="w-5 h-5" />
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Theme
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Choose your preferred theme
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-colors ${
              isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Bell className="w-5 h-5" />
          Notifications
        </h2>
        <div className="space-y-4">
          {[
            { key: 'deals', label: 'Deal Alerts', desc: 'Get notified about new deals' },
            { key: 'reviews', label: 'Review Responses', desc: 'When someone replies to your reviews' },
            { key: 'updates', label: 'App Updates', desc: 'New features and improvements' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {item.label}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.desc}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.key as keyof typeof notifications]}
                  onChange={(e) => setNotifications(prev => ({
                    ...prev,
                    [item.key]: e.target.checked
                  }))}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500`}></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Sound Settings */}
  <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
    <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      {soundSettings.enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      Sound Effects
    </h2>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Enable Sounds
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Play sound effects for actions and notifications
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={soundSettings.enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500`}></div>
        </label>
      </div>

      {soundSettings.enabled && (
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Volume
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Adjust sound effect volume
            </p>
          </div>
          <div className="flex items-center gap-3">
            <VolumeX className="w-4 h-4 text-gray-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={soundSettings.volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <Volume2 className="w-4 h-4 text-gray-400" />
            <button
              onClick={() => playSound('click')}
              className="px-3 py-1 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600 transition-colors"
            >
              Test
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
      <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Shield className="w-5 h-5" />
          Privacy
        </h2>
        <div className="space-y-4">
          {[
            { key: 'profileVisible', label: 'Public Profile', desc: 'Make your profile visible to others' },
            { key: 'activityVisible', label: 'Activity Status', desc: 'Show when you\'re online' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {item.label}
                </p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.desc}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacy[item.key as keyof typeof privacy]}
                  onChange={(e) => setPrivacy(prev => ({
                    ...prev,
                    [item.key]: e.target.checked
                  }))}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500`}></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Account Actions */}
      <div className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <User className="w-5 h-5" />
          Account
        </h2>
        <div className="space-y-3">
          <button className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
            isDark ? 'hover:bg-gray-750 text-gray-300' : 'hover:bg-gray-50 text-gray-700'
          }`}>
            <Key className="w-5 h-5" />
            <div>
              <p className="font-medium">Change Password</p>
              <p className="text-sm opacity-70">Update your account password</p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
              isDark ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-600'
            }`}
          >
            <LogOut className="w-5 h-5" />
            <div>
              <p className="font-medium">Logout</p>
              <p className="text-sm opacity-70">Sign out of your account</p>
            </div>
          </button>

          <button
            onClick={handleDeleteAccount}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
              isDark ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-600'
            }`}
          >
            <Trash2 className="w-5 h-5" />
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm opacity-70">Permanently delete your account</p>
            </div>
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className={`p-6 rounded-2xl text-center ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
        <div className="text-4xl mb-2">🦕</div>
        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Afflosaur v1.0
        </h3>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Smart Shopping Starts Here
        </p>
      </div>
    </div>
  );
}