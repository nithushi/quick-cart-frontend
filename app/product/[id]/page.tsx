'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { assets } from '@/app/assets/assets';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductItem from '@/app/components/ProductItem';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';

// Interfaces
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    rating: string;
}

interface Review {
    id: number;
    comment: string;
    rating: number;
    date: string;
    user: {
        firstName: string;
        lastName: string;
    };
}

const ProductDetails = () => {
    const { id } = useParams();
    const router = useRouter();
    const { token, isAuthenticated } = useAuth();

    // Product States
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [image, setImage] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [galleryImages, setGalleryImages] = useState<string[]>([]);
    const [quantity, setQuantity] = useState(1);

    // Review States (Newly Added)
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5);

    // Quantity Functions
    const incrementQuantity = () => setQuantity((prev) => prev + 1);
    const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

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
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: product?.id,
                    quantity: quantity
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

    // --- Fetch Reviews Function (Newly Added) ---
    const fetchReviews = async (productId: number) => {
        try {
            const res = await fetch(`http://localhost:8080/api/reviews/${productId}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    // --- Submit Review Function (Newly Added) ---
    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isAuthenticated || !token) {
            toast.error("Please login to write a review");
            return;
        }

        const toastId = toast.loading("Submitting review...");

        try {
            const response = await fetch('http://localhost:8080/api/reviews/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: id,
                    comment: newComment,
                    rating: newRating
                })
            });

            if (response.ok) {
                toast.success("Review submitted!", { id: toastId });
                setNewComment('');
                setNewRating(5);
                fetchReviews(Number(id)); // Refresh reviews list after submitting
            } else {
                toast.error("Failed to submit review", { id: toastId });
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error("Error submitting review", { id: toastId });
        }
    };

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                // 1. Main Product
                const response = await fetch(`http://localhost:8080/api/products/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);

                    // Image Logic
                    const mainImg = data.imageUrl
                        ? (data.imageUrl.startsWith('http') ? data.imageUrl : `http://localhost:8080${data.imageUrl}`)
                        : (assets.box_icon as any);

                    setImage(mainImg);
                    setGalleryImages([mainImg, mainImg, mainImg, mainImg]);

                    // 2. Related Products
                    fetchRelatedProducts(data.category, data.id);
                    
                    // 3. Fetch Reviews (Call the new function)
                    fetchReviews(data.id);
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
                                <Image 
                                    key={index} 
                                    src={index < Math.round(parseFloat(product.rating)) ? assets.star_icon : assets.star_dull_icon} 
                                    alt="star" 
                                    className="w-4" 
                                />
                            ))}
                        </div>
                        <p className="text-gray-500 text-sm font-roboto">({reviews.length} Reviews)</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-3xl font-bold text-gray-900 font-poppins">LKR {product.price}</p>
                        <p className="text-gray-400 line-through font-medium text-lg">LKR {(product.price * 1.2).toFixed(2)}</p>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed font-roboto mt-2">{product.description}</p>

                    <div className="flex flex-col gap-2 mt-4 text-sm text-gray-600 font-roboto">
                        <p><span className="font-bold text-gray-800 w-24 inline-block">Brand</span> : Generic</p>
                        <p><span className="font-bold text-gray-800 w-24 inline-block">Category</span> : {product.category}</p>
                        <p><span className="font-bold text-gray-800 w-24 inline-block">Tags</span> : Modern, Latest</p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4 mt-6">
                        <p className="font-medium text-gray-600 font-poppins">Quantity:</p>
                        <div className="flex items-center gap-3">
                            <button onClick={decrementQuantity} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition text-gray-600 font-bold">-</button>
                            <p className="w-8 text-center font-semibold text-gray-800 font-poppins">{quantity}</p>
                            <button onClick={incrementQuantity} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition text-gray-600 font-bold">+</button>
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

            {/* --- REVIEWS SECTION (Side-by-Side Layout) --- */}
            <div className="max-w-7xl mx-auto px-6 md:px-16 py-10 bg-gray-50 mt-10 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 font-poppins">Customer Reviews</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Side: Review List (Takes 2/3 width) */}
                    <div className="lg:col-span-2 space-y-6 h-fit max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm animate-fadeIn">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                                                {review.user.firstName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-800 font-poppins">{review.user.firstName} {review.user.lastName}</p>
                                                <div className="flex gap-1 mt-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Image 
                                                            key={i} 
                                                            src={i < review.rating ? assets.star_icon : assets.star_dull_icon} 
                                                            alt="star" 
                                                            className="w-3" 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 font-roboto">{new Date(review.date).toLocaleDateString()}</p>
                                    </div>
                                    <p className="text-gray-600 text-sm font-roboto leading-relaxed ml-14">{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white p-8 rounded-lg border border-dashed border-gray-300 text-center">
                                <p className="text-gray-500 italic font-poppins">No reviews yet. Be the first to review this product!</p>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Add Review Form (Takes 1/3 width) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-24">
                            <h4 className="text-lg font-bold text-gray-800 mb-4 font-poppins">Write a Review</h4>
                            <form onSubmit={submitReview} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">Rating</label>
                                    <select 
                                        value={newRating} 
                                        onChange={(e) => setNewRating(Number(e.target.value))} 
                                        className="border border-gray-300 rounded-md p-2.5 text-sm w-full focus:border-orange-500 outline-none font-roboto bg-transparent"
                                    >
                                        <option value="5">5 - Excellent</option>
                                        <option value="4">4 - Good</option>
                                        <option value="3">3 - Average</option>
                                        <option value="2">2 - Poor</option>
                                        <option value="1">1 - Terrible</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 font-poppins">Your Review</label>
                                    <textarea 
                                        value={newComment} 
                                        onChange={(e) => setNewComment(e.target.value)} 
                                        className="w-full border border-gray-300 rounded-md p-3 text-sm focus:border-orange-500 outline-none h-32 font-roboto resize-none"
                                        placeholder="Share your thoughts about this product..."
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full bg-gray-900 text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-black transition font-poppins">
                                    Submit Review
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>

            {/* Related Products */}
            <div className="max-w-7xl mx-auto px-6 md:px-16 py-16">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 font-poppins">Related Products</h2>
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