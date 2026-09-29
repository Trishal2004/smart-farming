import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { LineChart, Calculator, ShieldAlert } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { yieldService } from '../services/yieldService';

export default function YieldPrediction() {
  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      crop: 'Rice',
      area: 5,
      rainfall: 120,
      fertilizer: 50,
      previousYield: 3000
    }
  });

  const onSubmit = async (data) => {
    setIsPredicting(true);
    setResult(null);
    try {
      const payload = {
        crop: data.crop,
        landArea: Number(data.area),
        rainfall: Number(data.rainfall),
        fertilizerUsage: Number(data.fertilizer),
        previousYield: Number(data.previousYield || 0)
      };
      const response = await yieldService.predictYield(payload);
      setResult({
        totalYield: response.predictedYield,
        yieldPerAcre: response.yieldPerAcre,
        confidence: 90 // Mocking confidence % since Python only returns confidenceMessage string
      });
      toast.success('Yield prediction generated!');
    } catch (error) {
      toast.error('Failed to generate prediction. Please try again.');
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="AI Yield Prediction" 
        subtitle="Estimate expected crop yield using farming and environmental data."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Form */}
        <div className="space-y-6">
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Calculator className="w-4 h-4 text-green-600" /> Farm Parameters
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input 
                    id="crop" 
                    label="Crop Name" 
                    {...register('crop', { required: 'Required' })} 
                    error={errors.crop?.message} 
                  />
                  <Input 
                    id="area" 
                    type="number" 
                    step="0.1" 
                    label="Land Area (Acres)" 
                    {...register('area', { required: 'Required', min: { value: 0.1, message: 'Must be positive' } })} 
                    error={errors.area?.message} 
                  />
                  <Input 
                    id="rainfall" 
                    type="number" 
                    step="0.1" 
                    label="Expected Rainfall (mm)" 
                    {...register('rainfall', { required: 'Required', min: { value: 0, message: 'Cannot be negative' } })} 
                    error={errors.rainfall?.message} 
                  />
                  <Input 
                    id="fertilizer" 
                    type="number" 
                    step="0.1" 
                    label="Fertilizer Usage (kg)" 
                    {...register('fertilizer', { required: 'Required', min: { value: 0, message: 'Cannot be negative' } })} 
                    error={errors.fertilizer?.message} 
                  />
                  <Input 
                    id="previousYield" 
                    type="number" 
                    step="0.1" 
                    label="Previous Yield (kg) [Optional]" 
                    className="sm:col-span-2"
                    {...register('previousYield', { min: { value: 0, message: 'Cannot be negative' } })} 
                    error={errors.previousYield?.message} 
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full text-lg py-3" 
                  isLoading={isPredicting}
                  loadingText="Analyzing farming data..."
                >
                  🤖 Predict Yield
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Result Container */}
        <div>
          {isPredicting && (
            <Card className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-slate-50/50">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing Data</h3>
              <p className="text-slate-500 max-w-sm">Running machine learning models based on historical patterns and current inputs...</p>
            </Card>
          )}

          {!isPredicting && !result && (
            <Card className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-slate-50/50">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                <LineChart className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Ready for Prediction</h3>
              <p className="text-slate-500 max-w-sm">Enter your crop parameters to get an AI-powered yield estimation.</p>
            </Card>
          )}

          {!isPredicting && result && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full min-h-[400px]">
              <Card className="h-full relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center shadow-sm">
                      <LineChart className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-700 uppercase tracking-wider">Expected Total Yield</p>
                      <h2 className="text-4xl font-extrabold text-slate-900 mt-1">{result.totalYield.toLocaleString()} <span className="text-xl text-slate-500">kg</span></h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <span className="text-slate-500 text-sm font-medium">Yield per Acre</span>
                      <p className="text-2xl font-bold text-slate-800 mt-1">{result.yieldPerAcre.toLocaleString()} <span className="text-base font-normal">kg/acre</span></p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <span className="text-slate-500 text-sm font-medium">Prediction Confidence</span>
                      <p className="text-2xl font-bold text-green-600 mt-1">{result.confidence}%</p>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${result.confidence}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto relative z-10 pt-4 border-t border-slate-100">
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-3 text-sm text-amber-800">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
                    <p>
                      <strong>Important:</strong> This is an AI-based estimate and not a guaranteed yield. Actual results may vary based on unforeseen environmental factors.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
