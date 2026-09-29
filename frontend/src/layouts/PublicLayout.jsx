import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-green-600 p-1.5 rounded-lg group-hover:bg-green-700 transition-colors">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-green-900 tracking-tight">AgriSmart</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-slate-600 hover:text-green-600 font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
