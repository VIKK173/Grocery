'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, ShoppingBag, Users, Package, 
  CheckCircle, Clock, Truck, XCircle, Phone, Mail
} from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import StatCard from '@/components/admin/StatCard';

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const stats = {
    totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.total || 0), 0),
    totalOrders: orders.length,
    totalUsers: new Set(orders.map(o => o.userId)).size,
    totalProducts: 324, // Will come from database
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
        return <Package className="w-4 h-4" />;
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
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
      
      <div className="lg:ml-64 transition-all duration-300">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {getGreeting()}, Admin 👋
                </h1>
                <p className="text-gray-500">
                  Here's what's happening with your grocery store today.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={DollarSign}
              title="Total Revenue"
              value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
              change="12.5%"
              changeType="positive"
              iconColor="bg-green-50 text-green-600"
            />
            <StatCard
              icon={ShoppingBag}
              title="Total Orders"
              value={stats.totalOrders}
              change="8.2%"
              changeType="positive"
              iconColor="bg-blue-50 text-blue-600"
            />
            <StatCard
              icon={Users}
              title="Total Customers"
              value={stats.totalUsers}
              change="14.4%"
              changeType="positive"
              iconColor="bg-purple-50 text-purple-600"
            />
            <StatCard
              icon={Package}
              title="Total Products"
              value={stats.totalProducts}
              change="5.7%"
              changeType="positive"
              iconColor="bg-orange-50 text-orange-600"
            />
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
                  <p className="text-sm text-gray-500">Daily revenue and order trends</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded-lg font-medium">Daily</button>
                  <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-lg">Weekly</button>
                  <button className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-lg">Monthly</button>
                </div>
              </div>
              <div className="h-64">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Grid lines */}
                  <line x1="40" y1="180" x2="380" y2="180" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="40" y1="140" x2="380" y2="140" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="40" y1="100" x2="380" y2="100" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="40" y1="60" x2="380" y2="60" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="40" y1="20" x2="380" y2="20" stroke="#e5e7eb" strokeWidth="1" />
                  
                  {/* Area fill */}
                  <path 
                    d="M40,180 L80,140 L120,100 L160,120 L200,80 L240,60 L280,90 L320,50 L360,70 L380,40 L380,180 L40,180 Z" 
                    fill="rgba(34, 197, 94, 0.1)" 
                  />
                  
                  {/* Line */}
                  <path 
                    d="M40,180 L80,140 L120,100 L160,120 L200,80 L240,60 L280,90 L320,50 L360,70 L380,40" 
                    fill="none" 
                    stroke="#22c55e" 
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Data points */}
                  <circle cx="40" cy="180" r="4" fill="#22c55e" />
                  <circle cx="80" cy="140" r="4" fill="#22c55e" />
                  <circle cx="120" cy="100" r="4" fill="#22c55e" />
                  <circle cx="160" cy="120" r="4" fill="#22c55e" />
                  <circle cx="200" cy="80" r="4" fill="#22c55e" />
                  <circle cx="240" cy="60" r="4" fill="#22c55e" />
                  <circle cx="280" cy="90" r="4" fill="#22c55e" />
                  <circle cx="320" cy="50" r="4" fill="#22c55e" />
                  <circle cx="360" cy="70" r="4" fill="#22c55e" />
                  <circle cx="380" cy="40" r="4" fill="#22c55e" />
                  
                  {/* Labels */}
                  <text x="40" y="195" fontSize="10" fill="#6b7280" textAnchor="middle">Mon</text>
                  <text x="80" y="195" fontSize="10" fill="#6b7280" textAnchor="middle">Tue</text>
                  <text x="120" y="195" fontSize="10" fill="#6b7280" textAnchor="middle">Wed</text>
                  <text x="160" y="195" fontSize="10" fill="#6b7280" textAnchor="middle">Thu</text>
                  <text x="200" y="195" fontSize="10" fill="#6b7280" textAnchor="middle">Fri</text>
                  <text x="240" y="195" fontSize="10" fill="#6b7280" textAnchor="middle">Sat</text>
                  <text x="280" y="195" fontSize="10" fill="#6b7280" textAnchor="middle">Sun</text>
                  <text x="320" y="195" fontSize="10" fill="#6b7280" textAnchor="middle">Mon</text>
                  <text x="360" y="195" fontSize="10" fill="#6b7280" textAnchor="middle">Tue</text>
                  <text x="380" y="195" fontSize="10" fill="#6b7280" textAnchor="middle">Wed</text>
                </svg>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-600">Delivered</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {orders.filter(o => o.status === 'delivered').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-600">Processing</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {orders.filter(o => o.status === 'confirmed' || o.status === 'preparing').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-sm text-gray-600">Pending</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {orders.filter(o => o.status === 'confirmed').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-gray-600">Cancelled</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {orders.filter(o => o.status === 'cancelled').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                  <p className="text-sm text-gray-500">Latest customer orders</p>
                </div>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  View All Orders
                </button>
              </div>
            </div>
            
            {orders.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="font-medium">No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.slice(0, 10).map((order) => (
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
                          <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
