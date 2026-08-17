'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, MapPin, Clock, Phone, User, LogOut, CheckCircle, Truck, Navigation, ShieldCheck, XCircle } from 'lucide-react';

export default function WorkerDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [otp, setOtp] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [customerOtp, setCustomerOtp] = useState('');
  const [deliveryTimeline, setDeliveryTimeline] = useState<any[]>([]);

  useEffect(() => {
    const auth = localStorage.getItem('workerAuth');
    if (auth !== 'true') {
      router.push('/worker/login');
    } else {
      fetchAssignedOrders();
    }
  }, [router]);

  const fetchAssignedOrders = async () => {
    setLoading(true);
    try {
      const workerEmail = localStorage.getItem('workerEmail') || 'worker1@delivery.com';
      const res = await fetch(`/api/orders?worker=${workerEmail}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('workerAuth');
    router.push('/worker/login');
  };

  const startDelivery = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'out_for_delivery' }),
      });
      if (res.ok) {
        // Add to timeline
        const newTimeline = [...deliveryTimeline, { orderId, status: 'out_for_delivery', timestamp: new Date() }];
        setDeliveryTimeline(newTimeline);
        fetchAssignedOrders();
      }
    } catch (error) {
      console.error('Failed to start delivery:', error);
    }
  };

  const generateOtp = () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);
    setShowOtpModal(true);
    alert(`OTP Generated: ${generatedOtp}. Share with customer.`);
  };

  const verifyOtp = (enteredOtp: string) => {
    if (enteredOtp === otp) {
      completeDelivery(selectedOrder.orderId);
      setShowOtpModal(false);
      setOtp('');
    } else {
      alert('Invalid OTP');
    }
  };

  const completeDelivery = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'delivered' }),
      });
      if (res.ok) {
        // Add to timeline
        const newTimeline = [...deliveryTimeline, { orderId, status: 'delivered', timestamp: new Date() }];
        setDeliveryTimeline(newTimeline);
        fetchAssignedOrders();
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Failed to complete delivery:', error);
    }
  };

  const acceptOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'preparing' }),
      });
      if (res.ok) {
        const newTimeline = [...deliveryTimeline, { orderId, status: 'accepted', timestamp: new Date() }];
        setDeliveryTimeline(newTimeline);
        fetchAssignedOrders();
      }
    } catch (error) {
      console.error('Failed to accept order:', error);
    }
  };

  const rejectOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedWorker: null }),
      });
      if (res.ok) {
        fetchAssignedOrders();
      }
    } catch (error) {
      console.error('Failed to reject order:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Worker Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Assigned Deliveries</h2>
          <p className="text-gray-500">Manage your assigned deliveries</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No assigned deliveries</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-gray-900">#{order.orderId}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'preparing' ? 'bg-purple-100 text-purple-700' :
                    order.status === 'out_for_delivery' ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{order.address?.name || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{order.address?.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <p className="text-sm text-gray-600">
                      {order.address?.address}, {order.address?.city} - {order.address?.pincode}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <p className="text-sm text-gray-600">Total: ₹{order.total}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.status === 'confirmed' && (
                    <>
                      <button
                        onClick={() => acceptOrder(order.orderId)}
                        className="w-full bg-green-600 text-white py-2.5 rounded-xl font-medium hover:bg-green-700"
                      >
                        Accept Order
                      </button>
                      <button
                        onClick={() => rejectOrder(order.orderId)}
                        className="w-full bg-red-50 text-red-600 py-2.5 rounded-xl font-medium hover:bg-red-100"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => startDelivery(order.orderId)}
                      className="w-full bg-green-600 text-white py-2.5 rounded-xl font-medium hover:bg-green-700"
                    >
                      Start Delivery
                    </button>
                  )}
                  {order.status === 'out_for_delivery' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          generateOtp();
                        }}
                        className="w-full bg-green-600 text-white py-2.5 rounded-xl font-medium hover:bg-green-700"
                      >
                        Generate OTP
                      </button>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200"
                      >
                        View Details
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* OTP Modal */}
      {showOtpModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 m-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Verify Delivery OTP</h3>
            <p className="text-gray-600 mb-6">Enter the OTP provided by the customer to complete delivery.</p>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 text-center text-2xl tracking-widest"
              maxLength={6}
              onChange={(e) => verifyOtp(e.target.value)}
            />
            <button
              onClick={() => setShowOtpModal(false)}
              className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && !showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Order #{selectedOrder.orderId}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-medium">{selectedOrder.address?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{selectedOrder.address?.phone || 'N/A'}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Address:</span>
                    <span className="ml-2">{selectedOrder.address?.address}, {selectedOrder.address?.city} - {selectedOrder.address?.pincode}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <span className="font-semibold text-gray-900">₹{item.quantity * item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.status === 'out_for_delivery' && (
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    generateOtp();
                  }}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700"
                >
                  Generate Delivery OTP
                </button>
              )}

              {/* Delivery Timeline */}
              {selectedOrder && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Delivery Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600">Order Assigned</span>
                    </div>
                    {selectedOrder.status === 'preparing' && (
                      <div className="flex items-center gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-600">Order Accepted</span>
                      </div>
                    )}
                    {selectedOrder.status === 'out_for_delivery' && (
                      <>
                        <div className="flex items-center gap-3 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-gray-600">Order Accepted</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Truck className="w-4 h-4 text-orange-600" />
                          <span className="text-gray-600">Out for Delivery</span>
                        </div>
                      </>
                    )}
                    {selectedOrder.status === 'delivered' && (
                      <>
                        <div className="flex items-center gap-3 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-gray-600">Order Accepted</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Truck className="w-4 h-4 text-orange-600" />
                          <span className="text-gray-600">Out for Delivery</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <ShieldCheck className="w-4 h-4 text-green-600" />
                          <span className="text-gray-600">OTP Verified</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-gray-600">Delivered</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
