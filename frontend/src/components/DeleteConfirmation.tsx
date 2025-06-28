import React from 'react';

interface DeleteConfirmationProps {
  isOpen: boolean;
  habitTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  habitTitle,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mr-3">
            <span className="text-red-600 dark:text-red-400 text-xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Habit löschen
          </h3>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Möchtest du den Habit <strong className="text-gray-900 dark:text-white">"{habitTitle}"</strong> wirklich löschen?
        </p>
        
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
          Diese Aktion kann nicht rückgängig gemacht werden.
        </p>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Löschen
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation; 