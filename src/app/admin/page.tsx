"use client";

import { useState, useEffect } from "react";
import {
  Trash2, Edit2, Plus, Save, X, Lock, ExternalLink, Phone,
  ShoppingBag, BarChart3, Settings2, Package2, Loader2, RefreshCw, LogOut
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────

type Product = {
  id: number; name: string; category: string; moduleSize: string; material: string;
  primaryUse: string; dimensions: string; mrp: number; price: number; thickness: string;
  coating: string; features: string; hsnCode: string; description: string;
  inStock: boolean; showInBanner: boolean; bulkDiscount: number;
  imageUrl: string | null; imageGallery: string | null;
};

type Order = {
  id: number; totalAmount: number; status: string; paymentMode: string;
  createdAt: string;
  user: { fullName: string; mobile: string; companyName?: string; email?: string; address?: string };
  items: { id: number; productName: string; quantity: number; price: number }[];
};

type StoreSettings = {
  businessName: string; brandName: string; gstin: string; address: string;
  phoneOne: string; phoneTwo: string; email: string; bankName: string;
  bankBranch: string; accountNo: string; ifscCode: string;
};

type Analytics = {
  grossRevenue: number; totalOrders: number; stockValue: number;
  recentOrders: { id: number; date: string; customer: string; total: number; status: string }[];
};

type Tab = "CATALOG" | "ORDERS" | "ANALYTICS" | "SETTINGS" | "LOGISTICS";

const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-orange-50 text-orange-700 border-orange-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
};

// ─── Main Component ───────────────────────────────

export default function AdminPage() {
  // Auth state
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Data
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("CATALOG");
  const [dataLoading, setDataLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Product editing
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [uploadingImage, setUploadingImage] = useState(false);

  const defaultNewForm: Partial<Product> = {
    category: "Modular Boxes", material: "G.I.", moduleSize: "1M", inStock: true,
    showInBanner: false, bulkDiscount: 10, hsnCode: "8538",
    thickness: "1.0mm (Standard)", coating: "Pre-Galvanized Zinc",
    features: "Weldless folded design, Earth screw provision",
    description: "Premium quality modular electrical enclosure manufactured from industrial-grade materials.",
  };
  const [newForm, setNewForm] = useState<Partial<Product>>(defaultNewForm);

  // Logistics
  const [pinsText, setPinsText] = useState("");
  const [pinsCity, setPinsCity] = useState("Kolkata");
  const [pinsState, setPinsState] = useState("West Bengal");
  const [upsertingPins, setUpsertingPins] = useState(false);

  // ── Check session on mount ──────────────────────

  useEffect(() => {
    fetch("/api/admin/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.isAdmin) {
          setAuthed(true);
        }
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, []);

  // ── Load data once authenticated ────────────────

  useEffect(() => {
    if (!authed) return;
    fetchProducts();
    fetchSettings();
  }, [authed]);

  useEffect(() => {
    if (!authed || activeTab !== "ORDERS") return;
    fetchOrders();
  }, [authed, activeTab]);

  useEffect(() => {
    if (!authed || activeTab !== "ANALYTICS" || analytics) return;
    fetch("/api/admin/analytics").then(r => r.json()).then(setAnalytics);
  }, [authed, activeTab, analytics]);

  // ── Data fetchers ───────────────────────────────

  const fetchProducts = async () => {
    setDataLoading(true);
    const res = await fetch("/api/admin/products");
    if (res.ok) setProducts(await res.json());
    setDataLoading(false);
  };

  const fetchOrders = async () => {
    setDataLoading(true);
    const res = await fetch("/api/admin/orders");
    if (res.ok) setOrders(await res.json());
    setDataLoading(false);
  };

  const fetchSettings = async () => {
    const res = await fetch("/api/admin/settings");
    if (res.ok) setSettings(await res.json());
  };

  // ── Auth ────────────────────────────────────────

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, password }),
    });
    if (res.ok) {
      // Verify it's the admin mobile
      const profile = await fetch("/api/admin/me");
      const data = profile.ok ? await profile.json() : null;
      if (data?.isAdmin) {
        setAuthed(true);
      } else {
        setLoginError("Access denied. Admin credentials required.");
        // Log them out
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
      }
    } else {
      const err = await res.json();
      setLoginError(err.error || "Invalid credentials.");
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setAuthed(false);
    setMobile("");
    setPassword("");
  };

  // ── Product CRUD ─────────────────────────────────

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name || !newForm.price || !newForm.mrp) return;
    const res = await fetch("/api/admin/products", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newForm),
    });
    if (res.ok) { setNewForm(defaultNewForm); fetchProducts(); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const handleUpdate = async (id: number) => {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) { setEditingId(null); fetchProducts(); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isNew = false, productId?: number) => {
    if (!e.target.files?.[0]) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    
    if (res.ok) {
      const data = await res.json();
      const url = data.url;

      if (isNew) {
        setNewForm(f => ({ ...f, imageUrl: url }));
      } else {
        setEditForm(f => ({ ...f, imageUrl: url }));
        // If we have a product ID, immediately save it to DB
        if (productId) {
          await fetch(`/api/admin/products/${productId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl: url })
          });
          fetchProducts();
        }
      }
    }
    setUploadingImage(false);
  };

  // ── Order Status ──────────────────────────────────

  const handleOrderStatus = async (orderId: number, status: string) => {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      setAnalytics(null); // invalidate analytics cache
    }
  };

  // ── Pincode upsert ────────────────────────────────

  const handleUpsertPins = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpsertingPins(true);
    const res = await fetch("/api/admin/pincodes", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pins: pinsText, city: pinsCity, state: pinsState }),
    });
    setUpsertingPins(false);
    if (res.ok) {
      const data = await res.json();
      alert(`✅ ${data.count} pincodes mapped to ${pinsCity}, ${pinsState}`);
      setPinsText("");
    } else {
      alert("❌ Failed to map pincodes.");
    }
  };

  // ── Settings ──────────────────────────────────────

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSavingSettings(true);
    const res = await fetch("/api/admin/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSavingSettings(false);
    if (res.ok) alert("✅ Settings saved.");
  };

  // ─────────────────────────────────────────────────
  // RENDER: Auth check loading
  // ─────────────────────────────────────────────────

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-orange" />
      </div>
    );
  }

  // ─────────────────────────────────────────────────
  // RENDER: Login Form
  // ─────────────────────────────────────────────────

  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4">
        <div className="w-full max-w-sm">
          <form
            onSubmit={handleLogin}
            className="bg-white rounded-xl shadow-2xl border-t-8 border-accent-orange p-8"
          >
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center shadow-xl">
                <Lock className="w-7 h-7 text-accent-orange" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-center text-slate-800 uppercase tracking-widest mb-1">
              Admin Access
            </h1>
            <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">
              ShuBox Command Center
            </p>

            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-bold px-4 py-3 rounded mb-4">
                {loginError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    placeholder="9830234950"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange font-medium text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange font-medium text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="mt-6 w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-black uppercase tracking-widest py-3 rounded transition-colors flex items-center justify-center gap-2"
            >
              {loginLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : "Access Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────
  // RENDER: Dashboard
  // ─────────────────────────────────────────────────

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "CATALOG", label: "Products", icon: <Package2 className="w-4 h-4" /> },
    { id: "ORDERS", label: "Orders", icon: <ShoppingBag className="w-4 h-4" /> },
    { id: "ANALYTICS", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "SETTINGS", label: "Settings", icon: <Settings2 className="w-4 h-4" /> },
    { id: "LOGISTICS", label: "Logistics", icon: <Package2 className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-wide">Command Center</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">ShuBox Admin Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-accent-orange border border-slate-200 px-3 py-2 rounded transition-colors">
            Store <ExternalLink className="w-3 h-3" />
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 px-3 py-2 rounded transition-colors"
          >
            <LogOut className="w-3 h-3" /> Logout
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex overflow-x-auto gap-1 border-b-2 border-slate-200 mb-8 pb-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-bold uppercase tracking-widest text-xs whitespace-nowrap border-b-2 -mb-0.5 transition-colors ${
              activeTab === tab.id
                ? "border-accent-orange text-accent-orange"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ───── CATALOG TAB ───── */}
      {activeTab === "CATALOG" && (
        <>
          {/* Bulk Manager */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8 max-w-4xl">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-accent-orange" /> Bulk Manage Category
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <input id="bulkCat" type="text" placeholder="Category (e.g. Modular Boxes)" className="border p-2 rounded flex-1 font-bold text-sm" />
              <select id="bulkType" className="border p-2 rounded bg-slate-50 text-sm font-bold">
                <option value="FLAT_DISCOUNT">Set Flat Discount %</option>
                <option value="ADD_MRP">Add Amount to MRP (₹)</option>
              </select>
              <input id="bulkVal" type="number" placeholder="Value" className="border p-2 rounded w-28 font-bold text-sm" />
              <button
                onClick={async () => {
                  const cat = (document.getElementById("bulkCat") as HTMLInputElement).value;
                  const typ = (document.getElementById("bulkType") as HTMLSelectElement).value;
                  const val = (document.getElementById("bulkVal") as HTMLInputElement).value;
                  if (!cat || !val) return alert("Missing category or value");
                  if (!confirm(`Apply ${val} via ${typ} to all "${cat}" products?`)) return;
                  const res = await fetch("/api/admin/bulk", {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ category: cat, type: typ, value: val }),
                  });
                  if (res.ok) { alert("✅ Bulk update done."); fetchProducts(); }
                  else alert("❌ Bulk update failed.");
                }}
                className="bg-slate-900 text-white font-bold px-6 py-2 rounded uppercase text-xs tracking-widest hover:bg-slate-800"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Add Product Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg border-t-8 border-slate-900 mb-12">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-3">
              <Plus className="w-6 h-6 text-accent-orange" /> Add New Product
            </h2>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2 space-y-4">
                <input type="text" placeholder="Product Name" value={newForm.name || ""} onChange={e => setNewForm({ ...newForm, name: e.target.value })} className="w-full border-2 p-3 rounded font-bold focus:border-accent-orange outline-none" required />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Category" value={newForm.category || ""} onChange={e => setNewForm({ ...newForm, category: e.target.value })} className="border-2 p-2 rounded text-sm" />
                  <input type="text" placeholder="Module Size" value={newForm.moduleSize || ""} onChange={e => setNewForm({ ...newForm, moduleSize: e.target.value })} className="border-2 p-2 rounded text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select value={newForm.material || "G.I."} onChange={e => setNewForm({ ...newForm, material: e.target.value })} className="border-2 p-2 rounded text-sm font-bold">
                    <option value="G.I.">G.I.</option>
                    <option value="M.S.">M.S.</option>
                  </select>
                  <div className="flex items-center gap-2 border-2 rounded p-2">
                    <input type="checkbox" id="newBanner" checked={newForm.showInBanner || false} onChange={e => setNewForm({ ...newForm, showInBanner: e.target.checked })} className="w-4 h-4 accent-orange-500" />
                    <label htmlFor="newBanner" className="text-xs font-bold text-slate-700 cursor-pointer">Show in Banner</label>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <input type="number" placeholder="MRP (₹)" value={newForm.mrp || ""} onChange={e => setNewForm({ ...newForm, mrp: Number(e.target.value) })} className="w-full border-2 p-3 rounded font-bold" required />
                <input type="number" placeholder="Sale Price (₹)" value={newForm.price || ""} onChange={e => setNewForm({ ...newForm, price: Number(e.target.value) })} className="w-full border-2 p-3 rounded font-black text-accent-orange text-xl" required />
                <input type="number" placeholder="Bulk Discount %" value={newForm.bulkDiscount || ""} onChange={e => setNewForm({ ...newForm, bulkDiscount: Number(e.target.value) })} className="w-full border-2 p-2 rounded text-sm" />
              </div>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 p-4 rounded-xl text-center relative hover:bg-slate-50 transition-colors group min-h-[120px] flex flex-col items-center justify-center">
                  {uploadingImage ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-4 border-accent-orange border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] font-black uppercase text-slate-400">Uploading...</span>
                    </div>
                  ) : newForm.imageUrl ? (
                    <div className="relative w-full">
                      <img src={newForm.imageUrl} alt="Preview" className="max-h-20 object-contain rounded mx-auto" />
                      <button type="button" onClick={() => setNewForm({ ...newForm, imageUrl: "" })} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><X className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <>
                      <Plus className="w-8 h-8 text-slate-300 mb-2 group-hover:text-accent-orange transition-colors" />
                      <span className="text-[10px] font-black uppercase text-slate-400">Upload Image</span>
                      <input type="file" accept="image/*" onChange={e => handleImageUpload(e, true)} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </>
                  )}
                </div>
              </div>
              <div className="md:col-span-4">
                <textarea placeholder="Product Description" value={newForm.description || ""} onChange={e => setNewForm({ ...newForm, description: e.target.value })} className="w-full border-2 p-3 rounded text-sm h-20 mb-4" />
                <button type="submit" className="bg-slate-900 text-white px-10 py-4 rounded font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl">
                  Add to Catalog
                </button>
              </div>
            </form>
          </div>

          {/* Product Table */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">All Products ({products.length})</h2>
            <button onClick={fetchProducts} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>
          {dataLoading ? (
            <div className="text-center py-12 text-slate-400 font-bold animate-pulse uppercase tracking-widest">Loading catalog...</div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto border border-slate-200">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 uppercase text-xs tracking-wider border-b border-slate-200">
                    <th className="p-4 font-bold">Product</th>
                    <th className="p-4 font-bold">Specs</th>
                    <th className="p-4 font-bold">Pricing</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 text-sm">
                      {editingId === p.id ? (
                        <>
                          <td className="p-4 space-y-2 align-top">
                            <input type="text" value={editForm.name || ""} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full border p-1 rounded font-bold" placeholder="Name" />
                            <input type="text" value={editForm.category || ""} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="w-full border p-1 rounded text-xs" placeholder="Category" />
                            <div className="flex gap-2">
                              <input type="text" value={editForm.moduleSize || ""} onChange={e => setEditForm({ ...editForm, moduleSize: e.target.value })} className="w-16 border p-1 rounded text-xs" />
                              <select value={editForm.material || "G.I."} onChange={e => setEditForm({ ...editForm, material: e.target.value })} className="border p-1 rounded text-xs">
                                <option value="G.I.">G.I.</option>
                                <option value="M.S.">M.S.</option>
                              </select>
                            </div>
                            <div className="border border-dashed border-slate-300 p-2 rounded relative min-h-[50px] flex items-center justify-center">
                              {uploadingImage ? <span className="text-[10px] animate-pulse text-slate-400">Uploading...</span>
                                : editForm.imageUrl ? <img src={editForm.imageUrl} alt="Edit" className="h-10 object-contain" />
                                : <span className="text-[10px] text-slate-400">Upload image</span>}
                              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, false, p.id)} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                          </td>
                          <td className="p-4 space-y-2 align-top">
                            <input type="text" value={editForm.features || ""} onChange={e => setEditForm({ ...editForm, features: e.target.value })} className="w-full border p-1 rounded text-xs" placeholder="Features" />
                            <textarea value={editForm.description || ""} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full border p-1 rounded text-xs h-14" placeholder="Description" />
                          </td>
                          <td className="p-4 space-y-2 align-top">
                            <div className="flex justify-between items-center gap-2"><span className="text-xs text-slate-500">MRP:</span><input type="number" value={editForm.mrp || 0} onChange={e => setEditForm({ ...editForm, mrp: Number(e.target.value) })} className="w-24 border p-1 rounded" /></div>
                            <div className="flex justify-between items-center gap-2"><span className="text-xs text-slate-500">Price:</span><input type="number" value={editForm.price || 0} onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) })} className="w-24 border p-1 rounded" /></div>
                            <div className="flex justify-between items-center gap-2"><span className="text-xs text-slate-500">Disc%:</span><input type="number" value={editForm.bulkDiscount || 0} onChange={e => setEditForm({ ...editForm, bulkDiscount: Number(e.target.value) })} className="w-24 border p-1 rounded text-green-700 font-bold" /></div>
                          </td>
                          <td className="p-4 align-top space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer bg-slate-100 p-2 rounded border">
                              <input type="checkbox" checked={editForm.inStock ?? true} onChange={e => setEditForm({ ...editForm, inStock: e.target.checked })} className="w-4 h-4" />
                              <span className="font-bold text-slate-700 text-xs">In Stock</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer bg-orange-50 p-2 rounded border border-orange-200">
                              <input type="checkbox" checked={editForm.showInBanner ?? false} onChange={e => setEditForm({ ...editForm, showInBanner: e.target.checked })} className="w-4 h-4" />
                              <span className="font-bold text-orange-800 text-[10px] uppercase tracking-widest">Banner</span>
                            </label>
                          </td>
                          <td className="p-4 flex justify-center gap-2 align-top">
                            <button onClick={() => handleUpdate(p.id)} disabled={uploadingImage} className="flex items-center gap-1 text-white bg-green-600 px-3 py-2 rounded hover:bg-green-700 font-bold text-xs"><Save className="w-3 h-3" /> Save</button>
                            <button onClick={() => setEditingId(null)} className="flex items-center gap-1 text-slate-600 bg-slate-200 px-3 py-2 rounded hover:bg-slate-300 font-bold text-xs"><X className="w-3 h-3" /> Cancel</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-4 align-top">
                            <div className="flex items-start gap-3">
                              {p.imageUrl
                                ? <img src={p.imageUrl} alt="prod" className="w-10 h-10 object-cover rounded shadow border" />
                                : <div className="w-10 h-10 bg-slate-100 rounded border flex items-center justify-center"><Package2 className="w-5 h-5 text-slate-300" /></div>
                              }
                              <div>
                                <div className="font-black text-slate-800">{p.name}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.category}</div>
                                <div className="text-[10px] text-slate-500 font-bold">{p.material} • {p.moduleSize}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-top max-w-xs">
                            <div className="text-xs text-slate-600 truncate">{p.features}</div>
                          </td>
                          <td className="p-4 align-top">
                            <div className="text-xs text-slate-400 line-through">₹{p.mrp.toFixed(2)}</div>
                            <div className="font-bold text-accent-orange text-lg">₹{p.price.toFixed(2)}</div>
                            <div className="text-[10px] font-bold text-green-700">Bulk: {p.bulkDiscount}% off</div>
                          </td>
                          <td className="p-4 align-top space-y-1">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider block w-fit ${p.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                              {p.inStock ? "In Stock" : "Out of Stock"}
                            </span>
                            {p.showInBanner && <span className="bg-accent-orange text-white font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-widest block w-fit">🌟 Banner</span>}
                          </td>
                          <td className="p-4 align-top flex justify-center gap-2">
                            <button onClick={() => { setEditingId(p.id); setEditForm(p); }} className="text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 p-2 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                  {products.length === 0 && !dataLoading && (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-400 font-bold uppercase tracking-widest">No products in catalog. Add one above.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ───── ORDERS TAB ───── */}
      {activeTab === "ORDERS" && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">All Orders ({orders.length})</h2>
            <button onClick={fetchOrders} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>
          {dataLoading ? (
            <div className="text-center py-12 text-slate-400 font-bold animate-pulse uppercase tracking-widest">Loading orders...</div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto border border-slate-200">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider font-bold border-b">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-accent-orange text-sm">
                        #INV-{order.id.toString().padStart(6, "0")}
                      </td>
                      <td className="p-4 text-sm text-slate-500 font-medium">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800 text-sm">{order.user?.fullName}</div>
                        <div className="text-xs text-slate-400">{order.user?.mobile}</div>
                        {order.user?.companyName && <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{order.user.companyName}</div>}
                      </td>
                      <td className="p-4 text-xs text-slate-600 space-y-0.5">
                        {order.items.map(item => (
                          <div key={item.id}>• {item.quantity}× {item.productName} @ ₹{item.price}</div>
                        ))}
                      </td>
                      <td className="p-4 font-black text-slate-800 text-base">₹{order.totalAmount.toFixed(2)}</td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={e => handleOrderStatus(order.id, e.target.value)}
                          className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded cursor-pointer border outline-none shadow-sm ${STATUS_COLOR[order.status] || "bg-slate-50 text-slate-700 border-slate-200"}`}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-slate-400 font-bold uppercase tracking-widest">No orders yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ───── ANALYTICS TAB ───── */}
      {activeTab === "ANALYTICS" && (
        <div className="max-w-5xl">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest mb-6 border-b-4 border-slate-900 inline-block pb-2">Business Analytics</h2>
          {!analytics ? (
            <div className="flex items-center gap-3 text-slate-400 font-bold animate-pulse"><Loader2 className="w-5 h-5 animate-spin" /> Loading revenue data...</div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-6 rounded-lg shadow-xl text-white border-b-4 border-accent-orange">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Total Revenue</p>
                  <p className="text-4xl font-black text-accent-orange">₹{analytics.grossRevenue.toLocaleString("en-IN")}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg">
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">Total Orders</p>
                  <p className="text-4xl font-black text-slate-800">{analytics.totalOrders}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg">
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">Est. Stock Value</p>
                  <p className="text-4xl font-black text-slate-800">₹{analytics.stockValue.toLocaleString("en-IN")}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Recent Orders</h3>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left bg-white text-sm">
                    <thead className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="p-4 font-bold">ID</th>
                        <th className="p-4 font-bold">Date</th>
                        <th className="p-4 font-bold">Customer</th>
                        <th className="p-4 font-bold">Total</th>
                        <th className="p-4 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {analytics.recentOrders.map(o => (
                        <tr key={o.id} className="hover:bg-slate-50">
                          <td className="p-4 font-black">#INV-{o.id.toString().padStart(6, "0")}</td>
                          <td className="p-4 text-slate-600">{new Date(o.date).toLocaleDateString("en-IN")}</td>
                          <td className="p-4 font-bold text-slate-700">{o.customer || "Guest"}</td>
                          <td className="p-4 font-black text-accent-orange">₹{o.total.toFixed(2)}</td>
                          <td className="p-4">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border ${STATUS_COLOR[o.status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {analytics.recentOrders.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-slate-400 font-bold">No orders yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───── SETTINGS TAB ───── */}
      {activeTab === "SETTINGS" && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 max-w-4xl">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest mb-6">Business Settings</h2>
          {settings && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                <h3 className="md:col-span-2 text-sm font-bold text-slate-500 uppercase tracking-widest">Identity</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Business Name</label>
                  <input type="text" value={settings.businessName} onChange={e => setSettings({ ...settings, businessName: e.target.value })} className="w-full px-3 py-2 border rounded font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Brand Name</label>
                  <input type="text" value={settings.brandName} onChange={e => setSettings({ ...settings, brandName: e.target.value })} className="w-full px-3 py-2 border rounded font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">GSTIN</label>
                  <input type="text" value={settings.gstin} onChange={e => setSettings({ ...settings, gstin: e.target.value })} className="w-full px-3 py-2 border rounded font-bold text-accent-orange" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Registered Address</label>
                  <textarea value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} className="w-full px-3 py-2 border rounded font-medium" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100">
                <h3 className="md:col-span-3 text-sm font-bold text-slate-500 uppercase tracking-widest">Contact</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Mobile 1</label>
                  <input type="text" value={settings.phoneOne} onChange={e => setSettings({ ...settings, phoneOne: e.target.value })} className="w-full px-3 py-2 border rounded font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Mobile 2</label>
                  <input type="text" value={settings.phoneTwo} onChange={e => setSettings({ ...settings, phoneTwo: e.target.value })} className="w-full px-3 py-2 border rounded font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Email</label>
                  <input type="email" value={settings.email} onChange={e => setSettings({ ...settings, email: e.target.value })} className="w-full px-3 py-2 border rounded font-medium" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <h3 className="md:col-span-2 text-sm font-bold text-slate-500 uppercase tracking-widest">Bank Details</h3>
                <div><label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Bank Name</label><input type="text" value={settings.bankName} onChange={e => setSettings({ ...settings, bankName: e.target.value })} className="w-full px-3 py-2 border rounded font-medium" /></div>
                <div><label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Branch</label><input type="text" value={settings.bankBranch} onChange={e => setSettings({ ...settings, bankBranch: e.target.value })} className="w-full px-3 py-2 border rounded font-medium" /></div>
                <div><label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Account Number</label><input type="text" value={settings.accountNo} onChange={e => setSettings({ ...settings, accountNo: e.target.value })} className="w-full px-3 py-2 border rounded font-bold text-slate-900" /></div>
                <div><label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">IFSC Code</label><input type="text" value={settings.ifscCode} onChange={e => setSettings({ ...settings, ifscCode: e.target.value })} className="w-full px-3 py-2 border rounded font-bold text-slate-900 uppercase" /></div>
              </div>
              <button type="submit" disabled={savingSettings} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded uppercase tracking-widest text-sm font-bold">
                {savingSettings ? "Saving..." : "Save Settings"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* ───── LOGISTICS TAB ───── */}
      {activeTab === "LOGISTICS" && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 max-w-4xl">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest mb-2 border-b-4 border-slate-900 inline-block pb-2">Logistics Control</h2>
          <p className="text-slate-500 mb-8 font-medium text-sm mt-4">Map pincodes to cities for delivery serviceability checks.</p>
          <form onSubmit={handleUpsertPins} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">City</label>
                <input type="text" value={pinsCity} onChange={e => setPinsCity(e.target.value)} className="w-full px-3 py-2 border rounded font-medium focus:outline-none focus:ring-1 focus:ring-accent-orange" placeholder="e.g. Kolkata" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">State / Zone</label>
                <select value={pinsState} onChange={e => setPinsState(e.target.value)} className="w-full px-3 py-2 border rounded font-medium focus:outline-none bg-slate-50">
                  <option value="West Bengal">West Bengal (+4 Days)</option>
                  <option value="Rest of India">Rest of India (+7 Days)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Pincodes (comma-separated)</label>
                <textarea value={pinsText} onChange={e => setPinsText(e.target.value)} className="w-full px-3 py-2 border rounded font-bold tracking-widest text-slate-800 h-40 focus:outline-none focus:ring-1 focus:ring-accent-orange" placeholder="700015, 700016, 700017..." required />
              </div>
            </div>
            <button type="submit" disabled={upsertingPins || pinsText.length < 6} className="bg-accent-orange hover:bg-accent-orange-hover text-white px-8 py-3 rounded uppercase tracking-widest text-sm font-bold disabled:opacity-50 transition-colors">
              {upsertingPins ? "Routing Network..." : "Map Pincodes"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
