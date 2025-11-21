import React from 'react';
import { productsDummyData } from '@/app/assets/assets';
import ProductItem from '@/app/components/ProductItem';

const FeaturedProducts = () => {
  return (
    <div className="px-6 md:px-16 py-10">
        <div className='flex flex-col items-center mb-10'>
             <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Featured Products</h2>
             <div className='w-20 h-1 bg-orange-500 rounded-full'></div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsDummyData.slice(0, 4).map((item, index) => (
                <ProductItem 
                    key={index} 
                    id={item._id} 
                    name={item.name} 
                    price={item.price} 
                    image={item.image}
                    description={item.description} 
                />
            ))}
        </div>
    </div>
  );
};

export default FeaturedProducts;