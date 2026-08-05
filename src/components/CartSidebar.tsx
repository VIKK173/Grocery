'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Leaf } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function CartSidebar() {
  const { isCartOpen, setCartOpen, cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount, setCheckoutOpen, user, setAuthOpen, setAuthMode, showToast } = useStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-[95] w-full max-w-md h-screen bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-grocery-green/10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-grocery-green" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
                  <p className="text-sm text-gray-500">{getCartCount()} items</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCartOpen(false)}
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6"
                  >
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-800">Cart is empty</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-6">
                    Add some fresh produce to get started!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCartOpen(false)}
                    className="px-6 py-3 bg-grocery-green text-white font-semibold rounded-xl shadow-lg shadow-grocery-green/20"
                  >
                    Start Shopping
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.product._id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        className="flex gap-4 p-3 rounded-xl bg-gray-50 group hover:bg-gray-100 transition-colors"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-800 truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-gray-400">{item.product.unit}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-base font-bold text-grocery-dark">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-200 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </motion.button>
                              <span className="w-6 text-center text-sm font-semibold">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-200 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeFromCart(item.product._id)}
                                className="ml-1 w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 hover:bg-rose-100 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Delivery</span>
                    <span className="text-grocery-green font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (!user) {
                      showToast('Please login or signup to place an order!', 'info');
                      setAuthMode('login');
                      setAuthOpen(true);
                      return;
                    }
                    setCartOpen(false);
                    setTimeout(() => setCheckoutOpen(true), 300);
                  }}
                  className="w-full py-4 bg-grocery-yellow text-grocery-darker font-bold rounded-xl shadow-lg yellow-glow flex items-center justify-center gap-2 hover:bg-grocery-yellow-dark transition-colors"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Leaf className="w-3 h-3" />
                  Free delivery on orders above ₹299
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
