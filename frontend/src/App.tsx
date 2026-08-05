import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/Overview';
import Events from './pages/Events';
import Rules from './pages/Rules';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="events" element={<Events />} />
          <Route path="rules" element={<Rules />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
