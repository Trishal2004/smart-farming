import React, { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Wallet, Trash2, Edit, Calculator, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import StatCard from '../components/common/StatCard';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import { expenseService } from '../services/expenseService';
import { farmService } from '../services/farmService';
import { seasonService } from '../services/seasonService';

const COLORS = ['#16A34A', '#059669', '#10B981', '#34D399', '#6EE7B7', '#0284C7', '#38BDF8', '#94A3B8'];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm();
  const formValues = useWatch({ control });
  
  const calculateTotal = (data) => {
    const fields = ['seedCost', 'fertilizerCost', 'labourCost', 'irrigationCost', 'electricityCost', 'transportCost', 'pesticideCost', 'otherCost'];
    return fields.reduce((sum, field) => sum + (parseFloat(data?.[field]) || 0), 0);
  };

  const currentTotal = calculateTotal(formValues);

  useEffect(() => {
    loadSeasons();
  }, []);

  useEffect(() => {
    if (selectedSeasonId) {
      loadExpenses(selectedSeasonId);
    } else {
      setExpenses([]);
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

  const loadExpenses = async (seasonId) => {
    setIsLoading(true);
    try {
      const data = await expenseService.getExpensesBySeasonId(seasonId);
      setExpenses(data);
    } catch (error) {
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    reset({
      expenseDate: new Date().toISOString().split('T')[0],
      seedCost: 0, fertilizerCost: 0, labourCost: 0, irrigationCost: 0, electricityCost: 0, transportCost: 0, pesticideCost: 0, otherCost: 0
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
      expenseDate: data.expenseDate,
      seedCost: Number(data.seedCost),
      fertilizerCost: Number(data.fertilizerCost),
      labourCost: Number(data.labourCost),
      irrigationCost: Number(data.irrigationCost),
      electricityCost: Number(data.electricityCost),
      transportCost: Number(data.transportCost),
      pesticideCost: Number(data.pesticideCost),
      otherCost: Number(data.otherCost)
    };

    try {
      if (selectedRecord) {
        await expenseService.updateExpense(selectedRecord.id, payload);
        toast.success('Expense record updated!');
      } else {
        await expenseService.addExpense(selectedSeasonId, payload);
        toast.success('Expense record added!');
      }
      await loadExpenses(selectedSeasonId);
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to save expense');
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async () => {
    try {
      await expenseService.deleteExpense(selectedRecord.id);
      toast.success('Expense deleted!');
      await loadExpenses(selectedSeasonId);
      setIsDeleteOpen(false);
    } catch (err) {
      toast.error('Failed to delete expense');
    }
  };

  const grandTotal = expenses.reduce((sum, exp) => sum + (exp.totalInvestment || 0), 0);
  
  const aggregatedBreakdown = [
    { name: 'Seeds', value: expenses.reduce((sum, e) => sum + (e.seedCost || 0), 0) },
    { name: 'Fertilizer', value: expenses.reduce((sum, e) => sum + (e.fertilizerCost || 0), 0) },
    { name: 'Labour', value: expenses.reduce((sum, e) => sum + (e.labourCost || 0), 0) },
    { name: 'Irrigation', value: expenses.reduce((sum, e) => sum + (e.irrigationCost || 0), 0) },
    { name: 'Electricity', value: expenses.reduce((sum, e) => sum + (e.electricityCost || 0), 0) },
    { name: 'Transport', value: expenses.reduce((sum, e) => sum + (e.transportCost || 0), 0) },
    { name: 'Pesticides', value: expenses.reduce((sum, e) => sum + (e.pesticideCost || 0), 0) },
    { name: 'Other', value: expenses.reduce((sum, e) => sum + (e.otherCost || 0), 0) }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Expense Tracking" 
        subtitle="Manage and analyze your farm investments and operational costs."
        action={
          <Button onClick={openAddModal} icon={Plus} disabled={!selectedSeasonId}>
            Add Expense Record
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
      ) : expenses.length === 0 ? (
        <EmptyState 
          icon={Wallet}
          title="No expenses recorded"
          description="Start tracking your farm investments by adding your first expense record for this season."
          action={<Button onClick={openAddModal} icon={Plus} variant="outline" disabled={!selectedSeasonId}>Add Expense</Button>}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 flex flex-col gap-6">
              <StatCard 
                title="Total Investment" 
                value={`₹${grandTotal.toLocaleString()}`} 
                icon={Wallet} 
                color="green" 
              />
              <Card className="flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <PieChartIcon className="w-5 h-5 text-slate-500" />
                  <h3 className="font-semibold text-slate-800">Expense Breakdown</h3>
                </div>
                <div className="flex-1 min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={aggregatedBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                        {aggregatedBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card className="h-full flex flex-col">
                <h3 className="font-semibold text-slate-800 mb-4">Recent Records</h3>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Date</th>
                        <th className="px-4 py-3 text-right">Total (₹)</th>
                        <th className="px-4 py-3 text-right rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {expenses.map(exp => (
                        <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-slate-800">{exp.expenseDate}</td>
                          <td className="px-4 py-3 text-right font-semibold text-slate-900">{(exp.totalInvestment || 0).toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => openEditModal(exp)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => openDeleteModal(exp)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedRecord ? 'Edit Expense' : 'Add Expense Record'} maxWidth="max-w-3xl">
        <form onSubmit={handleSubmit(onSave)} className="space-y-6">
          <Input id="expenseDate" type="date" label="Date" {...register('expenseDate', { required: 'Required' })} error={errors.expenseDate?.message} />
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Cost Breakdown (₹)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <Input id="seedCost" type="number" step="0.01" label="Seeds" {...register('seedCost', { min: 0 })} />
              <Input id="fertilizerCost" type="number" step="0.01" label="Fertilizer" {...register('fertilizerCost', { min: 0 })} />
              <Input id="labourCost" type="number" step="0.01" label="Labour" {...register('labourCost', { min: 0 })} />
              <Input id="irrigationCost" type="number" step="0.01" label="Irrigation" {...register('irrigationCost', { min: 0 })} />
              <Input id="electricityCost" type="number" step="0.01" label="Electricity" {...register('electricityCost', { min: 0 })} />
              <Input id="transportCost" type="number" step="0.01" label="Transport" {...register('transportCost', { min: 0 })} />
              <Input id="pesticideCost" type="number" step="0.01" label="Pesticides" {...register('pesticideCost', { min: 0 })} />
              <Input id="otherCost" type="number" step="0.01" label="Other" {...register('otherCost', { min: 0 })} />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-green-700" />
              <span className="font-semibold text-green-800">Total Investment (Local Calc)</span>
            </div>
            <span className="text-2xl font-bold text-green-700">₹{currentTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSaving}>{selectedRecord ? 'Update Record' : 'Save Record'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={onDelete} title="Delete Expense" message="Are you sure you want to delete this expense record?" confirmText="Delete Expense" isDestructive={true} />
    </div>
  );
}
