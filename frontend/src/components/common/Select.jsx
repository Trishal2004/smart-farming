import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({ label, error, options = [], className = '', id, ...props }, ref) => {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>}
      <div className="relative">
        <select
          id={id}
          ref={ref}
          aria-invalid={error ? "true" : "false"}
          className={`w-full appearance-none rounded-xl border bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:border-transparent transition-all duration-200 cursor-pointer
            ${error 
              ? 'border-red-400 focus-visible:ring-red-500 bg-red-50/30' 
              : 'border-slate-300 focus-visible:ring-green-600 hover:border-slate-400'
            }
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
      {error && <p className="text-sm font-medium text-red-600 animate-in fade-in slide-in-from-top-1 duration-200" role="alert">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
