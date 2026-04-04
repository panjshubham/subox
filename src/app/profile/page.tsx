"use client";

import { useState, useEffect } from "react";
import { UserCircle2, Building, MapPin, Receipt, LogOut, Save } from "lucide-react";

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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold uppercase tracking-widest text-slate-400">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-8 border-b-4 border-accent-orange pb-2">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-wide">
          Contractor Profile
        </h1>
        <button onClick={handleLogout} className="flex items-center gap-2 font-bold text-red-500 hover:text-red-700 uppercase tracking-widest text-sm">
           <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow border border-slate-200 text-center">
             <UserCircle2 className="w-24 h-24 text-slate-300 mx-auto mb-4" />
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">{profile.fullName}</h2>
             <p className="text-sm font-bold text-accent-orange uppercase tracking-widest mt-1">{profile.mobile}</p>
             {profile.email && <p className="text-xs text-slate-500 mt-2">{profile.email}</p>}
          </div>

          <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 -mt-4 -mr-4 text-slate-700 opacity-50"><Receipt className="w-24 h-24" /></div>
             <h3 className="text-sm font-black uppercase tracking-widest mb-2 border-b border-slate-600 pb-2 inline-block">Order History</h3>
             <p className="text-xs text-slate-400 font-medium">Tracking integration coming soon. You've placed 0 orders.</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-xl shadow border border-slate-200">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">
               Business Details
            </h3>
            
            {message && (
              <div className="mb-6 bg-green-50 text-green-700 p-3 rounded text-sm font-bold border border-green-200 inline-block px-6">
                {message}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wide mb-2"><Building className="w-4 h-4 text-slate-400" /> Company Name</label>
                <input 
                  type="text" 
                  value={profile.companyName || ""} 
                  onChange={(e) => setProfile({...profile, companyName: e.target.value})} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:ring-accent-orange focus:bg-white transition-colors text-sm font-medium"
                  placeholder="Your Business Name"
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wide mb-2"><Receipt className="w-4 h-4 text-slate-400" /> GST Number (For ITC)</label>
                <input 
                  type="text" 
                  value={profile.gstNumber || ""} 
                  onChange={(e) => setProfile({...profile, gstNumber: e.target.value})} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:ring-accent-orange focus:bg-white transition-colors text-sm font-medium"
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wide mb-2"><MapPin className="w-4 h-4 text-slate-400" /> Dispatch Address</label>
                <textarea 
                  value={profile.address || ""} 
                  onChange={(e) => setProfile({...profile, address: e.target.value})} 
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:ring-accent-orange focus:bg-white transition-colors text-sm font-medium"
                  placeholder="Full shipping address..."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold uppercase tracking-widest rounded shadow transition-colors"
                >
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
