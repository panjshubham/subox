"use client";

import { useState, useEffect } from "react";
import { UserCircle2, Building, MapPin, Receipt, LogOut, Save, Package, ChevronRight, Download, Clock } from "lucide-react";
import Link from "next/link";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch("/api/user/profile");
    if (res.ok) {
      const data = await res.json();
      setProfile(data);
    } else {
      window.location.href = "/login";
    }
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    if (res.ok) {
      setMessage("Profile updated successfully.");
    } else {
      setMessage("Failed to update profile.");
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-black uppercase tracking-widest text-slate-400 animate-pulse">Synchronizing Profile...</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Profile Header */}
      <div className="bg-slate-900 shadow-2xl mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
           <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-accent-orange rounded-sm flex items-center justify-center text-white font-black text-3xl shadow-xl">
                    {profile.fullName.charAt(0)}
                 </div>
                 <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-1">{profile.fullName}</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Active B2B Account
                    </p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <button onClick={handleLogout} className="bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 px-6 py-2 rounded font-black uppercase tracking-widest text-[10px] border border-slate-700 transition-all flex items-center gap-2">
                    <LogOut className="w-3 h-3" /> Terminate Session
                 </button>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           
           {/* Sidebar: Business Intel */}
           <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-8 rounded-xl shadow-xl border border-slate-200">
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2 border-b-4 border-accent-orange pb-2 w-fit">
                    Corporate Intel
                 </h3>
                 
                 {message && <div className="mb-6 bg-green-50 text-green-700 p-4 rounded text-[10px] font-black uppercase tracking-widest border border-green-200">{message}</div>}

                 <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Enterprise Name</label>
                       <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input 
                            type="text" value={profile.companyName || ""} 
                            onChange={(e) => setProfile({...profile, companyName: e.target.value})} 
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-orange transition-all"
                            placeholder="NOT SET"
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">GSTIN (Input Credit)</label>
                       <div className="relative">
                          <Receipt className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <input 
                            type="text" value={profile.gstNumber || ""} 
                            onChange={(e) => setProfile({...profile, gstNumber: e.target.value})} 
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-orange transition-all"
                            placeholder="UNREGISTERED"
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Primary Site Address</label>
                       <div className="relative">
                          <MapPin className="absolute left-3 top-4 w-4 h-4 text-slate-300" />
                          <textarea 
                            value={profile.address || ""} 
                            onChange={(e) => setProfile({...profile, address: e.target.value})} 
                            rows={4}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded font-bold text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-orange transition-all resize-none"
                            placeholder="Update dispatch location..."
                          />
                       </div>
                    </div>

                    <button type="submit" disabled={saving} className="w-full py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded shadow-xl hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-3">
                       {saving ? "Saving Data..." : <><Save className="w-4 h-4 text-accent-orange" /> Commit Updates</>}
                    </button>
                 </form>
              </div>

              {/* Verified Badge */}
              <div className="bg-slate-900 p-6 rounded-xl border-l-8 border-accent-orange">
                 <h4 className="text-white font-black uppercase tracking-widest text-xs mb-2">Secure Factory Access</h4>
                 <p className="text-slate-500 text-[10px] font-bold leading-relaxed">Your data is AES-256 encrypted. All purchase orders are logged with immutable sequence IDs for industrial compliance.</p>
              </div>
           </div>

           {/* Main: Transaction History */}
           <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between border-b-4 border-slate-200 pb-2">
                 <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest ">Transaction Ledger</h2>
                 <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">{profile.orders?.length || 0} Records</span>
              </div>

              <div className="space-y-6">
                 {!profile.orders || profile.orders.length === 0 ? (
                    <div className="bg-white p-16 rounded-xl text-center border-2 border-dashed border-slate-200">
                       <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                       <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">No Procurement History</h3>
                       <p className="text-sm text-slate-400 font-bold mt-2">Initialize your first factory order from our catalog.</p>
                       <Link href="/product" className="mt-8 inline-block bg-slate-900 text-white px-8 py-3 rounded font-black uppercase tracking-widest text-[10px] shadow-lg">Start Shopping</Link>
                    </div>
                 ) : (
                    profile.orders.map((o: any) => (
                       <div key={o.id} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden group hover:border-accent-orange transition-all duration-300">
                          {/* Order Card Header */}
                          <div className="bg-slate-50 px-6 py-4 flex flex-col md:flex-row justify-between items-center border-b border-slate-100 gap-4">
                             <div className="flex items-center gap-4">
                                <div className="bg-slate-900 text-white p-2.5 rounded">
                                   <Package className="w-5 h-5 text-accent-orange" />
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Order Identifier</p>
                                   <p className="font-black text-slate-900 uppercase tracking-wider text-sm">#INV-{o.id.toString().padStart(6,'0')}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-8">
                                <div className="text-right hidden sm:block border-r border-slate-200 pr-8">
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1 flex items-center justify-end gap-1"><Clock className="w-3 h-3" /> Timestamp</p>
                                   <p className="font-bold text-slate-700 text-sm">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                                </div>
                                <div className="text-right">
                                   <OrderStatusBadge status={o.status} />
                                </div>
                             </div>
                          </div>

                          {/* Order Items Breakdown */}
                          <div className="p-6">
                             <div className="space-y-4">
                                {o.items.map((item: any) => (
                                   <div key={item.id} className="flex justify-between items-center group/item pb-2 border-b border-slate-50 last:border-0 last:pb-0">
                                      <div className="flex items-center gap-4">
                                         <div className="w-2 h-2 bg-accent-orange/30 group-hover/item:bg-accent-orange rounded-full transition-colors"></div>
                                         <div>
                                            <p className="text-sm font-black text-slate-800 uppercase tracking-wide group-hover/item:text-accent-orange transition-colors">{item.productName}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty: {item.quantity} Units | Indiv. Price: ₹{(item.price / item.quantity).toFixed(2)}</p>
                                         </div>
                                      </div>
                                      <p className="font-black text-slate-900 text-sm">₹{item.price.toFixed(2)}</p>
                                   </div>
                                ))}
                             </div>

                             {/* Card Footer */}
                             <div className="mt-8 pt-6 border-t font-black flex justify-between items-end">
                                <div>
                                   <p className="text-[10px] text-slate-400 uppercase tracking-[0.25em] mb-1">Total Payable</p>
                                   <p className="text-2xl text-slate-900 tracking-tighter">₹{o.totalAmount.toFixed(2)}</p>
                                </div>
                                <div className="flex gap-3">
                                   <Link href={`/invoice/${o.id}`} className="group/btn bg-white border-2 border-slate-900 text-slate-900 px-6 py-2.5 rounded shadow-lg hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2">
                                      <Download className="w-4 h-4 text-accent-orange" />
                                      <span className="font-black text-[10px] uppercase tracking-widest">View Invoice</span>
                                   </Link>
                                </div>
                             </div>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
