"use client";

import { useState, useEffect } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch("/api/admin/orders");
    if (res.ok) {
      setOrders(await res.json());
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
       fetchOrders();
    } else {
       alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-8 font-bold uppercase tracking-widest text-slate-400">Loading Orders...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black text-slate-800 uppercase tracking-wide mb-8 border-b-4 border-accent-orange inline-block pb-2">
        Order Management
      </h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto border border-slate-200 hide-scrollbar">
        <table className="w-full text-left min-w-[800px] border-collapse">
           <thead>
              <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider font-bold">
                 <th className="p-4">Order ID</th>
                 <th className="p-4">Date</th>
                 <th className="p-4">Customer</th>
                 <th className="p-4">Products</th>
                 <th className="p-4">Total</th>
                 <th className="p-4">Status</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
              {orders.map(order => (
                 <tr key={order.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-accent-orange uppercase tracking-wider text-sm">
                       INV-{order.id.toString().padStart(6,'0')}
                    </td>
                    <td className="p-4 text-sm text-slate-500 font-medium">
                       {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-4">
                       <div className="font-bold text-slate-800 text-sm">{order.user?.fullName}</div>
                       <div className="text-xs text-slate-500">{order.user?.mobile}</div>
                    </td>
                    <td className="p-4 text-xs text-slate-600 space-y-1">
                       {order.items.map((item: any) => (
                          <div key={item.id}>• {item.quantity}x {item.productName}</div>
                       ))}
                    </td>
                    <td className="p-4 font-black text-slate-800">
                       ₹{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="p-4">
                       <select 
                         value={order.status} 
                         onChange={(e) => handleStatusChange(order.id, e.target.value)}
                         className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded cursor-pointer border shadow-sm outline-none ${
                           order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' : 
                           order.status === 'SHIPPED' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                           order.status === 'PROCESSING' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                           'bg-yellow-50 text-yellow-700 border-yellow-200'
                         }`}
                       >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                       </select>
                    </td>
                 </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}
