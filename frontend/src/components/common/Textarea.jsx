import React, { forwardRef } from 'react';

const Textarea = forwardRef(({ label, error, className = '', id, ...props }, ref) => {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>}
      <textarea
        id={id}
        ref={ref}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow resize-y min-h-[80px]
          ${error 
            ? 'border-red-300 focus:ring-red-500' 
            : 'border-slate-300 focus:ring-green-600 hover:border-slate-400'
          }
        `}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
