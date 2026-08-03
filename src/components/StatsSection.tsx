'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, Users, Package, Award } from 'lucide-react';

const stats = [
  { icon: Users, value: '4.8K+', label: 'Happy Customers', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: Package, value: '21+', label: 'Products', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: Award, value: '100%', label: 'Organic Quality', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: TrendingUp, value: '99%', label: 'Satisfaction Rate', color: 'text-violet-500', bg: 'bg-violet-500/10' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-20 md:py-28 hero-gradient relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-grocery-green/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-grocery-yellow/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.03 }}
              className="text-center p-8 rounded-2xl glass-card"
            >
              <div className={`w-16 h-16 rounded-2xl ${stat.bg} flex items-center justify-center mx-auto mb-5`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</h3>
              <p className="text-white/50 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
