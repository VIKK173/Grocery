'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  Leaf,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useStore } from '@/lib/store';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About Us', href: '#about' },
  { label: 'Categories', href: '#categories' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const { setSearchOpen, setCartOpen, setAuthOpen, setAuthMode, user, setUser } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useStore((s) => s.cartItems.reduce((c, i) => c + i.quantity, 0));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUserClick = () => {
    if (user) {
      setUser(null);
      useStore.setState({ cartItems: [] });
    } else {
      setAuthMode('login');
      setAuthOpen(true);
    }
  };

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
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Matches screenshot */}
          <motion.a
            href="#home"
            className="flex items-center gap-2.5 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-10 h-10 rounded-xl bg-grocery-yellow flex items-center justify-center shadow-lg shadow-grocery-yellow/30">
              <svg className="w-5 h-5 text-grocery-darker" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Grocery
            </span>
          </motion.a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className="relative text-sm font-medium text-white/90 hover:text-grocery-yellow transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-grocery-yellow rounded-full transition-all duration-300 group-hover:w-3/4" />
              </motion.a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search Icon - CLICKABLE */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-full text-white/80 hover:text-grocery-yellow hover:bg-white/10 transition-all duration-300"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* User Icon - CLICKABLE */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleUserClick}
              className="p-2.5 rounded-full text-white/80 hover:text-grocery-yellow hover:bg-white/10 transition-all duration-300"
              title={user ? 'Sign Out' : 'Sign In'}
            >
              {user ? <LogOut className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </motion.button>

            {/* Cart Icon - CLICKABLE */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-full bg-white/10 text-white/90 hover:bg-white/15 transition-all duration-300"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (user) {
                  handleUserClick();
                } else {
                  setAuthMode('signup');
                  setAuthOpen(true);
                }
              }}
              className="hidden md:flex items-center px-5 py-2.5 bg-white text-grocery-dark font-semibold rounded-lg text-sm hover:bg-grocery-yellow transition-colors duration-300 shadow-md"
            >
              {user ? 'Sign Out' : 'Sign Up'}
            </motion.button>

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

      {/* User greeting when logged in */}
      {user && scrolled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="hidden lg:flex items-center justify-center gap-2 pb-2 text-xs text-white/40"
        >
          <Leaf className="w-3 h-3 text-grocery-lime" />
          Welcome, {user.name}!
        </motion.div>
      )}

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
              {user && (
                <div className="flex items-center gap-2 px-4 py-3 mb-2 rounded-xl bg-grocery-green/10 border border-grocery-green/20">
                  <div className="w-8 h-8 rounded-full bg-grocery-yellow text-grocery-darker flex items-center justify-center text-sm font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-white">{user.name}</span>
                </div>
              )}
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
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                onClick={() => {
                  handleUserClick();
                  setMobileOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-white/80 hover:text-grocery-yellow hover:bg-white/5 transition-all duration-300"
              >
                {user ? 'Sign Out' : 'Sign In'}
                {user ? <LogOut className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />}
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
