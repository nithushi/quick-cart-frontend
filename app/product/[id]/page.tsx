'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { assets } from '@/app/assets/assets';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductItem from '@/app/components/ProductItem'; // ProductItem Import කරන්න
import { useAuth } from '@/app/context/AuthContext'; // AuthContext එකතු කළා
import toast from 'react-hot-toast'; // Toast notification
import router from 'next/router';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    rating: string;
}

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]); // Related Products සඳහා State එකක්
    const [image, setImage] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const { token, isAuthenticated } = useAuth();
    const router = useRouter();

    const [quantity, setQuantity] = useState(1);

    const incrementQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    const decrementQuantity = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // 1 ට වඩා අඩු වෙන්න දෙන්නේ නෑ
    };

    // --- Add to Cart Function ---
    const addToCart = async () => {
        if (!isAuthenticated || !token) {
            toast.error("Please login to add items to cart");
            router.push('/login');
            return;
        }

        const toastId = toast.loading("Adding to cart...");

        try {
            const response = await fetch('http://localhost:8080/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // JWT Token එක යවනවා
                },
                body: JSON.stringify({
                    productId: product?.id,
                    quantity: 1
                })
            });

            if (response.ok) {
                toast.success("Added to cart successfully!", { id: toastId });
            } else {
                toast.error("Failed to add to cart", { id: toastId });
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Error adding to cart", { id: toastId });
        }
    };

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                // 1. Main Product එක ලබා ගැනීම
                const response = await fetch(`http://localhost:8080/api/products/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);

                    // Image URL Logic
                    const mainImg = data.imageUrl
                        ? (data.imageUrl.startsWith('http') ? data.imageUrl : `http://localhost:8080${data.imageUrl}`)
                        : (assets.box_icon as any);

                    setImage(mainImg);
                    setGalleryImages([mainImg, mainImg, mainImg, mainImg]);

                    // 2. Related Products ලබා ගැනීම (Category එක අනුව)
                    fetchRelatedProducts(data.category, data.id);
                } else {
                    console.error("Product not found");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchRelatedProducts = async (category: string, currentId: number) => {
            try {
                const res = await fetch(`http://localhost:8080/api/products/category/${category}`);
                if (res.ok) {
                    const data = await res.json();
                    // දැනට පෙන්වන Product එක අයින් කරලා, ඉතිරි ඒවායින් 4ක් ගන්නවා
                    const related = data.filter((item: Product) => item.id !== currentId).slice(0, 4);
                    setRelatedProducts(related);
                }
            } catch (error) {
                console.error("Error fetching related products:", error);
            }
        };

        if (id) {
            fetchProductData();
        }
    }, [id]);

    if (loading) return <div className="text-center py-20 font-poppins">Loading...</div>;
    if (!product) return <div className="text-center py-20 font-poppins">Product not found.</div>;

    return (
        <div className='bg-white min-h-screen'>
            <Navbar />

            {/* Product Details Section */}
            <div className="max-w-7xl mx-auto px-6 md:px-16 py-10 pt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left Side - Images */}
                <div className="flex flex-col-reverse md:flex-row gap-4">
                    <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto justify-between md:justify-start w-full md:w-[15%]">
                        {galleryImages.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => setImage(item)}
                                className={`cursor-pointer rounded-lg overflow-hidden border p-2 bg-gray-50 ${image === item ? 'border-orange-500' : 'border-gray-200'}`}
                            >
                                <Image src={item} alt="thumbnail" width={100} height={100} className="w-full object-contain" unoptimized={true} />
                            </div>
                        ))}
                    </div>
                    <div className="w-full md:w-[85%] bg-gray-50 rounded-xl p-10 flex items-center justify-center border border-gray-100 relative h-[400px] md:h-[500px]">
                        <Image src={image} alt={product.name} fill className="object-contain mix-blend-multiply p-5" unoptimized={true} />
                    </div>
                </div>

                {/* Right Side - Info */}
                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 font-poppins">{product.name}</h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, index) => (
                                <Image key={index} src={index < Math.floor(parseFloat(product.rating)) ? assets.star_icon : assets.star_dull_icon} alt="star" className="w-4" />
                            ))}
                        </div>
                        <p className="text-gray-500 text-sm font-roboto">({product.rating})</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-3xl font-bold text-gray-900 font-poppins">LKR {product.price}</p>
                        <p className="text-gray-400 line-through font-medium text-lg">LKR {(product.price * 1.2).toFixed(2)}</p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed font-roboto mt-2">{product.description}</p>

                    {/* Meta Data */}
                    <div className="flex flex-col gap-2 mt-4 text-sm text-gray-600 font-roboto">
                        <p><span className="font-bold text-gray-800 w-24 inline-block">Brand</span> : Generic</p>
                        <p><span className="font-bold text-gray-800 w-24 inline-block">Category</span> : {product.category}</p>
                        <p><span className="font-bold text-gray-800 w-24 inline-block">Tags</span> : Modern, Latest</p>
                    </div>

                    {/* 4. Quantity Selector UI */}
                    <div className="flex items-center gap-4 mt-6">
                        <p className="font-medium text-gray-600 font-poppins">Quantity:</p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={decrementQuantity}
                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition text-gray-600 font-bold"
                            >
                                -
                            </button>
                            <p className="w-8 text-center font-semibold text-gray-800 font-poppins">{quantity}</p>
                            <button
                                onClick={incrementQuantity}
                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition text-gray-600 font-bold"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button onClick={addToCart} className="flex-1 bg-gray-100 text-gray-800 py-3.5 px-8 rounded-md font-semibold hover:bg-gray-200 transition font-poppins">Add to Cart</button>
                        <button className="flex-1 bg-orange-500 text-white py-3.5 px-8 rounded-md font-semibold hover:bg-orange-600 transition shadow-lg shadow-orange-500/30 font-poppins">Buy now</button>
                    </div>
                    <hr className="my-6 border-gray-200" />
                    <div className="flex flex-col gap-2 text-sm text-gray-500 font-roboto">
                        <p>100% Original product.</p>
                        <p>Cash on delivery is available on this product.</p>
                        <p>Easy return and exchange policy within 7 days.</p>
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            <div className="max-w-7xl mx-auto px-6 md:px-16 py-16">
                <div className='flex flex-col  mb-10'>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 font-poppins">Related Products</h2>
                    {/* <div className='w-20 h-1 bg-orange-500 rounded-full'></div> */}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedProducts.length > 0 ? (
                        relatedProducts.map((item) => (
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
                                rating={parseFloat(item.rating)}
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500 font-poppins">No related products found.</p>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetails;