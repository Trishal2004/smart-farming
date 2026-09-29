import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  className = '',
  disabled,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600 shadow-sm hover:shadow-md",
    secondary: "bg-green-50 text-green-700 hover:bg-green-100 focus-visible:ring-green-600",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 shadow-sm hover:shadow-md",
    outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-green-600 hover:border-slate-400",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-500"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />}
      {!isLoading && Icon && <Icon className="w-4 h-4 mr-2" aria-hidden="true" />}
      {children}
    </button>
  );
}
