'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '@/lib/store';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About Us', href: '#about' },
  { label: 'Catagories', href: '#categories' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const { setCartOpen, setAuthOpen, setAuthMode, user, setProfileOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useStore((s) => s.cartItems.reduce((c, i) => c + i.quantity, 0));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-grocery-dark/95 backdrop-blur-md shadow-lg shadow-black/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <motion.a
            href="#home"
            className="flex items-center gap-2.5 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <svg className="w-8 h-8 text-grocery-yellow" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Grocery
            </span>
          </motion.a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className={`relative text-[15px] transition-colors duration-300 group ${link.label === 'Home' ? 'font-semibold text-white' : 'font-medium text-white/70 hover:text-white'}`}
              >
                {link.label}
                {link.label === 'Home' && <span className="absolute -bottom-1.5 left-0 w-full h-[2px] bg-white rounded-full" />}
              </motion.a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" fill="currentColor" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-grocery-yellow text-grocery-darker text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Sign Up Button (desktop) */}
            {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setProfileOpen(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white text-grocery-dark font-semibold rounded-lg text-sm hover:bg-grocery-yellow transition-colors duration-300 shadow-md"
              >
                <div className="w-7 h-7 rounded-full bg-grocery-green text-white flex items-center justify-center text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="max-w-[100px] truncate">{user?.name || 'User'}</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAuthMode('signup');
                  setAuthOpen(true);
                }}
                className="hidden md:flex items-center px-5 py-2.5 bg-white text-grocery-dark font-semibold rounded-lg text-sm hover:bg-grocery-yellow transition-colors duration-300 shadow-md"
              >
                Sign Up
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="lg:hidden p-2.5 rounded-full text-white/80 hover:text-grocery-yellow hover:bg-white/10 transition-all duration-300"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-grocery-dark/98 backdrop-blur-md border-t border-white/10 overflow-hidden"
          >
            <nav className="px-4 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-white/80 hover:text-grocery-yellow hover:bg-white/5 transition-all duration-300"
                >
                  {link.label}
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
