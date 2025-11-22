'use client';
import React, { useState } from 'react'; // useState එකතු කරන්න
import Image from 'next/image';
import Link from 'next/link';
import { assets } from '@/app/assets/assets';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth(); 
  
  // Search State
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault(); // Page reload නවත්වන්න
      if(searchQuery.trim()) {
          router.push(`/shop?search=${searchQuery}`); // Shop පිටුවට යවනවා query එකත් එක්ක
          setShowSearch(false); // Search box එක වහනවා (optional)
      }
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 py-4 border-b border-gray-200 bg-white sticky top-0 z-50">
        {/* Logo */}
        <Link href="/" className='w-28'>
            <Image src={assets.logo} alt="Logo" className="w-full" />
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-8 text-gray-600 font-medium font-poppins">
            <Link href="/" className={`hover:text-black transition ${pathname === '/' ? 'text-black border-b-2 border-black' : ''}`}>Home</Link>
            <Link href="/shop" className={`hover:text-black transition ${pathname === '/shop' ? 'text-black border-b-2 border-black' : ''}`}>Shop</Link>
            <Link href="/about" className="hover:text-black transition">About Us</Link>
            <Link href="/contact" className="hover:text-black transition">Contact</Link>
        </ul>

        {/* Icons & Search Bar */}
        <div className="flex items-center gap-5">
            
            {/* Search Functionality */}
            <div className='relative group'>
               {showSearch ? (
                   <form onSubmit={handleSearch} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full px-3 py-1 flex items-center shadow-md w-60">
                       <input 
                           type="text" 
                           placeholder="Search..." 
                           className="outline-none text-sm text-gray-700 w-full font-poppins"
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           autoFocus
                       />
                       <button type="submit">
                           <Image src={assets.search_icon} alt="search" className="w-4 cursor-pointer opacity-50 hover:opacity-100" />
                       </button>
                       <span onClick={() => setShowSearch(false)} className="ml-2 text-gray-400 cursor-pointer text-xs">✕</span>
                   </form>
               ) : (
                   <Image 
                       src={assets.search_icon} 
                       alt="search" 
                       className="w-5 cursor-pointer hover:scale-110 transition" 
                       onClick={() => setShowSearch(true)}
                   />
               )}
            </div>
            
            {/* User Icon & Dropdown (කලින් කෝඩ් එක එහෙමම තියන්න) */}
            <div className='relative group'>
                <div className='cursor-pointer p-2 hover:bg-gray-100 rounded-full transition'>
                    <Image src={assets.user_icon} alt="user" className="w-5" />
                </div>
                <div className="absolute right-0 top-full hidden group-hover:block pt-2 z-20 w-48">
                    <div className="bg-white rounded shadow-lg border border-gray-100 py-2 flex flex-col text-gray-600">
                        {isAuthenticated ? (
                            <>
                                <div className="px-4 py-2 border-b border-gray-100 mb-1 cursor-default">
                                    <p className="text-sm font-semibold text-gray-800 truncate font-poppins">Welcome!</p>
                                    <p className="text-xs text-gray-500 truncate font-poppins">{user}</p>
                                </div>
                                <Link href="/account" className="px-4 py-2 hover:bg-gray-100 hover:text-black text-sm text-left font-poppins">
                                    Manage Account
                                </Link>
                                <Link href="/orders" className="px-4 py-2 hover:bg-gray-100 hover:text-black text-sm text-left font-poppins">
                                    My Orders
                                </Link>
                                <button onClick={logout} className="px-4 py-2 hover:bg-gray-100 hover:text-red-600 text-sm text-left w-full font-poppins">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="px-4 py-2 hover:bg-gray-100 hover:text-black text-sm text-left font-poppins">Login</Link>
                                <Link href="/register" className="px-4 py-2 hover:bg-gray-100 hover:text-black text-sm text-left font-poppins">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Link href="/cart" className='relative'>
                <Image src={assets.cart_icon} alt="cart" className="w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </Link>
        </div>
    </nav>
  );
};

export default Navbar;