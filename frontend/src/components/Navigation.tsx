import React from 'react';

export type Page = 'dashboard' | 'habits' | 'statistics' | 'settings';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'dashboard' as Page, icon: '📊', label: 'Dashboard' },
    { id: 'habits' as Page, icon: '📋', label: 'Meine Habits' },
    { id: 'statistics' as Page, icon: '📈', label: 'Statistiken' },
    { id: 'settings' as Page, icon: '⚙️', label: 'Einstellungen' },
  ];

  return (
    <nav className="p-4">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation; 