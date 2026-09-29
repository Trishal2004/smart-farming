import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Download, FileText, Search, Filter, Sprout, Calendar, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import EmptyState from '../components/common/EmptyState';
import { getHistoricalReports } from '../services/reportService';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('All');
  const [filterSeason, setFilterSeason] = useState('All');
  const [filterCrop, setFilterCrop] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const data = await getHistoricalReports();
      setReports(data);
    } catch (error) {
      toast.error('Failed to load season reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = () => {
    // Structure for future implementation
    toast.success('PDF Export functionality will be available soon.');
  };

  const handleExportExcel = () => {
    // Structure for future implementation
    toast.success('Excel Export functionality will be available soon.');
  };

  // Extract unique filter options
  const years = ['All', ...new Set(reports.map(r => r.year))].sort().reverse();
  const seasons = ['All', ...new Set(reports.map(r => r.season))];
  const crops = ['All', ...new Set(reports.map(r => r.crop))];

  // Apply filters and sort
  const filteredReports = reports.filter(r => {
    const matchesSearch = r.crop.toLowerCase().includes(searchTerm.toLowerCase()) || r.season.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filterYear === 'All' || r.year === filterYear;
    const matchesSeason = filterSeason === 'All' || r.season === filterSeason;
    const matchesCrop = filterCrop === 'All' || r.crop === filterCrop;
    return matchesSearch && matchesYear && matchesSeason && matchesCrop;
  }).sort((a, b) => {
    if (sortBy === 'Newest') return b.year - a.year;
    if (sortBy === 'Oldest') return a.year - b.year;
    if (sortBy === 'Highest Profit') return b.profit - a.profit;
    if (sortBy === 'Lowest Profit') return a.profit - b.profit;
    return 0;
  });

  // Chart Data preparation
  const chartData = filteredReports.map(r => ({
    name: `${r.season} ${r.year}`,
    crop: r.crop,
    Investment: r.investment,
    Income: r.income,
    Profit: r.profit,
    Yield: r.yield
  }));

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Season Reports" 
        subtitle="Analyze historical performance across past farming seasons."
        action={
          <div className="flex gap-2">
            <Button onClick={handleExportExcel} variant="outline" icon={Download}>Excel</Button>
            <Button onClick={handleExportPDF} variant="outline" icon={FileText}>PDF</Button>
          </div>
        }
      />

      {/* Filters Toolbar */}
      <Card className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search crop or season..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          <Select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} options={years.map(y => ({ value: y, label: y === 'All' ? 'All Years' : y }))} />
          <Select value={filterSeason} onChange={(e) => setFilterSeason(e.target.value)} options={seasons.map(s => ({ value: s, label: s === 'All' ? 'All Seasons' : s }))} />
          <Select value={filterCrop} onChange={(e) => setFilterCrop(e.target.value)} options={crops.map(c => ({ value: c, label: c === 'All' ? 'All Crops' : c }))} />
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} options={[
            { value: 'Newest', label: 'Sort: Newest' },
            { value: 'Oldest', label: 'Sort: Oldest' },
            { value: 'Highest Profit', label: 'Sort: High Profit' },
            { value: 'Lowest Profit', label: 'Sort: Low Profit' }
          ]} />
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full"></div></div>
      ) : filteredReports.length === 0 ? (
        <EmptyState 
          icon={Filter}
          title="No reports match filters"
          description="Try adjusting your search or filters to see historical data."
          action={<Button onClick={() => {setSearchTerm(''); setFilterYear('All'); setFilterSeason('All'); setFilterCrop('All');}} variant="outline">Clear Filters</Button>}
        />
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-semibold text-slate-800 mb-6">Financial Overview (Season vs Inv/Inc/Profit)</h3>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="Investment" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="Income" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="Profit" fill="#10b981" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-slate-800 mb-6">Crop vs Yield Trend</h3>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} kg`} labelFormatter={(label, payload) => `${label} (${payload[0]?.payload.crop})`} />
                    <Legend />
                    <Line type="monotone" dataKey="Yield" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Report Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <Card key={report.id} className="relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20 ${report.profit > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        {report.season} {report.year}
                      </h3>
                      <p className="text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                        <Sprout className="w-4 h-4 text-green-600" /> {report.crop}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-slate-500 text-sm">Investment</span>
                      <span className="font-bold text-slate-700">₹{report.investment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-slate-500 text-sm">Gross Income</span>
                      <span className="font-bold text-blue-600">₹{report.income.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-slate-700 font-semibold flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" /> Net Profit
                      </span>
                      <span className={`text-xl font-black ${report.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {report.profit >= 0 ? '+' : ''}₹{report.profit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
