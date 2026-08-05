'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Leaf, Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser, showToast } = useStore();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy admin check
    if (email === 'admin@grocery.com' && password === 'admin123') {
      setUser({
        userId: 'admin-1',
        name: 'Admin',
        email: 'admin@grocery.com',
        role: 'admin',
      });
      showToast('Welcome back, Admin!', 'success');
      router.push('/admin');
    } else {
      showToast('Invalid admin credentials', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-grocery-light flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-grocery-dark p-8 text-center">
          <div className="w-16 h-16 bg-grocery-yellow rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-grocery-yellow/20">
            <svg className="w-8 h-8 text-grocery-darker" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-white/70 mt-2">Sign in to manage your store</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-grocery-green transition-colors"
                placeholder="admin@grocery.com"
                required
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-grocery-green transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-grocery-green text-white font-bold py-3.5 rounded-xl hover:bg-grocery-dark transition-colors shadow-lg shadow-grocery-green/30"
          >
            Sign In
          </button>
          
          <div className="text-center text-sm text-gray-500">
            Demo credentials: admin@grocery.com / admin123
          </div>
        </form>
      </motion.div>
    </div>
  );
}
