import React from 'react';
import Image from 'next/image';
import { assets } from '@/app/assets/assets';

const Hero = () => {
    return (
        <section className="bg-[#F3F4F6] px-6 md:px-16 py-12 md:py-0 flex flex-col-reverse md:flex-row items-center justify-between mx-4 md:mx-10 rounded-xl mt-5">
            {/* Left Content */}
            <div className="md:w-1/2 space-y-5 mt-10 md:mt-0 text-center md:text-left">
                <p className="text-orange-600 font-bold uppercase text-sm tracking-wide bg-orange-100 inline-block px-3 py-1 rounded-full font-poppins">
                    Hurry up only few lefts!
                </p>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight font-poppins">
                    Next-Level Gaming Starts Here <br />
                    <span className="text-gray-500 font-poppins">Discover PlayStation 5 Today!</span>
                </h1>

                <div className="flex gap-4 justify-center md:justify-start pt-4">
                    <button className="bg-orange-600 text-white px-8 py-3 rounded-full font-medium hover:bg-orange-700 transition font-poppins">
                        Shop Now
                    </button>

                    <button className="flex items-center gap-2 text-gray-700 font-medium hover:text-black transition font-poppins">
                        Explore Deals
                        <Image src={assets.arrow_icon} alt="arrow" className='w-4' />
                    </button>
                </div>
            </div>

            {/* Right Image */}
            <div className="md:w-1/2 flex justify-center relative">
                <Image
                    src={assets.header_playstation_image}
                    alt="PlayStation 5"
                    className="w-[80%] md:w-full max-w-[500px] object-contain drop-shadow-xl"
                    priority
                />
            </div>
        </section>
    );
};

export default Hero;