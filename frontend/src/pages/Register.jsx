import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Phone, Lock, User } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  
  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await registerUser(data);
    setIsLoading(false);
    
    if (result.success) {
      toast.success('Registration successful! Please login.');
      navigate('/login');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <Card className="max-w-md w-full space-y-8 p-8 sm:p-10 border-0 sm:border sm:shadow-sm shadow-none bg-transparent sm:bg-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
            <Leaf className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Create Account</h2>
          <p className="mt-2 text-sm text-slate-600">
            Join the smart farming community today
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              id="name"
              type="text"
              label="Full Name"
              icon={User}
              placeholder="e.g., John Doe"
              {...register('name', { required: 'Full name is required' })}
              error={errors.name?.message}
            />

            <Input
              id="mobile"
              type="tel"
              label="Mobile Number"
              icon={Phone}
              placeholder="e.g., 9876543210"
              {...register('mobile', { 
                required: 'Mobile number is required',
                pattern: { value: /^[0-9]{10}$/, message: 'Invalid 10-digit mobile number' }
              })}
              error={errors.mobile?.message}
            />
            
            <Input
              id="password"
              type="password"
              label="Password"
              icon={Lock}
              placeholder="••••••••"
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              error={errors.password?.message}
            />

            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              icon={Lock}
              placeholder="••••••••"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              error={errors.confirmPassword?.message}
            />
          </div>

          <div>
            <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
              Register Account
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              Login here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
