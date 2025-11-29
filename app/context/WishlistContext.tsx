'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Product {
    id: string;
    name: string;
    price: number;
    image: any;
    description: string;
    category?: string;
    rating?: number;
}

interface WishlistContextType {
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const [wishlist, setWishlist] = useState<Product[]>([]);

    // App load වෙනකොට LocalStorage එකෙන් Wishlist එක ගන්න
    useEffect(() => {
        const storedWishlist = localStorage.getItem('wishlist');
        if (storedWishlist) {
            setWishlist(JSON.parse(storedWishlist));
        }
    }, []);

    // Wishlist වෙනස් වෙනකොට LocalStorage එක Update කරන්න
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (product: Product) => {
        if (!isInWishlist(product.id)) {
            setWishlist([...wishlist, product]);
            toast.success("Added to Wishlist!");
        }
    };

    const removeFromWishlist = (id: string) => {
        setWishlist(wishlist.filter(item => item.id !== id));
        toast.error("Removed from Wishlist");
    };

    const isInWishlist = (id: string) => {
        return wishlist.some(item => item.id === id);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};