'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Star,
  MapPin,
  Clock,
  Leaf,
  ChevronDown,
  Smartphone,
  Shield,
  Truck,
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
    if (selectedCategory) {
      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden hero-gradient"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full bg-rivora-green/8 blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-[600px] h-[600px] rounded-full bg-rivora-lime/5 blur-[150px]" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-rivora-yellow/5 blur-[100px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-rivora-lime/20"
            style={{
              width: 3 + Math.random() * 4,
              height: 3 + Math.random() * 4,
              left: `${10 + i * 12}%`,
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
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass mb-8">
                <div className="w-2 h-2 rounded-full bg-rivora-lime animate-pulse" />
                <span className="text-sm font-medium text-white/80">
                  Food Delivery Service & Restaurant
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-black leading-[0.95] tracking-tight"
            >
              <span className="text-white">Get Fresh</span>
              <br />
              <span className="gradient-text">Grocery</span>
              <br />
              <span className="text-white">Delivered</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg md:text-xl text-white/50 max-w-lg leading-relaxed"
            >
              Enjoy a healthy life with premium organic fruits & vegetables
              delivered fresh to your doorstep within hours.
            </motion.p>

            {/* Category Selector + Shop Now */}
            <motion.div variants={itemVariants} className="mt-10">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-2xl px-5 py-4 pr-12 text-sm font-medium outline-none focus:border-rivora-lime/50 transition-all cursor-pointer"
                  >
                    <option value="" className="bg-rivora-darker text-white">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug} className="bg-rivora-darker text-white">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 15px 40px rgba(163,230,53,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleShopNow}
                  className="px-8 py-4 bg-gradient-to-r from-rivora-lime to-rivora-green text-rivora-darker font-bold rounded-2xl shadow-xl shadow-rivora-lime/20 text-sm tracking-wide"
                >
                  Shop Now
                  <ArrowRight className="inline w-4 h-4 ml-2" />
                </motion.button>
              </div>

              {/* Secondary link */}
              <p className="mt-4 text-sm text-white/40">
                Not yet a member?{' '}
                <button
                  onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}
                  className="text-rivora-lime font-semibold hover:text-white transition-colors"
                >
                  Sign Up Now
                </button>
              </p>
            </motion.div>

            {/* Social Proof Card */}
            <motion.div
              variants={itemVariants}
              className="mt-12"
            >
              <motion.div
                initial={{ rotate: -3 }}
                whileHover={{ rotate: 0 }}
                className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl glass p-6"
              >
                <div className="flex -space-x-3">
                  {['photo-1494790108377-be9c29b29330', 'photo-1507003211169-0a1dd7228f2d', 'photo-1438761681033-6461ffad8d80'].map((id, i) => (
                    <img
                      key={i}
                      src={`https://images.unsplash.com/${id}?w=40&h=40&fit=crop&crop=face`}
                      alt={`Customer ${i + 1}`}
                      className="w-10 h-10 rounded-full border-2 border-rivora-dark object-cover"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-rivora-yellow text-rivora-yellow" />
                    <span className="text-sm font-bold text-white">4.8</span>
                    <span className="text-xs text-white/40">(4.8k Reviews)</span>
                  </div>
                  <p className="text-xs text-white/50">Our Happy Customers</p>
                </div>
                <div className="w-12 h-1 rounded-full bg-rivora-yellow/40" />
              </motion.div>
            </motion.div>

            {/* App Download */}
            <motion.div variants={itemVariants} className="mt-8">
              <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Download App</p>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition-colors">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.232l1.645-1.645a.5.5 0 00-.708-.708L16.5 1.845 1.845 16.5l1.967 1.967-1.645 1.645a.5.5 0 00.708.708L3.5 19.155 19.155 3.5l-1.967-1.967z"/></svg>
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

          {/* Right - Hero Visual with Floating Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            {/* Background circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[450px] h-[450px] rounded-full bg-gradient-to-br from-rivora-green/15 to-rivora-lime/10 blur-sm" />
            </div>

            {/* Main Image */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10"
            >
              <img
                src="https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/af8eea555b4d.jpg"
                alt="Fresh organic produce"
                className="w-full h-[480px] object-cover rounded-[2rem] shadow-2xl"
              />
            </motion.div>

            {/* Floating Card: 100% Fresh */}
            <motion.div
              className="absolute -top-4 -right-4 z-20"
              animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="px-4 py-3 rounded-2xl glass shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-rivora-green/20 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-rivora-lime" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">100% Fresh</p>
                    <p className="text-[11px] text-white/50">Organic Certified</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Card: Location */}
            <motion.div
              className="absolute top-1/3 -left-8 z-20"
              animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              <div className="px-4 py-3 rounded-2xl glass shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Live Tracking</p>
                    <p className="text-[11px] text-white/50">Real-time updates</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Card: Fast Delivery */}
            <motion.div
              className="absolute bottom-16 -left-6 z-20"
              animate={{ y: [0, -8, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <div className="px-4 py-3 rounded-2xl glass shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-rivora-yellow/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-rivora-yellow" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">30 Min</p>
                    <p className="text-[11px] text-white/50">Fast Delivery</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Card: Discount */}
            <motion.div
              className="absolute bottom-4 right-8 z-20"
              animate={{ y: [0, -12, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            >
              <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-rivora-yellow to-amber-400 shadow-xl">
                <p className="text-xs font-bold text-rivora-darker">20% OFF</p>
                <p className="text-[10px] text-rivora-darker/70">First Order</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-rivora-light to-transparent" />
    </section>
  );
}
