import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Farms from './pages/Farms';
import Seasons from './pages/Seasons';
import SoilReport from './pages/SoilReport';
import CropRecommendation from './pages/CropRecommendation';
import Expenses from './pages/Expenses';
import FarmDiary from './pages/FarmDiary';
import Weather from './pages/Weather';
import YieldPrediction from './pages/YieldPrediction';
import Harvest from './pages/Harvest';
import Profit from './pages/Profit';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Mock component for Dashboard pages
const DashboardPlaceholder = ({ title }) => (
  <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm text-center py-20 animate-in fade-in duration-200">
    <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
    <p className="text-slate-500">This module is currently under construction.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="top-right" 
          toastOptions={{
            className: 'text-sm font-medium text-slate-900 rounded-xl shadow-sm border border-slate-100',
            success: {
              iconTheme: {
                primary: '#16A34A',
                secondary: '#fff',
              },
            },
          }} 
        />
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            
            <Route element={<PublicRoute />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Route>

          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="farms" element={<Farms />} />
              <Route path="seasons" element={<Seasons />} />
              <Route path="soil" element={<SoilReport />} />
              <Route path="recommendation" element={<CropRecommendation />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="diary" element={<FarmDiary />} />
              <Route path="weather" element={<Weather />} />
              <Route path="yield" element={<YieldPrediction />} />
              <Route path="harvest" element={<Harvest />} />
              <Route path="profit" element={<Profit />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help" element={<DashboardPlaceholder title="Help & Support" />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
