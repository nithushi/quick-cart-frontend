import React from 'react';
import AdminSidebar from '@/app/admin/components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Left Side - Sidebar */}
      <AdminSidebar />

      {/* Right Side - Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <main className="flex-1 p-8">
            {children}
        </main>
      </div>
    </div>
  );
}