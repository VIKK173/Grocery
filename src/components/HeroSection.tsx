'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Star,
  ShieldCheck,
  Truck,
  Award,
  Leaf,
} from 'lucide-react';

const features = [
  { icon: Leaf, label: '100% Natural', color: 'text-emerald-400' },
  { icon: Truck, label: 'Fast Delivery', color: 'text-sky-400' },
  { icon: ShieldCheck, label: 'Secure Payment', color: 'text-amber-400' },
  { icon: Award, label: 'Best Quality', color: 'text-rose-400' },
];

const customerAvatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544725176-7c40e128a544?w=40&h=40&fit=crop&crop=face',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-rivora-dark"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-rivora-dark via-rivora-darker to-rivora-dark" />
        {/* Decorative large R */}
        <motion.div
          initial={{ opacity: 0.03, scale: 0.8 }}
          animate={{ opacity: 0.06, scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute -right-20 top-1/4 text-[20rem] md:text-[30rem] font-black text-rivora-green leading-none select-none pointer-events-none"
        >
          R
        </motion.div>
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-rivora-green/30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rivora-green/10 border border-rivora-green/20 text-rivora-green text-sm font-medium mb-6">
                <Leaf className="w-3.5 h-3.5" />
                100% Organic & Fresh
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight"
            >
              <span className="text-white">Fresh Choices,</span>
              <br />
              <motion.span
                className="text-rivora-green inline-block"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                Better Life
              </motion.span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg md:text-xl text-white/60 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Premium &amp; tasty fruits and vegetables delivered fresh to your
              doorstep. Experience the goodness of nature.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <motion.a
                href="#shop"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(132,204,22,0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-rivora-green text-white font-semibold rounded-2xl shadow-lg shadow-rivora-green/30 hover:bg-rivora-green-dark transition-colors duration-300"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="#categories"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-2xl hover:border-rivora-green/50 hover:text-rivora-green transition-all duration-300"
              >
                Explore Categories
              </motion.a>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex items-center gap-4 justify-center lg:justify-start"
            >
              <div className="flex -space-x-3">
                {customerAvatars.map((url, i) => (
                  <motion.img
                    key={i}
                    src={url}
                    alt={`Customer ${i + 1}`}
                    className="w-10 h-10 rounded-full border-2 border-rivora-dark object-cover"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-white/60">
                  <span className="text-white font-semibold">4.8k</span> Happy
                  Customers
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-rivora-green/20 rounded-full blur-3xl" />
              <motion.img
                src="https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/af8eea555b4d.jpg"
                alt="Fresh organic produce"
                className="relative w-full h-[500px] object-cover rounded-3xl shadow-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Organic</p>
                  <p className="text-xs text-gray-500">Certified Fresh</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Feature Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {features.map((feat, i) => (
            <motion.div
              key={feat.label}
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-rivora-green/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + i * 0.1 }}
            >
              <div className="p-2.5 rounded-xl bg-white/10">
                <feat.icon className={`w-5 h-5 ${feat.color}`} />
              </div>
              <span className="text-sm font-medium text-white/80">
                {feat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
