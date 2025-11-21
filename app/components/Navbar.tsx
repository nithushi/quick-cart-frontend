'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { assets } from '@/app/assets/assets';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext'; // AuthContext එක import කරන්න

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  // useAuth hook එකෙන් අවශ්‍ය දත්ත ගන්න
  const { isAuthenticated, user, logout } = useAuth(); 

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 py-4 border-b border-gray-200 bg-white sticky top-0 z-50">
        {/* Logo */}
        <Link href="/" className='w-28'>
            <Image src={assets.logo} alt="Logo" className="w-full" />
        </Link>

        {/* Navigation Links - Desktop */}
        <ul className="hidden md:flex gap-8 text-gray-600 font-medium font-poppins">
            <Link href="/" className={`hover:text-black transition ${pathname === '/' ? 'text-black border-b-2 border-black' : ''}`}>Home</Link>
            <Link href="/shop" className="hover:text-black transition">Shop</Link>
            <Link href="/about" className="hover:text-black transition">About Us</Link>
            <Link href="/contact" className="hover:text-black transition">Contact</Link>
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-5">
            <div className='relative group hidden sm:block'>
               <Image src={assets.search_icon} alt="search" className="w-5 cursor-pointer" />
            </div>
            
            {/* User Icon with Dropdown */}
            <div className='relative group'>
                <div className='cursor-pointer p-2 hover:bg-gray-100 rounded-full transition'>
                    <Image src={assets.user_icon} alt="user" className="w-5" />
                </div>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full hidden group-hover:block pt-2 z-20 w-48">
                    <div className="bg-white rounded shadow-lg border border-gray-100 py-2 flex flex-col text-gray-600">
                        
                        {isAuthenticated ? ( // දැන් Context එකෙන් එන isAuthenticated අගය බලනවා
                            <>
                                {/* Logged In State */}
                                <div className="px-4 py-2 border-b border-gray-100 mb-1 cursor-default">
                                    <p className="text-sm font-semibold text-gray-800 truncate font-poppins">Welcome!</p>
                                    <p className="text-xs text-gray-500 truncate font-poppins">{user}</p> {/* Context එකේ තියෙන User Email එක පෙන්වනවා */}
                                </div>
                                <Link href="/account" className="px-4 py-2 hover:bg-gray-100 hover:text-black text-sm text-left font-poppins">
                                    Manage Account
                                </Link>
                                <Link href="/orders" className="px-4 py-2 hover:bg-gray-100 hover:text-black text-sm text-left font-poppins">
                                    My Orders
                                </Link>
                                <button 
                                    onClick={logout} // Context එකේ logout function එක call කරනවා
                                    className="px-4 py-2 hover:bg-gray-100 hover:text-red-600 text-sm text-left w-full font-poppins"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Logged Out State */}
                                <Link href="/login" className="px-4 py-2 hover:bg-gray-100 hover:text-black text-sm text-left font-poppins">
                                    Login
                                </Link>
                                <Link href="/register" className="px-4 py-2 hover:bg-gray-100 hover:text-black text-sm text-left font-poppins">
                                    Register
                                </Link>
                            </>
                        )}

                    </div>
                </div>
            </div>

            <Link href="/cart" className='relative'>
                <Image src={assets.cart_icon} alt="cart" className="w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    0
                </span>
            </Link>
        </div>
    </nav>
  );
};

export default Navbar;