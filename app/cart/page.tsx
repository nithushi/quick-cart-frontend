'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '@/app/context/AuthContext';
import { assets } from '@/app/assets/assets';
import toast from 'react-hot-toast';

// Interfaces
interface CartItem {
    id: number;
    product: {
        id: number;
        name: string;
        price: number;
        imageUrl: string;
        category: string;
    };
    quantity: number;
}

interface Address {
    id: number;
    fullName: string;
    phoneNumber: string;
    street: string;
    city: string;
    zipCode: string;
}

const Cart = () => {
    const { token, isAuthenticated } = useAuth();
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [subtotal, setSubtotal] = useState(0);
    const [shipping] = useState(0);
    const [tax, setTax] = useState(0);

    // Address State Management
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

    // New Address Form State
    const [newAddress, setNewAddress] = useState({
        fullName: '',
        phoneNumber: '',
        street: '',
        city: '',
        zipCode: ''
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        fetchCart();
        fetchLastAddress(); // Fetch last address on load
    }, [isAuthenticated, token, router]);

    useEffect(() => {
        const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        setSubtotal(total);
        setTax(total * 0.02);
    }, [cartItems]);

    const fetchCart = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/cart', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCartItems(data);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    // GET LAST ADDRESS
    const fetchLastAddress = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/orders/last-address', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok && response.status !== 204) {
                const data = await response.json();
                const lastAddr: Address = {
                    id: Date.now(),
                    fullName: data.fullName,
                    phoneNumber: data.phoneNumber,
                    street: data.street,
                    city: data.city,
                    zipCode: data.zipCode
                };
                setSelectedAddress(lastAddr);
                setAddresses([lastAddr]);
            }
        } catch (error) {
            console.error("Error fetching last address:", error);
        }
    };

    const updateQuantity = (id: number, delta: number) => {
        setCartItems(items => items.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeItem = async (id: number) => {
        const toastId = toast.loading("Removing item...");
        try {
            const response = await fetch(`http://localhost:8080/api/cart/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setCartItems(items => items.filter(item => item.id !== id));
                toast.success("Item removed", { id: toastId });
            } else {
                toast.error("Failed to remove item", { id: toastId });
            }
        } catch (error) {
            console.error("Error removing item:", error);
            toast.error("Something went wrong", { id: toastId });
        }
    };

    // --- Address Functions ---
    const handleSaveAddress = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAddress.fullName || !newAddress.street || !newAddress.phoneNumber) {
            toast.error("Please fill in all required fields");
            return;
        }

        const address: Address = {
            id: Date.now(),
            ...newAddress
        };

        setAddresses([...addresses, address]);
        setSelectedAddress(address);
        setIsAddingNewAddress(false);
        setIsAddressModalOpen(false);
        setNewAddress({ fullName: '', phoneNumber: '', street: '', city: '', zipCode: '' });
        toast.success("Address added successfully!");
    };

    const handleSelectAddress = (addr: Address) => {
        setSelectedAddress(addr);
        setIsAddressModalOpen(false);
    };

    // --- Place Order Function ---
    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error("Please select a delivery address");
            return;
        }

        const toastId = toast.loading("Placing order...");

        try {
            const response = await fetch('http://localhost:8080/api/orders/place', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fullName: selectedAddress.fullName,
                    phoneNumber: selectedAddress.phoneNumber,
                    street: selectedAddress.street,
                    city: selectedAddress.city,
                    zipCode: selectedAddress.zipCode
                })
            });

            if (response.ok) {
                toast.success("Order Placed Successfully!", { id: toastId });
                setCartItems([]);
                setTimeout(() => router.push('/orders'), 2000);
            } else {
                const msg = await response.text();
                toast.error(msg || "Failed to place order", { id: toastId });
            }
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error("Something went wrong", { id: toastId });
        }
    };

    if (loading) return <div className="text-center py-20 font-poppins text-gray-500">Loading cart...</div>;

    return (
        <div className='bg-white min-h-screen relative'>
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
                {/* Header */}
                <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
                    <h1 className="text-3xl font-bold text-gray-800 font-poppins">Your Cart</h1>
                    <p className="text-gray-500 font-roboto text-sm">{cartItems.length} Items</p>
                </div>

                {cartItems.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Left Side: Cart Items */}
                        <div className="w-full lg:w-2/3">
                            <div className="hidden md:grid grid-cols-12 text-sm font-medium text-gray-500 font-poppins mb-4">
                                <div className="col-span-6">Product Details</div>
                                <div className="col-span-2 text-center">Price</div>
                                <div className="col-span-2 text-center">Quantity</div>
                                <div className="col-span-2 text-right">Subtotal</div>
                            </div>

                            <div className="flex flex-col gap-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 border-b border-gray-100 pb-6 last:border-0">
                                        <div className="col-span-6 flex gap-4">
                                            <div className="w-20 h-20 bg-gray-50 rounded-lg flex-shrink-0 relative border border-gray-100">
                                                <Image
                                                    src={item.product.imageUrl
                                                        ? (item.product.imageUrl.startsWith('http') ? item.product.imageUrl : `http://localhost:8080${item.product.imageUrl}`)
                                                        : (assets.box_icon as any)}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-contain p-2 mix-blend-multiply"
                                                    unoptimized={true}
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <h3 className="font-semibold text-gray-800 font-poppins text-base">{item.product.name}</h3>
                                                <p className="text-xs text-gray-400 font-roboto mb-1">{item.product.category}</p>
                                                <button onClick={() => removeItem(item.id)} className="text-red-500 text-xs font-medium hover:underline text-left w-fit">Remove</button>
                                            </div>
                                        </div>
                                        <div className="col-span-2 text-center font-medium text-gray-700 font-roboto hidden md:block">
                                            LKR {item.product.price.toLocaleString()}
                                        </div>
                                        <div className="col-span-2 flex justify-center">
                                            <div className="flex items-center border border-gray-200 rounded-md">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition">
                                                    <Image src={assets.decrease_arrow} alt="-" width={8} className='opacity-60' />
                                                </button>
                                                <span className="px-2 text-sm font-medium text-gray-800 w-8 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition">
                                                    <Image src={assets.increase_arrow} alt="+" width={8} className='opacity-60' />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-span-2 text-right font-bold text-gray-800 font-roboto hidden md:block">
                                            LKR {(item.product.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Order Summary */}
                        <div className="w-full lg:w-1/2">
                            <div className="bg-[#ffffff] p-6 rounded-xl border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 font-poppins">Order Summary</h3>

                                {/* Address Selection Section */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide font-poppins">Delivery Address</label>
                                        <button
                                            onClick={() => { setIsAddressModalOpen(true); setIsAddingNewAddress(false); }}
                                            className="text-xs text-orange-600 font-bold hover:underline transition font-poppins"
                                        >
                                            {selectedAddress ? "CHANGE" : "ADD"}
                                        </button>
                                    </div>

                                    {selectedAddress ? (
                                        <div className="bg-white border border-orange-200 rounded-lg p-4 shadow-sm relative group cursor-pointer hover:border-orange-400 transition font-poppins" onClick={() => setIsAddressModalOpen(true)}>
                                            <div className='flex items-start gap-3'>
                                                <Image src={assets.my_location_image} alt="loc" className="w-5 h-5 opacity-60 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800 font-poppins">{selectedAddress.fullName}</p>
                                                    <p className="text-xs text-gray-500 mt-1 font-poppins leading-relaxed">
                                                        {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.zipCode}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1 font-bold font-poppins">{selectedAddress.phoneNumber}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => { setIsAddressModalOpen(true); setIsAddingNewAddress(true); }}
                                            className="border-2 border-dashed border-gray-300 rounded-lg p-5 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition duration-300 bg-white"
                                        >
                                            <span className="text-2xl mb-1">+</span>
                                            <span className="text-xs font-medium font-poppins">Add Delivery Address</span>
                                        </div>
                                    )}
                                </div>

                                {/* Promo Code */}
                                <div className="mb-6">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide font-poppins">Promo Code</label>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Enter code" className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm outline-none focus:border-orange-500 bg-white font-poppins" />
                                        <button className="bg-gray-800 text-white px-5 py-2 rounded-md text-xs hover:bg-black transition uppercase tracking-wide font-poppins">
                                            Apply
                                        </button>
                                    </div>
                                </div>

                                <hr className="border-gray-200 mb-4" />

                                {/* Cost Breakdown */}
                                <div className="space-y-3 text-sm text-gray-600 font-poppins">
                                    <div className="flex justify-between">
                                        <span>Items ({cartItems.length})</span>
                                        <span className="font-medium text-gray-800">LKR {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping Fee</span>
                                        <span className="font-medium text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax (2%)</span>
                                        <span className="font-medium text-gray-800">LKR {tax.toLocaleString()}</span>
                                    </div>
                                </div>

                                <hr className="border-gray-200 my-4" />

                                {/* Total */}
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-base font-bold text-gray-800 font-poppins">Total</span>
                                    <span className="text-xl font-bold text-orange-600 font-poppins">LKR {(subtotal + tax).toLocaleString()}</span>
                                </div>

                                <button
                                    className={`w-full text-white py-3.5 rounded-lg font-bold transition shadow-md font-poppins ${selectedAddress ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                    disabled={!selectedAddress}
                                    onClick={handlePlaceOrder}
                                >
                                    {selectedAddress ? "Place Order" : "Select Address to Checkout"}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-xl">
                        <p className="text-gray-500 text-lg font-poppins mb-6">Your cart is currently empty.</p>
                        <Link href="/shop" className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition font-poppins inline-block">Start Shopping</Link>
                    </div>
                )}
            </div>

            {/* --- Address Modal --- */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800 font-poppins">
                                {isAddingNewAddress ? "New Shipping Address" : "Select Address"}
                            </h3>
                            <button onClick={() => setIsAddressModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                        </div>

                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {isAddingNewAddress ? (
                                <form onSubmit={handleSaveAddress} className="flex flex-col gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className='flex flex-col gap-1'>
                                            <label className="text-xs font-medium text-gray-600 font-poppins">Full Name</label>
                                            <input type="text" className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-orange-500 outline-none" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} placeholder="John Doe" />
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <label className="text-xs font-medium text-gray-600 font-poppins">Phone</label>
                                            <input type="text" className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-orange-500 outline-none" value={newAddress.phoneNumber} onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })} placeholder="07X XXXXXXX" />
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <label className="text-xs font-medium text-gray-600 font-poppins">Address Line</label>
                                        <input type="text" className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-orange-500 outline-none" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} placeholder="No. 123, Main Street" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className='flex flex-col gap-1'>
                                            <label className="text-xs font-medium text-gray-600 font-poppins">City</label>
                                            <input type="text" className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-orange-500 outline-none" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} placeholder="Colombo" />
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <label className="text-xs font-medium text-gray-600 font-poppins">Zip Code</label>
                                            <input type="text" className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-orange-500 outline-none" value={newAddress.zipCode} onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })} placeholder="10000" />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-4">
                                        <button type="button" onClick={() => setIsAddingNewAddress(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                                        <button type="submit" className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-bold hover:bg-orange-700 transition font-poppins">Save Address</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {addresses.length > 0 ? (
                                        addresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                onClick={() => handleSelectAddress(addr)}
                                                className={`p-4 border rounded-lg cursor-pointer transition hover:border-orange-400 flex items-start gap-3 ${selectedAddress?.id === addr.id ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-gray-200'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center ${selectedAddress?.id === addr.id ? 'border-orange-600' : 'border-gray-400'}`}>
                                                    {selectedAddress?.id === addr.id && <div className="w-2 h-2 rounded-full bg-orange-600" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800 font-poppins">{addr.fullName}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5 font-roboto">{addr.street}, {addr.city}</p>
                                                    <p className="text-xs text-gray-500 font-bold mt-1">{addr.phoneNumber}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 text-sm py-4">No saved addresses found.</p>
                                    )}

                                    <button
                                        onClick={() => setIsAddingNewAddress(true)}
                                        className="mt-2 w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg font-medium text-sm hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 transition flex items-center justify-center gap-2"
                                    >
                                        <span>+</span> Add New Address
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Cart;