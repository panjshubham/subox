"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { PressButton } from "./PressButton";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    company: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", phone: "", company: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 p-8 rounded-lg text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
           <Send className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-green-800 uppercase tracking-widest mb-2">Message Sent!</h3>
        <p className="text-green-700 font-bold text-sm">Thank you for reaching out. Our factory team will contact you within 24 hours.</p>
        <button 
          onClick={() => setStatus("idle")}
          className="mt-6 text-green-800 font-black uppercase tracking-widest text-[10px] underline underline-offset-4"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Full Name *</label>
          <input 
            required type="text" name="name" value={formData.name} onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:bg-white transition-all shadow-sm"
            placeholder="Shubham Panjiyara"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Phone Number *</label>
          <input 
            required type="tel" name="phone" value={formData.phone} onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:bg-white transition-all shadow-sm"
            placeholder="+91 9830234950"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Company (Optional)</label>
        <input 
          type="text" name="company" value={formData.company} onChange={handleChange}
          className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:bg-white transition-all shadow-sm"
          placeholder="Enterprise Name"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Your Message *</label>
        <textarea 
          required name="message" rows={5} value={formData.message} onChange={handleChange}
          className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:bg-white transition-all shadow-sm resize-none"
          placeholder="Describe your requirement or project details..."
        />
      </div>

      <PressButton
        type="submit"
        disabled={status === "submitting"}
        className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest rounded shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-70"
      >
        {status === "submitting" ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Transmitting...</>
        ) : (
          <><Send className="w-5 h-5" /> Dispatch Message</>
        )}
      </PressButton>

      {status === "error" && (
        <p className="text-center text-red-500 font-bold uppercase tracking-widest text-[10px]">Error transmitting message. Please try again.</p>
      )}
    </form>
  );
}
