import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import HabitsPage from './components/HabitsPage';
import Statistics from './components/Statistics';
import SettingsPage from './components/SettingsPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { Page } from './components/Navigation';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'habits':
        return <HabitsPage />;
      case 'statistics':
        return <Statistics />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </Layout>
    </ThemeProvider>
  );
}

export default App;




