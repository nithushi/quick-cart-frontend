'use client';
import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductItem from '../components/ProductItem';
import { assets } from '@/app/assets/assets';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    rating?: string; // Rating String එකක් ලෙස එන නිසා
}

const ShopContent = () => {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // --- Filters States ---
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(500000); // Default Max Price (LKR)
    const [sortOption, setSortOption] = useState('default');
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

    // Categories List
    const categories = [
        "All", "Electronics", "Earphone", "Laptop", "Watch"
    ];

    // Brands List (අපි නිකන් hardcode කරමු දැනට)
    const brands = ["Apple", "Samsung", "Sony", "Bose", "Asus", "Canon"];

    // 1. Fetch Products form Backend
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // සරලව තියන්න අපි දැනට ඔක්කොම Products ගෙන්නාගෙන Frontend එකේ Filter කරමු.
                // (Real projects වලදී Backend එකෙන් Filter කරන එක වඩා හොඳයි)
                let url = 'http://localhost:8080/api/products';

                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    setProducts([]);
                    console.error("Failed to fetch products");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // 2. Filter & Sort Logic (Frontend Side)
    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        // A. Search Query Filter
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // B. Category Filter
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // C. Price Range Filter
        filtered = filtered.filter(p => p.price <= priceRange);

        // D. Brand Filter (Name එකේ Brand එක තියෙනවද බලනවා)
        if (selectedBrands.length > 0) {
            filtered = filtered.filter(p =>
                selectedBrands.some(brand => p.name.toLowerCase().includes(brand.toLowerCase()))
            );
        }

        // E. Sorting
        if (sortOption === 'price-low-high') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-high-low') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'newest') {
            filtered.sort((a, b) => b.id - a.id); // ID එක වැඩි එක අලුත් එකක් ලෙස සලකමු
        }

        return filtered;
    }, [products, searchQuery, selectedCategory, priceRange, selectedBrands, sortOption]);


    // Handle Brand Checkbox Change
    const handleBrandChange = (brand: string) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    return (
        <div className="px-6 md:px-16 py-10 min-h-[80vh] ">

            <div className="flex flex-col md:flex-row gap-8">

                {/* --- Left Sidebar (Filters) --- */}
                <div className="w-full md:w-1/4 lg:w-1/5 space-y-6">

                    {/* Categories */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-800 mb-4 font-poppins uppercase tracking-wider">Categories</h3>
                        <ul className="flex flex-col gap-2">
                            {categories.map((category) => (
                                <li
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`cursor-pointer text-sm px-2 py-1.5 rounded-lg transition font-poppins ${selectedCategory === category
                                            ? 'text-orange-600 font-bold bg-orange-50'
                                            : 'text-gray-600 hover:text-orange-600'
                                        }`}
                                >
                                    {category}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price Filter */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-800 mb-4 font-poppins uppercase tracking-wider">Price Range</h3>
                        <p className="text-xs text-gray-500 mb-2 font-roboto">Max Price: LKR {priceRange.toLocaleString()}</p>
                        <input
                            type="range"
                            min="0"
                            max="1000000"
                            step="5000"
                            value={priceRange}
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                        />
                    </div>

                    {/* Brand Filter */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-800 mb-4 font-poppins uppercase tracking-wider">Brands</h3>
                        <div className="flex flex-col gap-2">
                            {brands.map((brand) => (
                                <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 accent-orange-600 rounded border-gray-300"
                                        checked={selectedBrands.includes(brand)}
                                        onChange={() => handleBrandChange(brand)}
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-orange-600 transition font-roboto">{brand}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                </div>

                {/* --- Right Side (Product Grid) --- */}
                <div className="w-full md:w-3/4 lg:w-4/5">

                    {/* Top Bar (Title & Sort) */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-xs border border-gray-50 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 font-poppins">
                            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
                            <span className="text-gray-400 text-sm font-normal ml-2 font-roboto">({filteredProducts.length} items)</span>
                        </h2>

                        <div className="flex items-center gap-3 mt-3 sm:mt-0">
                            <span className="text-sm font-medium text-gray-600 font-poppins">Sort by:</span>

                            <div className="relative group">
                                <select
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 block w-48 px-4 py-2.5 pr-10 outline-none transition-all duration-200 hover:border-orange-400 font-roboto cursor-pointer shadow-sm"
                                >
                                    <option value="default">Default</option>
                                    <option value="price-low-high">Price: Low to High</option>
                                    <option value="price-high-low">Price: High to Low</option>
                                    <option value="newest">Newest Arrivals</option>
                                </select>

                                {/* Custom Arrow Icon */}
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 group-hover:text-orange-500 transition-colors duration-200">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((item) => (
                                    <ProductItem
                                        key={item.id}
                                        id={item.id.toString()}
                                        name={item.name}
                                        price={item.price}
                                        image={
                                            item.imageUrl
                                                ? (item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:8080${item.imageUrl}`)
                                                : (assets.box_icon as any)
                                        }
                                        description={item.description}
                                        rating={item.rating ? parseFloat(item.rating) : 4}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-20">
                                    <p className="text-gray-500 font-poppins text-lg">No products match your filters.</p>
                                    <button
                                        onClick={() => {
                                            setSelectedCategory('All');
                                            setPriceRange(500000);
                                            setSelectedBrands([]);
                                            setSortOption('default');
                                        }}
                                        className="mt-4 text-orange-600 hover:underline text-sm font-medium"
                                    >
                                        Reset All Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Shop = () => {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
                <ShopContent />
            </Suspense>
            <Footer />
        </main>
    );
};

export default Shop;