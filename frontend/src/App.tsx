import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/Overview';
import Events from './pages/Events';
import Rules from './pages/Rules';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="events" element={<Events />} />
          <Route path="rules" element={<Rules />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
