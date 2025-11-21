'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { assets } from '@/app/assets/assets';

const Hero = () => {
    const slides = [
        {
            id: 1,
            tag: "Hurry up only few lefts!",
            title: "Next-Level Gaming Starts Here",
            subtitle: "Discover PlayStation 5 Today!",
            buttonText: "Shop Now",
            image: assets.header_playstation_image,
            bgColor: "bg-[#F3F4F6]"
        },
        {
            id: 2,
            tag: "Exclusive Deal 40% Off",
            title: "Power Meets Elegance",
            subtitle: "Apple MacBook Pro is Here for you!",
            buttonText: "Order Now",
            image: assets.header_macbook_image,
            bgColor: "bg-[#EDF1F5]"
        },
        {
            id: 3,
            tag: "Best Sound Quality",
            title: "Immerse in Pure Audio",
            subtitle: "Premium Headphones for Music Lovers",
            buttonText: "Buy Now",
            image: assets.header_headphone_image,
            bgColor: "bg-[#F0F0F0]"
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 4000);

        return () => clearInterval(interval);
    }, [slides.length]);

    // Height එක අඩු කරන්න min-h-[400px] ලෙස වෙනස් කළා (කලින් 500px)
    return (
        <section className={`relative px-6 md:px-16 py-8 md:py-0 flex flex-col-reverse md:flex-row items-center justify-between mx-4 md:mx-10 rounded-xl mt-5 transition-colors duration-500 ease-in-out ${slides[currentSlide].bgColor} min-h-[400px]`}>
            
            {/* Left Content */}
            <div className="md:w-1/2 space-y-4 mt-8 md:mt-0 text-center md:text-left z-10">
                <p className="text-orange-600 font-bold uppercase text-xs tracking-wide bg-orange-100 inline-block px-3 py-1 rounded-full font-poppins animate-fadeIn">
                    {slides[currentSlide].tag}
                </p>
                {/* Text Sizes පොඩ්ඩක් අඩු කළා */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight font-poppins transition-all duration-500">
                    {slides[currentSlide].title.split(" - ")[0]} <br />
                    <span className="text-gray-500 font-poppins text-2xl md:text-3xl">{slides[currentSlide].subtitle}</span>
                </h1>

                <div className="flex gap-4 justify-center md:justify-start pt-2">
                    <button className="bg-orange-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-700 transition font-poppins shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm">
                        {slides[currentSlide].buttonText}
                    </button>

                    <button className="flex items-center gap-2 text-gray-700 font-medium hover:text-black transition font-poppins group text-sm">
                        Explore Deals
                        <Image src={assets.arrow_icon} alt="arrow" className='w-3 transition-transform group-hover:translate-x-1' />
                    </button>
                </div>
            </div>

            {/* Right Image */}
            {/* Image Container Height එක අඩු කළා: h-[250px] md:h-[350px] */}
            <div className="md:w-1/2 flex justify-center relative h-[250px] md:h-[350px] items-center">
                <Image
                    key={currentSlide}
                    src={slides[currentSlide].image}
                    alt="Hero Product"
                    // Image max-width එක 400px කළා (කලින් 500px)
                    className="w-[70%] md:w-full max-w-[340px] object-contain drop-shadow-2xl animate-slideUpFade"
                    priority
                />
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${
                            currentSlide === index ? "bg-orange-600 w-6" : "bg-gray-300 hover:bg-gray-400"
                        }`}
                    ></div>
                ))}
            </div>
        </section>
    );
};

export default Hero;