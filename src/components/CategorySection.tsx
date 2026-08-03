'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const categories = [
  {
    name: 'Fresh Fruits',
    count: 32,
    image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6833ccbfa961.webp',
    color: 'bg-gradient-to-br from-rose-100 to-rose-50',
  },
  {
    name: 'Vegetables',
    count: 28,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&h=200&fit=crop',
    color: 'bg-gradient-to-br from-emerald-100 to-emerald-50',
  },
  {
    name: 'Leafy Greens',
    count: 18,
    image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/480b534feb78.png',
    color: 'bg-gradient-to-br from-lime-100 to-lime-50',
  },
  {
    name: 'Herbs & Spices',
    count: 24,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop',
    color: 'bg-gradient-to-br from-amber-100 to-amber-50',
  },
  {
    name: 'Fresh Juices',
    count: 15,
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=200&h=200&fit=crop',
    color: 'bg-gradient-to-br from-orange-100 to-orange-50',
  },
  {
    name: 'Organic',
    count: 21,
    image: 'https://images.unsplash.com/photo-1590868309231-e006f37b003a?w=200&h=200&fit=crop',
    color: 'bg-gradient-to-br from-teal-100 to-teal-50',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function CategorySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = dir === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Shop by{' '}
              <span className="text-grocery-green">Category</span>
            </h2>
            <p className="mt-2 text-gray-500 text-lg">
              Browse our wide selection of fresh produce
            </p>
          </div>
          <motion.a
            href="#"
            whileHover={{ x: 5 }}
            className="hidden md:flex items-center gap-1 text-grocery-green font-medium hover:text-grocery-green-light transition-colors"
          >
            View All Categories
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>

        {/* Category Cards */}
        <div className="relative group">
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-grocery-green transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          )}
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-grocery-green transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}

          <motion.div
            ref={scrollRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            onScroll={handleScroll}
            className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat) => (
              <motion.div
                key={cat.name}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.03 }}
                className="flex-shrink-0 w-48 md:w-56 snap-center cursor-pointer group"
              >
                <div
                  className={`relative w-full h-48 md:h-56 rounded-2xl ${cat.color} p-6 flex flex-col justify-between overflow-hidden transition-shadow duration-300 group-hover:shadow-xl`}
                >
                  <div className="relative z-10">
                    <p className="text-sm font-medium text-gray-500">{cat.count} Items</p>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">
                      {cat.name}
                    </h3>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className="relative z-10"
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-2xl shadow-lg"
                    />
                  </motion.div>
                  <motion.div
                    className="absolute top-4 right-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <ArrowRight className="w-4 h-4 text-grocery-green" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
