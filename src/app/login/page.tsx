"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCircle2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, password }),
    });

    if (res.ok) {
      window.location.href = "/profile";
    } else {
      const data = await res.json();
      setError(data.error || "Failed to login.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow border-t-8 border-t-accent-orange">
        <div className="flex flex-col items-center">
          <UserCircle2 className="w-16 h-16 text-slate-800" />
          <h2 className="mt-6 text-center text-3xl font-black text-slate-900 tracking-tight uppercase">
            Contractor Login
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500 font-bold uppercase tracking-widest">
            Welcome back to ShuBox
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded text-sm font-bold border border-red-200">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Mobile Number</label>
              <input
                type="text"
                required
                className="appearance-none rounded relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-accent-orange focus:border-accent-orange focus:z-10 sm:text-sm font-medium"
                placeholder="e.g. 9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">Password</label>
              <input
                type="password"
                required
                className="appearance-none rounded relative block w-full px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-accent-orange focus:border-accent-orange focus:z-10 sm:text-sm font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 uppercase tracking-widest transition-colors"
            >
              {loading ? "Verifying..." : "Sign In"}
              <ArrowRight className="absolute right-4 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="text-center text-sm font-medium text-slate-600 mt-4">
            Don't have an account? <Link href="/register" className="text-accent-orange hover:text-accent-orange-hover font-bold uppercase tracking-wide">Register here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
