import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, CloudSun, Sprout, TrendingUp, BookOpen, Calculator, BarChart3, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';

export default function Home() {
  const features = [
    { title: 'Smart Crop Recommendation', icon: Sprout, desc: 'AI-driven suggestions based on soil and climate.' },
    { title: 'AI Yield Prediction', icon: TrendingUp, desc: 'Estimate production accurately before harvest.' },
    { title: 'Weather Advisory', icon: CloudSun, desc: 'Daily weather updates and actionable farming advice.' },
    { title: 'Farm Management', icon: Leaf, desc: 'Manage multiple farms and seasons effortlessly.' },
    { title: 'Expense Tracking', icon: Calculator, desc: 'Keep a tight record of all cultivation investments.' },
    { title: 'Farm Activity Diary', icon: BookOpen, desc: 'Digital logbook replacing manual notebooks.' },
    { title: 'Profit Analysis', icon: BarChart3, desc: 'Calculate exact profit margins after every harvest.' },
    { title: 'Seasonal Reports', icon: Clock, desc: 'Compare performance across different farming seasons.' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-green-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-400 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Smart Farming. <br className="hidden sm:block"/> Better Decisions. Higher Productivity.
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-green-100 max-w-3xl mx-auto mb-10 leading-relaxed">
            AI-powered farm management designed to help farmers make informed decisions using soil data, weather information, crop recommendations, and yield predictions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto bg-green-500 hover:bg-green-400 text-green-950 font-bold border-none shadow-lg">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-green-400 text-green-50 hover:bg-green-800 hover:text-white">
                Login to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Everything you need in one place</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Comprehensive tools built specifically for modern agricultural needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Powered Section */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">AI-Powered Agriculture</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Stop guessing. Our advanced machine learning models analyze your soil composition (N, P, K, pH) alongside real-time climate data to recommend the most suitable crops for your land.
            </p>
            <ul className="space-y-4">
              {['Data-driven crop selection', 'Predict yield before planting', 'Mitigate weather risks'].map((item, i) => (
                <li key={i} className="flex items-center text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner relative overflow-hidden">
               {/* Mock UI for AI */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative z-10">
                 <div className="flex items-center space-x-3 mb-4">
                   <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                     <Sprout className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-sm font-medium text-slate-500">AI Recommendation</p>
                     <p className="text-lg font-bold text-slate-900">Rice (Kharif)</p>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <div className="flex justify-between text-sm">
                     <span className="text-slate-500">Expected Yield</span>
                     <span className="font-semibold text-green-700">3,200 kg/acre</span>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-2">
                     <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                   </div>
                 </div>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-50 py-24 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-green-900 mb-6">Ready to digitize your farm?</h2>
          <p className="text-lg text-green-800 mb-8">Join the platform that helps you track expenses, predict yields, and increase your farming profits.</p>
          <Link to="/register">
            <Button size="lg" className="shadow-lg">Create Free Account</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Leaf className="w-6 h-6 text-green-500" />
            <span className="text-xl font-bold text-white tracking-tight">AgriSmart</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} AI Smart Farming Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
