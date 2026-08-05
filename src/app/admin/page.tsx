'use client';

import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Package,
  Users,
  Clock,
  MoreVertical,
  CheckCircle,
  Truck,
  PackageCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function AdminDashboard() {
  const { orders } = useStore();

  // Compute metrics from orders
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);
  
  const recentOrders = orders.slice(0, 5); // Show latest 5

  // Generate chart data based on orders (dummy dates for real-time feel if few orders)
  // Since we might not have a lot of orders, we'll create a 7-day trend
  const chartData = [
    { name: 'Mon', revenue: 1200 },
    { name: 'Tue', revenue: 1900 },
    { name: 'Wed', revenue: 1500 },
    { name: 'Thu', revenue: 2200 },
    { name: 'Fri', revenue: 1800 },
    { name: 'Sat', revenue: 3500 },
    { name: 'Sun', revenue: totalRevenue > 0 ? totalRevenue : 4200 }, // Plug actual revenue into latest if possible
  ];

  const cards = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue > 0 ? totalRevenue.toLocaleString() : '12,540'}`,
      change: '+14%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      title: 'Total Orders',
      value: totalOrders > 0 ? totalOrders : '145',
      change: '+8%',
      trend: 'up',
      icon: Package,
      color: 'text-grocery-green',
      bg: 'bg-grocery-green/10',
    },
    {
      title: 'Active Users',
      value: '2,405',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
    {
      title: 'Pending Deliveries',
      value: '24',
      change: '-2%',
      trend: 'down',
      icon: Clock,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">Track your store's performance and recent activities.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm">
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${card.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {card.change}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
            
            {/* Background decoration */}
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <card.icon className="w-32 h-32" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Revenue Analytics</h2>
              <p className="text-xs text-gray-500">Total revenue over the last 7 days</p>
            </div>
            <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-1.5 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#333' }}
                  itemStyle={{ color: '#2E7D32' }}
                  formatter={(value: number) => [`₹${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2E7D32" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Live Activity Feed */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Live Activity</h2>
          
          <div className="flex-1 space-y-6">
            {recentOrders.length > 0 ? (
              recentOrders.map((order, i) => (
                <div key={order.orderId || i} className="flex gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-grocery-green/10 flex items-center justify-center z-10 relative">
                      <Truck className="w-4 h-4 text-grocery-green" />
                    </div>
                    {i !== recentOrders.length - 1 && (
                      <div className="absolute top-10 bottom-[-24px] left-1/2 -translate-x-1/2 w-px bg-gray-100" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      New order placed <span className="text-grocery-green font-bold">₹{order.total}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Order #{order.orderId.substring(0, 8)}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Just now</p>
                  </div>
                </div>
              ))
            ) : (
              // Mock activities if no orders
              <>
                <div className="flex gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center z-10 relative">
                      <Users className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="absolute top-10 bottom-[-24px] left-1/2 -translate-x-1/2 w-px bg-gray-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">New user registered</p>
                    <p className="text-xs text-gray-500 mt-1">Rahul Sharma from Mumbai</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">2 mins ago</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-grocery-green/10 flex items-center justify-center z-10 relative">
                      <CheckCircle className="w-4 h-4 text-grocery-green" />
                    </div>
                    <div className="absolute top-10 bottom-[-24px] left-1/2 -translate-x-1/2 w-px bg-gray-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order delivered successfully</p>
                    <p className="text-xs text-gray-500 mt-1">Order #ORD-8472 to Delhi</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">15 mins ago</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center z-10 relative">
                      <PackageCheck className="w-4 h-4 text-orange-500" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Inventory alert</p>
                    <p className="text-xs text-gray-500 mt-1">Fresh Avocados are running low (Only 5 left)</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">1 hour ago</p>
                  </div>
                </div>
              </>
            )}
          </div>
          <button className="w-full py-2.5 mt-4 text-sm font-semibold text-grocery-green bg-grocery-green/5 hover:bg-grocery-green/10 rounded-xl transition-colors">
            View All Activity
          </button>
        </motion.div>
      </div>

      {/* Recent Orders Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <button className="text-sm font-medium text-grocery-green hover:text-grocery-dark transition-colors">
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length > 0 ? (
                recentOrders.map((order, i) => (
                  <tr key={order.orderId || i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.orderId.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-grocery-yellow/20 text-grocery-darker flex items-center justify-center font-bold text-xs mr-3">
                          G
                        </div>
                        <span className="text-sm text-gray-700">Guest User</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ₹{order.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                // Mock orders
                <>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-9021</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Priya Patel</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Today, 10:24 AM</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₹1,240</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Processing</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-9020</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Amit Kumar</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Today, 09:12 AM</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₹850</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Shipped</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-9019</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Sneha Gupta</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Yesterday, 06:45 PM</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₹2,100</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Delivered</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
