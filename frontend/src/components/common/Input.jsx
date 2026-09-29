import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, error, icon: Icon, className = '', id, ...props }, ref) => {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
        <input
          id={id}
          ref={ref}
          aria-invalid={error ? "true" : "false"}
          className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:border-transparent transition-all duration-200
            ${Icon ? 'pl-10' : ''}
            ${error 
              ? 'border-red-400 focus-visible:ring-red-500 bg-red-50/30' 
              : 'border-slate-300 focus-visible:ring-green-600 hover:border-slate-400'
            }
          `}
          {...props}
        />
      </div>
      {error && <p className="text-sm font-medium text-red-600 animate-in fade-in slide-in-from-top-1 duration-200" role="alert">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
