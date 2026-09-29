import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Clock, Trash2, Edit, Eye, CalendarRange, Sprout } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';

import { seasonService } from '../services/seasonService';
import { farmService } from '../services/farmService';

export default function Seasons() {
  const [seasons, setSeasons] = useState([]);
  const [farms, setFarms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const farmsData = await farmService.getFarms();
      setFarms(farmsData);
      
      if (farmsData.length > 0) {
        const seasonsData = await seasonService.getAllSeasons(farmsData);
        setSeasons(seasonsData);
      } else {
        setSeasons([]);
      }
    } catch (error) {
       // handled by interceptor
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    if (farms.length === 0) {
      toast.error('You must add a farm first before creating a season.');
      return;
    }
    reset({ status: 'Active', season: 'Kharif', year: new Date().getFullYear().toString(), farmId: farms[0].id });
    setSelectedSeason(null);
    setIsModalOpen(true);
  };

  const openEditModal = (season) => {
    setSelectedSeason(season);
    setValue('farmId', season.farmId);
    setValue('season', season.season);
    setValue('year', season.year);
    setValue('crop', season.crop);
    setValue('startDate', season.startDate);
    setValue('endDate', season.endDate);
    setValue('status', season.status);
    setIsModalOpen(true);
  };

  const openDeleteModal = (season) => {
    setSelectedSeason(season);
    setIsDeleteOpen(true);
  };

  const onSave = async (data) => {
    try {
      if (selectedSeason) {
        await seasonService.updateSeason(selectedSeason.id, data);
        toast.success('Season updated successfully!');
      } else {
        await seasonService.createSeason(data.farmId, data);
        toast.success('Season created successfully!');
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
       // handled
    }
  };

  const onDelete = async () => {
    try {
      await seasonService.deleteSeason(selectedSeason.id);
      toast.success('Season deleted successfully!');
      setIsDeleteOpen(false);
      loadData();
    } catch (error) {
      // handled
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Farming Seasons" 
        subtitle="Manage your crop cycles and seasonal planning."
        action={
          <Button onClick={openAddModal} icon={Plus}>
            Create New Season
          </Button>
        }
      />

      {isLoading ? (
        <div className="p-8 text-center text-slate-500 animate-pulse">Loading seasons...</div>
      ) : seasons.length === 0 ? (
        <EmptyState 
          icon={CalendarRange}
          title="No seasons planned yet"
          description={farms.length === 0 ? "You need to add a farm first." : "Create your first farming season to start tracking your crops."}
          action={<Button onClick={openAddModal} icon={Plus} variant="outline">Create Season</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {seasons.map(season => (
            <Card key={season.id} className="flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{season.season} {season.year}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                    <Sprout className="w-3.5 h-3.5" />
                    {season.crop} • {season.farmName}
                  </p>
                </div>
                <Badge variant={season.status === 'Active' ? 'success' : 'default'}>
                  {season.status}
                </Badge>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-lg mb-4 text-sm border border-slate-100 flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-slate-400" />
                Duration: <span className="font-semibold text-slate-900">{season.startDate} to {season.endDate || 'TBD'}</span>
              </div>

              <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-slate-100">
                <Button variant="ghost" size="sm" icon={Eye} className="text-blue-600 hover:bg-blue-50">View</Button>
                <Button variant="ghost" size="sm" icon={Edit} onClick={() => openEditModal(season)}>Edit</Button>
                <Button variant="ghost" size="sm" icon={Trash2} className="text-red-600 hover:bg-red-50" onClick={() => openDeleteModal(season)}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedSeason ? 'Edit Season' : 'Create New Season'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Season Name</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white" {...register('season', { required: 'Required' })}>
                <option value="Kharif">Kharif</option>
                <option value="Rabi">Rabi</option>
                <option value="Zaid">Zaid</option>
              </select>
            </div>
            <Input id="year" type="number" label="Year" {...register('year', { required: 'Required' })} error={errors.year?.message} />
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Farm</label>
              <select 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white" 
                {...register('farmId', { required: 'Required' })}
                disabled={!!selectedSeason}
              >
                {farms.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <Input id="crop" label="Crop" {...register('crop', { required: 'Required' })} error={errors.crop?.message} />
            <Input id="startDate" type="date" label="Start Date" {...register('startDate', { required: 'Required' })} error={errors.startDate?.message} />
            <Input id="endDate" type="date" label="End Date" {...register('endDate')} error={errors.endDate?.message} />
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Status</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white" {...register('status', { required: 'Required' })}>
                <option value="Planned">Planned</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{selectedSeason ? 'Update Season' : 'Save Season'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={onDelete}
        title="Delete Season"
        message={`Are you sure you want to delete this season? This action cannot be undone.`}
        confirmText="Delete Season"
        isDestructive={true}
      />
    </div>
  );
}
