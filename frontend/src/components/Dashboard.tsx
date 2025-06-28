import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
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

const Dashboard = () => {
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

  // Habit Status ändern
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

  // Tägliche Completion aktualisieren (für DailyHabits)
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

  // Habit hinzufügen
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
      {/* Hero Section */}
      <HeroSection />
      
      {/* Main Content */}
      <div className="px-6 py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Willkommen zurück! 👋
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Lass uns heute an deinen Gewohnheiten arbeiten
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Habit Form */}
            <div>
              <HabitForm onHabitAdded={addHabit} />
            </div>
            
            {/* Daily Habits */}
            <div>
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

export default Dashboard; 