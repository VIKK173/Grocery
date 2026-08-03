'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Star,
  MapPin,
  Clock,
  Leaf,
  ChevronDown,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';
import { categories } from '@/lib/data';
import { useStore } from '@/lib/store';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroSection() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const { setCartOpen, setSearchOpen, user, setAuthOpen, setAuthMode } = useStore();

  const handleShopNow = () => {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden hero-gradient"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full bg-grocery-green/10 blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-[600px] h-[600px] rounded-full bg-grocery-green-light/8 blur-[150px]" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-grocery-yellow/5 blur-[100px]" />

        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-grocery-lime/20"
            style={{
              width: 3 + Math.random() * 4,
              height: 3 + Math.random() * 4,
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 4) * 20}%`,
            }}
            animate={{ y: [0, -25, 0], opacity: [0.2, 0.7, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {/* Trust Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass-card mb-8">
                <Leaf className="w-4 h-4 text-grocery-lime" />
                <span className="text-sm font-medium text-white/70">
                  Food Delivery Service &amp; Restaurant
                </span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight"
            >
              <span className="text-white">Get Fresh</span>
              <br />
              <span className="text-white">Grocery</span>
              <br />
              <span className="text-white/70">Enjoy healthy life.</span>
            </motion.h1>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="mt-10">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-xl px-5 py-4 pr-12 text-sm font-medium outline-none focus:border-grocery-yellow/50 transition-all cursor-pointer"
                  >
                    <option value="" className="bg-grocery-darker text-white">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug} className="bg-grocery-darker text-white">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleShopNow}
                  className="px-8 py-4 bg-grocery-yellow text-grocery-darker font-bold rounded-xl shadow-xl text-sm tracking-wide yellow-glow transition-all"
                >
                  Shop Now
                  <ArrowRight className="inline w-4 h-4 ml-2" />
                </motion.button>
              </div>

              {/* Not yet member */}
              <p className="mt-4 text-sm text-white/40">
                Not yet Member?{' '}
                <button
                  onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}
                  className="text-grocery-yellow font-semibold hover:text-white transition-colors underline underline-offset-2"
                >
                  Sign Up Now.
                </button>
              </p>
            </motion.div>

            {/* Social Proof Card */}
            <motion.div
              variants={itemVariants}
              className="mt-12"
            >
              <motion.div
                initial={{ rotate: -2 }}
                whileHover={{ rotate: 0 }}
                className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl glass-card"
              >
                <div className="flex -space-x-3">
                  {['photo-1494790108377-be9c29b29330', 'photo-1507003211169-0a1dd7228f2d', 'photo-1438761681033-6461ffad8d80'].map((id, i) => (
                    <img
                      key={i}
                      src={`https://images.unsplash.com/${id}?w=40&h=40&fit=crop&crop=face`}
                      alt={`Customer ${i + 1}`}
                      className="w-10 h-10 rounded-full border-2 border-grocery-dark object-cover"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Our Happy Customer</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-grocery-yellow fill-grocery-yellow" />
                    ))}
                    <span className="text-xs text-white/50 ml-1">4.8</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* App Download */}
            <motion.div variants={itemVariants} className="mt-8">
              <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Download App</p>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition-colors">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.396 13l2.302-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z"/></svg>
                  <div className="text-left">
                    <p className="text-[10px] text-white/50">GET IT ON</p>
                    <p className="text-sm font-semibold text-white">Google Play</p>
                  </div>
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition-colors">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.98 21.18 12.5 21.18C11.03 21.18 10.65 21.95 9.38 22C8.06 22.05 6.97 20.68 6.13 19.47C4.3 16.56 2.93 11.3 4.7 7.72C5.57 5.94 7.36 4.86 9.28 4.84C10.56 4.81 11.78 5.72 12.57 5.72C13.36 5.72 14.85 4.62 16.4 4.8C17.06 4.83 18.89 5.08 20.07 6.79C19.96 6.86 17.62 8.24 17.65 11.04C17.69 14.4 20.63 15.52 20.66 15.53C20.64 15.63 20.17 17.26 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/></svg>
                  <div className="text-left">
                    <p className="text-[10px] text-white/50">Download on the</p>
                    <p className="text-sm font-semibold text-white">App Store</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Hero Visual with Delivery Person */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            {/* Background circle glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[480px] h-[480px] rounded-full bg-gradient-to-br from-grocery-green/20 to-grocery-green-light/10 blur-sm" />
            </div>

            {/* Main Image - Delivery Person */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10"
            >
              <img
                src="https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&h=700&fit=crop&crop=person"
                alt="Delivery person with fresh groceries"
                className="w-full h-[520px] object-cover object-top rounded-[2rem] shadow-2xl"
                style={{ filter: 'contrast(1.05) brightness(1.05)' }}
              />
            </motion.div>

            {/* Floating Card: 100% Fresh (top-right) */}
            <motion.div
              className="absolute -top-4 -right-4 z-20"
              animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="px-4 py-3 rounded-2xl glass-card shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-grocery-green/30 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-grocery-lime" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">100% Fresh</p>
                    <p className="text-[11px] text-white/50">Organic Certified</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Card: Location Pin (top-left) */}
            <motion.div
              className="absolute top-16 -left-8 z-20"
              animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              <div className="w-12 h-12 rounded-full bg-grocery-red shadow-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
            </motion.div>

            {/* Floating Card: Live Tracking (left) */}
            <motion.div
              className="absolute top-1/3 -left-10 z-20"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            >
              <div className="px-4 py-3 rounded-2xl glass-card shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Live Tracking</p>
                    <p className="text-[11px] text-white/50">Real-time updates</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Card: 30 Min Fast Delivery (bottom-left) */}
            <motion.div
              className="absolute bottom-24 -left-6 z-20"
              animate={{ y: [0, -8, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <div className="px-4 py-3 rounded-2xl glass-card shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-grocery-yellow/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-grocery-yellow" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">30 Min</p>
                    <p className="text-[11px] text-white/50">Fast Delivery</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Card: Expand icon (right-middle) */}
            <motion.div
              className="absolute top-1/2 -right-6 z-20"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            >
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                <Maximize2 className="w-4 h-4 text-white/70" />
              </div>
            </motion.div>

            {/* Floating Card: Refresh icon (bottom-right) */}
            <motion.div
              className="absolute bottom-8 right-4 z-20"
              animate={{ y: [0, -6, 0], rotate: [0, 45, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            >
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                <RefreshCw className="w-4 h-4 text-white/70" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-grocery-light to-transparent" />
    </section>
  );
}
