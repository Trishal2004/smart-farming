import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, Wallet, TrendingUp, CloudSun, CircleDollarSign, 
  ArrowRight, CloudRain, Droplets, Wind, Activity
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

import StatCard from '../components/common/StatCard';
import Card from '../components/common/Card';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';

export default function Dashboard() {
  const { user } = useAuth();

  const expenseData = [
    { name: 'Seeds', value: 5000 },
    { name: 'Fertilizer', value: 8000 },
    { name: 'Labour', value: 6000 },
    { name: 'Irrigation', value: 3000 },
    { name: 'Electricity', value: 1500 },
    { name: 'Transport', value: 2000 },
    { name: 'Pesticides', value: 1500 },
    { name: 'Other', value: 1000 },
  ];
  const COLORS = ['#16A34A', '#059669', '#10B981', '#34D399', '#6EE7B7', '#0284C7', '#38BDF8', '#94A3B8'];

  const monthlyTrend = [
    { month: 'Jun', expenses: 4000 },
    { month: 'Jul', expenses: 12000 },
    { month: 'Aug', expenses: 8000 },
    { month: 'Sep', expenses: 4000 },
  ];

  const yieldData = [
    { name: 'Previous Season', yield: 2800 },
    { name: 'Current (Pred.)', yield: 3200 },
  ];

  const profitData = [
    { name: 'Economics', Investment: 28000, Income: 76800, Profit: 48800 },
  ];

  const recentActivities = [
    { date: '10 July', title: 'Land Preparation', desc: 'Ploughed and leveled Farm 1' },
    { date: '18 July', title: 'Seed Sowing', desc: 'Planted MTU-1010 Rice variety' },
    { date: '25 July', title: 'First Irrigation', desc: 'Completed standard flooding' },
    { date: '30 July', title: 'Applied Fertilizer', desc: 'Urea application completed' },
  ];

  const forecast = [
    { day: 'Mon', temp: '29°', icon: CloudSun },
    { day: 'Tue', temp: '28°', icon: CloudRain },
    { day: 'Wed', temp: '31°', icon: CloudSun },
    { day: 'Thu', temp: '32°', icon: CloudSun },
    { day: 'Fri', temp: '30°', icon: CloudSun },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Good morning, {user?.name?.split(' ')[0] || 'Farmer'} 👋</h1>
          <p className="text-slate-500 mt-1">Here's an overview of your current farming season.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Select 
            options={[
              { value: 'kharif2026', label: 'Kharif 2026' },
              { value: 'rabi2026', label: 'Rabi 2026' }
            ]}
            className="w-full sm:w-48"
          />
          <Select 
            options={[
              { value: 'farm1', label: 'Farm 1' },
              { value: 'farm2', label: 'Farm 2' }
            ]}
            className="w-full sm:w-48"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Current Crop" value="Rice" icon={Sprout} color="green" />
        <StatCard title="Total Investment" value="₹28,000" icon={Wallet} color="amber" />
        <StatCard title="Expected Yield" value="3,200 kg" icon={TrendingUp} color="blue" />
        <StatCard title="Weather" value="30°C" icon={CloudSun} trend="Partly Cloudy" color="blue" />
        <StatCard title="Expected Income" value="₹76,800" icon={CircleDollarSign} color="green" />
        <StatCard title="Profit" value="Pending" icon={Activity} color="amber" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="flex flex-col">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Expense Breakdown</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Monthly Expense Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Line type="monotone" dataKey="expenses" stroke="#16A34A" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="flex flex-col">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Yield Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value}kg`} />
                <Tooltip formatter={(value) => `${value} kg`} />
                <Bar dataKey="yield" fill="#0284C7" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Economics Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
                <Bar dataKey="Investment" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Profit" fill="#16A34A" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Weather & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Weather Card */}
        <Card className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <h3 className="text-lg font-semibold text-slate-800">Weather & Advisory</h3>
            <Badge variant="warning">Heavy rainfall expected tomorrow</Badge>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 border-r-0 md:border-r border-slate-200 md:pr-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                  <CloudSun className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-4xl font-bold text-slate-900">30°C</div>
                  <div className="text-slate-500 font-medium">Partly Cloudy</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-500">Humidity:</span>
                  <span className="font-semibold text-slate-700">72%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CloudRain className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-500">Rainfall:</span>
                  <span className="font-semibold text-slate-700">12 mm</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wind className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-500">Wind:</span>
                  <span className="font-semibold text-slate-700">14 km/h</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-amber-800 text-sm font-medium">
                  <strong>Recommendation:</strong> Avoid irrigation today due to upcoming rainfall.
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h4 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">5-Day Forecast</h4>
              <div className="flex justify-between">
                {forecast.map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium text-slate-600">{day.day}</span>
                    <day.icon className="w-6 h-6 text-slate-400" />
                    <span className="text-sm font-bold text-slate-900">{day.temp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activities */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Recent Activities</h3>
            <button className="text-sm text-green-600 font-medium hover:text-green-700">View All</button>
          </div>
          <div className="space-y-6">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  {index !== recentActivities.length - 1 && (
                    <div className="w-px h-full bg-slate-200 my-1"></div>
                  )}
                </div>
                <div className="pb-1">
                  <p className="text-xs font-semibold text-green-600 mb-1">{activity.date}</p>
                  <p className="text-sm font-bold text-slate-800">{activity.title}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{activity.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
