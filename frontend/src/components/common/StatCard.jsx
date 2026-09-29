import React from 'react';
import Card from './Card';

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendLabel, 
  color = 'green' 
}) {
  const colorStyles = {
    green: 'text-green-600 bg-green-50',
    blue: 'text-blue-600 bg-blue-50',
    amber: 'text-amber-600 bg-amber-50',
    red: 'text-red-600 bg-red-50',
  };
  
  const selectedColor = colorStyles[color] || colorStyles.green;

  return (
    <Card className="flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        {Icon && (
          <div className={`p-2 rounded-lg ${selectedColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-auto">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {(trend || trendLabel) && (
          <div className="flex items-center mt-1 text-sm">
            {trend && (
              <span className={`font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {trend}
              </span>
            )}
            {trendLabel && (
              <span className="text-slate-500 ml-2">{trendLabel}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
