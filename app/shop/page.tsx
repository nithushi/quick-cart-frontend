'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductItem from '../components/ProductItem';
import { assets } from '@/app/assets/assets';

// Product සඳහා Interface එක
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    rating?: number;
}

const Shop = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Backend එකෙන් සියලුම Products ලබා ගැනීම
                const response = await fetch('http://localhost:8080/api/products');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    console.error("Failed to fetch products");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            
            <div className="px-6 md:px-16 py-10 min-h-[60vh]">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-10 mt-5">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center font-poppins">All Products</h2>
                    <div className="w-20 h-1 bg-orange-500 rounded-full"></div>
                </div>

                {/* Content Section */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500 font-poppins">Loading products...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.length > 0 ? (
                            products.map((item) => (
                                <ProductItem 
                                    key={item.id} 
                                    id={item.id.toString()} 
                                    name={item.name} 
                                    price={item.price} 
                                    // Image URL එක හරිගැස්සීම
                                    image={
                                        item.imageUrl 
                                            ? (item.imageUrl.startsWith('http') 
                                                ? item.imageUrl 
                                                : `http://localhost:8080${item.imageUrl}`)
                                            : (assets.box_icon as any)
                                    }
                                    description={item.description} 
                                    rating={item.rating || 4} // Rating එකක් නැත්නම් Default 4ක් පෙන්වයි
                                />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500 font-poppins">No products found.</p>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
};

export default Shop;