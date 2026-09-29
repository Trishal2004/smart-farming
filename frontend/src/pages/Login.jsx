import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Phone, Lock } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await login(data.mobile, data.password);
    setIsLoading(false);
    
    if (result.success) {
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <Card className="max-w-md w-full space-y-8 p-8 sm:p-10 border-0 sm:border sm:shadow-sm shadow-none bg-transparent sm:bg-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
            <Leaf className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to manage your farming operations
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
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
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-green-600 hover:text-green-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
              Login to Account
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
              Register here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
