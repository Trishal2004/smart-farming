import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, UserCircle, Map, CalendarRange, 
  FlaskConical, Sprout, Wallet, Book, 
  CloudRain, TrendingUp, Tractor, CircleDollarSign, 
  FileBarChart, Settings, HelpCircle, LogOut,
  ChevronLeft, ChevronRight, X
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/dashboard/profile', label: 'Farmer Profile', icon: UserCircle },
  { path: '/dashboard/farms', label: 'My Farms', icon: Map },
  { path: '/dashboard/seasons', label: 'Farming Seasons', icon: CalendarRange },
  { path: '/dashboard/soil', label: 'Soil Reports', icon: FlaskConical },
  { path: '/dashboard/recommendation', label: 'Crop Recommendation', icon: Sprout },
  { path: '/dashboard/expenses', label: 'Expense Tracking', icon: Wallet },
  { path: '/dashboard/diary', label: 'Farm Activity Diary', icon: Book },
  { path: '/dashboard/weather', label: 'Weather Advisory', icon: CloudRain },
  { path: '/dashboard/yield', label: 'Yield Prediction', icon: TrendingUp },
  { path: '/dashboard/harvest', label: 'Harvest Details', icon: Tractor },
  { path: '/dashboard/profit', label: 'Profit Analysis', icon: CircleDollarSign },
  { path: '/dashboard/reports', label: 'Season Reports', icon: FileBarChart },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isMobileOpen, setIsMobileOpen, isCollapsed, setIsCollapsed }) {
  const { logout } = useAuth();
  const sidebarClasses = `bg-green-900 text-white flex flex-col transition-all duration-300 ease-in-out fixed inset-y-0 left-0 z-40 lg:static
    ${isCollapsed ? 'lg:w-20' : 'lg:w-72'} 
    ${isMobileOpen ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0'}`;

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between p-4 border-b border-green-800 h-16 shrink-0">
          <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'lg:hidden' : ''}`}>
            <span className="text-2xl">🌱</span>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight whitespace-nowrap">AgriSmart</span>
              <span className="text-[10px] text-green-300 font-medium tracking-wider uppercase">AI Smart Farming</span>
            </div>
          </div>
          {isCollapsed && (
             <div className="hidden lg:flex w-full justify-center">
               <span className="text-2xl">🌱</span>
             </div>
          )}
          
          <button 
            className="lg:hidden p-1 text-green-300 hover:text-white rounded-md hover:bg-green-800 transition-colors"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-thin scrollbar-thumb-green-700">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group
                  ${isActive 
                    ? 'bg-green-800 text-white shadow-sm' 
                    : 'text-green-100 hover:bg-green-800/50 hover:text-white'
                  }
                  ${isCollapsed ? 'lg:justify-center' : ''}
                `}
                title={isCollapsed ? item.label : undefined}
                end={item.path === '/dashboard'}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0`} />
                <span className={`whitespace-nowrap font-medium text-sm ${isCollapsed ? 'lg:hidden' : ''}`}>
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-3 border-t border-green-800 space-y-1 shrink-0">
          <NavLink
            to="/dashboard/help"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-green-100 hover:bg-green-800/50 transition-colors group ${isCollapsed ? 'lg:justify-center' : ''}`}
            title={isCollapsed ? 'Help & Support' : undefined}
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            <span className={`whitespace-nowrap font-medium text-sm ${isCollapsed ? 'lg:hidden' : ''}`}>Help & Support</span>
          </NavLink>
          <button
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-green-100 hover:bg-red-500/20 hover:text-red-300 transition-colors group ${isCollapsed ? 'lg:justify-center' : ''}`}
            title={isCollapsed ? 'Logout' : undefined}
            onClick={logout}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`whitespace-nowrap font-medium text-sm ${isCollapsed ? 'lg:hidden' : ''}`}>Logout</span>
          </button>
        </div>

        {/* Desktop Collapse Toggle */}
        <div className="hidden lg:flex items-center justify-end p-2 border-t border-green-800 bg-green-950/30 shrink-0">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-green-400 hover:bg-green-800 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </aside>
    </>
  );
}
