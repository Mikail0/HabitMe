import React, { useState, useEffect } from 'react';

interface Habit {
  _id: string;
  title: string;
  completed?: boolean;
  dailyCompletions?: { [key: string]: boolean };
  reminder?: {
    enabled: boolean;
    time: string;
    days: string[];
  };
  createdAt: string;
}

interface DailyHabitsProps {
  habits: Habit[];
  onToggleDailyHabit: (habitId: string, date: string, completed: boolean) => Promise<void>;
}

const DailyHabits: React.FC<DailyHabitsProps> = ({ habits, onToggleDailyHabit }) => {
  const [today, setToday] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD Format
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('de-DE', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isHabitCompletedForToday = (habit: Habit) => {
    const todayKey = formatDateKey(today);
    if (habit.dailyCompletions) {
      return habit.dailyCompletions[todayKey] || false;
    }
    return false;
  };

  const handleToggleHabit = async (habitId: string, currentStatus: boolean) => {
    setLoading(true);
    try {
      const todayKey = formatDateKey(today);
      await onToggleDailyHabit(habitId, todayKey, !currentStatus);
    } catch (error) {
      console.error('Fehler beim Aktualisieren:', error);
    } finally {
      setLoading(false);
    }
  };

  const completedToday = habits.filter(habit => isHabitCompletedForToday(habit)).length;
  const totalHabits = habits.length;
  const progressPercentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            📅 Heute - {formatDateDisplay(today)}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Markiere deine erledigten Habits für heute
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {completedToday}/{totalHabits}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            erledigt
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Fortschritt
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Habits */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">📝</div>
            <p>Noch keine Habits erstellt</p>
            <p className="text-sm">Erstelle deinen ersten Habit oben links!</p>
          </div>
        ) : (
          habits.map((habit) => {
            const isCompleted = isHabitCompletedForToday(habit);
            return (
              <div
                key={habit._id}
                className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200 ${
                  isCompleted ? 'border-l-4 border-green-500' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                      isCompleted 
                        ? 'text-gray-500 dark:text-gray-400 line-through' 
                        : 'text-gray-800 dark:text-white'
                    }`}>
                      {habit.title}
                    </h3>
                    
                    {/* Erinnerungs-Info */}
                    {habit.reminder && habit.reminder.enabled && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>⏰</span>
                        <span>{habit.reminder.time}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Status Badge */}
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isCompleted
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {isCompleted ? '✅ Erledigt' : '⏳ Ausstehend'}
                    </div>
                    
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleHabit(habit._id, isCompleted)}
                      disabled={loading}
                      className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-400'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {isCompleted && (
                        <span className="text-sm">✓</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Motivations-Nachricht */}
      {completedToday > 0 && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🎉</span>
            <div>
              <p className="text-green-800 dark:text-green-400 font-medium">
                Großartig! Du hast heute {completedToday} Habit{completedToday > 1 ? 's' : ''} erledigt!
              </p>
              <p className="text-green-600 dark:text-green-500 text-sm">
                Bleib dran und baue positive Gewohnheiten auf.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyHabits; 