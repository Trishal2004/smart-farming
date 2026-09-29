import React from 'react';

export default function Card({ children, className = '', noPadding = false, ...props }) {
  return (
    <div 
      className={`bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden hover:shadow-md transition-all duration-300 ${noPadding ? '' : 'p-6'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
