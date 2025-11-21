'use client';
import React, { useState, useEffect } from 'react'; // 1. Import useEffect
import Link from 'next/link';
import Image from 'next/image';
import { assets } from '@/app/assets/assets';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [firstName, setFname] = useState('');
  const [lastName, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const router = useRouter();
  const { isAuthenticated } = useAuth(); // 2. Get isAuthenticated status

  // 3. Redirect if already logged in (Sinhala: Login වී ඇත්නම් Redirect කරන්න)
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading('Creating account...');
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        toast.success("Account created! Redirecting to login...", { id: toastId });
        setTimeout(() => router.push('/login'), 2000); 
      } else {
        const errorMessage = await response.text();
        toast.error(errorMessage || "Registration Failed", { id: toastId });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    }
  };

  // 4. Prevent rendering form content if authenticated (Sinhala: Login වී ඇත්නම් Form එක පෙන්වීම නවතන්න)
  if (isAuthenticated) {
    return null; 
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Left Side - Image Section */}
      <div className="hidden md:flex w-1/2 relative bg-black items-center justify-center overflow-hidden">
        {/* <Image 
            src={assets.register} 
            alt="Register Background" 
            fill 
            className="object-cover opacity-80"
            priority
        /> */}
        <div className="absolute z-10 text-white text-center px-10">
            <h1 className="text-5xl font-bold mb-4 font-poppins">Join Us Today!</h1>
            <p className="text-lg text-gray-200 font-roboto">
                Sign up to unlock exclusive deals, personalized recommendations, and faster checkout.
            </p>
        </div>
      </div>

      {/* Right Side - Register Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-md">
            
            <div className='flex flex-col gap-1 mb-8'>
                <h2 className="text-3xl font-bold text-gray-800 font-poppins">Create Account</h2>
                <p className="text-gray-500 text-sm font-roboto">Enter your details below to create your account</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium text-sm font-roboto">First Name</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition font-roboto" 
                      placeholder="John" 
                      value={firstName}
                      onChange={(e) => setFname(e.target.value)}
                      required 
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium text-sm font-roboto">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition font-roboto" 
                      placeholder="Doe" 
                      value={lastName}
                      onChange={(e) => setLname(e.target.value)}
                      required 
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium text-sm font-roboto">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition font-roboto" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-gray-700 font-medium text-sm font-roboto">Password</label>
                    <input 
                      type="password" 
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition font-roboto" 
                      placeholder="********" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                </div>

                <button type="submit" className="bg-orange-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-orange-700 transition duration-200 shadow-md mt-2 font-poppins">
                    Create Account
                </button>

                <p className="text-center text-sm text-gray-600 mt-4 font-roboto">
                    Already have an account?{' '}
                    <Link href="/login" className="text-orange-600 font-bold hover:underline cursor-pointer font-poppins">
                        Login here
                    </Link>
                </p>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Register;