'use client';
import React, { useEffect, useState } from 'react';
import ProductItem from './ProductItem';
import { assets } from '@/app/assets/assets';
import { StaticImageData } from 'next/image';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    rating: string; // 1. Database එකේ rating එක String එකක් නිසා මෙතන string දැම්මා
}

const PopularProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products');
        if (response.ok) {
            const data: Product[] = await response.json();
            
            // 2. Rating එක 5 වන නිෂ්පාදන පමණක් තෝරා ගැනීම
            // (Backend එකෙන් එන rating එක string එකක් නිසා parseFloat පාවිච්චි කරමු)
            const topRatedProducts = data.filter(item => parseFloat(item.rating) === 4.5);
            
            setProducts(topRatedProducts);
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

  if (loading) {
    return <div className="text-center py-10 font-poppins text-gray-500">Loading products...</div>;
  }

  return (
    <div className="px-6 md:px-16 py-20">
        <div className='flex flex-col items-center mb-10'>
             <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center font-poppins">Popular Products</h2>
             <div className='w-20 h-1 bg-orange-500 rounded-full'></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
                products.slice(0, 4).map((item) => (
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
                        
                        // 3. Database එකෙන් ආපු Rating එක ProductItem එකට යැවීම
                        rating={parseFloat(item.rating)} 
                    />
                ))
            ) : (
                <p className="col-span-full text-center text-gray-500 font-poppins">No 5-star products found.</p>
            )}
        </div>
    </div>
  );
};

export default PopularProducts;