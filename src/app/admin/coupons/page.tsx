'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import { useState } from 'react';

export default function CouponsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth !== 'true') {
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64 transition-all duration-300">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Coupons & Offers</h1>
            <p className="text-gray-500">Create and manage discount coupons and promotional offers.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎟️</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Coupons Management</h2>
            <p className="text-gray-500 mb-6">This feature is coming soon. You'll be able to create and manage coupons here.</p>
            <div className="inline-flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              Under Development
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
