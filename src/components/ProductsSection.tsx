'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ShoppingBag, Heart, Eye } from 'lucide-react';
import { useStore } from '@/lib/store';
import { products, categories } from '@/lib/data';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
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

function ProductCard({ product, onProductClick }: { product: typeof products[0]; onProductClick: (p: typeof products[0]) => void }) {
  const { addToCart, wishlist, toggleWishlist, user, setAuthMode, setAuthOpen, showToast } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const isLiked = wishlist.includes(product._id);

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      onClick={() => onProductClick(product)}
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

        {/* Quick Info Overlay */}
        {isHovered && product.origin && (
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] font-medium text-gray-500">
            📍 {product.origin}
          </div>
        )}

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
              if (!user) {
                showToast('Please login to add products to cart', 'error');
                setAuthMode('login');
                setAuthOpen(true);
                return;
              }
              addToCart(product);
            }}
            className="w-9 h-9 rounded-full bg-grocery-green shadow-md flex items-center justify-center text-white"
          >
            <ShoppingBag className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category tag */}
        <span className="text-[10px] font-medium text-grocery-green bg-green-50 px-2 py-0.5 rounded-full">
          {product.category}
        </span>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-3 h-3 ${
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

        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-grocery-green transition-colors mt-1">
          {product.name}
        </h3>

        {/* Short description */}
        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-grocery-dark">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
          <span className="ml-auto text-[10px] text-gray-400">{product.unit}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { setSelectedProduct, setProductDetailOpen } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showAll, setShowAll] = useState(false);

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory);

  const displayProducts = showAll ? filteredProducts : filteredProducts.slice(0, 12);

  const handleProductClick = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setProductDetailOpen(true);
  };

  return (
    <section id="shop" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-6"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our{' '}
              <span className="text-grocery-green">Products</span>
            </h2>
            <p className="mt-2 text-gray-500 text-lg">
              Fresh & organic, handpicked just for you
            </p>
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide"
        >
          <button
            onClick={() => { setActiveCategory('All'); setShowAll(false); }}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === 'All'
                ? 'bg-grocery-green text-white shadow-lg shadow-grocery-green/25'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.name).length;
            return (
              <button
                key={cat.name}
                onClick={() => { setActiveCategory(cat.name); setShowAll(false); }}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.name
                    ? 'bg-grocery-green text-white shadow-lg shadow-grocery-green/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </motion.div>

        {/* Product Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} onProductClick={handleProductClick} />
          ))}
        </motion.div>

        {/* Show More / Show Less */}
        {filteredProducts.length > 12 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-10"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-8 py-3 bg-grocery-green/10 text-grocery-green font-bold rounded-xl hover:bg-grocery-green/20 transition-colors"
            >
              {showAll ? (
                <>
                  Show Less
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </>
              ) : (
                <>
                  Show All {filteredProducts.length} Products
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
