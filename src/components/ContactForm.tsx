"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { PressButton } from "./PressButton";

type FormData = { name: string; phone: string; company: string; message: string };
type FieldErrors = Partial<Record<keyof FormData, string>>;

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({ name: "", phone: "", company: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!/^\d{10}$/.test(formData.phone.trim())) newErrors.phone = "Please enter a valid 10-digit phone number.";
    if (!formData.message.trim() || formData.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", phone: "", company: "", message: "" });
        setErrors({});
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 p-8 rounded-lg text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-green-800 uppercase tracking-widest mb-2">Message Sent!</h3>
        <p className="text-green-700 font-bold text-sm">We'll get back to you within 24 hours.</p>
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
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Full Name *</label>
          <input
            type="text" name="name" value={formData.name} onChange={handleChange} required
            className={`w-full bg-slate-50 border rounded px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:bg-white transition-all shadow-sm ${errors.name ? "border-red-400" : "border-slate-200"}`}
            placeholder="Shubham Panjiyara"
          />
          {errors.name && <p className="text-red-500 text-[10px] font-bold pl-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Phone Number * (10 digits)</label>
          <input
            type="tel" name="phone" value={formData.phone} onChange={handleChange} required maxLength={10}
            className={`w-full bg-slate-50 border rounded px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:bg-white transition-all shadow-sm ${errors.phone ? "border-red-400" : "border-slate-200"}`}
            placeholder="9830234950"
          />
          {errors.phone && <p className="text-red-500 text-[10px] font-bold pl-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Company (Optional)</label>
        <input
          type="text" name="company" value={formData.company} onChange={handleChange}
          className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:bg-white transition-all shadow-sm"
          placeholder="Enterprise Name"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Your Message *</label>
        <textarea
          name="message" rows={5} value={formData.message} onChange={handleChange} required
          className={`w-full bg-slate-50 border rounded px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:bg-white transition-all shadow-sm resize-none ${errors.message ? "border-red-400" : "border-slate-200"}`}
          placeholder="Describe your requirement or project details..."
        />
        {errors.message && <p className="text-red-500 text-[10px] font-bold pl-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.message}</p>}
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
        <div className="flex items-center justify-center gap-2 text-red-500 font-bold text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>Failed to send. Please try calling us directly or use WhatsApp.</span>
        </div>
      )}
    </form>
  );
}
