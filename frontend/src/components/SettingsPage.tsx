import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SettingsPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ⚙️ Einstellungen
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Passe deine App-Einstellungen an
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              App-Einstellungen
            </h2>

            <div className="space-y-6">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Dark Mode
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Wechsle zwischen hellem und dunklem Design
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDarkMode ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Notifications */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Benachrichtigungen
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Erhalte Erinnerungen für deine Habits
                  </p>
                </div>
                <button
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                </button>
              </div>

              {/* Data Export */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Daten exportieren
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Lade deine Habit-Daten als JSON herunter
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Exportieren
                </button>
              </div>

              {/* About */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Über HabitMe
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  HabitMe ist eine App, die dir dabei hilft, positive Gewohnheiten zu entwickeln und zu verfolgen. 
                  Erstelle deine eigenen Habits, setze Erinnerungen und verfolge deinen Fortschritt.
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Version 1.0.0 • Entwickelt mit ❤️
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 