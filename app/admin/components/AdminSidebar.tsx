'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { assets } from '@/app/assets/assets';

const AdminSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: assets.menu_icon }, 
    { name: 'Add Product', path: '/admin/add-product', icon: assets.add_icon },
    { name: 'Orders', path: '/admin/orders', icon: assets.order_icon },
    { name: 'Inventory', path: '/admin/products', icon: assets.order_icon },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col sticky top-0 h-screen">
      {/* Admin Logo Area */}
      <div className="p-6 border-b border-gray-200 flex items-center gap-3">
         <div className='w-8 h-8 relative'>
            <Image src={assets.logo} alt="Logo" fill className="object-contain" />
         </div>
         <div>
            <h1 className='font-bold text-gray-800 text-lg leading-none font-poppins'>QuickCart</h1>
            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-wider">Admin</span>
         </div>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-poppins text-sm ${
                isActive 
                  ? 'bg-orange-50 text-orange-600 font-semibold shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Image 
                src={item.icon} 
                alt={item.name} 
                width={20} 
                height={20} 
                className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <Link href="/login" className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm font-poppins">
            {/* <Image src={assets.logout_icon} alt="logout" width={20} height={20} /> */}
            <span>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;