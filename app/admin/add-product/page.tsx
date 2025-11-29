'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { assets } from '@/app/assets/assets';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const { token, isAuthenticated } = useAuth();
    const router = useRouter();

    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Electronics',
        rating: '5'
    });

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // Categories List
    const categories = ["Electronics", "Fashion", "Home & Garden", "Sports", "Toys", "Earphone", "Laptop", "Watch"];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error("Please login as Admin");
            router.push('/login');
            return;
        }

        if (!image) {
            toast.error("Please select a product image");
            return;
        }

        const toastId = toast.loading("Adding Product...");

        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('price', product.price);
        formData.append('category', product.category);
        formData.append('rating', product.rating);
        formData.append('image', image);

        try {
            const response = await fetch('http://localhost:8080/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                toast.success("Product added successfully!", { id: toastId });
                setProduct({ name: '', description: '', price: '', category: 'Electronics', rating: '5' });
                removeImage();
                router.push('/shop');
            } else {
                toast.error("Failed to add product", { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error("Error connecting to server", { id: toastId });
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 font-poppins">Add New Product</h1>
                    <p className="text-sm text-gray-500 mt-1 font-poppins">Create a new product to add to your store.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column - Image Upload */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-800 mb-4 font-poppins uppercase tracking-wide">Product Image</h3>
                        
                        <div className={`relative flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${preview ? 'border-orange-200 bg-orange-50' : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'}`}>
                            
                            {preview ? (
                                <>
                                    <Image src={preview} alt="Preview" fill className="object-contain p-4 rounded-xl" />
                                    <button 
                                        type="button" 
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 bg-white text-red-500 p-1.5 rounded-full shadow-md hover:bg-red-50 transition z-10"
                                    >
                                        ✕
                                    </button>
                                </>
                            ) : (
                                <>
                                    <input 
                                        type="file" 
                                        onChange={handleImageChange} 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="image/*"
                                    />
                                    <div className="flex flex-col items-center text-center p-6">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                            <Image src={assets.upload_area} alt="upload" className="w-6 h-6 opacity-40" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-700 font-poppins">Click to upload image</p>
                                        <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Product Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-800 mb-6 font-poppins uppercase tracking-wide">General Information</h3>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Product Name</label>
                                <input 
                                    required 
                                    name="name" 
                                    value={product.name} 
                                    onChange={handleInputChange} 
                                    type="text" 
                                    placeholder="Type product name here..." 
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition font-roboto" 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Description</label>
                                <textarea 
                                    required 
                                    name="description" 
                                    value={product.description} 
                                    onChange={handleInputChange} 
                                    rows={5} 
                                    placeholder="Type product description here..." 
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition font-roboto resize-none"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-800 mb-6 font-poppins uppercase tracking-wide">Pricing & Category</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Base Price (LKR)</label>
                                <input 
                                    required 
                                    name="price" 
                                    value={product.price} 
                                    onChange={handleInputChange} 
                                    type="number" 
                                    placeholder="0.00" 
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition font-roboto" 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Category</label>
                                <select 
                                    name="category" 
                                    value={product.category} 
                                    onChange={handleInputChange} 
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition font-roboto bg-white cursor-pointer"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5 font-poppins">Initial Rating</label>
                                <input 
                                    name="rating" 
                                    value={product.rating} 
                                    onChange={handleInputChange} 
                                    type="number" 
                                    step="0.1" 
                                    max="5" 
                                    min="0" 
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition font-roboto" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button 
                            type="submit" 
                            className="bg-orange-600 text-white font-semibold py-3 px-8 rounded-xl hover:bg-orange-700 transition shadow-lg hover:shadow-orange-200 transform hover:-translate-y-0.5 active:translate-y-0 duration-200 font-poppins flex items-center gap-2"
                        >
                            <span className="text-xl leading-none pb-1">+</span> Add Product
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default AddProduct;