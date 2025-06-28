import React from 'react';
import Layout from './Layout';
import Dashboard from './Dashboard';

const HabitApp = () => {
  return (
    <Layout currentPage={'habits'} onPageChange={() => {}}>
      <Dashboard />
    </Layout>
  );
};

export default HabitApp;
