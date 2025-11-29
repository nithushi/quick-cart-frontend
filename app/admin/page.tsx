'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { assets } from '@/app/assets/assets';
import { useAuth } from '@/app/context/AuthContext';

// Data Types
interface DashboardStats {
    totalSales: number;
    totalOrders: number;
    totalProducts: number;
}

interface Order {
    id: number;
    date: string;
    totalAmount: number;
    status: string;
    user: {
        firstName: string;
        lastName: string;
    };
}

const AdminDashboard = () => {
  const { token, isAuthenticated } = useAuth();
  
  // State for dynamic data
  const [stats, setStats] = useState<DashboardStats>({ totalSales: 0, totalOrders: 0, totalProducts: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
        if (!token) return;

        try {
            // 1. Fetch Stats
            const statsRes = await fetch('http://localhost:8080/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (statsRes.ok) {
                setStats(await statsRes.json());
            }

            // 2. Fetch Recent Orders
            const ordersRes = await fetch('http://localhost:8080/api/admin/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (ordersRes.ok) {
                const allOrders = await ordersRes.json();
                setRecentOrders(allOrders.slice(0, 5)); // අලුත්ම Orders 5 විතරක් ගන්නවා
            }

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (isAuthenticated) {
        fetchDashboardData();
    }
  }, [token, isAuthenticated]);

  return (
    <div className="flex flex-col gap-8 font-poppins w-full">
      
      {/* 1. Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of your store's performance.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">Store Manager</p>
           </div>
           <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold border border-orange-200">
              A
           </div>
        </div>
      </div>

      {/* 2. Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Sales Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                 <h3 className="text-3xl font-bold text-gray-900 font-roboto group-hover:text-orange-600 transition-colors">
                    {loading ? "..." : `LKR ${stats.totalSales.toLocaleString()}`}
                 </h3>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                 <Image src={assets.cart_icon} alt="sales" className="w-6 h-6 opacity-60" />
              </div>
           </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Orders</p>
                 <h3 className="text-3xl font-bold text-gray-900 font-roboto group-hover:text-blue-600 transition-colors">
                    {loading ? "..." : stats.totalOrders}
                 </h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                 <Image src={assets.order_icon} alt="orders" className="w-6 h-6 opacity-60" />
              </div>
           </div>
        </div>

        {/* Total Products Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Products</p>
                 <h3 className="text-3xl font-bold text-gray-900 font-roboto group-hover:text-purple-600 transition-colors">
                    {loading ? "..." : stats.totalProducts}
                 </h3>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                 <Image src={assets.box_icon} alt="products" className="w-6 h-6 opacity-60" />
              </div>
           </div>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side: Sales Analytics Placeholder */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Sales Overview</h3>
              <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <div className="text-center">
                      <p className="text-gray-400 font-medium mb-2">Chart Feature Coming Soon</p>
                      <p className="text-xs text-gray-400">We are working on integrating visual analytics.</p>
                  </div>
              </div>
          </div>

          {/* Right Side: Recent Orders (Dynamic) */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full">
              <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Activity</h3>
              
              <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                          <div key={order.id} className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                              <div className="w-10 h-10 rounded-full bg-orange-50 flex-shrink-0 flex items-center justify-center text-orange-600 font-bold text-xs">
                                  {order.user.firstName.charAt(0)}
                              </div>
                              <div className="flex-1">
                                  <p className="text-sm font-bold text-gray-800">{order.user.firstName} placed an order</p>
                                  <p className="text-xs text-gray-500">LKR {order.totalAmount.toLocaleString()} • {new Date(order.date).toLocaleDateString()}</p>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                                  order.status === 'Placed' ? 'bg-blue-50 text-blue-600' : 
                                  order.status === 'Shipped' ? 'bg-yellow-50 text-yellow-600' : 
                                  'bg-green-50 text-green-600'
                              }`}>
                                  {order.status}
                              </span>
                          </div>
                      ))
                  ) : (
                      <div className="text-center pt-10 text-gray-400 text-sm">
                          No recent activity found.
                      </div>
                  )}
              </div>
          </div>

      </div>
    </div>
  );
};

export default AdminDashboard;