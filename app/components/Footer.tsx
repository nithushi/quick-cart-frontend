import React from 'react';
import Image from 'next/image';
import { assets } from '@/app/assets/assets';

const Footer = () => {
    return (
        <footer>
            <hr className="border-gray-300" />
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm px-6 md:px-16">

                {/* Left Section - Logo & Description */}
                <div>
                    <Image src={assets.logo} alt="Logo" className="mb-5 w-32" />
                    <p className="w-full md:w-2/3 text-gray-600 font-poppins">
                        QuickCart is your one-stop destination for all your shopping needs. We provide high-quality products with exceptional customer service. Shop with confidence and enjoy fast delivery.
                    </p>
                </div>

                {/* Center Section - Company Links */}
                <div>
                    <p className="text-xl font-medium mb-5 text-gray-800 font-poppins">COMPANY</p>
                    <ul className="flex flex-col gap-1 text-gray-600 font-poppins">
                        <li className="cursor-pointer hover:text-black transition">Home</li>
                        <li className="cursor-pointer hover:text-black transition">About us</li>
                        <li className="cursor-pointer hover:text-black transition">Delivery</li>
                        <li className="cursor-pointer hover:text-black transition">Privacy policy</li>
                    </ul>
                </div>

                {/* Right Section - Contact Info */}
                <div>
                    <p className="text-xl font-medium mb-5 text-gray-800 font-poppins">GET IN TOUCH</p>
                    <ul className="flex flex-col gap-1 text-gray-600 font-poppins">
                        <li>+94-112-345-678</li>
                        <li>contact@quickcart.dev</li>
                        <li className='cursor-pointer hover:text-black transition'>Instagram</li>
                    </ul>
                </div>
            </div>

            {/* Copyright Section */}
            <div>
                <hr className="border-gray-300" />
                <p className="py-5 text-sm text-center text-gray-600 font-poppins">
                    Copyright 2025 @Nithushi Shavindi - All Right Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;