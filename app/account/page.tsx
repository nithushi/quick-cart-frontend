'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import { assets } from '@/app/assets/assets';
import toast from 'react-hot-toast';

// --- Types ---
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

    // --- State ---
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [address, setAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Sidebar Menu ---
    const menuItems = [
        { id: 'profile', label: 'My Profile', icon: assets.user_icon },
        { id: 'orders', label: 'My Orders', icon: assets.box_icon },
        { id: 'address', label: 'Address Book', icon: assets.my_location_image },
        { id: 'settings', label: 'Settings', icon: assets.menu_icon },
    ];

    // --- Fetch Data ---
    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const headers = { 'Authorization': `Bearer ${token}` };

                // 1. Profile
                const profileRes = await fetch('http://localhost:8080/api/users/profile', { headers });
                if (profileRes.ok) setProfile(await profileRes.json());

                // 2. Orders
                const ordersRes = await fetch('http://localhost:8080/api/orders', { headers });
                if (ordersRes.ok) {
                    const data = await ordersRes.json();
                    setOrders(Array.isArray(data) ? data.slice(0, 5) : []);
                }
                // 3. Address
                const addressRes = await fetch('http://localhost:8080/api/users/address', { headers });

                // Status 204 (No Content) කියන්නේ Address එකක් නෑ කියන එක. එතකොට Error එකක් නෙමෙයි.
                if (addressRes.ok && addressRes.status !== 204) {
                    const addressData = await addressRes.json(); // Data තියෙනවා නම් විතරක් JSON කරන්න
                    setAddress(addressData);
                } else {
                    setAddress(null); // Address නැත්නම් null කරන්න
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, token, router, isLoading]);

    // app/account/page.tsx ඇතුලේ

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation: Image එකක්ද සහ Size එක 2MB ට අඩුද කියලා බලනවා
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size should be less than 2MB");
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        const toastId = toast.loading("Uploading image...");

        try {
            const response = await fetch('http://localhost:8080/api/users/profile/image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Content-Type දාන්න එපා! FormData යවනකොට Browser එක ඉබේම හදාගන්නවා.
                },
                body: formData
            });

            if (response.ok) {
                const newImageUrl = await response.text();
                // Profile State එක update කරනවා අලුත් පින්තූරයත් එක්ක
                setProfile(prev => prev ? { ...prev, imageUrl: newImageUrl } : null);
                toast.success("Profile picture updated!", { id: toastId });
            } else {
                toast.error("Failed to upload image", { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error("Error uploading image", { id: toastId });
        }
    };

    if (isLoading || loading) {
        return <div className="min-h-screen flex items-center justify-center font-poppins text-gray-400 animate-pulse">Loading...</div>;
    }

    // --- Render Content Section ---
    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
            // ... existing imports and code ...

            case 'profile':
                return (
                    <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-sm">

                        {/* Header */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Update your personal profile details securely.
                            </p>
                        </div>

                        {/* Profile Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase">First Name</label>
                                <div className="p-4 bg-gray-50 rounded-xl text-gray-800 border border-gray-200">
                                    {profile?.firstName}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Last Name</label>
                                <div className="p-4 bg-gray-50 rounded-xl text-gray-800 border border-gray-200">
                                    {profile?.lastName}
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
                                <div className="p-4 bg-gray-50 rounded-xl text-gray-800 border border-gray-200 flex items-center justify-between">
                                    <span>{profile?.email}</span>
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                        Verified
                                    </span>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Account Role</label>
                                <div className="p-4 bg-gray-50 rounded-xl text-gray-800 border border-gray-200 uppercase">
                                    {profile?.role}
                                </div>
                            </div>

                        </div>

                        {/* Edit Button */}
                        <div className="flex justify-end mt-10">
                            <button className="text-sm font-semibold text-white bg-gray-900 px-6 py-3 rounded-lg hover:bg-black transition">
                                Edit Profile
                            </button>
                        </div>

                    </div>
                );


            case 'orders':
                return (
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm animate-fadeIn">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 font-poppins">Order History</h2>
                            <p className="text-sm text-gray-400 mt-1">Check the status of recent orders.</p>
                        </div>
                        {orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 hover:shadow-md transition-all duration-300 cursor-pointer group bg-white">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors duration-300">
                                                <Image src={assets.box_icon} alt="Order" className="w-5 opacity-40 group-hover:opacity-100 group-hover:text-orange-600 transition-all duration-300" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm font-poppins group-hover:text-orange-600 transition-colors">Order #{order.id}</p>
                                                <p className="text-xs text-gray-400 mt-0.5 font-roboto">{new Date(order.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 text-base font-poppins">LKR {order.totalAmount.toLocaleString()}</p>
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md inline-block mt-1 uppercase tracking-wide ${order.status === 'Completed' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-yellow-50 text-yellow-600 border border-yellow-100'}`}>{order.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm font-medium">No orders placed yet.</p>
                            </div>
                        )}
                    </div>
                );

            case 'address':
                return (
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm animate-fadeIn relative overflow-hidden">
                        {/* Decorative Background Circle */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-full filter blur-3xl opacity-40 -mr-10 -mt-10 pointer-events-none"></div>

                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 font-poppins">Address Book</h2>
                                <p className="text-sm text-gray-400 mt-1 font-roboto">Manage shipping and delivery addresses.</p>
                            </div>
                            <button className="text-xs font-bold text-white bg-gray-900 px-5 py-2.5 rounded-xl hover:bg-black transition shadow-lg shadow-gray-200 flex items-center gap-2 transform hover:-translate-y-0.5 duration-200">
                                <span className="text-lg leading-none pb-0.5">+</span> Add New
                            </button>
                        </div>

                        {address ? (
                            <div className="border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 p-7 rounded-3xl relative group hover:shadow-lg hover:border-orange-100 transition-all duration-300 z-10">
                                <div className="absolute top-5 right-5">
                                    <span className="text-[10px] font-bold bg-white border border-gray-100 text-gray-500 px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider group-hover:text-orange-500 group-hover:border-orange-100 transition-colors">Default</span>
                                </div>
                                <div className="flex items-start gap-6">
                                    <div className="mt-1 p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                                        <Image src={assets.my_location_image} alt="Location" className="w-6 opacity-70" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg font-poppins">{profile?.firstName} {profile?.lastName}</h4>
                                        <div className="text-sm text-gray-500 font-roboto mt-3 leading-relaxed space-y-1">
                                            <p className="font-medium text-gray-700">{address.street}</p>
                                            <p>{address.city}, {address.zipCode}</p>
                                            <p>{address.province}</p>
                                        </div>
                                        <div className="mt-5 flex items-center gap-2 text-xs text-gray-600 font-bold bg-white px-4 py-2 rounded-lg border border-gray-100 w-fit shadow-sm group-hover:border-orange-100 transition-colors">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            {address.phone}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-5 border-t border-gray-100 flex gap-6 pl-[4.5rem]">
                                    <button className="text-xs font-bold text-gray-400 hover:text-orange-600 uppercase tracking-widest transition duration-200 flex items-center gap-1">
                                        Edit
                                    </button>
                                    <button className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition duration-200">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200 relative z-10">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-50">
                                    <Image src={assets.my_location_image} alt="No Address" className="w-8 opacity-20 grayscale" />
                                </div>
                                <p className="text-gray-400 text-sm font-medium">No address saved yet.</p>
                                <p className="text-xs text-gray-300 mt-1">Add a shipping address to speed up checkout.</p>
                            </div>
                        )}
                    </div>
                );

            case 'settings':
                return (
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm animate-fadeIn">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 font-poppins">Settings</h2>
                            <p className="text-sm text-gray-400 mt-1">Security and preferences.</p>
                        </div>
                        <div className="space-y-3">
                            {['Change Password', 'Notification Preferences'].map((item, idx) => (
                                <button key={idx} className="w-full flex items-center justify-between p-5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition text-left group bg-white">
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 font-poppins">{item}</span>
                                    <Image src={assets.arrow_right_icon_colored} alt="arrow" className="w-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition" />
                                </button>
                            ))}
                            <button className="w-full p-4 border border-red-100 bg-red-50/30 rounded-2xl text-red-500 text-sm font-bold hover:bg-red-50 transition mt-4">Delete Account</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    // --- Main Render ---
    return (
        <div className='bg-[#F8F9FA] min-h-screen pb-20'>
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
                {/* Header Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 font-poppins tracking-tight">My Account</h1>
                    <p className="text-gray-500 text-sm mt-2 font-roboto">Welcome back, {profile?.firstName}!</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 items-start">

                    {/* Sidebar */}
                    <div className="w-full lg:w-1/4">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-28">

                            {/* Profile Picture */}
                            <div className="flex flex-col items-center mb-8 relative group">
                                <div className="w-28 h-28 rounded-full border-[6px] border-white shadow-xl overflow-hidden relative bg-gray-100 cursor-pointer">
                                    {profile?.imageUrl ? (
                                        <img src={profile.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300 bg-gray-50">
                                            {profile?.firstName?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    {/* Overlay */}
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                                    >
                                        <Image src={assets.upload_area} alt="upload" className="w-8 h-8 brightness-0 invert" />
                                    </div>
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />

                                <h2 className="mt-4 text-xl font-bold text-gray-900 font-poppins">{profile?.firstName} {profile?.lastName}</h2>
                                <p className="text-xs text-gray-500 font-medium mt-1 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wide">{profile?.role}</p>
                            </div>

                            {/* Menu */}
                            <nav className="space-y-2">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-300 ${activeTab === item.id
                                            ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 transform scale-[1.02]'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full transition-colors ${activeTab === item.id ? 'bg-orange-500 scale-150' : 'bg-gray-300'}`}></span>
                                        {item.label}
                                    </button>
                                ))}
                            </nav>

                            <div className="my-8 border-t border-gray-100 mx-2"></div>

                            <button onClick={logout} className="w-full px-4 py-3.5 rounded-2xl text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 transition flex items-center justify-center gap-2 group">
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
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