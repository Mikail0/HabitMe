import React, { useState } from 'react';
import ReminderSettings from './ReminderSettings';
import DeleteConfirmation from './DeleteConfirmation';

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
}

interface HabitListProps {
  habits: Habit[];
  onToggleHabit: (habitId: string, completed: boolean) => Promise<void>;
  onDeleteHabit: (habitId: string) => Promise<void>;
}

const HabitList: React.FC<HabitListProps> = ({ habits, onToggleHabit, onDeleteHabit }) => {
  const [reminderModal, setReminderModal] = useState<{
    isOpen: boolean;
    habitId: string;
    reminder: Reminder;
  } | null>(null);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    habitId: string;
    habitTitle: string;
  } | null>(null);

  // Erinnerung aktualisieren
  const updateReminder = (reminder: Reminder) => {
    // This will be handled by the parent component
    console.log('Reminder updated:', reminder);
  };

  // Erinnerung öffnen
  const openReminderSettings = (habit: Habit) => {
    setReminderModal({
      isOpen: true,
      habitId: habit._id,
      reminder: habit.reminder || { enabled: false, time: "09:00", days: [] }
    });
  };

  // Erinnerung schließen
  const closeReminderSettings = () => {
    setReminderModal(null);
  };

  // Lösch-Bestätigung öffnen
  const openDeleteConfirmation = (habit: Habit) => {
    setDeleteModal({
      isOpen: true,
      habitId: habit._id,
      habitTitle: habit.title
    });
  };

  // Lösch-Bestätigung schließen
  const closeDeleteConfirmation = () => {
    setDeleteModal(null);
  };

  // Habit löschen bestätigen
  const confirmDelete = async () => {
    if (deleteModal) {
      await onDeleteHabit(deleteModal.habitId);
      closeDeleteConfirmation();
    }
  };

  // Erinnerungs-Text formatieren
  const formatReminderText = (reminder: Reminder) => {
    if (!reminder.enabled) return null;
    
    const dayNames = {
      monday: 'Mo', tuesday: 'Di', wednesday: 'Mi', thursday: 'Do',
      friday: 'Fr', saturday: 'Sa', sunday: 'So'
    };
    
    const selectedDays = reminder.days.map(day => dayNames[day as keyof typeof dayNames]).join(', ');
    return `${reminder.time} (${selectedDays})`;
  };

  if (habits.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          📋 Meine Habits
        </h2>
        <div className="text-center p-8">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Keine Habits vorhanden</h3>
          <p className="text-gray-500 dark:text-gray-400">Erstelle deinen ersten Habit, um loszulegen!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        📋 Meine Habits
      </h2>
      
      <div className="space-y-4">
        {habits.map((habit) => (
          <div
            key={habit._id}
            className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200 ${
              habit.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                  habit.completed 
                    ? 'text-gray-500 dark:text-gray-400 line-through' 
                    : 'text-gray-800 dark:text-white'
                }`}>
                  {habit.title}
                </h3>
                
                {/* Erinnerungs-Info */}
                {habit.reminder && habit.reminder.enabled && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>⏰</span>
                    <span>{formatReminderText(habit.reminder)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Erinnerung-Button */}
                <button
                  onClick={() => openReminderSettings(habit)}
                  className={`p-2 rounded-lg transition-colors ${
                    habit.reminder?.enabled
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                  title="Erinnerung einstellen"
                >
                  ⏰
                </button>

                {/* Löschen-Button */}
                <button
                  onClick={() => openDeleteConfirmation(habit)}
                  className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  title="Habit löschen"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reminder Settings Modal */}
      {reminderModal && (
        <ReminderSettings
          habitId={reminderModal.habitId}
          reminder={reminderModal.reminder}
          onUpdate={updateReminder}
          isOpen={reminderModal.isOpen}
          onClose={closeReminderSettings}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <DeleteConfirmation
          isOpen={deleteModal.isOpen}
          habitTitle={deleteModal.habitTitle}
          onConfirm={confirmDelete}
          onCancel={closeDeleteConfirmation}
        />
      )}
    </div>
  );
};

export default HabitList;
