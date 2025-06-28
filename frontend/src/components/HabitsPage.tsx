import React, { useState, useEffect } from 'react';
import HabitForm from './HabitForm';
import HabitList from './HabitList';
import DailyHabits from './DailyHabits';

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

const HabitsPage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  // Habits laden
  const fetchHabits = async () => {
    try {
      const response = await fetch('http://localhost:5000/habits');
      if (!response.ok) {
        throw new Error('Fehler beim Laden der Habits');
      }
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error('Fehler beim Laden der Habits:', error);
    } finally {
      setLoading(false);
    }
  };

  // Habit Status ändern (für Kompatibilität mit bestehenden Komponenten)
  const toggleHabit = async (habitId: string, completed: boolean) => {
    try {
      const response = await fetch(`http://localhost:5000/habits/${habitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren des Habits');
      }

      // Lokalen State aktualisieren
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit._id === habitId ? { ...habit, completed } : habit
        )
      );
    } catch (error) {
      console.error('Fehler beim Aktualisieren:', error);
    }
  };

  // Tägliche Completion aktualisieren (für Kalender)
  const updateDailyCompletion = async (habitId: string, date: string, completed: boolean) => {
    try {
      const response = await fetch(`http://localhost:5000/habits/${habitId}/daily`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, completed }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren der täglichen Completion');
      }

      const updatedHabit = await response.json();
      
      // Lokalen State aktualisieren
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit._id === habitId ? updatedHabit : habit
        )
      );
    } catch (error) {
      console.error('Fehler beim Aktualisieren der täglichen Completion:', error);
    }
  };

  // Habit hinzufügen (wird von HabitForm aufgerufen)
  const addHabit = (newHabit: Habit) => {
    setHabits(prevHabits => [...prevHabits, newHabit]);
  };

  // Habit löschen
  const deleteHabit = async (habitId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/habits/${habitId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Fehler beim Löschen des Habits');
      }

      setHabits(prevHabits => prevHabits.filter(habit => habit._id !== habitId));
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📋 Meine Habits
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Verwalte und verfolge deine täglichen Gewohnheiten
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Habit Form */}
            <div className="lg:col-span-1">
              <HabitForm onHabitAdded={addHabit} />
            </div>
            
            {/* Daily Habits */}
            <div className="lg:col-span-1">
              <DailyHabits 
                habits={habits}
                onToggleDailyHabit={updateDailyCompletion}
              />
            </div>
          </div>

          {/* Habit List - Full Width */}
          <div className="mt-8">
            <HabitList 
              habits={habits} 
              onToggleHabit={toggleHabit}
              onDeleteHabit={deleteHabit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitsPage; 