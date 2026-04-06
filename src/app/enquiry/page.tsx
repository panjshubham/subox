"use client";

import { useState } from "react";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default function EnquiryPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    product: "",
    quantity: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const res = await fetch("/api/enquiry", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(formData)
    });

    if (res.ok) {
       setStatus("success");
       setFormData({ name: "", company: "", phone: "", product: "", quantity: "", message: "" });
    } else {
       setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 uppercase tracking-widest mb-4">
            Bulk <span className="text-accent-orange">Enquiries</span>
          </h1>
          <p className="text-slate-500 font-bold max-w-2xl mx-auto">
            Need G.I. or M.S. Modular Boxes for a large project? Request a direct factory quote.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Contact Info Sidebar */}
           <div className="w-full lg:w-1/3 bg-slate-900 text-slate-300 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-slate-700 flex flex-col">
              <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-8 border-b-2 border-accent-orange pb-2 inline-block">Contact Info</h2>
              
              <div className="space-y-6 flex-1">
                 <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-accent-orange shrink-0 mt-1" />
                    <div>
                       <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-1">Factory Address</h4>
                       <p className="text-sm leading-relaxed">41, Tangra Road,<br/>Kolkata - 700 015<br/>West Bengal, India</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-accent-orange shrink-0 mt-1" />
                    <div>
                       <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-1">Phone & WhatsApp</h4>
                       <p className="text-sm">+91 9830234950</p>
                       <p className="text-sm">+91 6290754634</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-accent-orange shrink-0 mt-1" />
                    <div>
                       <h4 className="font-bold text-white uppercase tracking-wider text-sm mb-1">Email</h4>
                       <p className="text-sm">siyarampanjiyara@gmail.com</p>
                    </div>
                 </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-700">
                 <Link href="/about" className="text-accent-orange font-bold uppercase tracking-widest text-xs hover:text-white transition-colors">
                    View Factory Profile &rarr;
                 </Link>
              </div>
           </div>

           {/* Enquiry Form */}
           <div className="w-full lg:w-2/3 p-8 md:p-12">
              <h3 className="text-2xl font-bold text-slate-800 uppercase tracking-wide mb-8">Send a Message</h3>
              
              {status === "success" && (
                 <div className="bg-green-50 border border-green-200 text-green-800 font-bold p-6 rounded-lg mb-8 uppercase tracking-widest text-sm text-center shadow-inner">
                    Thank you! Your enquiry has been routed directly to the factory team. We will contact you shortly.
                 </div>
              )}

              {status === "error" && (
                 <div className="bg-red-50 border border-red-200 text-red-800 font-bold p-6 rounded-lg mb-8 uppercase tracking-widest text-sm text-center shadow-inner">
                    Error submitting enquiry. Please try again or contact us directly.
                 </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name *</label>
                       <input 
                         required type="text" name="name" value={formData.name} onChange={handleChange}
                         className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange" 
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Company / Business Name *</label>
                       <input 
                         required type="text" name="company" value={formData.company} onChange={handleChange}
                         className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange" 
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Phone Number *</label>
                       <input 
                         required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                         className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange" 
                       />
                    </div>
                    <div className="md:col-span-1">
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Product Category</label>
                       <select 
                         required name="product" value={formData.product} onChange={handleChange as any}
                         className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange"
                       >
                          <option value="">Select Category</option>
                          <option value="Junction Box">Junction Box</option>
                          <option value="D.B. Pole Box">D.B. Pole Box</option>
                          <option value="Modular Box">Modular Box</option>
                          <option value="Custom Requirement">Custom Requirement</option>
                       </select>
                    </div>
                    <div className="md:col-span-1">
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Volume/Quantity</label>
                       <input 
                         type="text" name="quantity" placeholder="e.g. 500 units" value={formData.quantity} onChange={handleChange}
                         className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange" 
                       />
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Additional Requirements</label>
                    <textarea 
                      name="message" rows={4} value={formData.message} onChange={handleChange}
                      placeholder="Specify material thickness, module sizes, finish requirements..."
                      className="w-full bg-slate-50 border border-slate-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange" 
                    />
                 </div>

                 <button 
                   type="submit" 
                   disabled={status === "submitting"}
                   className="flex items-center justify-center w-full md:w-auto ml-auto gap-2 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest px-8 py-4 rounded shadow-lg transition-colors border border-slate-700"
                 >
                   <Send className="w-5 h-5" />
                   {status === "submitting" ? "Sending Details..." : "Request Factory Quote"}
                 </button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}
