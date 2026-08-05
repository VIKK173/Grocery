'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  Leaf
} from 'lucide-react';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user || user.role !== 'admin') {
      if (pathname !== '/admin/login') {
        router.replace('/admin/login');
      }
    }
  }, [user, pathname, router]);

  if (!mounted) return null;

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Double check auth before rendering admin UI
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : (window.innerWidth >= 1024 ? 0 : -300) }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="fixed lg:static top-0 left-0 h-screen w-[280px] bg-white border-r border-gray-200 z-50 flex flex-col"
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-grocery-yellow rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-grocery-darker" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-grocery-darker">Grocery</h2>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-lg bg-gray-100 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-grocery-green text-white shadow-md shadow-grocery-green/20'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <link.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {link.name}
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => {
              setUser(null);
              router.push('/admin/login');
            }}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 shadow-sm"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-10 pr-4 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:border-grocery-green focus:ring-2 focus:ring-grocery-green/20 rounded-xl outline-none transition-all w-64 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-100" />
            </button>
            <div className="h-10 w-px bg-gray-200 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-grocery-dark text-white flex items-center justify-center font-bold">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
