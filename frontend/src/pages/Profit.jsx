import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import EmptyState from '../components/common/EmptyState';
import { profitService } from '../services/profitService';
import { farmService } from '../services/farmService';
import { seasonService } from '../services/seasonService';

export default function Profit() {
  const [profitData, setProfitData] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSeasons();
  }, []);

  useEffect(() => {
    if (selectedSeasonId) {
      loadProfitSummary(selectedSeasonId);
    } else {
      setProfitData(null);
    }
  }, [selectedSeasonId]);

  const loadSeasons = async () => {
    try {
      const farmsData = await farmService.getFarms();
      const seasonsData = await seasonService.getAllSeasons(farmsData);
      setSeasons(seasonsData);
      if (seasonsData.length > 0) {
        setSelectedSeasonId(seasonsData[0].id.toString());
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  const loadProfitSummary = async (seasonId) => {
    setIsLoading(true);
    try {
      const data = await profitService.getProfitSummary(seasonId);
      setProfitData(data);
    } catch (error) {
      setProfitData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Profit Analysis" 
        subtitle="View comprehensive financial health and profit margins for your seasons."
      />
      
      <Card className="mb-6 bg-slate-50 border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-center gap-4">
        <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">Select Season:</label>
        <select 
          className="w-full sm:w-64 px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={selectedSeasonId}
          onChange={(e) => setSelectedSeasonId(e.target.value)}
        >
          {seasons.length === 0 && <option value="">No active seasons found</option>}
          {seasons.map(s => (
            <option key={s.id} value={s.id}>{s.season} {s.year} ({s.crop})</option>
          ))}
        </select>
      </Card>

      {isLoading ? (
        <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full"></div></div>
      ) : !profitData ? (
        <EmptyState 
          icon={PieChartIcon}
          title="No profit data available"
          description="Log expenses and harvests for this season to see the profit summary."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Investment" value={`₹${(profitData.totalInvestment || 0).toLocaleString()}`} icon={TrendingDown} color="red" />
            <StatCard title="Total Revenue" value={`₹${(profitData.totalIncome || 0).toLocaleString()}`} icon={TrendingUp} color="green" />
            <StatCard title="Net Profit" value={`₹${(profitData.profit || 0).toLocaleString()}`} icon={DollarSign} color={profitData.profit >= 0 ? "blue" : "red"} />
            <StatCard title="Profit Margin" value={`${(profitData.profitMargin || 0).toFixed(2)}%`} icon={PieChartIcon} color={profitData.profitMargin >= 0 ? "blue" : "red"} />
          </div>

          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-slate-50/50">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Financial Status</h3>
            <p className="text-slate-500 max-w-sm mb-6">Based on backend automated calculations from your expense and harvest ledgers.</p>
            {profitData.profit > 0 ? (
               <div className="px-6 py-4 bg-green-100 text-green-800 rounded-xl font-bold text-lg border border-green-200 shadow-sm flex flex-col items-center">
                  <span>✅ Profitable Season</span>
                  <span className="text-sm font-normal mt-1 text-green-700">Excellent work! You generated a positive return on investment.</span>
               </div>
            ) : profitData.profit < 0 ? (
               <div className="px-6 py-4 bg-red-100 text-red-800 rounded-xl font-bold text-lg border border-red-200 shadow-sm flex flex-col items-center">
                  <span>⚠️ Loss Incurred</span>
                  <span className="text-sm font-normal mt-1 text-red-700">Your expenses exceeded your income for this season.</span>
               </div>
            ) : (
               <div className="px-6 py-4 bg-slate-100 text-slate-800 rounded-xl font-bold text-lg border border-slate-200 shadow-sm flex flex-col items-center">
                  <span>⚖️ Break-Even</span>
                  <span className="text-sm font-normal mt-1 text-slate-600">Your income exactly covered your expenses. Or no data is entered.</span>
               </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
