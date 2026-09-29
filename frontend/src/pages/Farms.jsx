import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Map, Trash2, Edit, Eye, MapPin, Maximize, Target } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import { farmService } from '../services/farmService';

export default function Farms() {
  const [farms, setFarms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const loadFarms = async () => {
    setIsLoading(true);
    try {
      const data = await farmService.getFarms();
      setFarms(data);
    } catch (error) {
      // errors handled by interceptor
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  const openAddModal = () => {
    reset();
    setSelectedFarm(null);
    setIsModalOpen(true);
  };

  const parseLocation = (location) => {
    if (!location) return { village: '', district: '', state: '' };
    const parts = location.split(',').map(s => s.trim());
    return {
      village: parts[0] || '',
      district: parts[1] || '',
      state: parts[2] || ''
    };
  };

  const openEditModal = (farm) => {
    setSelectedFarm(farm);
    const loc = parseLocation(farm.location);
    setValue('name', farm.name);
    setValue('area', farm.areaSizeHectares ? (farm.areaSizeHectares / 0.404686).toFixed(2) : '');
    setValue('village', loc.village);
    setValue('district', loc.district);
    setValue('state', loc.state);
    setValue('soil', farm.primarySoilType);
    setIsModalOpen(true);
  };

  const openDeleteModal = (farm) => {
    setSelectedFarm(farm);
    setIsDeleteOpen(true);
  };

  const onSave = async (data) => {
    try {
      const location = [data.village, data.district, data.state].filter(Boolean).join(', ');
      const areaHectares = parseFloat(data.area) * 0.404686;
      
      const payload = {
        name: data.name,
        location: location,
        areaSizeHectares: areaHectares,
        primarySoilType: data.soil
      };

      if (selectedFarm) {
        await farmService.updateFarm(selectedFarm.id, payload);
        toast.success('Farm updated successfully!');
      } else {
        await farmService.createFarm(payload);
        toast.success('Farm added successfully!');
      }
      setIsModalOpen(false);
      loadFarms();
    } catch (error) {
       // handled by interceptor
    }
  };

  const onDelete = async () => {
    try {
      await farmService.deleteFarm(selectedFarm.id);
      toast.success('Farm deleted successfully!');
      setIsDeleteOpen(false);
      loadFarms();
    } catch (error) {
      // handled
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Farms" 
        subtitle="Manage your agricultural land parcels and their details."
        action={
          <Button onClick={openAddModal} icon={Plus}>
            Add New Farm
          </Button>
        }
      />

      {isLoading ? (
        <div className="p-8 text-center text-slate-500 animate-pulse">Loading farms...</div>
      ) : farms.length === 0 ? (
        <EmptyState 
          icon={Map}
          title="No farms added yet"
          description="Add your first farm to start managing your agricultural activities."
          action={<Button onClick={openAddModal} icon={Plus} variant="outline">Add Farm</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map(farm => {
            const loc = parseLocation(farm.location);
            return (
              <Card key={farm.id} className="flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{farm.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {loc.village}, {loc.district}
                    </p>
                  </div>
                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                    {farm.areaSizeHectares ? (farm.areaSizeHectares / 0.404686).toFixed(1) : 0} Acres
                  </div>
                </div>
                
                <div className="bg-slate-50 p-3 rounded-lg mb-4 text-sm border border-slate-100 flex items-center gap-2 text-slate-700">
                  <Target className="w-4 h-4 text-amber-600" />
                  Soil Type: <span className="font-semibold text-slate-900">{farm.primarySoilType || 'Not specified'}</span>
                </div>

                <div className="flex justify-end gap-2 mt-auto pt-4 border-t border-slate-100">
                  <Button variant="ghost" size="sm" icon={Eye} className="text-blue-600 hover:bg-blue-50">View</Button>
                  <Button variant="ghost" size="sm" icon={Edit} onClick={() => openEditModal(farm)}>Edit</Button>
                  <Button variant="ghost" size="sm" icon={Trash2} className="text-red-600 hover:bg-red-50" onClick={() => openDeleteModal(farm)}>Delete</Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedFarm ? 'Edit Farm' : 'Add New Farm'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input id="name" label="Farm Name" {...register('name', { required: 'Name is required' })} error={errors.name?.message} />
            <Input id="area" type="number" step="0.1" label="Land Area (Acres)" icon={Maximize} {...register('area', { required: 'Area is required' })} error={errors.area?.message} />
            <Input id="village" label="Village" {...register('village', { required: 'Village is required' })} error={errors.village?.message} />
            <Input id="district" label="District" {...register('district', { required: 'District is required' })} error={errors.district?.message} />
            <Input id="state" label="State" {...register('state', { required: 'State is required' })} error={errors.state?.message} />
            <Input id="soil" label="Soil Type" {...register('soil', { required: 'Soil type is required' })} error={errors.soil?.message} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{selectedFarm ? 'Update Farm' : 'Save Farm'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={onDelete}
        title="Delete Farm"
        message={`Are you sure you want to delete ${selectedFarm?.name}? This action cannot be undone and will permanently remove all associated data.`}
        confirmText="Delete Farm"
        isDestructive={true}
      />
    </div>
  );
}
