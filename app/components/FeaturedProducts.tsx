import React from 'react';
import Image from 'next/image';
import { assets } from '@/app/assets/assets';

const FeaturedProducts = () => {
  // Screenshot එකේ තියෙන විදියට කාඩ්පත් 3 සඳහා දත්ත (Static Data)
  const features = [
    {
      id: 1,
      title: "Unparalleled Sound",
      description: "Experience crystal-clear audio with premium headphones.",
      image: assets.girl_with_headphone_image,
      link: "/shop/headphones"
    },
    {
      id: 2,
      title: "Stay Connected",
      description: "Compact and stylish earphones for every occasion.",
      image: assets.girl_with_earphone_image,
      link: "/shop/earphones"
    },
    {
      id: 3,
      title: "Power in Every Pixel",
      description: "Shop the latest laptops for work, gaming, and more.",
      image: assets.boy_with_laptop_image,
      link: "/shop/laptops"
    }
  ];

  return (
    <div className="px-6 md:px-16 py-16">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center font-poppins">
          Featured Products
        </h2>
        {/* Orange Underline */}
        <div className="w-16 h-1 bg-orange-500 mt-2 rounded-full"></div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((item) => (
          <div 
            key={item.id} 
            className="relative h-[650px] rounded-xl overflow-hidden group cursor-pointer shadow-lg"
          >
            {/* Background Image */}
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              placeholder="blur" // Optional: if using static imports
            />

            {/* Dark Gradient Overlay (for text readability) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>

            {/* Text Content */}
            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-start gap-3">
              <h3 className="text-white text-2xl font-bold font-poppins leading-tight">
                {item.title}
              </h3>
              <p className="text-gray-200 text-sm font-roboto leading-relaxed">
                {item.description}
              </p>
              
              {/* Buy Now Button */}
              <button className="mt-2 bg-orange-600 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-orange-700 transition-colors flex items-center gap-2 font-poppins">
                Buy now
                <Image 
                    src={assets.redirect_icon} 
                    alt="redirect" 
                    className="w-3 h-3 invert opacity-80" 
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;