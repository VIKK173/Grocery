'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, Star, Truck, ShieldCheck, RefreshCw, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { products } from '@/lib/data';
import { useState } from 'react';

export default function ProductDetailModal() {
  const { selectedProduct, setSelectedProduct, isProductDetailOpen, setProductDetailOpen, addToCart, wishlist, toggleWishlist, showToast, user, setAuthMode, setAuthOpen } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'nutrition' | 'reviews'>('description');

  if (!selectedProduct) return null;

  const isLiked = wishlist.includes(selectedProduct._id);
  const discount = selectedProduct.originalPrice
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)
    : 0;

  const relatedProducts = products
    .filter((p) => p.category === selectedProduct.category && p._id !== selectedProduct._id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!user) {
      showToast('Please login to add products to cart', 'error');
      setAuthMode('login');
      setAuthOpen(true);
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(selectedProduct);
    }
    setQuantity(1);
  };

  const handleClose = () => {
    setProductDetailOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  // Fake review data
  const fakeReviews = [
    { name: 'Priya S.', date: '2 days ago', rating: 5, text: 'Absolutely fresh and amazing quality! Will order again.', avatar: '👩‍🦱' },
    { name: 'Rahul M.', date: '1 week ago', rating: 4, text: 'Good quality product. Packaging was great. Recommended!', avatar: '👨' },
    { name: 'Anita K.', date: '2 weeks ago', rating: 5, text: 'Best I have found online. The freshness is unmatched.', avatar: '👩' },
  ];

  return (
    <AnimatePresence>
      {isProductDetailOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-12 bg-white rounded-3xl z-[61] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </motion.button>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-full">
                {/* Left - Image Section */}
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
                  <motion.img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full max-w-[350px] h-[350px] object-cover rounded-2xl shadow-lg"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  />

                  {/* Floating badges */}
                  {selectedProduct.badge && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className={`absolute top-6 left-6 px-4 py-1.5 ${selectedProduct.badgeColor} text-white text-sm font-bold rounded-full shadow-lg`}
                    >
                      {selectedProduct.badge}
                    </motion.div>
                  )}

                  {discount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="absolute bottom-8 left-6 bg-rose-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg"
                    >
                      {discount}% OFF
                    </motion.div>
                  )}

                  {/* Wishlist */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleWishlist(selectedProduct._id)}
                    className="absolute bottom-8 right-6 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center"
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
                  </motion.button>
                </div>

                {/* Right - Info Section */}
                <div className="p-6 md:p-8 lg:p-10 flex flex-col">
                  {/* Category */}
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-block text-sm font-semibold text-grocery-green bg-green-50 px-3 py-1 rounded-full mb-3 w-fit"
                  >
                    {selectedProduct.category}
                  </motion.span>

                  {/* Name */}
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
                  >
                    {selectedProduct.name}
                  </motion.h2>

                  {/* Rating & Reviews */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3 mb-4"
                  >
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-600">{selectedProduct.rating}</span>
                    <span className="text-sm text-gray-400">|</span>
                    <span className="text-sm text-gray-500">{selectedProduct.reviews} reviews</span>
                  </motion.div>

                  {/* Price */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex items-center gap-3 mb-5"
                  >
                    <span className="text-3xl font-bold text-grocery-dark">
                      ₹{selectedProduct.price.toLocaleString('en-IN')}
                    </span>
                    {selectedProduct.originalPrice && (
                      <>
                        <span className="text-lg text-gray-400 line-through">
                          ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-sm font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">
                          Save ₹{(selectedProduct.originalPrice - selectedProduct.price).toLocaleString('en-IN')}
                        </span>
                      </>
                    )}
                    <span className="text-sm text-gray-400 ml-auto">{selectedProduct.unit}</span>
                  </motion.div>

                  {/* Quick Info Tags */}
                  {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap gap-2 mb-5"
                    >
                      {selectedProduct.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          {tag}
                        </span>
                      ))}
                    </motion.div>
                  )}

                  {/* Origin & Shelf Life */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32 }}
                    className="flex items-center gap-4 mb-5 text-sm text-gray-500"
                  >
                    {selectedProduct.origin && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {selectedProduct.origin}
                      </span>
                    )}
                    {selectedProduct.shelfLife && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {selectedProduct.shelfLife}
                      </span>
                    )}
                  </motion.div>

                  {/* Tabs */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="border-b border-gray-100 mb-4"
                  >
                    <div className="flex gap-6">
                      {(['description', 'nutrition', 'reviews'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`pb-3 text-sm font-medium capitalize transition-colors relative ${
                            activeTab === tab ? 'text-grocery-dark' : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          {tab}
                          {activeTab === tab && (
                            <motion.div
                              layoutId="tab-indicator"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-grocery-green rounded-full"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Tab Content */}
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 mb-6 min-h-[100px]"
                  >
                    {activeTab === 'description' && (
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {selectedProduct.description}
                        <br /><br />
                        Our {selectedProduct.name.toLowerCase()} is carefully sourced and quality-checked before delivery.
                        We ensure the highest standards of freshness and hygiene so you receive only the best produce at your doorstep.
                        Store in a cool, dry place for maximum freshness and shelf life.
                      </p>
                    )}

                    {activeTab === 'nutrition' && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Nutritional Information (per 100g)</h4>
                        <p className="text-sm text-gray-600 mb-3">{selectedProduct.nutrition || 'Nutritional information not available.'}</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-400">Protein</div>
                            <div className="text-sm font-semibold text-gray-700">High Quality</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-400">Fiber</div>
                            <div className="text-sm font-semibold text-gray-700">Natural</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-400">Organic</div>
                            <div className="text-sm font-semibold text-gray-700">Certified</div>
                          </div>
                          <div className="bg-white rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-400">Preservatives</div>
                            <div className="text-sm font-semibold text-gray-700">None</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'reviews' && (
                      <div className="space-y-4">
                        {fakeReviews.map((review, i) => (
                          <div key={i} className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xl">{review.avatar}</span>
                              <div>
                                <div className="text-sm font-semibold text-gray-700">{review.name}</div>
                                <div className="text-xs text-gray-400">{review.date}</div>
                              </div>
                              <div className="ml-auto flex items-center gap-0.5">
                                {[...Array(5)].map((_, j) => (
                                  <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{review.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  {/* Quantity & Add to Cart */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3 mt-auto"
                  >
                    {/* Quantity */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-semibold text-gray-800">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Add to Cart */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      className="flex-1 h-12 bg-grocery-green hover:bg-grocery-dark text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-grocery-green/25"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart — ₹{(selectedProduct.price * quantity).toLocaleString('en-IN')}
                    </motion.button>
                  </motion.div>

                  {/* Trust Badges */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400"
                  >
                    <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Free Delivery</span>
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Quality Assured</span>
                    <span className="flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Easy Returns</span>
                  </motion.div>

                  {/* Related Products */}
                  {relatedProducts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 }}
                      className="mt-6 pt-6 border-t border-gray-100"
                    >
                      <h4 className="text-sm font-bold text-gray-700 mb-3">You May Also Like</h4>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {relatedProducts.map((product) => (
                          <button
                            key={product._id}
                            onClick={() => {
                              setSelectedProduct(product);
                              setQuantity(1);
                              setActiveTab('description');
                            }}
                            className="flex-shrink-0 w-20 group"
                          >
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 mb-1">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <p className="text-xs text-gray-600 truncate text-center group-hover:text-grocery-green transition-colors">{product.name}</p>
                            <p className="text-xs font-bold text-gray-800 text-center">₹{product.price}</p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
