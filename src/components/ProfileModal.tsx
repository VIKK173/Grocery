'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, ShoppingBag, Calendar, Package, CheckCircle, Clock, Leaf, LogOut, Truck, MapPin, Navigation } from 'lucide-react';
import { useStore, type Order } from '@/lib/store';

export default function ProfileModal() {
  const { isProfileOpen, setProfileOpen, user, setUser, orders, showToast } = useStore();

  const handleLogout = () => {
    setUser(null);
    showToast('Logged out successfully', 'success');
    setProfileOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'preparing':
        return 'text-blue-600 bg-blue-50';
      case 'out_for_delivery':
        return 'text-orange-600 bg-orange-50';
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getTrackingSteps = (status: string) => {
    const steps = [
      { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle },
      { key: 'preparing', label: 'Preparing', icon: Package },
      { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle },
    ];

    const statusOrder = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  if (!isProfileOpen) return null;

  if (!user) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setProfileOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900">Please login first</h2>
            <p className="text-gray-500 mt-2">You need to be logged in to view your profile</p>
            <button
              onClick={() => {
                setProfileOpen(false);
                // This will trigger the auth modal through the header
              }}
              className="mt-6 px-6 py-3 bg-grocery-green text-white font-semibold rounded-xl"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={() => setProfileOpen(false)}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => setProfileOpen(false)}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-br from-grocery-dark to-grocery-darker p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-grocery-green mx-auto mb-4 flex items-center justify-center shadow-lg shadow-grocery-green/30"
            >
              <span className="text-3xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </motion.div>
            <h2 className="text-2xl font-bold text-white">{user?.name || 'User'}</h2>
            <p className="text-white/60 mt-1 text-sm flex items-center justify-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              {user?.email || 'No email'}
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* User Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-grocery-green/10 to-grocery-green/5 rounded-2xl p-4 text-center">
                <ShoppingBag className="w-6 h-6 text-grocery-green mx-auto mb-2" />
                <p className="text-2xl font-bold text-grocery-dark">{orders.length}</p>
                <p className="text-xs text-gray-500">Orders</p>
              </div>
              <div className="bg-gradient-to-br from-grocery-yellow/10 to-grocery-yellow/5 rounded-2xl p-4 text-center">
                <Package className="w-6 h-6 text-grocery-yellow mx-auto mb-2" />
                <p className="text-2xl font-bold text-grocery-dark">
                  {orders.reduce((sum, order) => sum + (order.items?.length || 0), 0)}
                </p>
                <p className="text-xs text-gray-500">Items</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-2xl p-4 text-center">
                <CheckCircle className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-grocery-dark">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
                <p className="text-xs text-gray-500">Delivered</p>
              </div>
            </div>

            {/* Orders Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-grocery-dark mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-grocery-green" />
                My Orders
              </h3>
              
              {orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No orders yet</p>
                  <p className="text-gray-400 text-sm mt-1">Start shopping to see your orders here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <motion.div
                      key={order.orderId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-grocery-dark">#{order.orderId}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Package className="w-4 h-4" />
                        <span>{order.items?.length || 0} items</span>
                        <span className="mx-2">•</span>
                        <span className="font-semibold text-grocery-dark">₹{order.total}</span>
                      </div>

                      {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 rounded-lg px-3 py-2">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Estimated: {order.estimatedDelivery}</span>
                        </div>
                      )}

                      {/* Order Tracking */}
                      {order.status !== 'cancelled' && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                            <Navigation className="w-4 h-4" />
                            <span>Live Tracking</span>
                          </div>
                          <div className="space-y-3">
                            {getTrackingSteps(order.status).map((step, index) => (
                              <div key={step.key} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  step.completed 
                                    ? 'bg-green-500 text-white' 
                                    : step.current 
                                      ? 'bg-blue-500 text-white animate-pulse' 
                                      : 'bg-gray-200 text-gray-400'
                                }`}>
                                  <step.icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <p className={`text-sm font-medium ${
                                    step.completed ? 'text-green-700' : 
                                    step.current ? 'text-blue-700' : 'text-gray-400'
                                  }`}>
                                    {step.label}
                                  </p>
                                  {step.current && (
                                    <p className="text-xs text-gray-500">In Progress</p>
                                  )}
                                </div>
                                {index < 3 && (
                                  <div className={`w-8 h-0.5 ${
                                    step.completed ? 'bg-green-500' : 'bg-gray-200'
                                  }`} />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
