import React, { useState } from 'react';

interface Reminder {
  enabled: boolean;
  time: string;
  days: string[];
}

interface Habit {
  _id: string;
  title: string;
  completed?: boolean;
  dailyCompletions?: { [key: string]: boolean };
  reminder?: Reminder;
  createdAt: string;
}

interface HabitFormProps {
  onHabitAdded?: (habit: Habit) => void;
}

const HabitForm: React.FC<HabitFormProps> = ({ onHabitAdded }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showReminderSettings, setShowReminderSettings] = useState(false);
  const [reminder, setReminder] = useState<Reminder>({
    enabled: false,
    time: "09:00",
    days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const habit = { title, reminder };

    try {
      const response = await fetch('http://localhost:5000/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(habit),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Erstellen des Habits');
      }

      const newHabit = await response.json();
      
      setTitle('');
      setReminder({
        enabled: false,
        time: "09:00",
        days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
      });
      setShowReminderSettings(false);
      
      // Callback aufrufen, wenn vorhanden
      if (onHabitAdded) {
        onHabitAdded(newHabit);
      }
      
      alert('Habit erfolgreich erstellt!');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unbekannter Fehler aufgetreten');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReminder = () => {
    setReminder(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const updateReminderTime = (time: string) => {
    setReminder(prev => ({ ...prev, time }));
  };

  const toggleDay = (day: string) => {
    setReminder(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const weekDays = [
    { key: 'monday', label: 'Mo' },
    { key: 'tuesday', label: 'Di' },
    { key: 'wednesday', label: 'Mi' },
    { key: 'thursday', label: 'Do' },
    { key: 'friday', label: 'Fr' },
    { key: 'saturday', label: 'Sa' },
    { key: 'sunday', label: 'So' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        🌱 Neues Habit erstellen
      </h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-md text-sm animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Titel
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="z.B. Täglich 10 Minuten lesen"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 dark:focus:ring-green-500 dark:focus:border-green-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Erinnerung-Einstellungen */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              ⏰ Erinnerung hinzufügen
            </label>
            <button
              type="button"
              onClick={toggleReminder}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                reminder.enabled ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  reminder.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {reminder.enabled && (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Zeit
                </label>
                <input
                  type="time"
                  value={reminder.time}
                  onChange={(e) => updateReminderTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Wochentage
                </label>
                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map((day) => (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => toggleDay(day.key)}
                      className={`p-2 text-xs rounded-lg transition-colors ${
                        reminder.days.includes(day.key)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${
            isLoading 
              ? 'bg-green-400 dark:bg-green-600 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Wird erstellt...
            </span>
          ) : (
            '➕ Habit hinzufügen'
          )}
        </button>
      </form>
    </div>
  );
};

export default HabitForm;
