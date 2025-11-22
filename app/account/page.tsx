'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import { assets } from '@/app/assets/assets';

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

interface Order {
    id: number;
    date: string;
    totalAmount: number;
    status: string;
}

const Account = () => {
    // 1. isLoading ලබා ගන්න
    const { token, isAuthenticated, logout, isLoading } = useAuth(); 
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        // 2. Auth Loading නම් ඉන්න (Redirect කරන්න එපා)
        if (isLoading) return;

        // 3. Loading ඉවර වුනාම Login වෙලා නැත්නම් විතරක් යවන්න
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch Profile Data
                const profileRes = await fetch('http://localhost:8080/api/users/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (profileRes.ok) {
                    setProfile(await profileRes.json());
                }

                // Fetch Recent Orders
                const ordersRes = await fetch('http://localhost:8080/api/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    setOrders(ordersData.slice(0, 5)); 
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, token, router, isLoading]); // isLoading dependency එකට දැම්මා

    // 4. Loading Screen එක පෙන්නන්න
    if (isLoading || loading) return <div className="text-center py-20 font-poppins text-gray-500">Loading account...</div>;

    return (
        <div className='bg-[#F8F9FA] min-h-screen'>
            <Navbar />
            
            <div className="max-w-6xl mx-auto px-6 md:px-16 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* Sidebar */}
                    <div className="w-full md:w-1/2">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-3xl font-bold mb-3 font-poppins">
                                    {profile?.firstName?.charAt(0)}
                                </div>
                                <h2 className="text-lg font-bold text-gray-800 font-poppins">{profile?.firstName} {profile?.lastName}</h2>
                                <p className="text-sm text-gray-500 font-roboto">{profile?.email}</p>
                            </div>
                            
                            <div className="flex flex-col gap-2 font-poppins">
                                <button 
                                    onClick={() => setActiveTab('profile')}
                                    className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-3 ${activeTab === 'profile' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span></span> My Profile
                                </button>
                                <button 
                                    onClick={() => setActiveTab('orders')}
                                    className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-3 ${activeTab === 'orders' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span></span> My Orders
                                </button>
                                <button 
                                    onClick={logout}
                                    className="text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition flex items-center gap-3 mt-4"
                                >
                                    <span></span> Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full md:w-2/2 font-poppins">
                        {activeTab === 'profile' ? (
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fadeIn">
                                <h3 className="text-xl font-bold text-gray-800 mb-6 font-poppins border-b border-gray-100 pb-4">Personal Information</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">First Name</label>
                                        <p className="text-gray-800 font-medium border-b border-gray-100 pb-2">{profile?.firstName}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Last Name</label>
                                        <p className="text-gray-800 font-medium border-b border-gray-100 pb-2">{profile?.lastName}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email Address</label>
                                        <p className="text-gray-800 font-medium border-b border-gray-100 pb-2">{profile?.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Account Type</label>
                                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                            {profile?.role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fadeIn">
                                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                    <h3 className="text-xl font-bold text-gray-800 font-poppins">Recent Orders</h3>
                                    <button onClick={() => router.push('/orders')} className="text-orange-600 text-sm font-medium hover:underline">View All</button>
                                </div>

                                {orders.length > 0 ? (
                                    <div className="flex flex-col gap-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-orange-200 transition">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800 font-poppins">Order #{order.id}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{new Date(order.date).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-gray-900">LKR {order.totalAmount.toLocaleString()}</p>
                                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{order.status}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-10">No orders found.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Account;