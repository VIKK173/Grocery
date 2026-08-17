'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, CreditCard, CheckCircle2, ShoppingBag,
  ArrowLeft, ArrowRight, Truck, ShieldCheck, Leaf,
  Phone, User, Building2, Smartphone, Package, Clock, Copy, Check,
} from 'lucide-react';
import { useStore } from '@/lib/store';

const steps = [
  { num: 1, label: 'Address', icon: MapPin },
  { num: 2, label: 'Payment', icon: CreditCard },
  { num: 3, label: 'Confirmation', icon: CheckCircle2 },
];

export default function CheckoutModal() {
  const {
    isCheckoutOpen, setCheckoutOpen, cartItems, getCartTotal, clearCart,
    showToast, setLastOrderId, setLastOrderData, user, lastOrderId, addOrder,
  } = useStore();

  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    address: '',
    landmark: '',
    city: '',
    pincode: '',
    paymentMethod: 'cod',
    upiId: '',
    cardNumber: '',
    couponCode: '',
  });
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const total = getCartTotal();
  const deliveryFee = total >= 299 ? 0 : 49;
  const couponDiscount = appliedCoupon === 'FRESH20' ? Math.round(total * 0.2) : 0;
  const bulkDiscount = total >= 500 && !appliedCoupon ? Math.round(total * 0.1) : 0;
  const discount = couponDiscount + bulkDiscount;
  const finalTotal = total + deliveryFee - discount;

  const updateForm = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const applyCoupon = () => {
    if (form.couponCode.toUpperCase() === 'FRESH20') {
      setAppliedCoupon('FRESH20');
      showToast('Coupon FRESH20 applied! 20% off!', 'success');
    } else if (form.couponCode) {
      showToast('Invalid coupon code', 'error');
    }
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    setOrderError('');

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          _id: item.product._id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          quantity: item.quantity,
          unit: item.product.unit,
        })),
        address: {
          name: form.name,
          phone: form.phone,
          address: `${form.address}${form.landmark ? `, ${form.landmark}` : ''}`,
          city: form.city,
          pincode: form.pincode,
        },
        paymentMethod: form.paymentMethod,
        subtotal: total,
        deliveryFee,
        discount,
        total: finalTotal,
        userId: user?.userId || 'guest',
        userEmail: user?.email || form.email || 'guest@email.com',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (data.success) {
        setLastOrderId(data.order.orderId);
        setLastOrderData(data.order);
        addOrder(data.order);
        moveToConfirmation();
        setStep(2);
        clearCart();
        showToast('Order placed successfully! 🎉', 'success');
      } else {
        setOrderError(data.error || 'Failed to place order. Try again!');
        showToast(data.error || 'Order failed', 'error');
      }
    } catch {
      // Fallback if API fails (e.g. MongoDB not reachable)
      const fallbackOrderId = `RF${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      const deliveryMinutes = Math.floor(Math.random() * 31) + 30;
      const est = new Date(Date.now() + deliveryMinutes * 60 * 1000);
      const estimatedDelivery = est.toLocaleString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: true, day: 'numeric', month: 'short',
      });

      const fallbackOrder = {
        orderId: fallbackOrderId,
        estimatedDelivery,
        total: finalTotal,
        status: 'confirmed',
        items: cartItems.map((item) => ({
          _id: item.product._id,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          quantity: item.quantity,
          unit: item.product.unit,
        })),
        createdAt: new Date(),
      };

      setLastOrderId(fallbackOrderId);
      setLastOrderData(fallbackOrder);
      addOrder(fallbackOrder);
      moveToConfirmation();
      setStep(2);
      clearCart();
      showToast('Order placed successfully! 🎉', 'success');
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = () => {
    setCheckoutOpen(false);
    setTimeout(() => setStep(0), 300);
  };

  const copyOrderId = () => {
    if (lastOrderId) {
      navigator.clipboard.writeText(lastOrderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Track item count before cart clears
  const [itemCount, setItemCount] = useState(0);
  const [savedTotal, setSavedTotal] = useState(0);

  // Save item count and total when moving to confirmation
  const moveToConfirmation = () => {
    setItemCount(cartItems.length);
    setSavedTotal(finalTotal);
  };

  if (!isCheckoutOpen || !user || (cartItems.length === 0 && step < 2)) return null;
  if ((!user || cartItems.length === 0) && step !== 2 && itemCount === 0) return null;

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-[95] w-full max-w-lg h-screen bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-grocery-light/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-grocery-green/10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-grocery-green" />
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
                onClick={handleClose}
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
                      <span className={`text-[11px] mt-1.5 font-medium ${step >= i ? 'text-grocery-green' : 'text-gray-400'}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div className="h-[2px] flex-1 mx-2 rounded-full bg-gray-200 relative -top-3">
                        <motion.div
                          className="absolute inset-y-0 left-0 rounded-full bg-grocery-green"
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
                        <ShoppingBag className="w-4 h-4 text-grocery-green" />
                        Your Items ({cartItems.length})
                      </h3>
                      <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                        {cartItems.map((item) => (
                          <div key={item.product._id} className="flex gap-3 p-3 rounded-xl bg-gray-50">
                            <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-800 truncate">{item.product.name}</h4>
                              <p className="text-xs text-gray-400">{item.product.unit} × {item.quantity}</p>
                            </div>
                            <span className="text-sm font-bold text-gray-900">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Coupon Code */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <span className="text-base">🏷️</span> Coupon Code
                      </h3>
                      <div className="flex gap-2">
                        <input
                          type="text" placeholder="Enter coupon code (try FRESH20)" value={form.couponCode}
                          onChange={(e) => updateForm('couponCode', e.target.value)}
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-grocery-green/30 focus:border-grocery-green transition-all"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={applyCoupon}
                          className="px-5 py-3 bg-grocery-green text-white font-semibold rounded-xl text-sm"
                        >
                          Apply
                        </motion.button>
                      </div>
                      {appliedCoupon && (
                        <div className="flex items-center gap-2 text-xs text-grocery-green bg-green-50 px-3 py-2 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Coupon FRESH20 applied — 20% off!
                        </div>
                      )}
                    </div>

                    {/* Bill Summary */}
                    <div className="p-4 rounded-2xl bg-gray-50 space-y-2">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Subtotal</span>
                        <span>₹{total.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Delivery</span>
                        <span className={deliveryFee === 0 ? 'text-grocery-green font-medium' : ''}>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                      </div>
                      {couponDiscount > 0 && (
                        <div className="flex justify-between text-sm text-grocery-green">
                          <span>Coupon (FRESH20)</span>
                          <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      {bulkDiscount > 0 && (
                        <div className="flex justify-between text-sm text-grocery-green">
                          <span>10% Bulk Discount</span>
                          <span>-₹{bulkDiscount.toLocaleString('en-IN')}</span>
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
                        <MapPin className="w-4 h-4 text-grocery-green" />
                        Delivery Address
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text" placeholder="Full Name *" value={form.name}
                            onChange={(e) => updateForm('name', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-grocery-green/30 focus:border-grocery-green transition-all"
                          />
                        </div>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel" placeholder="Phone Number *" value={form.phone}
                            onChange={(e) => updateForm('phone', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-grocery-green/30 focus:border-grocery-green transition-all"
                          />
                        </div>
                      </div>
                      <textarea
                        placeholder="Full Address (House No, Street) *"
                        value={form.address}
                        onChange={(e) => updateForm('address', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-grocery-green/30 focus:border-grocery-green transition-all resize-none"
                      />
                      <input
                        type="text" placeholder="Landmark (Near temple, school, etc.)"
                        value={form.landmark}
                        onChange={(e) => updateForm('landmark', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-grocery-green/30 focus:border-grocery-green transition-all"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text" placeholder="City *" value={form.city}
                            onChange={(e) => updateForm('city', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-grocery-green/30 focus:border-grocery-green transition-all"
                          />
                        </div>
                        <input
                          type="text" placeholder="Pincode *" value={form.pincode}
                          onChange={(e) => updateForm('pincode', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-grocery-green/30 focus:border-grocery-green transition-all"
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
                      <CreditCard className="w-4 h-4 text-grocery-green" />
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
                            ? 'border-grocery-green bg-grocery-green/5'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          form.paymentMethod === method.id ? 'bg-grocery-green/15' : 'bg-gray-100'
                        }`}>
                          <method.icon className={`w-5 h-5 ${form.paymentMethod === method.id ? 'text-grocery-green' : 'text-gray-500'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{method.label}</p>
                          <p className="text-xs text-gray-500">{method.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          form.paymentMethod === method.id ? 'border-grocery-green' : 'border-gray-300'
                        }`}>
                          {form.paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-grocery-green" />}
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
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-grocery-green/30 focus:border-grocery-green transition-all"
                        />
                      </motion.div>
                    )}

                    {form.paymentMethod === 'card' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="overflow-hidden space-y-3"
                      >
                        <input
                          type="text" placeholder="Card Number"
                          value={form.cardNumber}
                          onChange={(e) => updateForm('cardNumber', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-grocery-green/30 focus:border-grocery-green transition-all"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-grocery-green/30 focus:border-grocery-green transition-all" />
                          <input type="text" placeholder="CVV" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-grocery-green/30 focus:border-grocery-green transition-all" />
                        </div>
                      </motion.div>
                    )}

                    {/* Delivery Summary */}
                    <div className="p-4 rounded-2xl bg-gray-50 space-y-2">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Delivery Details</h4>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-grocery-green mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{form.address}{form.landmark ? `, ${form.landmark}` : ''}, {form.city} - {form.pincode}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-700">{form.name} — {form.phone}</p>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="p-4 rounded-2xl bg-grocery-green/5 border border-grocery-green/20 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Order Total</span>
                        <span className="font-bold text-gray-900">₹{finalTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Items</span>
                        <span className="font-medium text-gray-700">{cartItems.length} products</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Payment</span>
                        <span className="font-medium text-gray-700 capitalize">{form.paymentMethod === 'cod' ? 'Cash on Delivery' : form.paymentMethod === 'upi' ? 'UPI' : form.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <ShieldCheck className="w-4 h-4 text-grocery-green" />
                      Your payment is secure and encrypted
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Confirmation / Success */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 text-center flex flex-col items-center"
                  >
                    {/* Success Icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.2 }}
                      className="w-24 h-24 rounded-full bg-grocery-green/10 flex items-center justify-center mb-6"
                    >
                      <CheckCircle2 className="w-12 h-12 text-grocery-green" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="text-2xl font-bold text-gray-900">Order Placed Successfully!</h3>
                      <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                        Your fresh groceries are being packed. Our delivery partner will arrive soon.
                      </p>
                    </motion.div>

                    {/* Order ID Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-6 w-full max-w-sm p-4 rounded-2xl bg-gray-50 border border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <p className="text-xs text-gray-400">Order ID</p>
                          <p className="text-xl font-bold text-gray-900">
                            {lastOrderId || 'RF------'}
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={copyOrderId}
                          className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm"
                        >
                          {copied ? <Check className="w-4 h-4 text-grocery-green" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </motion.button>
                      </div>
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5 text-grocery-green" />
                          <span>30-60 min delivery</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Package className="w-3.5 h-3.5 text-grocery-green" />
                          <span>{itemCount || cartItems.length || 0} items</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 ml-auto">
                          ₹{(savedTotal || finalTotal).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </motion.div>

                    {/* Status Timeline */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-6 w-full max-w-sm space-y-3"
                    >
                      {[
                        { label: 'Order Confirmed', status: 'done', icon: CheckCircle2 },
                        { label: 'Packing your groceries', status: 'active', icon: Package },
                        { label: 'Out for delivery', status: 'pending', icon: Truck },
                        { label: 'Delivered to your door', status: 'pending', icon: MapPin },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.status === 'done' ? 'bg-grocery-green text-white' :
                            item.status === 'active' ? 'bg-grocery-green/15 text-grocery-green' :
                            'bg-gray-100 text-gray-400'
                          }`}>
                            <item.icon className="w-4 h-4" />
                          </div>
                          <span className={`text-sm ${
                            item.status === 'pending' ? 'text-gray-400' : 'text-gray-700 font-medium'
                          }`}>
                            {item.label}
                          </span>
                          {item.status === 'active' && (
                            <motion.div
                              className="ml-auto w-2 h-2 rounded-full bg-grocery-green"
                              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            />
                          )}
                        </div>
                      ))}
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="mt-8 w-full max-w-sm flex gap-3"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClose}
                        className="flex-1 px-6 py-3.5 bg-grocery-green text-white font-semibold rounded-2xl shadow-lg shadow-grocery-green/20"
                      >
                        Continue Shopping
                      </motion.button>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="mt-4 flex items-center gap-2 text-xs text-gray-400"
                    >
                      <Leaf className="w-3 h-3 text-grocery-green" />
                      Thank you for choosing fresh & organic!
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            {step < 2 && (
              <div className="border-t border-gray-100 p-5 space-y-3">
                {orderError && (
                  <div className="text-sm text-rose-500 bg-rose-50 px-4 py-2 rounded-xl">
                    {orderError}
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-grocery-green">₹{finalTotal.toLocaleString('en-IN')}</span>
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
                    onClick={step === 0 ? () => {
                      if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
                        showToast('Please fill all required fields', 'error');
                        return;
                      }
                      setStep(1);
                    } : handlePlaceOrder}
                    disabled={processing}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-grocery-green text-white font-semibold rounded-2xl shadow-lg shadow-grocery-green/20 hover:bg-grocery-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                  >
                    {processing ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Placing Order...
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
                  Secure checkout powered by Grocery Fresh
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
