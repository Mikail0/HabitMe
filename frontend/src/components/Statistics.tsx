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

interface HabitStats {
  totalHabits: number;
  completedToday: number;
  completionRate: number;
  mostActiveDay: string;
  longestStreak: number;
  totalCompletions: number;
}

interface Quote {
  content: string;
  author: string;
}

const Statistics = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [stats, setStats] = useState<HabitStats>({
    totalHabits: 0,
    completedToday: 0,
    completionRate: 0,
    mostActiveDay: '',
    longestStreak: 0,
    totalCompletions: 0
  });

  // Motivationsspruch laden
  const fetchQuote = async () => {
    try {
      setQuoteLoading(true);
      const response = await fetch('https://api.quotable.io/random?tags=motivation|success|inspiration&maxLength=150');
      if (!response.ok) {
        throw new Error('Fehler beim Laden des Motivationsspruchs');
      }
      const data = await response.json();
      setQuote({
        content: data.content,
        author: data.author
      });
    } catch (err) {
      console.error('Fehler beim Laden des Motivationsspruchs:', err);
      // Fallback-Zitat
      setQuote({
        content: "Kleine Schritte führen zu großen Veränderungen. Du machst das großartig!",
        author: "HabitMe"
      });
    } finally {
      setQuoteLoading(false);
    }
  };

  // Alle Habits laden
  const fetchHabits = async () => {
    try {
      const response = await fetch('http://localhost:5000/habits');
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Habits');
      }
      const data = await response.json();
      setHabits(data);
      calculateStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  };

  // Statistiken berechnen
  const calculateStats = (habitsData: Habit[]) => {
    const totalHabits = habitsData.length;
    
    // Berechne echte tägliche Completions
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habitsData.filter(habit => {
      if (habit.dailyCompletions && typeof habit.dailyCompletions === 'object') {
        return habit.dailyCompletions[today] || false;
      }
      return false;
    }).length;
    
    const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
    
    // Berechne echte Statistiken basierend auf dailyCompletions
    let totalCompletions = 0;
    const dayCounts: { [key: string]: number } = {};
    const dayNames: { [key: string]: string } = {
      monday: 'Montag',
      tuesday: 'Dienstag', 
      wednesday: 'Mittwoch',
      thursday: 'Donnerstag',
      friday: 'Freitag',
      saturday: 'Samstag',
      sunday: 'Sonntag'
    };

    // Analysiere die letzten 30 Tage für Statistiken
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    habitsData.forEach(habit => {
      if (habit.dailyCompletions && typeof habit.dailyCompletions === 'object') {
        // Zähle alle Completions
        Object.values(habit.dailyCompletions).forEach(completed => {
          if (completed) totalCompletions++;
        });
        
        // Analysiere Wochentage basierend auf Erinnerungen
        if (habit.reminder?.enabled && habit.reminder.days) {
          habit.reminder.days.forEach(day => {
            dayCounts[day] = (dayCounts[day] || 0) + 1;
          });
        }
      }
    });
    
    const mostActiveDay = Object.keys(dayCounts).length > 0 
      ? Object.entries(dayCounts).sort(([,a], [,b]) => b - a)[0][0]
      : '';

    // Berechne längsten Streak basierend auf echten Daten
    let longestStreak = 0;
    let currentStreak = 0;
    
    // Gehe durch die letzten 30 Tage
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      const dateKey = checkDate.toISOString().split('T')[0];
      
      const dayCompletions = habitsData.filter(habit => {
        if (habit.dailyCompletions && typeof habit.dailyCompletions === 'object') {
          return habit.dailyCompletions[dateKey] || false;
        }
        return false;
      }).length;
      
      if (dayCompletions > 0) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    setStats({
      totalHabits,
      completedToday,
      completionRate,
      mostActiveDay: dayNames[mostActiveDay] || 'Keine Daten',
      longestStreak,
      totalCompletions
    });
  };

  useEffect(() => {
    fetchHabits();
    fetchQuote();
  }, []);

  // Statistiken neu berechnen, wenn sich Habits ändern
  useEffect(() => {
    if (habits.length > 0) {
      calculateStats(habits);
    }
  }, [habits]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                📈 Statistiken
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Übersicht über deine Habit-Performance basierend auf täglichem Tracking
              </p>
            </div>
            <button
              onClick={fetchHabits}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Aktualisieren</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Habits */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gesamte Habits</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalHabits}</p>
                </div>
              </div>
            </div>

            {/* Completed Today */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Heute erledigt</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedToday}</p>
                </div>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Erfolgsrate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completionRate}%</p>
                </div>
              </div>
            </div>

            {/* Longest Streak */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <span className="text-2xl">🔥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Längster Streak</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.longestStreak} Tage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Wöchentlicher Fortschritt
              </h3>
              <div className="space-y-4">
                {['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'].map((day, index) => {
                  // Berechne echten Fortschritt basierend auf den letzten 4 Wochen
                  const dayKey = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][index];
                  let totalPossible = 0;
                  let totalCompleted = 0;
                  
                  // Gehe durch die letzten 4 Wochen
                  for (let week = 0; week < 4; week++) {
                    const checkDate = new Date();
                    checkDate.setDate(checkDate.getDate() - (week * 7) - index);
                    const dateKey = checkDate.toISOString().split('T')[0];
                    
                    habits.forEach(habit => {
                      if (habit.dailyCompletions && typeof habit.dailyCompletions === 'object') {
                        totalPossible++;
                        if (habit.dailyCompletions[dateKey]) {
                          totalCompleted++;
                        }
                      }
                    });
                  }
                  
                  const progress = totalPossible > 0 
                    ? Math.round((totalCompleted / totalPossible) * 100) 
                    : 0;
                  
                  return (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-20">
                        {day}
                      </span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                        {progress}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Habit Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Habit-Verteilung
              </h3>
              <div className="space-y-4">
                {habits.slice(0, 5).map((habit, index) => {
                  // Berechne echten Prozentsatz basierend auf den letzten 30 Tagen
                  let totalDays = 0;
                  let completedDays = 0;
                  
                  for (let i = 0; i < 30; i++) {
                    const checkDate = new Date();
                    checkDate.setDate(checkDate.getDate() - i);
                    const dateKey = checkDate.toISOString().split('T')[0];
                    
                    if (habit.dailyCompletions && typeof habit.dailyCompletions === 'object') {
                      totalDays++;
                      if (habit.dailyCompletions[dateKey]) {
                        completedDays++;
                      }
                    }
                  }
                  
                  const percentage = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
                  
                  return (
                    <div key={habit._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-purple-500' :
                          index === 3 ? 'bg-orange-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-32">
                          {habit.title}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Most Active Day */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Aktivster Tag
              </h3>
              <div className="text-center">
                <div className="text-4xl mb-2">📅</div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {stats.mostActiveDay}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Du bist an diesem Tag am produktivsten
                </p>
              </div>
            </div>

            {/* Total Completions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Gesamte Vervollständigungen
              </h3>
              <div className="text-center">
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {stats.totalCompletions}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Habits erfolgreich abgeschlossen
                </p>
              </div>
            </div>

            {/* Motivation Quote */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tägliche Motivation
              </h3>
              <div className="text-center">
                <div className="text-4xl mb-2">💪</div>
                {quoteLoading ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                  </div>
                ) : quote ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
                      "{quote.content}"
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      — {quote.author}
                    </p>
                    <button
                      onClick={fetchQuote}
                      className="mt-3 text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                    >
                      🔄 Neuer Spruch
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    "Kleine Schritte führen zu großen Veränderungen. Du machst das großartig!"
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 