import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Page } from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
      
      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile Header */}
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        
        {/* Content Area */}
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 