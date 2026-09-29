import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Sprout, Beaker, Thermometer, Info, CheckCircle2, ChevronRight } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { cropService } from '../services/cropService';

export default function CropRecommendation() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      n: 90,
      p: 42,
      k: 43,
      ph: 6.5,
      temp: 26.5,
      humidity: 80,
      rainfall: 200
    }
  });

  const onSubmit = async (data) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const payload = {
        nitrogen: Number(data.n),
        phosphorus: Number(data.p),
        potassium: Number(data.k),
        phLevel: Number(data.ph),
        temperature: Number(data.temp),
        humidity: Number(data.humidity),
        rainfall: Number(data.rainfall)
      };
      const response = await cropService.recommendCrop(payload);
      setResult({
        crop: response.recommendedCrop,
        confidence: (response.confidence * 100).toFixed(1),
        reason: "Based on AI analysis of your specific soil nutrients and local climate."
      });
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze data. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="AI Crop Recommendation" 
        subtitle="Find the most suitable crop based on soil nutrients and climatic conditions."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Form */}
        <div className="space-y-6">
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Beaker className="w-4 h-4 text-green-600" /> Soil Nutrients
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input id="n" type="number" step="0.1" label="Nitrogen (N)" {...register('n', { required: 'Required', min: 0 })} error={errors.n?.message} />
                  <Input id="p" type="number" step="0.1" label="Phosphorus (P)" {...register('p', { required: 'Required', min: 0 })} error={errors.p?.message} />
                  <Input id="k" type="number" step="0.1" label="Potassium (K)" {...register('k', { required: 'Required', min: 0 })} error={errors.k?.message} />
                  <Input id="ph" type="number" step="0.1" label="Soil pH" {...register('ph', { required: 'Required', min: 0, max: 14 })} error={errors.ph?.message} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2 mt-2">
                  <Thermometer className="w-4 h-4 text-blue-500" /> Climate Info
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input id="temp" type="number" step="0.1" label="Temperature (°C)" {...register('temp', { required: 'Required' })} error={errors.temp?.message} />
                  <Input id="humidity" type="number" step="0.1" label="Humidity (%)" {...register('humidity', { required: 'Required', min: 0, max: 100 })} error={errors.humidity?.message} />
                  <Input id="rainfall" type="number" step="0.1" label="Rainfall (mm)" className="col-span-2" {...register('rainfall', { required: 'Required', min: 0 })} error={errors.rainfall?.message} />
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full text-lg py-3" 
                  isLoading={isAnalyzing}
                  loadingText="Analyzing soil and climate data..."
                >
                  🤖 Get AI Recommendation
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Result Container */}
        <div>
          {isAnalyzing && (
            <Card className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-slate-50/50">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing Data</h3>
              <p className="text-slate-500 max-w-sm">Running complex machine learning models on your soil and climate parameters...</p>
            </Card>
          )}

          {!isAnalyzing && !result && (
            <Card className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-slate-50/50">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-6">
                <Sprout className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Ready for Analysis</h3>
              <p className="text-slate-500 max-w-sm">Enter your farm's soil and climate data on the left to get a highly accurate AI crop recommendation.</p>
            </Card>
          )}

          {!isAnalyzing && result && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full min-h-[400px]">
              <Card className="h-full relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"></div>
                
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center shadow-sm">
                      <Sprout className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-700 uppercase tracking-wider">Recommended Crop</p>
                      <h2 className="text-4xl font-extrabold text-slate-900 mt-1">{result.crop}</h2>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-700">AI Confidence Score</span>
                      <span className="font-bold text-green-600 text-lg">{result.confidence}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${result.confidence}%` }}></div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="font-bold text-slate-800 mb-2 text-lg">Why this crop?</h4>
                    <p className="text-slate-600 leading-relaxed text-base">{result.reason}</p>
                  </div>
                </div>

                <div className="mt-auto space-y-4 relative z-10">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-3 text-sm text-blue-800">
                    <Info className="w-5 h-5 flex-shrink-0 text-blue-500 mt-0.5" />
                    <p>
                      <strong>Important:</strong> This recommendation is based entirely on soil and climate suitability, not market prices or expected profit. The final crop decision always belongs to the farmer.
                    </p>
                  </div>

                  <Button className="w-full text-lg py-3 flex items-center justify-center gap-2 group">
                    <CheckCircle2 className="w-5 h-5" />
                    Use This Crop
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
