'use client';
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductItem from '../components/ProductItem';
import { useWishlist } from '../context/WishlistContext';
import { assets } from '@/app/assets/assets';
import Image from 'next/image';
import Link from 'next/link';

const Wishlist = () => {
    const { wishlist } = useWishlist();

    return (
        <div className='bg-white min-h-screen'>
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
                <div className="flex flex-col items-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 font-poppins">My Wishlist</h1>
                    <div className='w-16 h-1 bg-orange-500 rounded-full mt-2'></div>
                    <p className="text-gray-500 mt-2 font-roboto">{wishlist.length} Items Saved</p>
                </div>

                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlist.map((item) => (
                            <ProductItem 
                                key={item.id} 
                                id={item.id} 
                                name={item.name} 
                                price={item.price} 
                                image={item.image} 
                                description={item.description} 
                                rating={item.rating} 
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Image src={assets.heart_icon} alt="Empty Wishlist" className="w-6 opacity-20 grayscale" />
                        </div>
                        <p className="text-gray-500 text-lg font-poppins mb-6">Your wishlist is empty.</p>
                        <Link href="/shop" className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition font-poppins inline-block">
                            Continue Shopping
                        </Link>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Wishlist;