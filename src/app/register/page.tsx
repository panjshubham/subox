"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    companyName: "",
    gstNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      window.location.href = "/profile";
    } else {
      const data = await res.json();
      setError(data.error || "Failed to register.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow border-t-8 border-t-accent-orange relative">
        <div className="flex flex-col items-center">
          <UserPlus className="w-16 h-16 text-slate-800" />
          <h2 className="mt-6 text-center text-3xl font-black text-slate-900 tracking-tight uppercase">
            Create Business Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500 font-bold uppercase tracking-widest">
            Unlock trade pricing
          </p>
        </div>

        <form className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleRegister}>
          {error && (
            <div className="col-span-1 md:col-span-2 bg-red-50 text-red-700 p-3 rounded text-sm font-bold border border-red-200">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Full Name</label>
            <input required type="text" className="w-full px-3 py-3 border border-slate-300 rounded text-sm focus:ring-accent-orange focus:border-accent-orange" placeholder="John Doe" value={form.fullName} onChange={(e) => setForm({...form, fullName: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Mobile Number</label>
            <input required type="text" className="w-full px-3 py-3 border border-slate-300 rounded text-sm focus:ring-accent-orange focus:border-accent-orange" placeholder="10-digit mobile" value={form.mobile} onChange={(e) => setForm({...form, mobile: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Email <span className="text-slate-400 font-normal">(Optional)</span></label>
            <input type="email" className="w-full px-3 py-3 border border-slate-300 rounded text-sm focus:ring-accent-orange focus:border-accent-orange" placeholder="john@example.com" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Company Name <span className="text-slate-400 font-normal">(Optional)</span></label>
            <input type="text" className="w-full px-3 py-3 border border-slate-300 rounded text-sm focus:ring-accent-orange focus:border-accent-orange" placeholder="Doe Electricals" value={form.companyName} onChange={(e) => setForm({...form, companyName: e.target.value})} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">GST Number <span className="text-slate-400 font-normal">(Optional)</span></label>
            <input type="text" className="w-full px-3 py-3 border border-slate-300 rounded text-sm focus:ring-accent-orange focus:border-accent-orange" placeholder="22AAAAA0000A1Z5" value={form.gstNumber} onChange={(e) => setForm({...form, gstNumber: e.target.value})} />
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Adding GST applies Input Tax Credit (ITC) benefits automatically.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Password</label>
            <input required type="password" minLength={6} className="w-full px-3 py-3 border border-slate-300 rounded text-sm focus:ring-accent-orange focus:border-accent-orange" placeholder="Min 6 characters" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Confirm</label>
            <input required type="password" minLength={6} className="w-full px-3 py-3 border border-slate-300 rounded text-sm focus:ring-accent-orange focus:border-accent-orange" placeholder="Retype password" value={form.confirmPassword} onChange={(e) => setForm({...form, confirmPassword: e.target.value})} />
          </div>

          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded text-white bg-accent-orange hover:bg-accent-orange-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-orange uppercase tracking-widest transition-colors shadow"
            >
              {loading ? "Creating..." : "Register Now"}
              <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="md:col-span-2 text-center text-sm font-medium text-slate-600 mt-4">
            Already have an account? <Link href="/login" className="text-slate-900 hover:underline font-bold uppercase tracking-wide">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
