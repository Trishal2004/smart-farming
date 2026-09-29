import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Wheat, Trash2, Edit, TrendingUp, Calendar as CalendarIcon, User } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import { harvestService } from '../services/harvestService';
import { farmService } from '../services/farmService';
import { seasonService } from '../services/seasonService';

export default function Harvest() {
  const [harvests, setHarvests] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    loadSeasons();
  }, []);

  useEffect(() => {
    if (selectedSeasonId) {
      loadHarvests(selectedSeasonId);
    } else {
      setHarvests([]);
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

  const loadHarvests = async (seasonId) => {
    setIsLoading(true);
    try {
      const data = await harvestService.getHarvestsBySeasonId(seasonId);
      setHarvests(data);
    } catch (error) {
      setHarvests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    reset({
      harvestDate: new Date().toISOString().split('T')[0],
      quantity: 0,
      sellingPricePerKg: 0,
      buyerName: ''
    });
    setSelectedRecord(null);
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setSelectedRecord(record);
    Object.keys(record).forEach(key => setValue(key, record[key]));
    setIsModalOpen(true);
  };

  const openDeleteModal = (record) => {
    setSelectedRecord(record);
    setIsDeleteOpen(true);
  };

  const onSave = async (data) => {
    setIsSaving(true);
    const payload = {
      harvestDate: data.harvestDate,
      quantity: Number(data.quantity),
      sellingPricePerKg: Number(data.sellingPricePerKg),
      buyerName: data.buyerName
    };

    try {
      if (selectedRecord) {
        await harvestService.updateHarvest(selectedRecord.id, payload);
        toast.success('Harvest record updated!');
      } else {
        await harvestService.addHarvest(selectedSeasonId, payload);
        toast.success('Harvest record added!');
      }
      await loadHarvests(selectedSeasonId);
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to save harvest');
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async () => {
    try {
      await harvestService.deleteHarvest(selectedRecord.id);
      toast.success('Harvest deleted!');
      await loadHarvests(selectedSeasonId);
      setIsDeleteOpen(false);
    } catch (err) {
      toast.error('Failed to delete harvest');
    }
  };

  const totalYield = harvests.reduce((sum, h) => sum + (h.quantity || 0), 0);
  const totalIncome = harvests.reduce((sum, h) => sum + (h.totalIncome || 0), 0);
  const avgPrice = totalYield > 0 ? (totalIncome / totalYield).toFixed(2) : 0;

  const chartData = harvests.map(h => ({
    date: h.harvestDate,
    income: h.totalIncome || 0
  }));

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Harvest & Sales" 
        subtitle="Record crop yield, track sales, and calculate revenue."
        action={
          <Button onClick={openAddModal} icon={Plus} disabled={!selectedSeasonId}>
            Add Harvest Record
          </Button>
        }
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
      ) : harvests.length === 0 ? (
        <EmptyState 
          icon={Wheat}
          title="No harvests recorded"
          description="Start tracking your yield and revenue by adding your first harvest record."
          action={<Button onClick={openAddModal} icon={Plus} variant="outline" disabled={!selectedSeasonId}>Add Record</Button>}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Yield" value={`${totalYield.toLocaleString()} kg`} icon={Wheat} color="amber" />
            <StatCard title="Total Revenue" value={`₹${totalIncome.toLocaleString()}`} icon={TrendingUp} color="green" />
            <StatCard title="Average Price" value={`₹${avgPrice} / kg`} icon={TrendingUp} color="blue" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-full flex flex-col">
                <h3 className="font-semibold text-slate-800 mb-4">Harvest Records</h3>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Date</th>
                        <th className="px-4 py-3">Quantity (kg)</th>
                        <th className="px-4 py-3">Price/kg (₹)</th>
                        <th className="px-4 py-3">Buyer</th>
                        <th className="px-4 py-3 text-right">Income (₹)</th>
                        <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {harvests.map(h => (
                        <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-slate-800">
                            <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-slate-400" />{h.harvestDate}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-700 font-medium">{h.quantity} kg</td>
                          <td className="px-4 py-3 text-slate-700 font-medium">₹{h.sellingPricePerKg}</td>
                          <td className="px-4 py-3 text-slate-600">
                            <div className="flex items-center gap-2"><User className="w-4 h-4 text-slate-400" />{h.buyerName || 'Unknown'}</div>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-green-700">₹{(h.totalIncome || 0).toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => openEditModal(h)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => openDeleteModal(h)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card className="h-full flex flex-col">
                <h3 className="font-semibold text-slate-800 mb-6">Revenue Timeline</h3>
                <div className="flex-1 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(value) => `₹${value / 1000}k`} />
                      <RechartsTooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="income" fill="#16A34A" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedRecord ? 'Edit Harvest Record' : 'Add Harvest Record'} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <Input id="harvestDate" type="date" label="Date" {...register('harvestDate', { required: 'Required' })} error={errors.harvestDate?.message} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input id="quantity" type="number" step="0.1" label="Quantity (kg)" {...register('quantity', { required: 'Required', min: 0.1 })} error={errors.quantity?.message} />
            <Input id="sellingPricePerKg" type="number" step="0.1" label="Selling Price per kg (₹)" {...register('sellingPricePerKg', { required: 'Required', min: 0 })} error={errors.sellingPricePerKg?.message} />
          </div>
          <Input id="buyerName" label="Buyer Name (Optional)" {...register('buyerName')} />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSaving}>{selectedRecord ? 'Update Record' : 'Save Record'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={onDelete} title="Delete Harvest" message="Are you sure you want to delete this record? This affects revenue calculations." confirmText="Delete Record" isDestructive={true} />
    </div>
  );
}
