'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ShoppingBag, Heart, Eye } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { featuredProducts } from '@/lib/data';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

function ProductCard({ product }: { product: typeof featuredProducts[0] }) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const isLiked = wishlist.includes(product._id);

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 cursor-pointer"
    >
      {/* Badge */}
      {product.badge && (
        <div
          className={`absolute top-4 left-4 z-20 px-3 py-1 ${product.badgeColor} text-white text-xs font-bold rounded-full`}
        >
          {product.badge}
        </div>
      )}

      {/* Wishlist */}
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product._id);
        }}
        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-400'
          }`}
        />
      </motion.button>

      {/* Image */}
      <div className="relative w-full h-52 overflow-hidden bg-gray-50">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Overlay Actions */}
        <motion.div
          className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 pb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-grocery-green transition-colors"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="w-9 h-9 rounded-full bg-grocery-green shadow-md flex items-center justify-center text-white"
          >
            <ShoppingBag className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(product.rating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-200 fill-gray-200'
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
        </div>

        <h3 className="text-base font-semibold text-gray-800 group-hover:text-grocery-green transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-grocery-dark">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="shop" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Best Selling{' '}
              <span className="text-grocery-green">Products</span>
            </h2>
            <p className="mt-2 text-gray-500 text-lg">
              Most popular items chosen by our customers
            </p>
          </div>
          <motion.a
            href="#shop"
            whileHover={{ x: 5 }}
            className="hidden md:flex items-center gap-1 text-grocery-green font-medium hover:text-grocery-green-light transition-colors"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
