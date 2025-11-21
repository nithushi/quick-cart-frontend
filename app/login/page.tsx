'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { assets } from '@/app/assets/assets';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast'; 
import { useRouter } from 'next/navigation'; // 1. Import useRouter

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 2. Get isAuthenticated and router
  const { login, isAuthenticated } = useAuth(); 
  const router = useRouter();

  // 3. Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/'); // Redirect to Home
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading('Logging in...'); 
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        login(data.token, email); 
        toast.success("Login Successful!", { id: toastId }); 
      } else {
        toast.error(data.message || "Invalid Credentials", { id: toastId });
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Connection Error! Is Backend Running?", { id: toastId });
    }
  };

  // 4. Optional: Prevent rendering the form if authenticated to avoid flicker
  if (isAuthenticated) {
    return null; 
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 relative bg-black items-center justify-center overflow-hidden">
        <Image 
            src={assets.login} 
            alt="Login Background" 
            fill 
            className="object-cover opacity-80"
            priority
        />
        <div className="absolute z-10 text-white text-center px-10">
            <h1 className="text-5xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-lg text-gray-200">
                Access your personalized shopping experience and track your orders with ease.
            </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-md">
            <div className='flex flex-col gap-1 mb-8'>
                <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
                <p className="text-gray-500 text-sm">Please enter your details to continue.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium text-sm">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium text-sm">Password</label>
                    <input 
                      type="password" 
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition" 
                      placeholder="********" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                </div>

                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="remember" className="accent-orange-600" />
                        <label htmlFor="remember" className="text-gray-600 cursor-pointer">Remember me</label>
                    </div>
                    <p className='cursor-pointer text-orange-600 font-medium hover:underline'>Forgot Password?</p>
                </div>

                <button type="submit" className="bg-orange-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-orange-700 transition duration-200 shadow-md mt-2">
                    Sign In
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-orange-600 font-bold hover:underline cursor-pointer">
                        Create account
                    </Link>
                </p>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Login;