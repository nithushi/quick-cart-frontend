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

    // Icons අයින් කරලා Menu Items ටික හැදුවා
    const menuItems = [
        { id: 'profile', label: 'My Profile' },
        { id: 'orders', label: 'My Orders' },
        { id: 'address', label: 'Address Book' },
        { id: 'settings', label: 'Settings' },
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
                if (addressRes.ok && addressRes.status !== 204) {
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
            // Backend implementation needed for image upload
            toast.success("Image selected (Backend needed)", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Error", { id: toastId });
        }
    };

    if (isLoading || loading) return <div className="min-h-screen flex items-center justify-center font-poppins text-gray-500 text-lg">Loading dashboard...</div>;

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="bg-white p-8 rounded-m shadow-sm border border-gray-100 animate-fadeIn">
                        <div className="flex justify-between items-end border-b border-gray-100 pb-5 mb-8 font-poppins">
                             <div>
                                <h3 className="text-2xl font-bold text-gray-900 font-poppins">Personal Information</h3>
                                <p className="text-sm text-gray-500 mt-1 font-roboto">Manage your personal details</p>
                             </div>
                             <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase">Verified User</span>
                        </div>
                       
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 font-poppins">
                            <div className='space-y-2'>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">First Name</label>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 font-medium font-roboto">{profile?.firstName}</div>
                            </div>
                            <div className='space-y-2'>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 font-medium font-roboto">{profile?.lastName}</div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 font-medium font-roboto flex justify-between items-center">
                                    {profile?.email}
                                    <Image src={assets.checkmark} alt="verified" className="w-5 opacity-60" />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'orders':
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fadeIn">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-5">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 font-poppins">Recent Orders</h3>
                                <p className="text-sm text-gray-500 mt-1 font-roboto">Track and manage your orders</p>
                            </div>
                        </div>
                        {orders.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:border-orange-200 transition-colors cursor-pointer bg-white">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                                <Image src={assets.box_icon} alt="icon" className="w-5 opacity-50" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800 font-poppins">Order #{order.id}</p>
                                                <p className="text-xs text-gray-500 mt-1 font-roboto">{new Date(order.date).toLocaleDateString()}</p>
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
                            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <Image src={assets.box_icon} alt="No Orders" className="w-8 opacity-20 grayscale" />
                                </div>
                                <p className="text-gray-500 font-medium font-poppins">No orders placed yet</p>
                                <button onClick={() => router.push('/')} className="px-6 py-2.5 mt-4 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition">Start Shopping</button>
                            </div>
                        )}
                    </div>
                );

            case 'address':
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fadeIn">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-5">
                             <div>
                                <h3 className="text-2xl font-bold text-gray-900 font-poppins">Address Book</h3>
                                <p className="text-sm text-gray-500 mt-1 font-roboto">Manage your shipping addresses</p>
                             </div>
                             <button onClick={() => router.push('/cart')} className=" font-poppins bg-gray-900 text-white text-xs px-4 py-2.5 rounded-lg hover:bg-black transition font-bold flex items-center gap-2">
                                <span className="text-lg leading-none pb-0.5 font-poppins">+</span> Add New
                            </button>
                        </div>
                        
                        {/* Address Card - Data from DB */}
                        {address ? (
                             <div className="border p-6 rounded-xl border-gray-200 bg-white relative hover:shadow-md transition-all duration-300 font-poppins">
                                <span className="absolute top-5 right-5 text-[10px] font-bold bg-orange-50 text-orange-600 px-3 py-1 rounded-full uppercase tracking-wider border border-orange-100 font-poppins">Default</span>
                                <div className="flex items-start gap-5">
                                    <div className="mt-1 p-2.5 bg-gray-50 rounded-full">
                                         <Image src={assets.my_location_image} alt="location" className="w-5 opacity-60" />
                                    </div>
                                    <div className="flex-1 font-poppins">
                                        <p className="font-bold text-gray-800 text-base mb-1 font-poppins">{profile?.firstName} {profile?.lastName}</p>
                                        <div className="text-sm text-gray-600 font-poppins leading-relaxed space-y-1">
                                            <p>{address.street}</p>
                                            <p>{address.city}, {address.zipCode}</p>
                                            <p className="font-medium text-gray-500">{address.province}</p>
                                        </div>
                                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            <p className="text-xs text-gray-700 font-medium font-roboto">{address.phone}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-5 pt-4 border-t border-gray-100 flex gap-5 text-xs font-bold text-gray-500 uppercase tracking-widest pl-[4.5rem]">
                                    <button className="hover:text-orange-600 transition duration-200">Edit</button>
                                    <button className="hover:text-red-500 transition duration-200">Remove</button>
                                </div>
                            </div>
                        ) : (
                             <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <Image src={assets.my_location_image} alt="No Address" className="w-6 opacity-30 grayscale" />
                                </div>
                                <p className="text-gray-500 font-medium font-poppins">No address found</p>
                                <p className="text-xs text-gray-400 mt-1 font-roboto">Please add your delivery address to proceed.</p>
                            </div>
                        )}
                    </div>
                );

            case 'settings':
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fadeIn">
                        <h3 className="text-2xl font-bold text-gray-900 mb-8 font-poppins border-b border-gray-100 pb-5">Settings</h3>
                        <div className="flex flex-col gap-3 max-w-lg">
                            {['Change Password', 'Notification Preferences'].map((item, index) => (
                                <button key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition bg-white text-left">
                                    <span className="text-sm font-medium text-gray-700 font-poppins">{item}</span>
                                    <Image src={assets.arrow_right_icon_colored} alt="arrow" className="w-4 opacity-40" />
                                </button>
                            ))}
                            <button className="mt-4 w-full py-3.5 border border-red-200 bg-red-50 rounded-xl hover:bg-red-100 transition text-center">
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
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 font-poppins">My Account</h1>
                    <p className="text-gray-500 text-sm mt-2 font-roboto">Welcome back, {profile?.firstName}!</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Clean & Simple Sidebar */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white p-6 rounded-m shadow-sm border border-gray-100 sticky top-24">
                            {/* Profile Image */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-24 h-24 rounded-full flex items-center justify-center text-orange-600 text-3xl font-bold mb-4 font-poppins border-4 border-orange-50 bg-orange-100 relative overflow-hidden group cursor-pointer">
                                    {profile?.imageUrl ? (
                                        <img src={profile.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{profile?.firstName?.charAt(0).toUpperCase()}</span>
                                    )}
                                    
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    >
                                        <Image src={assets.upload_area} alt="edit" className="w-6 h-6 invert brightness-0" />
                                    </div>
                                </div>
                                
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleImageUpload} 
                                    className="hidden" 
                                    accept="image/*"
                                />

                                <h2 className="text-lg font-bold text-gray-800 font-poppins text-center">{profile?.firstName} {profile?.lastName}</h2>
                                <p className="text-xs text-gray-400 font-roboto font-medium tracking-wide uppercase mt-1">{profile?.role}</p>
                            </div>
                            
                            {/* Simple Menu Items (Icons Removed) */}
                            <nav className="flex flex-col gap-1 font-poppins">
                                {menuItems.map((item) => (
                                    <button 
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            activeTab === item.id 
                                            ? 'bg-orange-600 text-white shadow-md' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </nav>

                            <div className="my-6 border-t border-gray-100 mx-2"></div>
                            
                            <button 
                                onClick={logout}
                                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition flex items-center gap-3 group"
                            >
                                <span className="group-hover:translate-x-1 transition-transform duration-200">Logout</span>
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