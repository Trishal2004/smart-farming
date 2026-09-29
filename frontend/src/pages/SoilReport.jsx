import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FlaskConical, Thermometer, Droplets, CloudRain, Save } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { soilReportService } from '../services/soilReportService';
import { farmService } from '../services/farmService';
import { seasonService } from '../services/seasonService';

export default function SoilReport() {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      n: 45,
      p: 20,
      k: 30,
      ph: 6.5,
      temp: 28,
      humidity: 65,
      rainfall: 120
    }
  });

  const watchN = watch('n');
  const watchP = watch('p');
  const watchK = watch('k');
  const watchPH = watch('ph');

  useEffect(() => {
    loadSeasons();
  }, []);

  const loadSeasons = async () => {
    try {
      const farmsData = await farmService.getFarms();
      const seasonsData = await seasonService.getAllSeasons(farmsData);
      setSeasons(seasonsData);
      if (seasonsData.length > 0) {
        setSelectedSeasonId(seasonsData[0].id.toString());
      }
    } catch (err) {}
  };

  const onSubmit = async (data) => {
    if (!selectedSeasonId) {
      toast.error('Please select a season first.');
      return;
    }
    setIsSaving(true);
    
    const payload = {
      nitrogen: Number(data.n),
      phosphorus: Number(data.p),
      potassium: Number(data.k),
      phLevel: Number(data.ph),
      temperature: Number(data.temp),
      humidity: Number(data.humidity),
      rainfall: Number(data.rainfall)
    };

    try {
      await soilReportService.createSoilReport(selectedSeasonId, payload);
      toast.success('Soil report saved successfully!');
    } catch (error) {
      toast.error('Failed to save soil report.');
    } finally {
      setIsSaving(false);
    }
  };

  const getIndicatorColor = (value, type) => {
    const val = parseFloat(value) || 0;
    if (type === 'ph') {
      if (val < 5.5 || val > 8.5) return 'bg-red-500';
      if (val < 6.0 || val > 7.5) return 'bg-amber-500';
      return 'bg-green-500';
    }
    if (val < 20) return 'bg-amber-500';
    if (val > 100) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const VisualIndicator = ({ label, value, type, max = 140 }) => {
    let percentage = type === 'ph' ? (parseFloat(value) / 14) * 100 : (parseFloat(value) / max) * 100;
    if (percentage > 100) percentage = 100;
    
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-slate-700">{label}</span>
          <span className="text-slate-900 font-bold">{value || 0}</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getIndicatorColor(value, type)}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Soil & Climate Report" 
        subtitle="Record and analyze your soil health and environmental conditions."
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                <FlaskConical className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-slate-800">Soil Nutrients</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id="n"
                  type="number"
                  step="0.1"
                  label="Nitrogen (N) mg/kg"
                  {...register('n', { required: 'Required', min: { value: 0, message: 'Cannot be negative' } })}
                  error={errors.n?.message}
                />
                <Input
                  id="p"
                  type="number"
                  step="0.1"
                  label="Phosphorus (P) mg/kg"
                  {...register('p', { required: 'Required', min: { value: 0, message: 'Cannot be negative' } })}
                  error={errors.p?.message}
                />
                <Input
                  id="k"
                  type="number"
                  step="0.1"
                  label="Potassium (K) mg/kg"
                  {...register('k', { required: 'Required', min: { value: 0, message: 'Cannot be negative' } })}
                  error={errors.k?.message}
                />
                <Input
                  id="ph"
                  type="number"
                  step="0.1"
                  label="Soil pH"
                  {...register('ph', { 
                    required: 'Required', 
                    min: { value: 0, message: 'Invalid pH' },
                    max: { value: 14, message: 'Invalid pH' }
                  })}
                  error={errors.ph?.message}
                />
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                <Thermometer className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-slate-800">Climate Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  id="temp"
                  type="number"
                  step="0.1"
                  label="Temperature (°C)"
                  icon={Thermometer}
                  {...register('temp', { required: 'Required' })}
                  error={errors.temp?.message}
                />
                <Input
                  id="humidity"
                  type="number"
                  step="0.1"
                  label="Humidity (%)"
                  icon={Droplets}
                  {...register('humidity', { 
                    required: 'Required',
                    min: { value: 0, message: 'Min 0' },
                    max: { value: 100, message: 'Max 100' }
                  })}
                  error={errors.humidity?.message}
                />
                <Input
                  id="rainfall"
                  type="number"
                  step="0.1"
                  label="Rainfall (mm)"
                  icon={CloudRain}
                  {...register('rainfall', { required: 'Required', min: { value: 0, message: 'Cannot be negative' } })}
                  error={errors.rainfall?.message}
                />
              </div>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" isLoading={isSaving} icon={Save} size="lg" disabled={!selectedSeasonId}>
                Save Soil Report
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Health Indicators</h3>
              
              <div className="space-y-6">
                <VisualIndicator label="Nitrogen (N)" value={watchN} type="n" />
                <VisualIndicator label="Phosphorus (P)" value={watchP} type="p" />
                <VisualIndicator label="Potassium (K)" value={watchK} type="k" />
                
                <div className="pt-4 border-t border-slate-100">
                  <VisualIndicator label="Soil pH" value={watchPH} type="ph" />
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Ideal pH range is between 6.0 and 7.5
                  </p>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </form>
    </div>
  );
}
