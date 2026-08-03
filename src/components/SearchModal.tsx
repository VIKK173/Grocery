'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ShoppingBag, Star } from 'lucide-react';
import { useStore } from '@/lib/store';
import { products } from '@/lib/data';
import { useMemo } from 'react';

export default function SearchModal() {
  const { isSearchOpen, setSearchOpen, searchQuery, setSearchQuery, addToCart } = useStore();

  const results = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-20 p-4"
        onClick={() => setSearchOpen(false)}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 p-5 border-b border-gray-100">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for fruits, vegetables, juices..."
              className="flex-1 text-lg outline-none bg-transparent placeholder-gray-400"
            />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchQuery('')}
                className="text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg hover:bg-gray-200"
              >
                Clear
              </motion.button>
            )}
            <button
              onClick={() => setSearchOpen(false)}
              className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto p-4">
            {searchQuery.trim() === '' ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-400 text-sm">Type to search products...</p>
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {['Fruits', 'Vegetables', 'Mango', 'Juice', 'Organic'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1.5 text-sm bg-gray-100 rounded-full text-gray-600 hover:bg-grocery-green/10 hover:text-grocery-green transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm">No products found for &ldquo;{searchQuery}&rdquo;</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-gray-400 mb-3">{results.length} products found</p>
                {results.map((product) => (
                  <motion.div
                    key={product._id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => {
                      addToCart(product);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-800 group-hover:text-grocery-green transition-colors truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-400">{product.category} &middot; {product.unit}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-gray-500">{product.rating}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-grocery-dark">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="mt-1 p-1.5 rounded-lg bg-grocery-green/10 text-grocery-green group-hover:bg-grocery-green group-hover:text-white transition-all"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
