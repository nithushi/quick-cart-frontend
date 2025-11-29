'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { assets } from '@/app/assets/assets';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';

// Interfaces
interface Order {
    id: number;
    date: string;
    totalAmount: number;
    status: string;
    fullName: string;
    phoneNumber: string;
    address: string;
    city: string;
    zipCode: string;
    orderItems: {
        id: number;
        quantity: number;
        price: number;
        product: {
            name: string;
            imageUrl: string;
        }
    }[];
}

const AdminOrders = () => {
    const { token, isAuthenticated } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Modal එකට

    const statusOptions = ["Placed", "Processing", "Shipped", "Delivered", "Cancelled"];

    // Fetch Orders
    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/admin/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setOrders(await response.json());
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) fetchOrders();
    }, [isAuthenticated, token]);

    // Update Order Status
    const handleStatusChange = async (orderId: number, newStatus: string) => {
        const toastId = toast.loading("Updating status...");
        try {
            const response = await fetch(`http://localhost:8080/api/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                toast.success("Status updated!", { id: toastId });
                // Local State එක Update කරන්න (Refresh නොවී)
                setOrders(prev => prev.map(order => 
                    order.id === orderId ? { ...order, status: newStatus } : order
                ));
            } else {
                toast.error("Failed to update", { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating status", { id: toastId });
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500 font-poppins">Loading orders...</div>;

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 font-poppins">Manage Orders</h1>
                    <p className="text-sm text-gray-500 mt-1 font-poppins">View and update order statuses.</p>
                </div>
                <div className="text-sm text-gray-500 font-roboto bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    Total Orders: <span className="font-bold text-gray-900">{orders.length}</span>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm font-poppins">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Order ID</th>
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Total</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <p className="font-medium text-gray-800">{order.fullName}</p>
                                        <p className="text-xs text-gray-400">{order.phoneNumber}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 font-roboto">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-bold text-gray-800 font-roboto">LKR {order.totalAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <select 
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border outline-none cursor-pointer transition ${
                                                order.status === 'Placed' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                order.status === 'Processing' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                                                order.status === 'Shipped' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                                                order.status === 'Delivered' ? 'bg-green-50 text-green-600 border-green-200' :
                                                'bg-red-50 text-red-600 border-red-200'
                                            }`}
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => setSelectedOrder(order)}
                                            className="text-orange-600 hover:text-orange-700 font-medium text-xs border border-orange-200 hover:border-orange-400 px-4 py-2 rounded-lg transition"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {orders.length === 0 && (
                    <div className="p-10 text-center text-gray-400 font-poppins">No orders found.</div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 font-poppins">Order Details</h3>
                                <p className="text-xs text-gray-500">ID: #{selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                        </div>
                        
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {/* Shipping Info */}
                            <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide font-poppins">Shipping Information</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 font-roboto">
                                    <div>
                                        <p className="text-xs text-gray-400">Customer Name</p>
                                        <p className="font-medium text-gray-800">{selectedOrder.fullName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Phone Number</p>
                                        <p className="font-medium text-gray-800">{selectedOrder.phoneNumber}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-400">Address</p>
                                        <p className="font-medium text-gray-800">{selectedOrder.address}, {selectedOrder.city}, {selectedOrder.zipCode}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide font-poppins">Items Ordered</h4>
                                <div className="space-y-3">
                                    {selectedOrder.orderItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 border border-gray-100 p-3 rounded-lg">
                                            <div className="w-12 h-12 bg-gray-50 rounded-md relative flex-shrink-0 border border-gray-200">
                                                <Image 
                                                    src={item.product.imageUrl 
                                                        ? (item.product.imageUrl.startsWith('http') ? item.product.imageUrl : `http://localhost:8080${item.product.imageUrl}`) 
                                                        : (assets.box_icon as any)}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-contain p-1 mix-blend-multiply"
                                                    unoptimized={true}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-800 font-poppins">{item.product.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity} x LKR {item.price.toLocaleString()}</p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900 font-roboto">LKR {(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button 
                                onClick={() => setSelectedOrder(null)}
                                className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-black transition font-poppins"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;