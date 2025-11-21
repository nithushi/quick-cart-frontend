'use client';
import React, { useEffect, useState } from 'react';
import ProductItem from './ProductItem';
import { assets } from '@/app/assets/assets';

// Product Data එක සඳහා Type එකක් හදාගමු
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
}

const PopularProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Spring Boot Backend එකෙන් Data ඉල්ලනවා
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

  if (loading) {
    return <div className="text-center py-10 font-poppins text-gray-500">Loading products...</div>;
  }

  return (
    <div className="px-6 md:px-16 py-4">
        {/* <div className='flex flex-col items-center mb-10'>
             <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center font-poppins">Featured Products</h2>
             <div className='w-20 h-1 bg-orange-500 rounded-full'></div>
        </div> */}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.length > 0 ? (
                products.slice(0, 4).map((item) => (
                    <ProductItem 
                        key={item.id} 
                        id={item.id.toString()} 
                        name={item.name} 
                        price={item.price} 
                        // Backend එකෙන් එන Image URL එක Array එකක් විදියට යවනවා.
                        // Image එක නැත්නම් Placeholder එකක් දානවා.
                        image={[item.imageUrl || assets.box_icon]} 
                        description={item.description} 
                    />
                ))
            ) : (
                <p className="col-span-full text-center text-gray-500 font-poppins">No products found.</p>
            )}
        </div>
    </div>
  );
};

export default PopularProducts;