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

interface HabitCalendarProps {
  habits: Habit[];
  onToggleHabit: (habitId: string, date: string, completed: boolean) => void;
}

const HabitCalendar: React.FC<HabitCalendarProps> = ({ habits, onToggleHabit }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Woche generieren (Montag bis Sonntag)
  const getWeekDays = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Montag als erster Tag
    start.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(currentWeek);

  const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const fullDayNames = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD Format
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  // Prüfe ob ein Habit an einem bestimmten Tag abgehakt ist
  const isHabitCompletedForDay = (habit: Habit, date: Date) => {
    const dateKey = formatDateKey(date);
    if (habit.dailyCompletions) {
      // MongoDB gibt Maps als Objekte zurück, nicht als Map-Objekte
      if (typeof habit.dailyCompletions === 'object' && habit.dailyCompletions !== null) {
        return (habit.dailyCompletions as any)[dateKey] || false;
      }
      return false;
    }
    return false;
  };

  // Toggle tägliche Completion
  const handleToggleDailyHabit = async (habitId: string, date: Date, currentStatus: boolean) => {
    setLoading(true);
    try {
      const dateKey = formatDateKey(date);
      const response = await fetch(`http://localhost:5000/habits/${habitId}/daily`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          date: dateKey, 
          completed: !currentStatus 
        }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren der täglichen Completion');
      }

      // Lokalen State aktualisieren (wird von der Parent-Komponente gehandhabt)
      await onToggleHabit(habitId, dateKey, !currentStatus);
    } catch (error) {
      console.error('Fehler beim Aktualisieren:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          📅 Wochenkalender
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousWeek}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ←
          </button>
          <button
            onClick={goToCurrentWeek}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Heute
          </button>
          <button
            onClick={goToNextWeek}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Kalender Header */}
      <div className="grid grid-cols-8 gap-2 mb-4">
        <div className="p-2"></div> {/* Leerer Platz für Habit-Namen */}
        {weekDays.map((day, index) => (
          <div key={index} className="text-center">
            <div className={`text-sm font-medium p-2 rounded-lg ${
              isToday(day) 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              <div>{dayNames[index]}</div>
              <div className="text-xs">{formatDate(day)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Habits und Checkboxen */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">📝</div>
            <p>Noch keine Habits erstellt</p>
            <p className="text-sm">Erstelle deinen ersten Habit oben links!</p>
          </div>
        ) : (
          habits.map((habit) => (
            <div key={habit._id} className="grid grid-cols-8 gap-2 items-center">
              {/* Habit Name */}
              <div className="p-2">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {habit.title}
                </div>
                {habit.reminder?.enabled && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ⏰ {habit.reminder.time}
                  </div>
                )}
              </div>

              {/* Checkboxen für jeden Tag */}
              {weekDays.map((day, dayIndex) => {
                const isCompleted = isHabitCompletedForDay(habit, day);
                return (
                  <div key={dayIndex} className="flex justify-center">
                    <button
                      onClick={() => handleToggleDailyHabit(habit._id, day, isCompleted)}
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
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Wochenübersicht */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Woche vom {formatDate(weekDays[0])} - {formatDate(weekDays[6])}
          </div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {habits.reduce((total, habit) => {
              const weekCompletions = weekDays.filter(day => isHabitCompletedForDay(habit, day)).length;
              return total + weekCompletions;
            }, 0)} / {habits.length * 7} erledigt
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitCalendar; 