'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Leaf, Users, Star, Play, Truck } from 'lucide-react';

const stats = [
  { icon: Leaf, value: '100%', label: 'Organic' },
  { icon: Users, value: '4.8k+', label: 'Happy Customers' },
  { icon: Star, value: '4.9', label: 'Average Rating' },
  { icon: Truck, value: '50+', label: 'Products' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function FarmSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative rounded-[2rem] overflow-hidden bg-rivora-dark shadow-2xl"
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Content */}
            <motion.div
              variants={itemVariants}
              className="p-8 md:p-12 lg:p-16 flex flex-col justify-center"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rivora-green/15 text-rivora-green text-sm font-medium w-fit mb-6">
                <Leaf className="w-3.5 h-3.5" />
                Farm Fresh
              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                From Our Farm
                <br />
                <span className="text-rivora-green">To Your Home.</span>
              </h2>

              <p className="mt-6 text-white/60 text-lg leading-relaxed max-w-md">
                We partner directly with local organic farmers to bring you the
                freshest produce. Every item is hand-picked and delivered within
                24 hours of harvest, ensuring maximum nutrition and taste.
              </p>

              <motion.a
                href="#"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-rivora-green text-white font-semibold rounded-2xl w-fit shadow-lg shadow-rivora-green/20 hover:bg-rivora-green-dark transition-colors duration-300"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </motion.a>

              {/* Stats */}
              <motion.div
                variants={containerVariants}
                className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6"
              >
                {stats.map((stat) => (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 rounded-xl bg-rivora-green/10 flex items-center justify-center mx-auto mb-2">
                      <stat.icon className="w-5 h-5 text-rivora-green" />
                    </div>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/50">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              variants={itemVariants}
              className="relative hidden md:block"
            >
              <img
                src="https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&h=600&fit=crop"
                alt="Organic farm field"
                className="w-full h-full object-cover"
              />
              {/* Play Button Overlay */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40 hover:bg-white/30 transition-colors"
              >
                <Play className="w-6 h-6 text-white ml-1" fill="white" />
              </motion.button>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-rivora-dark/50 to-transparent" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
