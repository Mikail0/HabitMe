import React, { useState } from 'react';

interface Reminder {
  enabled: boolean;
  time: string;
  days: string[];
}

interface ReminderSettingsProps {
  habitId: string;
  reminder: Reminder;
  onUpdate: (reminder: Reminder) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ReminderSettings: React.FC<ReminderSettingsProps> = ({
  habitId,
  reminder,
  onUpdate,
  isOpen,
  onClose
}) => {
  const [localReminder, setLocalReminder] = useState<Reminder>(reminder);
  const [isLoading, setIsLoading] = useState(false);

  const weekDays = [
    { key: 'monday', label: 'Mo' },
    { key: 'tuesday', label: 'Di' },
    { key: 'wednesday', label: 'Mi' },
    { key: 'thursday', label: 'Do' },
    { key: 'friday', label: 'Fr' },
    { key: 'saturday', label: 'Sa' },
    { key: 'sunday', label: 'So' }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/habits/${habitId}/reminder`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reminder: localReminder }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Speichern der Erinnerung');
      }

      onUpdate(localReminder);
      onClose();
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('Fehler beim Speichern der Erinnerung');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDay = (day: string) => {
    setLocalReminder(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const selectAllDays = () => {
    setLocalReminder(prev => ({
      ...prev,
      days: weekDays.map(day => day.key)
    }));
  };

  const clearAllDays = () => {
    setLocalReminder(prev => ({
      ...prev,
      days: []
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            ⏰ Erinnerung einstellen
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Erinnerung aktivieren/deaktivieren */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Erinnerung aktivieren
            </label>
            <button
              onClick={() => setLocalReminder(prev => ({ ...prev, enabled: !prev.enabled }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localReminder.enabled ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localReminder.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {localReminder.enabled && (
            <>
              {/* Zeit auswählen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Zeit
                </label>
                <input
                  type="time"
                  value={localReminder.time}
                  onChange={(e) => setLocalReminder(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Wochentage auswählen */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Wochentage
                  </label>
                  <div className="space-x-2">
                    <button
                      onClick={selectAllDays}
                      className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                      Alle
                    </button>
                    <button
                      onClick={clearAllDays}
                      className="text-xs text-red-600 hover:text-red-800 dark:text-red-400"
                    >
                      Keine
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map((day) => (
                    <button
                      key={day.key}
                      onClick={() => toggleDay(day.key)}
                      className={`p-2 text-xs rounded-lg transition-colors ${
                        localReminder.days.includes(day.key)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderSettings; 