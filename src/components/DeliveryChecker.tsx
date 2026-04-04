"use client";

import { useState } from "react";
import { Truck } from "lucide-react";

export function DeliveryChecker() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async () => {
    if (pin.length !== 6) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/shipping?pin=${pin}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 mt-6 p-4 rounded mb-6">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-3">
        <Truck className="w-5 h-5 text-accent-orange" />
        Check Delivery Availability
      </h3>
      <div className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit Pincode"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          className="flex-grow bg-white border border-slate-300 rounded px-3 py-2 text-sm font-bold focus:outline-none focus:border-accent-orange focus:ring-1 focus:ring-accent-orange"
        />
        <button
          onClick={handleCheck}
          disabled={loading || pin.length !== 6}
          className="bg-slate-900 text-white font-bold px-4 py-2 rounded text-xs uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50"
        >
          Check
        </button>
      </div>

      {loading && <p className="text-xs text-slate-500 font-bold mt-3">Verifying routes...</p>}
      
      {result && (
        <div className={`mt-3 p-3 rounded border text-xs font-bold ${result.deliverable ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
           {result.deliverable ? (
             <div>
                <p className="flex items-center gap-1 mb-1">✅ Deliverable to {result.city}</p>
                <p className="text-sm font-black text-slate-900 uppercase">Get it by {result.estimatedDate}</p>
             </div>
           ) : (
             <p className="flex items-center gap-1">❌ Not deliverable to this location</p>
           )}
        </div>
      )}
    </div>
  );
}
