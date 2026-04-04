"use client";

import { useState, useEffect } from "react";
import { Trash2, Edit2, Plus, Save, X, Lock, ExternalLink } from "lucide-react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  category: string;
  moduleSize: string;
  material: string;
  primaryUse: string;
  dimensions: string;
  mrp: number;
  price: number;
  thickness: string;
  coating: string;
  features: string;
  hsnCode: string;
  description: string;
  inStock: boolean;
  showInBanner: boolean;
  bulkDiscount: number;
  imageUrl: string | null;
  imageGallery: string | null;
};

type StoreSettings = {
  businessName: string;
  brandName: string;
  gstin: string;
  address: string;
  phoneOne: string;
  phoneTwo: string;
  email: string;
  bankName: string;
  bankBranch: string;
  accountNo: string;
  ifscCode: string;
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<"CATALOG" | "SETTINGS" | "LOGISTICS">("CATALOG");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  
  const defaultNewForm: Partial<Product> = {
    category: "Modular Boxes", material: "G.I.", moduleSize: "1M", inStock: true, showInBanner: false, bulkDiscount: 10.0, hsnCode: "8538", 
    thickness: "1.0mm (Standard)", coating: "Pre-Galvanized Zinc", 
    features: "Weldless folded design, Earth screw provision",
    description: "Premium Quality: Manufactured from high-grade materials for maximum rust resistance."
  };
  const [newForm, setNewForm] = useState<Partial<Product>>(defaultNewForm);

  const [pinsText, setPinsText] = useState("");
  const [pinsCity, setPinsCity] = useState("Kolkata");
  const [pinsState, setPinsState] = useState("West Bengal");
  const [upsertingPins, setUpsertingPins] = useState(false);
  const handleUpsertPins = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpsertingPins(true);
    const res = await fetch("/api/admin/pincodes", {
       method: "POST", headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ pins: pinsText, city: pinsCity, state: pinsState })
    });
    setUpsertingPins(false);
    if(res.ok) {
       const data = await res.json();
       alert(`Successfully mapped ${data.count} pincodes!`);
       setPinsText("");
    } else {
       alert("Failed to map pincodes.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchSettings();
    }
  }, [isAuthenticated]);

  const fetchSettings = async () => {
    const res = await fetch("/api/admin/settings");
    const data = await res.json();
    setSettings(data);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSavingSettings(true);
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    });
    setSavingSettings(false);
    alert("Settings Saved successfully.");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid password! Hint: admin123");
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name || !newForm.price || !newForm.mrp) return;
    
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newForm),
    });
    setNewForm(defaultNewForm);
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm(product);
  };

  const handleUpdate = async (id: number) => {
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setEditingId(null);
    fetchProducts();
  };

  const [uploadingImage, setUploadingImage] = useState(false);
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean = false) => {
    if (!e.target.files?.[0]) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      if (isNew) {
        setNewForm({ ...newForm, imageUrl: url });
      } else {
        setEditForm({ ...editForm, imageUrl: url });
      }
    } else {
      alert("Image upload failed");
    }
    setUploadingImage(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full border-t-4 border-slate-800">
          <div className="flex justify-center mb-6 text-slate-800">
            <Lock className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-center mb-6 text-slate-800 uppercase tracking-widest">ShuBox Admin</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded p-3 mb-4 focus:ring-accent-orange focus:border-accent-orange"
          />
          <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded transition-colors uppercase tracking-widest text-sm">
            Access System
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-8 border-b-4 border-accent-orange pb-2">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-wide">
          Command Center
        </h1>
        <div className="flex gap-4 items-center">
            <button 
               onClick={() => setActiveTab("CATALOG")} 
               className={`font-bold uppercase tracking-widest text-sm px-4 py-2 ${activeTab === "CATALOG" ? "text-accent-orange border-b-2 border-accent-orange" : "text-slate-500 hover:text-slate-800"}`}
            >
              Catalog
            </button>
            <button 
               onClick={() => setActiveTab("SETTINGS")} 
               className={`font-bold uppercase tracking-widest text-sm px-4 py-2 ${activeTab === "SETTINGS" ? "text-accent-orange border-b-2 border-accent-orange" : "text-slate-500 hover:text-slate-800"}`}
            >
              Settings
            </button>
            <button 
               onClick={() => setActiveTab("LOGISTICS")} 
               className={`font-bold uppercase tracking-widest text-sm px-4 py-2 ${activeTab === "LOGISTICS" ? "text-accent-orange border-b-2 border-accent-orange" : "text-slate-500 hover:text-slate-800"}`}
            >
              Logistics
            </button>
            <Link href="/" className="flex items-center gap-2 font-bold text-slate-800 hover:text-accent-orange border border-slate-300 px-3 py-1 rounded ml-4 text-xs">
               Store <ExternalLink className="w-3 h-3" />
            </Link>
        </div>
      </div>

      {activeTab === "CATALOG" ? (
      <>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8 max-w-4xl">
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Edit2 className="w-4 h-4 text-accent-orange" /> Bulk Manage Category
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
           <input type="text" id="bulkCategory" placeholder="Exact Category Name (e.g. Modular Boxes)" className="border p-2 rounded flex-1 font-bold text-sm" />
           <select id="bulkType" className="border p-2 rounded bg-slate-50 text-sm font-bold">
             <option value="FLAT_DISCOUNT">Set Flat Discount %</option>
             <option value="ADD_MRP">Add Flat Amount to MRP (₹)</option>
           </select>
           <input type="number" id="bulkValue" placeholder="Value (e.g. 15)" className="border p-2 rounded w-32 font-bold text-sm" />
           <button onClick={async () => {
              const cat = (document.getElementById('bulkCategory') as HTMLInputElement).value;
              const typ = (document.getElementById('bulkType') as HTMLSelectElement).value;
              const val = (document.getElementById('bulkValue') as HTMLInputElement).value;
              if(!cat || !val) return alert("Missing category or value");
              if(!confirm(`Are you sure you want to apply ${val} via ${typ} to ${cat}?`)) return;
              const res = await fetch('/api/admin/bulk', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({category: cat, type: typ, value: val}) });
              if(res.ok) { alert("Bulk updated successfully"); fetchProducts(); } else { alert("Bulk update failed."); }
           }} className="bg-slate-900 text-white font-bold px-6 py-2 rounded uppercase text-xs tracking-widest hover:bg-slate-800">Apply Mass Update</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto border border-slate-200">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-slate-100 text-slate-700 uppercase text-xs tracking-wider border-b border-slate-200">
              <th className="p-4 font-bold">Product Core</th>
              <th className="p-4 font-bold">Specs & Coating</th>
              <th className="p-4 font-bold">Pricing details</th>
              <th className="p-4 font-bold">Stock</th>
              <th className="p-4 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 text-sm">
                {editingId === p.id ? (
                  <>
                    <td className="p-4 space-y-2 align-top">
                      <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full border p-1 rounded font-bold" placeholder="Name" />
                      <input type="text" value={editForm.category || ""} onChange={(e) => setEditForm({...editForm, category: e.target.value})} className="w-full border p-1 rounded text-xs text-slate-500" placeholder="Category" />
                      <div className="flex gap-2">
                         <input type="text" value={editForm.moduleSize} onChange={(e) => setEditForm({...editForm, moduleSize: e.target.value})} className="w-20 border p-1 rounded" placeholder="Mod" />
                         <select value={editForm.material} onChange={(e) => setEditForm({...editForm, material: e.target.value})} className="border p-1 rounded"><option value="G.I.">G.I.</option><option value="M.S.">M.S.</option></select>
                         <input type="text" value={editForm.dimensions} onChange={(e) => setEditForm({...editForm, dimensions: e.target.value})} className="w-20 border p-1 rounded" placeholder="Size" />
                      </div>
                      <input type="text" value={editForm.primaryUse} onChange={(e) => setEditForm({...editForm, primaryUse: e.target.value})} className="w-full border p-1 rounded text-xs" placeholder="Primary Use" />
                    </td>
                    <td className="p-4 space-y-2 align-top">
                      <input type="text" value={editForm.thickness || ""} onChange={(e) => setEditForm({...editForm, thickness: e.target.value})} className="w-full border p-1 rounded text-xs" placeholder="Thickness" />
                      <input type="text" value={editForm.coating || ""} onChange={(e) => setEditForm({...editForm, coating: e.target.value})} className="w-full border p-1 rounded text-xs" placeholder="Coating" />
                      <input type="text" value={editForm.features || ""} onChange={(e) => setEditForm({...editForm, features: e.target.value})} className="w-full border p-1 rounded text-xs" placeholder="Features" />
                      <textarea value={editForm.description || ""} onChange={(e) => setEditForm({...editForm, description: e.target.value})} className="w-full border p-1 rounded text-xs h-16" placeholder="SEO Description" />
                      
                      <div className="border border-dashed border-slate-300 p-2 rounded text-center relative">
                         {uploadingImage ? <span className="text-xs font-bold text-slate-500">Uploading...</span> : (
                            <>
                               <span className="text-xs font-bold text-slate-500 cursor-pointer block">{editForm.imageUrl ? "Change Image" : "Attach Image (.jpg/.png)"}</span>
                               <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </>
                         )}
                         {editForm.imageUrl && <p className="text-[10px] text-green-600 mt-1 truncate">{editForm.imageUrl}</p>}
                      </div>
                    </td>
                    <td className="p-4 space-y-2 align-top">
                      <div className="flex justify-between items-center"><span className="text-xs text-slate-500">MRP:</span> <input type="number" value={editForm.mrp || 0} onChange={(e) => setEditForm({...editForm, mrp: Number(e.target.value)})} className="w-24 border p-1 rounded" /></div>
                      <div className="flex justify-between items-center"><span className="text-xs text-slate-500">Price:</span> <input type="number" value={editForm.price || 0} onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})} className="w-24 border p-1 rounded" /></div>
                      <div className="flex justify-between items-center"><span className="text-xs text-slate-500">Bulk %:</span> <input type="number" value={editForm.bulkDiscount || 0} onChange={(e) => setEditForm({...editForm, bulkDiscount: Number(e.target.value)})} className="w-24 border p-1 rounded text-green-700 font-bold" /></div>
                      <div className="flex justify-between items-center"><span className="text-xs text-slate-500">HSN:</span> <input type="text" value={editForm.hsnCode || ""} onChange={(e) => setEditForm({...editForm, hsnCode: e.target.value})} className="w-24 border p-1 rounded" /></div>
                    </td>
                    <td className="p-4 align-top space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer bg-slate-100 p-2 rounded border">
                        <input type="checkbox" checked={editForm.inStock || false} onChange={(e) => setEditForm({...editForm, inStock: e.target.checked})} className="w-4 h-4 text-green-600 focus:ring-green-500 rounded" />
                        <span className="font-bold text-slate-700">In Stock</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-orange-50 p-2 rounded border border-orange-200 mt-2">
                        <input type="checkbox" checked={editForm.showInBanner || false} onChange={(e) => setEditForm({...editForm, showInBanner: e.target.checked})} className="w-4 h-4 text-accent-orange focus:ring-accent-orange rounded" />
                        <span className="font-bold text-orange-800 text-[10px] uppercase tracking-widest leading-tight">Show in Banner</span>
                      </label>
                    </td>
                    <td className="p-4 flex justify-center gap-2 align-top">
                       <button onClick={() => handleUpdate(p.id)} disabled={uploadingImage} className="flex items-center gap-1 text-white bg-green-600 px-3 py-2 rounded hover:bg-green-700 font-bold"><Save className="w-4 h-4" /> Save</button>
                       <button onClick={() => setEditingId(null)} className="flex items-center gap-1 text-slate-600 bg-slate-200 px-3 py-2 rounded hover:bg-slate-300 font-bold"><X className="w-4 h-4" /> Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 align-top">
                      <div className="flex items-start gap-4">
                        {p.imageUrl && <img src={p.imageUrl} alt="preview" className="w-12 h-12 object-cover rounded shadow-sm mix-blend-multiply border" />}
                        <div>
                          <div className="font-black text-slate-800 text-lg mb-1">{p.name}</div>
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{p.category}</div>
                          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">{p.material} • {p.moduleSize} • {p.dimensions}"</div>
                          <div className="text-sm text-slate-600"><span className="font-bold mr-1">Uses:</span>{p.primaryUse}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-top max-w-xs">
                      <div className="text-xs text-slate-600 mb-1"><span className="font-bold mr-1">Thickness:</span>{p.thickness}</div>
                      <div className="text-xs text-slate-600 mb-1"><span className="font-bold mr-1">Coating:</span>{p.coating}</div>
                      <div className="text-xs text-slate-600 italic truncate mb-2" title={p.features}>{p.features}</div>
                      <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded border line-clamp-2" title={p.description}>{p.description}</div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="text-xs text-slate-400 line-through mb-1">MRP: ₹{p.mrp.toFixed(2)}</div>
                      <div className="font-bold text-accent-orange text-xl mb-2">₹{p.price.toFixed(2)}</div>
                      <div className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 inline-block rounded border border-green-200 mb-1">Bulk Disc: {p.bulkDiscount}%</div>
                      <div className="text-xs text-slate-500">HSN: {p.hsnCode}</div>
                    </td>
                    <td className="p-4 align-top space-y-2">
                      {p.inStock ? 
                        <span className="bg-green-100 text-green-800 font-bold px-2 py-1 rounded text-xs uppercase tracking-wider block w-fit">In Stock</span> : 
                        <span className="bg-red-100 text-red-800 font-bold px-2 py-1 rounded text-xs uppercase tracking-wider block w-fit">Out of Stock</span>
                      }
                      {p.showInBanner && <span className="bg-accent-orange text-white font-bold px-2 py-1 rounded text-[10px] uppercase tracking-widest block w-fit shadow-sm">Home Banner 🌟</span>}
                    </td>
                    <td className="p-4 align-top flex justify-center gap-2">
                       <button onClick={() => startEdit(p)} className="text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 p-2 rounded transition-colors"><Edit2 className="w-5 h-5" /></button>
                       <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>
      ) : activeTab === "SETTINGS" ? (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 max-w-4xl">
         <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest mb-6">Business Settings</h2>
         {settings && (
         <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
               <div className="col-span-1 md:col-span-2">
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Identity</h3>
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Business Name</label>
                  <input type="text" value={settings.businessName} onChange={(e) => setSettings({...settings, businessName: e.target.value})} className="w-full px-3 py-2 border rounded font-medium" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Brand Name</label>
                  <input type="text" value={settings.brandName} onChange={(e) => setSettings({...settings, brandName: e.target.value})} className="w-full px-3 py-2 border rounded font-medium" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">GSTIN</label>
                  <input type="text" value={settings.gstin} onChange={(e) => setSettings({...settings, gstin: e.target.value})} className="w-full px-3 py-2 border rounded font-bold text-accent-orange" />
               </div>
               <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Registered Address</label>
                  <textarea value={settings.address} onChange={(e) => setSettings({...settings, address: e.target.value})} className="w-full px-3 py-2 border rounded font-medium" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100">
               <div className="col-span-1 md:col-span-3">
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Contact Info</h3>
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Mobile 1</label>
                  <input type="text" value={settings.phoneOne} onChange={(e) => setSettings({...settings, phoneOne: e.target.value})} className="w-full px-3 py-2 border rounded font-medium" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Mobile 2</label>
                  <input type="text" value={settings.phoneTwo} onChange={(e) => setSettings({...settings, phoneTwo: e.target.value})} className="w-full px-3 py-2 border rounded font-medium" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Public Email</label>
                  <input type="email" value={settings.email} onChange={(e) => setSettings({...settings, email: e.target.value})} className="w-full px-3 py-2 border rounded font-medium" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
               <div className="col-span-1 md:col-span-2">
                 <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Bandhan Bank (RTGS/NEFT/IMPS)</h3>
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Bank Name</label>
                  <input type="text" value={settings.bankName} onChange={(e) => setSettings({...settings, bankName: e.target.value})} className="w-full px-3 py-2 border rounded font-medium" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Branch</label>
                  <input type="text" value={settings.bankBranch} onChange={(e) => setSettings({...settings, bankBranch: e.target.value})} className="w-full px-3 py-2 border rounded font-medium" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Account Number</label>
                  <input type="text" value={settings.accountNo} onChange={(e) => setSettings({...settings, accountNo: e.target.value})} className="w-full px-3 py-2 border rounded font-bold text-slate-900" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">IFSC Code</label>
                  <input type="text" value={settings.ifscCode} onChange={(e) => setSettings({...settings, ifscCode: e.target.value})} className="w-full px-3 py-2 border rounded font-bold text-slate-900 uppercase" />
               </div>
            </div>

            <button type="submit" disabled={savingSettings} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded uppercase tracking-widest text-sm font-bold">
               {savingSettings ? "Saving..." : "Update Business Details"}
            </button>
         </form>
         )}
      </div>
      ) : activeTab === "LOGISTICS" ? (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 max-w-4xl">
         <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest mb-6 border-b-4 border-slate-900 inline-block pb-2">Logistics Control</h2>
         <p className="text-slate-500 mb-8 font-medium text-sm">Assign serviceability to groups of pincodes. Type values comma-separated.</p>
         
         <form onSubmit={handleUpsertPins} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">City Label</label>
                  <input type="text" value={pinsCity} onChange={(e) => setPinsCity(e.target.value)} className="w-full px-3 py-2 border rounded font-medium focus:outline-none focus:ring-1 focus:ring-accent-orange focus:border-accent-orange" placeholder="e.g. Kolkata" required />
               </div>
               <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">State Routing (Delivery Math)</label>
                  <select value={pinsState} onChange={(e) => setPinsState(e.target.value)} className="w-full px-3 py-2 border rounded font-medium focus:outline-none bg-slate-50">
                    <option value="West Bengal">West Bengal (+4 Days)</option>
                    <option value="Rest of India">Rest of India (+7 Days)</option>
                  </select>
               </div>
               <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1 flex justify-between">
                     <span>Pincode Matrix</span>
                     <span className="text-slate-400 font-normal">Comma Separated (e.g. 700015, 700016)</span>
                  </label>
                  <textarea value={pinsText} onChange={(e) => setPinsText(e.target.value)} className="w-full px-3 py-2 border rounded font-bold tracking-widest text-slate-800 h-40 focus:outline-none focus:ring-1 focus:ring-accent-orange focus:border-accent-orange" placeholder="700015, 700016..." required />
               </div>
            </div>
            
            <button type="submit" disabled={upsertingPins || pinsText.length < 6} className="bg-accent-orange hover:bg-accent-orange-hover text-white px-8 py-3 rounded uppercase tracking-widest text-sm font-bold w-full disabled:opacity-50 transition-colors">
               {upsertingPins ? "Routing Network..." : "Mass Update Pincodes"}
            </button>
         </form>
      </div>
      ) : null}
    </div>
  );
}
