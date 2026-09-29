import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { User, Phone, MapPin, Building2, Map } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { farmerProfileService } from '../services/farmerProfileService';

export default function Profile() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await farmerProfileService.getProfile();
        
        // Parse address back
        let village = '', district = '', state = '';
        if (data.address) {
          const parts = data.address.split(',').map(s => s.trim());
          if (parts.length >= 3) {
             village = parts[0];
             district = parts[1];
             state = parts[2];
          } else {
             village = data.address;
          }
        }

        reset({
          name: data.fullName || user?.fullName || '',
          mobile: data.phone || user?.mobileNumber || '',
          village: village,
          district: district,
          state: state
        });
      } catch (error) {
        // Handled by api interceptor
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [reset, user]);

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      const address = [data.village, data.district, data.state].filter(Boolean).join(', ');
      await farmerProfileService.updateProfile({
        fullName: data.name,
        phone: data.mobile,
        address: address
      });
      toast.success('Profile updated successfully.');
    } catch (error) {
      // Error is handled by interceptor
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader 
        title="Farmer Profile" 
        subtitle="Manage your personal details and location information."
      />

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              id="name"
              label="Full Name"
              icon={User}
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
            />
            
            <Input
              id="mobile"
              label="Mobile Number"
              icon={Phone}
              {...register('mobile', { 
                required: 'Mobile is required',
                pattern: { value: /^[0-9]{10}$/, message: 'Invalid 10-digit mobile number' }
              })}
              error={errors.mobile?.message}
            />
            
            <Input
              id="village"
              label="Village"
              icon={MapPin}
              {...register('village', { required: 'Village is required' })}
              error={errors.village?.message}
            />
            
            <Input
              id="district"
              label="District"
              icon={Building2}
              {...register('district', { required: 'District is required' })}
              error={errors.district?.message}
            />

            <Input
              id="state"
              label="State"
              icon={Map}
              className="md:col-span-2"
              {...register('state', { required: 'State is required' })}
              error={errors.state?.message}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button type="submit" isLoading={isSaving} icon={User}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
