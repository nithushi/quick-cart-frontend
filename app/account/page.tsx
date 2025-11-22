'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import { assets } from '@/app/assets/assets';

// Profile Interface
interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}

// Order Interface
interface Order {
    id: number;
    date: string;
    totalAmount: number;
    status: string;
}

// Address Interface (Manipud iti DB)
interface Address {
    id?: number;
    street: string;
    city: string;
    province: string;
    zipCode: string;
    phone: string;
    isDefault?: boolean;
}

const Account = () => {
    const { token, isAuthenticated, logout, isLoading } = useAuth();
    const router = useRouter();
    
    // States
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [address, setAddress] = useState<Address | null>(null); // Address state
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    // Menu items
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
                // 1. Fetch Profile
                const profileRes = await fetch('http://localhost:8080/api/users/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (profileRes.ok) setProfile(await profileRes.json());

                // 2. Fetch Orders
                const ordersRes = await fetch('http://localhost:8080/api/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    setOrders(ordersData.slice(0, 5));
                }

                // 3. Fetch Address (Mocking API call if backend not ready, or use real endpoint)
                // Real Endpoint Example: http://localhost:8080/api/users/address
                // For now, assuming backend sends address or using placeholder if 404
                 try {
                    const addressRes = await fetch('http://localhost:8080/api/users/address', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (addressRes.ok) {
                        setAddress(await addressRes.json());
                    } else {
                        // Fallback placeholder if no address found in DB
                        setAddress({
                            street: 'No Address Found',
                            city: '-',
                            province: '-',
                            zipCode: '-',
                            phone: '-'
                        });
                    }
                } catch (e) {
                    console.error("Address fetch failed", e);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, token, router, isLoading]);

    if (isLoading || loading) return <div className="min-h-screen flex items-center justify-center font-poppins text-gray-500 text-lg animate-pulse">Loading your dashboard...</div>;

    // Render Content Helper
    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-fadeIn transition-all">
                        <div className="flex justify-between items-end border-b border-gray-100 pb-4 mb-6">
                             <h3 className="text-2xl font-bold text-gray-800 font-poppins">Personal Information</h3>
                             <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">Verified Account</span>
                        </div>
                       
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className='space-y-2'>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">First Name</label>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-700 font-medium font-roboto">{profile?.firstName}</div>
                            </div>
                            <div className='space-y-2'>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-700 font-medium font-roboto">{profile?.lastName}</div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-700 font-medium font-roboto flex justify-between items-center">
                                    {profile?.email}
                                    <Image src={assets.checkmark} alt="verified" className="w-4 opacity-50" />
                                </div>
                            </div>
                            <div className='space-y-2'>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Role</label>
                                <div className="inline-flex">
                                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase shadow-md shadow-blue-100">
                                        {profile?.role}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button className="px-6 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition shadow-md">Edit Details</button>
                        </div>
                    </div>
                );

            case 'orders':
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-fadeIn">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h3 className="text-2xl font-bold text-gray-800 font-poppins">Recent Orders</h3>
                        </div>
                        {orders.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="group flex items-center justify-between p-5 border border-gray-100 rounded-xl hover:border-orange-200 hover:shadow-md transition cursor-pointer bg-white">
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 font-poppins group-hover:text-orange-600 transition">Order #{order.id}</p>
                                            <p className="text-xs text-gray-400 mt-1 font-roboto">{new Date(order.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-base font-bold text-gray-900 font-poppins">LKR {order.totalAmount.toLocaleString()}</p>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md mt-1 inline-block uppercase tracking-wide ${order.status === 'Completed' ? 'text-green-700 bg-green-100' : 'text-yellow-700 bg-yellow-100'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Image src={assets.box_icon} alt="No Orders" className="w-8 opacity-30 grayscale" />
                                </div>
                                <p className="text-gray-500 font-medium">No orders placed yet</p>
                                <p className="text-xs text-gray-400 mt-1 mb-6">Looks like you haven't made your choice yet</p>
                                <button onClick={() => router.push('/')} className="px-6 py-2 bg-orange-600 text-white text-sm rounded-lg shadow-lg shadow-orange-200 hover:bg-orange-700 transition">Start Shopping</button>
                            </div>
                        )}
                    </div>
                );

            case 'address':
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-fadeIn">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                            <h3 className="text-2xl font-bold text-gray-800 font-poppins">Address Book</h3>
                            <button className="bg-gray-900 text-white text-xs px-5 py-2.5 rounded-lg hover:bg-gray-800 transition shadow-md font-medium flex items-center gap-2">
                                <span>+</span> Add New
                            </button>
                        </div>
                        
                        {/* Address Card - Dynamic Data from DB */}
                        {address ? (
                             <div className="border p-6 rounded-xl border-orange-200 bg-orange-50/50 relative hover:shadow-md transition duration-300">
                                <span className="absolute top-4 right-4 text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded uppercase tracking-wider">Default</span>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                         <Image src={assets.my_location_image} alt="location" className="w-5 opacity-60" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-base mb-1 font-poppins">{profile?.firstName} {profile?.lastName}</p>
                                        <p className="text-sm text-gray-600 font-roboto leading-relaxed">{address.street}</p>
                                        <p className="text-sm text-gray-600 font-roboto">{address.city}, {address.zipCode}</p>
                                        <p className="text-sm text-gray-600 font-roboto mb-3">{address.province}</p>
                                        <p className="text-sm text-gray-700 font-medium flex items-center gap-2">
                                            <span className="text-gray-400 text-xs">Mobile:</span> {address.phone}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mt-6 pt-4 border-t border-orange-100 flex gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wide pl-9">
                                    <button className="hover:text-orange-600 hover:underline transition">Edit</button>
                                    <button className="hover:text-red-600 hover:underline transition">Remove</button>
                                </div>
                            </div>
                        ) : (
                             <div className="text-center py-10 text-gray-500">No address found. Please add one.</div>
                        )}
                    </div>
                );

            case 'settings':
                return (
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-fadeIn">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 font-poppins border-b border-gray-100 pb-4">Settings</h3>
                        <div className="flex flex-col gap-3 max-w-lg">
                            {['Change Password', 'Notification Preferences', 'Privacy Settings'].map((item, index) => (
                                <button key={index} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition group bg-white">
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{item}</span>
                                    <Image src={assets.arrow_right_icon_colored} alt="arrow" className="w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                            <button className="mt-4 flex justify-center items-center p-4 border border-red-100 bg-red-50/50 rounded-xl hover:bg-red-100 transition group">
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
        <div className='bg-[#F8F9FA] min-h-screen font-sans'>
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
                
                {/* Page Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 font-poppins">My Account</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your profile, orders and preferences</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Modern Sidebar Navigation */}
                    <div className="w-full lg:w-1/4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
                            {/* User Info Card */}
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center text-orange-600 text-3xl font-bold mb-4 font-poppins border-4 border-white shadow-lg">
                                    {profile?.firstName?.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-lg font-bold text-gray-800 font-poppins text-center">{profile?.firstName} {profile?.lastName}</h2>
                                <p className="text-xs text-gray-400 font-roboto font-medium tracking-wide uppercase mt-1">{profile?.role}</p>
                            </div>
                            
                            {/* Navigation Links */}
                            <nav className="flex flex-col gap-2 font-poppins">
                                {menuItems.map((item) => (
                                    <button 
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-4 relative overflow-hidden ${
                                            activeTab === item.id 
                                            ? 'bg-gray-900 text-white shadow-md' 
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className={`w-1 h-4 rounded-full absolute left-0 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${activeTab === item.id ? 'bg-orange-500 h-6 opacity-100' : 'opacity-0 h-0'}`}></div>
                                        {/* <Image src={item.icon} alt={item.label} className={`w-4 ${activeTab === item.id ? 'brightness-0 invert' : 'opacity-60'}`} /> */}
                                        <span className="relative z-10">{item.label}</span>
                                    </button>
                                ))}
                            </nav>

                            <div className="my-6 border-t border-gray-100"></div>
                            
                            <button 
                                onClick={logout}
                                className="w-full text-center px-4 py-3 rounded-xl text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 transition flex items-center justify-center gap-2"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="w-full lg:w-3/4">
                        {renderContent()}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Account;