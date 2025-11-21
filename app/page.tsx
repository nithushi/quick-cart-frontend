import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import PopularProducts from './components/PopularProducts';
import Image from 'next/image';
import { assets } from '@/app/assets/assets';

export default function Home() {
  return (
    <main className="min-h-screen bg-white pb-10">
      <Navbar /> 
      <Hero />
      
      {/* Popular Products Section (Placeholder for now) */}
      <div className="px-6 md:px-16 py-8">
        <h3 className="text-xl font-semibold text-gray-700  font-poppins">Popular products</h3>
        {/* You can add a slider component here later */}
      </div>

      {/* <FeaturedProducts/> */}
      <PopularProducts/>

      {/* Middle Banner - JBL Speaker Section */}
      <div className="mx-6 md:mx-16 my-16 bg-[#EAEFF5] rounded-xl px-8 py-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
          {/* Left Image */}
          <div className="md:w-1/3 flex justify-center z-10">
               <Image src={assets.jbl_soundbox_image} alt="JBL Speaker" className="h-48 md:h-64 object-contain" />
          </div>

          {/* Middle Text */}
          <div className="md:w-1/3 text-center z-10 mt-6 md:mt-0">
               <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 font-poppins">Level Up Your <br/> Gaming Experience</h2>
               <p className="text-gray-500 text-sm mb-6 font-poppins">From immersive sound to precise controls — everything you need to win</p>
               <button className="bg-orange-600 text-white px-8 py-2.5 rounded-md font-medium hover:bg-orange-700 transition font-poppins">
                   Buy now
               </button>
          </div>

          {/* Right Image (Controller) */}
          <div className="md:w-1/3 flex justify-center z-10 mt-6 md:mt-0">
               <Image src={assets.md_controller_image} alt="Controller" className="h-40 md:h-52 object-contain" />
          </div>
      </div>

      {/* Footer Subscribe Section */}
      <div className='flex flex-col items-center justify-center py-10 px-4'>
           <h2 className='text-2xl font-bold text-gray-800 font-poppins'>Subscribe now & get 20% off</h2>
           <p className='text-gray-500 mt-2 text-sm text-center font-poppins'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
           <div className='mt-6 flex w-full max-w-md'>
               <input 
                 type="email" 
                 placeholder='Enter your email id' 
                 className='w-full border border-gray-300 px-4 py-2 outline-none' 
               />
               <button className='bg-orange-600 text-white px-6 py-2 hover:bg-orange-700 font-poppins'>Subscribe</button>
           </div>
      </div>

      <Footer/>

    </main>
  );
}