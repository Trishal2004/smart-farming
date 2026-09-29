import React, { useState } from 'react';
import { Menu, Bell, CloudSun, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ toggleMobileSidebar }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Basic breadcrumb logic
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    if (!path || path === 'dashboard') return 'Dashboard Overview';
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };

  const notifications = [
    { id: 1, text: "Heavy rainfall expected tomorrow", time: "2 hours ago", type: "warning" },
    { id: 2, text: "Soil report updated", time: "5 hours ago", type: "success" },
    { id: 3, text: "Harvest record added", time: "1 day ago", type: "info" },
    { id: 4, text: "Yield prediction completed", time: "2 days ago", type: "success" },
  ];

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 shadow-sm shrink-0">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-green-600 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={toggleMobileSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <div>
          <h1 className="text-lg font-bold text-slate-900 hidden sm:block">{getPageTitle()}</h1>
          <div className="text-xs font-medium text-slate-500 hidden sm:flex items-center gap-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-green-600 capitalize">{location.pathname.split('/').pop() || 'Dashboard'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Weather Summary (Desktop only) */}
        <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-700 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
          <CloudSun className="w-4 h-4 text-blue-500" />
          <span>28°C, Partly Cloudy</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            className="p-2 text-slate-500 hover:text-green-600 rounded-full hover:bg-slate-100 relative transition-colors"
            onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          {isNotifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-semibold text-slate-800">Notifications</h3>
                  <button className="text-xs text-green-600 hover:text-green-700 font-medium">Mark all read</button>
                </div>
                <div className="max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                  {notifications.map(notif => (
                    <div key={notif.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors">
                      <p className="text-sm font-medium text-slate-800">{notif.text}</p>
                      <span className="text-xs text-slate-400 mt-1 block">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative border-l border-slate-200 pl-3 sm:pl-5">
          <button 
            className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
          >
            <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold border border-green-200">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'RA'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-700 leading-none">{user?.name || 'Ramesh Anna'}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Farmer</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                <Link to="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-green-600 transition-colors">
                  <User className="w-4 h-4" /> My Profile
                </Link>
                <Link to="/dashboard/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-green-600 transition-colors">
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <div className="border-t border-slate-100 my-1"></div>
                <button 
                  onClick={logout}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
