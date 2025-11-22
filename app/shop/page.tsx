'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductItem from '../components/ProductItem';
import { assets } from '@/app/assets/assets';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    rating?: number;
}

const ShopContent = () => {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // ඔයාගේ System එකේ තියෙන Categories ටික මෙතන දාන්න
    const categories = [
        "All", 
        "Electronics", 
        "Fashion", 
        "Home & Garden", 
        "Sports", 
        "Toys",
        "Earphone",
        "Laptop",
        "Watch"
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = 'http://localhost:8080/api/products';

                if (searchQuery) {
                    // Search කරලා නම්
                    url = `http://localhost:8080/api/products/search?query=${searchQuery}`;
                } else if (selectedCategory !== 'All') {
                    // Category එකක් තෝරලා නම්
                    url = `http://localhost:8080/api/products/category/${selectedCategory}`;
                }

                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    setProducts([]); // Error එකක් ආවොත් හෝ Data නැත්නම් Empty කරන්න
                    console.error("Failed to fetch products");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchQuery, selectedCategory]); // Search හෝ Category වෙනස් වෙනකොට මේක Run වෙනවා

    return (
        <div className="px-6 md:px-16 py-10 min-h-[80vh]">
            
            <div className="flex flex-col md:flex-row gap-10">
                
                {/* Left Sidebar - Category Filter */}
                <div className="w-full md:w-1/4 lg:w-1/5">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-24">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 font-poppins border-b pb-2">Categories</h3>
                        <ul className="flex flex-col gap-2">
                            {categories.map((category) => (
                                <li 
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        // Search එක අයින් කරන්න ඕන නම් පහළ පේළිය uncomment කරන්න (optional)
                                        // if(searchQuery) window.history.pushState({}, '', '/shop'); 
                                    }}
                                    className={`cursor-pointer text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 font-poppins flex justify-between items-center ${
                                        selectedCategory === category 
                                            ? 'bg-orange-600 text-white shadow-md' 
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                                    }`}
                                >
                                    {category}
                                    {selectedCategory === category && <span>✓</span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Side - Product Grid */}
                <div className="w-full md:w-3/4 lg:w-4/5">
                    {/* Header */}
                    <div className="flex flex-col items-start mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 font-poppins">
                            {searchQuery ? `Search Results: "${searchQuery}"` : `${selectedCategory} Products`}
                        </h2>
                        <p className="text-gray-500 text-sm font-roboto mt-1">
                            Showing {products.length} results
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-80 bg-gray-100 rounded-xl"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.length > 0 ? (
                                products.map((item) => (
                                    <ProductItem 
                                        key={item.id} 
                                        id={item.id.toString()} 
                                        name={item.name} 
                                        price={item.price} 
                                        image={
                                            item.imageUrl 
                                                ? (item.imageUrl.startsWith('http') 
                                                    ? item.imageUrl 
                                                    : `http://localhost:8080${item.imageUrl}`)
                                                : (assets.box_icon as any)
                                        }
                                        description={item.description} 
                                        rating={item.rating || 4}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    {/* <Image src={assets.product_list_icon || assets.box_icon} alt="no products" width={64} height={64} className="opacity-20 mb-4" /> */}
                                    <p className="text-gray-500 font-poppins text-lg">No products found in this category.</p>
                                    <button 
                                        onClick={() => setSelectedCategory('All')}
                                        className="mt-4 text-orange-600 hover:underline text-sm font-medium"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Shop = () => {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
                <ShopContent />
            </Suspense>
            <Footer />
        </main>
    );
};

export default Shop;