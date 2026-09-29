import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { User, Bell, Shield, Settings2, Save } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import { useAuth } from '../context/AuthContext';

// Simple Toggle Switch component
const Toggle = ({ enabled, onChange, label, description }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-medium text-slate-800">{label}</p>
      {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
    </div>
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${enabled ? 'bg-green-500' : 'bg-slate-200'}`}
      onClick={() => onChange(!enabled)}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

export default function Settings() {
  const { user } = useAuth();
  
  // States for Notifications
  const [notifWeather, setNotifWeather] = useState(true);
  const [notifCrop, setNotifCrop] = useState(true);
  const [notifHarvest, setNotifHarvest] = useState(false);
  const [notifExpense, setNotifExpense] = useState(true);

  // States for Preferences
  const [language, setLanguage] = useState('English');
  const [units, setUnits] = useState('Metric');
  const [theme, setTheme] = useState('Light');

  const { register: regProfile, handleSubmit: handleProfileSubmit } = useForm({
    defaultValues: {
      name: user?.name || 'Farmer',
      mobile: user?.mobile || '9876543210',
      email: 'farmer@agrismart.local'
    }
  });

  const { register: regPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword } = useForm();

  const onProfileSave = (data) => {
    toast.success('Profile settings updated successfully.');
  };

  const onPasswordSave = (data) => {
    toast.success('Password changed successfully.');
    resetPassword();
  };

  const onPreferencesSave = () => {
    toast.success('Application preferences updated.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your profile, preferences, and account security."
      />

      {/* Profile Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="p-2 bg-green-100 text-green-700 rounded-lg"><User className="w-5 h-5" /></div>
          <h3 className="text-lg font-bold text-slate-800">Profile Settings</h3>
        </div>
        
        <form onSubmit={handleProfileSubmit(onProfileSave)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input id="name" label="Full Name" {...regProfile('name')} />
            <Input id="mobile" label="Mobile Number" {...regProfile('mobile')} />
            <Input id="email" type="email" label="Email Address (Optional)" className="md:col-span-2" {...regProfile('email')} />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" icon={Save}>Save Profile</Button>
          </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Notification Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><Bell className="w-5 h-5" /></div>
            <h3 className="text-lg font-bold text-slate-800">Notifications</h3>
          </div>
          
          <div className="space-y-1 divide-y divide-slate-100">
            <Toggle 
              label="Weather Alerts" 
              description="Get notified about severe weather conditions" 
              enabled={notifWeather} 
              onChange={setNotifWeather} 
            />
            <Toggle 
              label="Crop Recommendations" 
              description="Updates on AI crop suitability" 
              enabled={notifCrop} 
              onChange={setNotifCrop} 
            />
            <Toggle 
              label="Harvest Reminders" 
              description="Alerts for upcoming expected harvests" 
              enabled={notifHarvest} 
              onChange={setNotifHarvest} 
            />
            <Toggle 
              label="Expense Reminders" 
              description="Weekly summary of farm expenditures" 
              enabled={notifExpense} 
              onChange={setNotifExpense} 
            />
          </div>
        </Card>

        {/* Application Preferences */}
        <Card>
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-lg"><Settings2 className="w-5 h-5" /></div>
            <h3 className="text-lg font-bold text-slate-800">Preferences</h3>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Language</label>
              <Select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)} 
                options={[{value: 'English', label: 'English'}, {value: 'Hindi', label: 'Hindi'}, {value: 'Marathi', label: 'Marathi'}]} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Measurement Units</label>
              <Select 
                value={units} 
                onChange={(e) => setUnits(e.target.value)} 
                options={[{value: 'Metric', label: 'Metric (kg, mm, °C)'}, {value: 'Imperial', label: 'Imperial (lbs, in, °F)'}]} 
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Application Theme</label>
              <Select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)} 
                options={[{value: 'Light', label: 'Light Theme'}, {value: 'Dark', label: 'Dark Theme'}]} 
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button onClick={onPreferencesSave} variant="outline" icon={Save}>Save Preferences</Button>
          </div>
        </Card>

      </div>

      {/* Security Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-lg"><Shield className="w-5 h-5" /></div>
          <h3 className="text-lg font-bold text-slate-800">Security</h3>
        </div>
        
        <form onSubmit={handlePasswordSubmit(onPasswordSave)} className="space-y-4 max-w-md">
          <Input id="currentPassword" type="password" label="Current Password" {...regPassword('currentPassword')} />
          <Input id="newPassword" type="password" label="New Password" {...regPassword('newPassword')} />
          <Input id="confirmPassword" type="password" label="Confirm New Password" {...regPassword('confirmPassword')} />
          
          <div className="pt-2">
            <Button type="submit" variant="danger" icon={Shield}>Update Password</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
