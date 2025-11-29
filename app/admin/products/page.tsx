'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { assets } from '@/app/assets/assets';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    imageUrl: string;
    rating: string;
}

const AllProducts = () => {
    const { token, isAuthenticated } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/products');
            if (response.ok) {
                setProducts(await response.json());
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: number) => {
        if(!confirm("Are you sure you want to delete this product?")) return;

        const toastId = toast.loading("Deleting...");
        try {
            const response = await fetch(`http://localhost:8080/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                toast.success("Product deleted", { id: toastId });
                setProducts(products.filter(p => p.id !== id)); // Remove from UI
            } else {
                toast.error("Failed to delete", { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error("Error deleting product", { id: toastId });
        }
    };

    if (loading) return <div className="p-10 text-center text-gray-500 font-poppins">Loading inventory...</div>;

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 font-poppins">Product Inventory</h1>
                    <p className="text-sm text-gray-500 mt-1 font-poppins">Manage your store's products.</p>
                </div>
                <Link href="/admin/add-product" className="bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-orange-700 transition font-poppins shadow-lg shadow-orange-200">
                    + Add New
                </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm font-poppins">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Image</th>
                                <th className="px-6 py-4 font-semibold">Name</th>
                                <th className="px-6 py-4 font-semibold">Category</th>
                                <th className="px-6 py-4 font-semibold">Price</th>
                                <th className="px-6 py-4 font-semibold text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-3">
                                        <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-200 relative">
                                            <Image 
                                                src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:8080${item.imageUrl}`) : (assets.box_icon as any)}
                                                alt={item.name}
                                                fill
                                                className="object-contain p-1"
                                                unoptimized={true}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{item.category}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900 font-roboto">LKR {item.price.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition"
                                            title="Delete Product"
                                        >
                                            <Image src={assets.search_icon} alt="delete" width={18} height={18} className="filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:invert-[.25] sepia saturate-[5000%] hue-rotate-[340deg]" />
                                            {/* Note: If you don't have a trash icon, use text: */}
                                            {/* <span className="text-xs font-bold border border-red-200 px-3 py-1 rounded-md">Delete</span> */}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {products.length === 0 && (
                    <div className="p-10 text-center text-gray-400 font-poppins">No products found.</div>
                )}
            </div>
        </div>
    );
};

export default AllProducts;