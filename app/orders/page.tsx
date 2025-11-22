'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '@/app/context/AuthContext';
import { assets } from '@/app/assets/assets';

// Interfaces
interface Product {
    id: number;
    name: string;
    imageUrl: string;
    category: string;
}

interface OrderItem {
    id: number;
    product: Product;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    date: string;
    totalAmount: number;
    status: string;
    orderItems: OrderItem[];
}

const MyOrders = () => {
    const { token, isAuthenticated, isLoading } = useAuth(); // 1. isLoading ලබා ගන්න
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        // 2. Auth Loading නම් මුකුත් කරන්න එපා (ඉන්න)
        if (isLoading) return;

        // 3. Loading ඉවර වුනාම, User Login වෙලා නැත්නම් විතරක් එලවන්න
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoadingData(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, token, router, isLoading]); // Dependencies වලට isLoading එකතු කරන්න

    // 4. Auth Check කරනකම් හෝ Data එනකම් Loading පෙන්වන්න
    if (isLoading || loadingData) return <div className="text-center py-20 font-poppins text-gray-500">Loading...</div>;

    return (
        <div className='bg-[#F8F9FA] min-h-screen'>
            <Navbar />
            
            <div className="max-w-6xl mx-auto px-6 md:px-16 py-12">
                <h1 className="text-3xl font-bold text-gray-900 font-poppins mb-8">My Orders</h1>

                {orders.length > 0 ? (
                    <div className="flex flex-col gap-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl border font-poppins border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
                                
                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Order ID</p>
                                        <p className="text-sm font-bold text-gray-800 font-poppins">#{order.id}</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Date Placed</p>
                                        <p className="text-sm font-medium text-gray-700 font-roboto">
                                            {new Date(order.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Amount</p>
                                        <p className="text-sm font-bold text-gray-900 font-poppins">LKR {order.totalAmount.toLocaleString()}</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Status</p>
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide w-fit">
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="flex flex-col gap-4">
                                        {order.orderItems.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4 border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                                                <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 flex-shrink-0 relative">
                                                    <Image 
                                                        src={item.product.imageUrl 
                                                            ? (item.product.imageUrl.startsWith('http') ? item.product.imageUrl : `http://localhost:8080${item.product.imageUrl}`) 
                                                            : (assets.box_icon as any)}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-contain p-2 mix-blend-multiply"
                                                        unoptimized={true}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold text-gray-800 font-poppins">{item.product.name}</h4>
                                                    <p className="text-xs text-gray-500 mt-0.5 font-roboto">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-gray-800 font-roboto">LKR {item.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-center mb-4">
                            <Image src={assets.order_icon} alt="no orders" className="w-16 h-16 opacity-20" />
                        </div>
                        <p className="text-gray-500 text-lg font-poppins mb-6">You haven't placed any orders yet.</p>
                        <button 
                            onClick={() => router.push('/shop')}
                            className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition font-poppins shadow-lg"
                        >
                            Start Shopping
                        </button>
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    );
};

export default MyOrders;