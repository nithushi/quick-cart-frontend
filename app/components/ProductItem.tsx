import React from 'react';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { assets } from '@/app/assets/assets';
import { useWishlist } from '@/app/context/WishlistContext'; // 1. Import

interface ProductProps {
    id: string;
    name: string;
    price: number;
    image: string | StaticImageData;
    description: string;
    category?: string;
    rating?: number;
}

const ProductItem = ({ id, name, price, image, description, rating = 4 }: ProductProps) => {
  
  // 2. Wishlist Hook එක පාවිච්චි කරන්න
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(id);

  // 3. Toggle Function එක
  const handleWishlistClick = (e: React.MouseEvent) => {
      e.preventDefault(); // Link එක click වෙලා Page එක මාරු වෙන එක නවත්වන්න
      if (isWishlisted) {
          removeFromWishlist(id);
      } else {
          addToWishlist({ id, name, price, image, description, rating });
      }
  };

  return (
    <Link href={`/product/${id}`} className="group cursor-pointer flex flex-col gap-3 p-7 rounded-xl hover:shadow-xl transition-all duration-300 bg-white border border-transparent hover:border-gray-100 relative">
        
        {/* Image Section */}
        <div className="bg-gray-100 rounded-xl overflow-hidden relative h-60 flex items-center justify-center group-hover:bg-gray-50 transition">
            
            {/* 4. Heart Icon එක Update කළා */}
            <div 
                onClick={handleWishlistClick}
                className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm hover:scale-110 transition z-10 cursor-pointer"
            >
                 <Image 
                    src={assets.heart_icon} 
                    alt="wishlist" 
                    className={`w-3.5 h-3.5 transition-all ${isWishlisted ? 'grayscale-0 opacity-100 scale-110' : 'grayscale opacity-60 hover:opacity-100'}`} 
                    // Note: ඔයාගේ heart icon එක රතු පාට එකක් නම්, grayscale පාවිච්චි කරලා select නැති විට කළු/සුදු කරන්න පුළුවන්.
                    // නැත්නම් Heart Filled / Heart Outline කියලා අයිකන් දෙකක් මාරු කරන්නත් පුළුවන්.
                 />
                 {/* දැනට තියෙන icon එකේ පාට වෙනස් කරන්න අමාරු නම්, සරලව opacity එකෙන් පෙන්නමු */}
                 {isWishlisted && <div className="absolute inset-0 bg-red-500 opacity-20 rounded-full"></div>}
            </div>

            <Image 
                src={image} 
                alt={name} 
                width={200} 
                height={200}
                className="object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                unoptimized={true} 
            />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-1.5 mt-1">
            <h3 className="text-base font-semibold text-gray-800 truncate font-poppins">{name}</h3>
            <p className="text-xs text-gray-500 line-clamp-2 font-roboto leading-relaxed">{description}</p>
            
            <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, index) => (
                    <Image 
                        key={index} 
                        src={index < Math.floor(rating) ? assets.star_icon : assets.star_dull_icon} 
                        alt="star" 
                        className="w-3 h-3" 
                    />
                ))}
                <p className='text-xs text-gray-400 ml-1 font-roboto'>({rating})</p>
            </div>

            <div className='flex items-center justify-between mt-3'>
                <p className="text-lg font-bold text-gray-900 font-poppins">LKR {price}</p>
                <button className='border border-gray-300 text-gray-600 px-4 py-1.5 text-xs rounded-full font-medium hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-300 font-poppins'>
                    Buy now
                </button>
            </div>
        </div>
    </Link>
  );
};

export default ProductItem;