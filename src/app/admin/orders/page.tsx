'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import { Search, CheckCircle, Clock, Truck, XCircle, Phone, Mail, Eye, UserPlus } from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState('');

  const workers = ['worker1@delivery.com', 'worker2@delivery.com', 'worker3@delivery.com'];

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth !== 'true') {
      router.push('/admin/login');
    } else {
      fetchOrders();
    }
  }, [router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders?admin=true');
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

  const assignWorker = async (orderId: string, workerEmail: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedWorker: workerEmail }),
      });
      if (res.ok) {
        fetchOrders();
        setShowAssignModal(false);
        setSelectedWorker('');
      }
    } catch (error) {
      console.error('Failed to assign worker:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'preparing':
        return 'bg-blue-100 text-blue-700';
      case 'out_for_delivery':
        return 'bg-orange-100 text-orange-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'preparing':
        return <Clock className="w-4 h-4" />;
      case 'out_for_delivery':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Orders</h1>
            <p className="text-gray-500">Manage customer orders and track deliveries.</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
              </div>
              <select className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50">
                <option>All Status</option>
                <option>Confirmed</option>
                <option>Preparing</option>
                <option>Out for Delivery</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
              <select className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50">
                <option>All Payment</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">#{order.orderId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.address?.name || 'N/A'}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                            <Phone className="w-3 h-3" />
                            {order.address?.phone || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{order.items?.length || 0} items</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">₹{order.total}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-green-600 font-medium">Paid</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {!order.assignedWorker && order.status === 'confirmed' && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setShowAssignModal(true);
                              }}
                              className="p-2 hover:bg-orange-50 rounded-lg text-orange-600"
                            >
                              <UserPlus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Details Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Order #{selectedOrder.orderId}</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  {/* Customer Info */}
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
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{selectedOrder.userEmail || 'N/A'}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Address:</span>
                        <span className="ml-2">{selectedOrder.address?.address}, {selectedOrder.address?.city} - {selectedOrder.address?.pincode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
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

                  {/* Order Summary */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Order Summary</h3>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span>₹{selectedOrder.subtotal || selectedOrder.total}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Delivery Fee</span>
                        <span>₹{selectedOrder.deliveryFee || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Discount</span>
                        <span className="text-green-600">-₹{selectedOrder.discount || 0}</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span>₹{selectedOrder.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  {selectedOrder.assignedWorker && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Delivery Information</h3>
                      <div className="bg-orange-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <UserPlus className="w-4 h-4 text-orange-600" />
                          <span className="text-gray-500">Assigned Worker:</span>
                          <span className="font-medium">{selectedOrder.assignedWorker}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Assign Worker Modal */}
          {showAssignModal && selectedOrder && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 m-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Assign Worker</h2>
                <p className="text-gray-600 mb-4">Select a delivery worker for order #{selectedOrder.orderId}</p>
                <div className="space-y-2 mb-6">
                  {workers.map((worker) => (
                    <button
                      key={worker}
                      onClick={() => setSelectedWorker(worker)}
                      className={`w-full p-3 rounded-xl border-2 text-left ${
                        selectedWorker === worker
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <UserPlus className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="font-medium">{worker}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setSelectedWorker('');
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => assignWorker(selectedOrder.orderId, selectedWorker)}
                    disabled={!selectedWorker}
                    className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
