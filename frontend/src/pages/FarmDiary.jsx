import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, BookOpen, Trash2, Edit, Calendar as CalendarIcon, Filter, MapPin } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';

import { diaryService } from '../services/diaryService';
import { farmService } from '../services/farmService';
import { seasonService } from '../services/seasonService';

const ACTIVITY_TYPES = [
  'LAND_PREPARATION',
  'SEED_SOWING',
  'IRRIGATION',
  'FERTILIZER_APPLICATION',
  'PESTICIDE_SPRAYING',
  'WEEDING',
  'HARVEST_PREPARATION',
  'OTHER'
];

const getTypeColor = (type) => {
  switch (type) {
    case 'SEED_SOWING': return 'success';
    case 'IRRIGATION': return 'blue';
    case 'FERTILIZER_APPLICATION': return 'amber';
    case 'PESTICIDE_SPRAYING': return 'red';
    case 'HARVEST_PREPARATION': return 'purple';
    default: return 'default';
  }
};

const formatType = (type) => {
  return type.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
};

export default function FarmDiary() {
  const [activities, setActivities] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [filterType, setFilterType] = useState('ALL');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    loadSeasons();
  }, []);

  useEffect(() => {
    if (selectedSeasonId) {
      loadActivities(selectedSeasonId);
    } else {
      setActivities([]);
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

  const loadActivities = async (seasonId) => {
    setIsLoading(true);
    try {
      const data = await diaryService.getActivitiesBySeasonId(seasonId);
      // Backend returns 'date', need to sort
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setActivities(data);
    } catch (error) {
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    reset({
      date: new Date().toISOString().split('T')[0],
      activityType: 'LAND_PREPARATION',
      notes: ''
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
      date: data.date,
      activityType: data.activityType,
      notes: data.notes
    };

    try {
      if (selectedRecord) {
        await diaryService.updateActivity(selectedRecord.id, payload);
        toast.success('Activity updated!');
      } else {
        await diaryService.addActivity(selectedSeasonId, payload);
        toast.success('Activity logged!');
      }
      await loadActivities(selectedSeasonId);
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to log activity');
    } finally {
      setIsSaving(false);
    }
  };

  const onDelete = async () => {
    try {
      await diaryService.deleteActivity(selectedRecord.id);
      toast.success('Activity deleted!');
      await loadActivities(selectedSeasonId);
      setIsDeleteOpen(false);
    } catch (err) {
      toast.error('Failed to delete activity');
    }
  };

  const filteredActivities = filterType === 'ALL' 
    ? activities 
    : activities.filter(a => a.activityType === filterType);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Farm Activity Diary" 
        subtitle="Log and track day-to-day farming operations and observations."
        action={
          <Button onClick={openAddModal} icon={Plus} disabled={!selectedSeasonId}>
            Log Activity
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
      ) : activities.length === 0 ? (
        <EmptyState 
          icon={BookOpen}
          title="No activities logged"
          description="Keep track of your daily farm operations by adding your first activity."
          action={<Button onClick={openAddModal} icon={Plus} variant="outline" disabled={!selectedSeasonId}>Log Activity</Button>}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <Filter className="w-4 h-4" /> Filter by Type:
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto hide-scrollbar">
              <button 
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${filterType === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                All Activities
              </button>
              {ACTIVITY_TYPES.map(type => (
                <button 
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${filterType === type ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {formatType(type)}
                </button>
              ))}
            </div>
          </div>

          <div className="relative border-l-2 border-slate-200 ml-4 md:ml-8 space-y-8 pb-8">
            {filteredActivities.length === 0 ? (
              <div className="ml-8 text-slate-500 py-8">No activities found for this filter.</div>
            ) : (
              filteredActivities.map((activity) => (
                <div key={activity.id} className="relative pl-8 md:pl-12">
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white bg-green-500`}></div>
                  
                  <Card className="group hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 group-hover:bg-green-500 transition-colors"></div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                          <CalendarIcon className="w-4 h-4" /> {activity.date}
                        </div>
                        <Badge variant={getTypeColor(activity.activityType)}>
                          {formatType(activity.activityType)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(activity)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => openDeleteModal(activity)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {activity.notes || <span className="text-slate-400 italic">No additional notes provided.</span>}
                    </p>
                  </Card>
                </div>
              ))
            )}
          </div>
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedRecord ? 'Edit Activity' : 'Log New Activity'} maxWidth="max-w-xl">
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <Input id="date" type="date" label="Date" {...register('date', { required: 'Required' })} error={errors.date?.message} />
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Activity Type</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white" {...register('activityType', { required: 'Required' })}>
              {ACTIVITY_TYPES.map(type => (
                <option key={type} value={type}>{formatType(type)}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Notes & Observations</label>
            <textarea 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white min-h-[120px] resize-y" 
              placeholder="E.g. Applied NPK 10:26:26 via broadcasting method..."
              {...register('notes')}
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={isSaving}>{selectedRecord ? 'Update Activity' : 'Save Activity'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={onDelete} title="Delete Activity" message="Are you sure you want to delete this log entry?" confirmText="Delete Activity" isDestructive={true} />
    </div>
  );
}
