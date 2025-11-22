'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import { assets } from '@/app/assets/assets';
import toast from 'react-hot-toast';

// Types
interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    imageUrl?: string;
}

interface Order {
    id: number;
    date: string;
    totalAmount: number;
    status: string;
}

interface Address {
    id: number;
    street: string;
    city: string;
    province: string;
    zipCode: string;
    phone: string;
}

const Account = () => {
    const { token, isAuthenticated, logout, isLoading } = useAuth();
    const router = useRouter();
    
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [address, setAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const menuItems = [
        { id: 'profile', label: 'My Profile', icon: assets.user_icon },
        { id: 'orders', label: 'My Orders', icon: assets.box_icon },
        { id: 'address', label: 'Address Book', icon: assets.my_location_image },
        { id: 'settings', label: 'Settings', icon: assets.menu_icon },
    ];

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const headers = { 'Authorization': `Bearer ${token}` };

                // 1. Fetch Profile
                const profileRes = await fetch('http://localhost:8080/api/users/profile', { headers });
                if (profileRes.ok) setProfile(await profileRes.json());

                // 2. Fetch Orders
                const ordersRes = await fetch('http://localhost:8080/api/orders', { headers });
                if (ordersRes.ok) setOrders((await ordersRes.json()).slice(0, 5));

                // 3. Fetch Address from DB
                const addressRes = await fetch('http://localhost:8080/api/users/address', { headers });
                if (addressRes.ok) {
                    setAddress(await addressRes.json());
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, token, router, isLoading]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        const toastId = toast.loading("Uploading...");

        try {
            const response = await fetch('http://localhost:8080/api/users/profile/image', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setProfile(prev => prev ? { ...prev, imageUrl: data.imageUrl } : null);
                toast.success("Updated!", { id: toastId });
            } else {
                toast.error("Failed", { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error("Error", { id: toastId });
        }
    };

    if (isLoading || loading) return <div className="min-h-screen flex items-center justify-center font-poppins text-gray-500 animate-pulse text-lg">Loading dashboard...</div>;

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-fadeIn transition-all duration-500">
                        <div className="flex justify-between items-end border-b border-gray-100 pb-5 mb-8">
                             <div>
                                <h3 className="text-2xl font-bold text-gray-900 font-poppins">Personal Information</h3>
                                <p className="text-sm text-gray-400 mt-1 font-roboto">Manage your personal details</p>
                             </div>
                             <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase">Verified User</span>
                        </div>
                       
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className='space-y-2 group'>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-orange-500 transition-colors">First Name</label>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 font-medium font-roboto group-hover:border-orange-100 group-hover:bg-orange-50/30 transition-colors">{profile?.firstName}</div>
                            </div>
                            <div className='space-y-2 group'>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-orange-500 transition-colors">Last Name</label>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 font-medium font-roboto group-hover:border-orange-100 group-hover:bg-orange-50/30 transition-colors">{profile?.lastName}</div>
                            </div>
                            <div className="md:col-span-2 space-y-2 group">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-orange-500 transition-colors">Email Address</label>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 font-medium font-roboto flex justify-between items-center group-hover:border-orange-100 group-hover:bg-orange-50/30 transition-colors">
                                    {profile?.email}
                                    <Image src={assets.checkmark} alt="verified" className="w-5 opacity-60" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'orders':
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-fadeIn">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-5">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 font-poppins">Recent Orders</h3>
                                <p className="text-sm text-gray-400 mt-1 font-roboto">Track and manage your orders</p>
                            </div>
                        </div>
                        {orders.length > 0 ? (
                            <div className="flex flex-col gap-5">
                                {orders.map((order) => (
                                    <div key={order.id} className="group flex items-center justify-between p-6 border border-gray-100 rounded-2xl hover:border-orange-200 hover:shadow-md hover:bg-orange-50/10 transition-all cursor-pointer bg-white">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                                                <Image src={assets.box_icon} alt="icon" className="w-5 opacity-40 group-hover:opacity-100" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800 font-poppins group-hover:text-orange-600 transition">Order #{order.id}</p>
                                                <p className="text-xs text-gray-400 mt-1 font-roboto">{new Date(order.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-base font-bold text-gray-900 font-poppins">LKR {order.totalAmount.toLocaleString()}</p>
                                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full mt-1.5 inline-block uppercase tracking-wide ${order.status === 'Completed' ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
                                    <Image src={assets.box_icon} alt="No Orders" className="w-8 opacity-20 grayscale" />
                                </div>
                                <p className="text-gray-500 font-medium font-poppins">No orders placed yet</p>
                                <button onClick={() => router.push('/')} className="px-8 py-3 mt-4 bg-orange-600 text-white text-sm font-medium rounded-xl shadow-lg hover:bg-orange-700 transition">Start Shopping</button>
                            </div>
                        )}
                    </div>
                );

            case 'address':
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-fadeIn">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-5">
                             <div>
                                <h3 className="text-2xl font-bold text-gray-900 font-poppins">Address Book</h3>
                                <p className="text-sm text-gray-400 mt-1 font-roboto">Manage your shipping addresses</p>
                             </div>
                             <button className="bg-gray-900 text-white text-xs px-5 py-2.5 rounded-xl hover:bg-black transition shadow-lg font-bold flex items-center gap-2 hover:-translate-y-0.5 transform duration-200">
                                <span className="text-lg leading-none pb-1">+</span> Add New
                            </button>
                        </div>
                        
                        {/* Address Card - Data from DB */}
                        {address ? (
                             <div className="border p-6 rounded-2xl border-orange-100 bg-gradient-to-br from-white to-orange-50 relative hover:shadow-lg hover:border-orange-200 transition-all duration-300 group">
                                <span className="absolute top-5 right-5 text-[10px] font-bold bg-white text-orange-600 px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-orange-100">Default</span>
                                <div className="flex items-start gap-5">
                                    <div className="mt-1 p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                                         <Image src={assets.my_location_image} alt="location" className="w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800 text-lg mb-1 font-poppins">{profile?.firstName} {profile?.lastName}</p>
                                        <div className="text-sm text-gray-600 font-roboto leading-relaxed space-y-1">
                                            <p>{address.street}</p>
                                            <p>{address.city}, {address.zipCode}</p>
                                            <p className="font-medium text-gray-500">{address.province}</p>
                                        </div>
                                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-100 shadow-sm">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            <p className="text-xs text-gray-700 font-medium font-roboto">{address.phone}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-6 pt-5 border-t border-orange-100/50 flex gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest pl-[4.5rem]">
                                    <button className="hover:text-orange-600 transition duration-200 flex items-center gap-1">Edit</button>
                                    <button className="hover:text-red-500 transition duration-200">Remove</button>
                                </div>
                            </div>
                        ) : (
                             <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <Image src={assets.my_location_image} alt="No Address" className="w-8 opacity-30 grayscale" />
                                </div>
                                <p className="text-gray-500 font-medium font-poppins">No address found</p>
                                <p className="text-xs text-gray-400 mt-1 font-roboto">Please add your delivery address to proceed.</p>
                            </div>
                        )}
                    </div>
                );

            case 'settings':
                return (
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 animate-fadeIn">
                        <h3 className="text-2xl font-bold text-gray-900 mb-8 font-poppins border-b border-gray-100 pb-5">Settings</h3>
                        <div className="flex flex-col gap-4 max-w-lg">
                            {['Change Password', 'Notification Preferences'].map((item, index) => (
                                <button key={index} className="flex justify-between items-center p-5 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition group bg-white shadow-sm hover:shadow-md">
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 font-poppins">{item}</span>
                                    <Image src={assets.arrow_right_icon_colored} alt="arrow" className="w-4 opacity-30 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                                </button>
                            ))}
                            <button className="mt-6 w-full py-4 border border-red-100 bg-red-50/50 rounded-2xl hover:bg-red-100 transition group text-center">
                                <span className="text-sm font-bold text-red-600">Delete Account</span>
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className='bg-[#F8F9FA] min-h-screen font-sans pb-20'>
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 font-poppins tracking-tight">My Account</h1>
                    <p className="text-gray-500 text-sm mt-2 font-roboto">Manage your profile, orders and preferences</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    
                    {/* Modern Sidebar */}
                    <div className="w-full lg:w-1/4">
                        <div className="bg-white p-6 rounded-3xl shadow-lg shadow-gray-100/50 border border-gray-100 sticky top-28">
                            <div className="flex flex-col items-center mb-8 relative group cursor-pointer">
                                <div className="w-28 h-28 rounded-full flex items-center justify-center text-orange-600 text-4xl font-bold mb-5 font-poppins border-[6px] border-white shadow-xl overflow-hidden relative bg-gradient-to-br from-orange-100 to-orange-200 group-hover:shadow-2xl transition-all duration-300">
                                    {profile?.imageUrl ? (
                                        <img src={profile.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{profile?.firstName?.charAt(0).toUpperCase()}</span>
                                    )}
                                    
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
                                    >
                                        <Image src={assets.upload_area} alt="edit" className="w-8 h-8 invert brightness-0" />
                                    </div>
                                </div>
                                
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleImageUpload} 
                                    className="hidden" 
                                    accept="image/*"
                                />

                                <h2 className="text-xl font-bold text-gray-800 font-poppins text-center">{profile?.firstName} {profile?.lastName}</h2>
                                <p className="text-xs text-gray-400 font-roboto font-medium tracking-wide uppercase mt-1 bg-gray-100 px-3 py-1 rounded-full">{profile?.role}</p>
                            </div>
                            
                            <nav className="flex flex-col gap-2 font-poppins">
                                {menuItems.map((item) => (
                                    <button 
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`text-left px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-300 flex items-center gap-4 relative overflow-hidden group ${
                                            activeTab === item.id 
                                            ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' 
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeTab === item.id ? 'bg-orange-500 scale-125' : 'bg-gray-300 group-hover:bg-gray-400'}`}></div>
                                        <span className="relative z-10">{item.label}</span>
                                        {activeTab === item.id && (
                                            <Image src={assets.arrow_right_icon_colored} alt="active" className="w-4 ml-auto brightness-0 invert opacity-50" />
                                        )}
                                    </button>
                                ))}
                            </nav>

                            <div className="my-8 border-t border-gray-100 mx-4"></div>
                            
                            <button 
                                onClick={logout}
                                className="w-full text-center px-4 py-3.5 rounded-2xl text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 transition flex items-center justify-center gap-2 group"
                            >
                                <span className="group-hover:scale-105 transition-transform">Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="w-full lg:w-3/4 min-h-[500px]">
                        {renderContent()}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Account;