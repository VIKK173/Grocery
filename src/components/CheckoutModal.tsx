'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, CreditCard, CheckCircle2, ShoppingBag,
  ArrowLeft, ArrowRight, Truck, ShieldCheck, Leaf,
  ChevronRight, Phone, User, Building2,
} from 'lucide-react';
import { useStore } from '@/lib/store';

const steps = [
  { num: 1, label: 'Address', icon: MapPin },
  { num: 2, label: 'Payment', icon: CreditCard },
  { num: 3, label: 'Confirmation', icon: CheckCircle2 },
];

export default function CheckoutModal() {
  const { isCartOpen, setCartOpen, cartItems, getCartTotal, clearCart, showToast } = useStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', phone: '', address: '', city: '', pincode: '',
    paymentMethod: 'cod', upiId: '',
  });
  const [processing, setProcessing] = useState(false);

  const total = getCartTotal();
  const deliveryFee = total >= 299 ? 0 : 49;
  const discount = total >= 500 ? Math.round(total * 0.1) : 0;
  const finalTotal = total + deliveryFee - discount;

  const updateForm = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handlePlaceOrder = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep(2);
      clearCart();
      showToast('Order placed successfully! 🎉', 'success');
    }, 2500);
  };

  if (!isCartOpen || cartItems.length === 0) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
            onClick={() => { setCartOpen(false); setStep(0); }}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-[95] w-full max-w-lg h-screen bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-rivora-light/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rivora-green/10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-rivora-green" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Checkout</h2>
                  <p className="text-xs text-gray-500">
                    {step === 0 ? 'Review & Address' : step === 1 ? 'Payment' : 'Order Confirmed'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { setCartOpen(false); setStep(0); }}
                className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors shadow-sm"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Step Indicator */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                {steps.map((s, i) => (
                  <div key={s.num} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <motion.div
                        animate={{
                          scale: step === i ? 1.1 : 1,
                          backgroundColor: step >= i ? '#16A34A' : '#F5F7FA',
                        }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                      >
                        {step > i ? (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : (
                          <s.icon className={`w-5 h-5 ${step >= i ? 'text-white' : 'text-gray-400'}`} />
                        )}
                      </motion.div>
                      <span className={`text-[11px] mt-1.5 font-medium ${step >= i ? 'text-rivora-green' : 'text-gray-400'}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div className="h-[2px] flex-1 mx-2 rounded-full bg-gray-200 relative -top-3">
                        <motion.div
                          className="absolute inset-y-0 left-0 rounded-full bg-rivora-green"
                          animate={{ width: step > i ? '100%' : '0%' }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* STEP 0: Cart Review + Address */}
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-5 space-y-5"
                  >
                    {/* Cart Items */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-rivora-green" />
                        Your Items ({cartItems.length})
                      </h3>
                      {cartItems.map((item) => (
                        <div key={item.product._id} className="flex gap-3 p-3 rounded-2xl bg-gray-50">
                          <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-800 truncate">{item.product.name}</h4>
                            <p className="text-xs text-gray-400">{item.product.unit} &times; {item.quantity}</p>
                          </div>
                          <span className="text-sm font-bold text-gray-900">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bill Summary */}
                    <div className="p-4 rounded-2xl bg-gray-50 space-y-2">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Subtotal</span>
                        <span>₹{total.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Delivery</span>
                        <span className={deliveryFee === 0 ? 'text-rivora-green font-medium' : ''}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm text-rivora-green">
                          <span>10% Discount</span>
                          <span>-₹{discount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-rivora-green" />
                        Delivery Address
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text" placeholder="Full Name" value={form.name}
                            onChange={(e) => updateForm('name', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rivora-green/30 focus:border-rivora-green transition-all"
                          />
                        </div>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel" placeholder="Phone Number" value={form.phone}
                            onChange={(e) => updateForm('phone', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rivora-green/30 focus:border-rivora-green transition-all"
                          />
                        </div>
                      </div>
                      <textarea
                        placeholder="Full Address (House No, Street, Landmark)"
                        value={form.address}
                        onChange={(e) => updateForm('address', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rivora-green/30 focus:border-rivora-green transition-all resize-none"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text" placeholder="City" value={form.city}
                            onChange={(e) => updateForm('city', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rivora-green/30 focus:border-rivora-green transition-all"
                          />
                        </div>
                        <input
                          type="text" placeholder="Pincode" value={form.pincode}
                          onChange={(e) => updateForm('pincode', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rivora-green/30 focus:border-rivora-green transition-all"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 1: Payment */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-5 space-y-5"
                  >
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-rivora-green" />
                      Select Payment Method
                    </h3>

                    {[
                      { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: Truck },
                      { id: 'upi', label: 'UPI Payment', desc: 'GPay, PhonePe, Paytm', icon: Smartphone },
                      { id: 'card', label: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard },
                      { id: 'netbanking', label: 'Net Banking', desc: 'All major banks supported', icon: Building2 },
                    ].map((method) => (
                      <motion.button
                        key={method.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => updateForm('paymentMethod', method.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                          form.paymentMethod === method.id
                            ? 'border-rivora-green bg-rivora-green/5'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          form.paymentMethod === method.id ? 'bg-rivora-green/15' : 'bg-gray-100'
                        }`}>
                          <method.icon className={`w-5 h-5 ${form.paymentMethod === method.id ? 'text-rivora-green' : 'text-gray-500'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{method.label}</p>
                          <p className="text-xs text-gray-500">{method.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          form.paymentMethod === method.id ? 'border-rivora-green' : 'border-gray-300'
                        }`}>
                          {form.paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-rivora-green" />}
                        </div>
                      </motion.button>
                    ))}

                    {form.paymentMethod === 'upi' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="overflow-hidden"
                      >
                        <input
                          type="text" placeholder="Enter UPI ID (example@upi)"
                          value={form.upiId}
                          onChange={(e) => updateForm('upiId', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rivora-green/30 focus:border-rivora-green transition-all"
                        />
                      </motion.div>
                    )}

                    {/* Order Summary */}
                    <div className="p-4 rounded-2xl bg-rivora-green/5 border border-rivora-green/20 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Order Total</span>
                        <span className="font-bold text-gray-900">₹{finalTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Delivery to</span>
                        <span className="font-medium text-gray-700">{form.city || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Payment</span>
                        <span className="font-medium text-gray-700 capitalize">{form.paymentMethod === 'cod' ? 'Cash on Delivery' : form.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <ShieldCheck className="w-4 h-4 text-rivora-green" />
                      Your payment is secure and encrypted
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Confirmation */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 text-center flex flex-col items-center justify-center min-h-[60vh]"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
                      className="w-24 h-24 rounded-full bg-rivora-green/10 flex items-center justify-center mb-6"
                    >
                      <CheckCircle2 className="w-12 h-12 text-rivora-green" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="text-2xl font-bold text-gray-900">Order Placed!</h3>
                      <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                        Your fresh groceries are on the way. Expected delivery in 30-45 minutes.
                      </p>
                      <div className="mt-6 p-4 rounded-2xl bg-gray-50 inline-block">
                        <p className="text-xs text-gray-400">Order ID</p>
                        <p className="text-lg font-bold text-gray-900">RF{Date.now().toString().slice(-6)}</p>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-8 flex gap-3"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setCartOpen(false); setStep(0); }}
                        className="px-8 py-3.5 bg-rivora-green text-white font-semibold rounded-2xl shadow-lg shadow-rivora-green/20"
                      >
                        Continue Shopping
                      </motion.button>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="mt-6 flex items-center gap-2 text-xs text-gray-400"
                    >
                      <Leaf className="w-3 h-3 text-rivora-green" />
                      Track your order in the app
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            {step < 2 && (
              <div className="border-t border-gray-100 p-5 space-y-4">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-rivora-green">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex gap-3">
                  {step > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(step - 1)}
                      className="flex items-center gap-2 px-5 py-3.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-colors text-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={step === 0 ? () => setStep(1) : handlePlaceOrder}
                    disabled={step === 0 && (!form.name || !form.address || !form.city)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-rivora-green text-white font-semibold rounded-2xl shadow-lg shadow-rivora-green/20 hover:bg-rivora-green/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                  >
                    {processing ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </>
                    ) : step === 0 ? (
                      <>Proceed to Payment <ArrowRight className="w-4 h-4" /></>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Place Order — ₹{finalTotal.toLocaleString('en-IN')}
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <ShieldCheck className="w-3 h-3" />
                  Secure checkout powered by RivoraFresh
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
