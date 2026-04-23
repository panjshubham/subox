import { prisma } from "@/lib/prisma";
import { Phone, Mail, MapPin, Building2, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | ShuBox Industrial",
  description: "Get in touch with Shubham Enterprise for industrial electrical box procurement, bulk orders, and B2B rates. Call or WhatsApp from Kolkata.",
};

export default async function ContactPage() {
  const settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });
  
  if (!settings) return null;


  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-4 shadow-sm">Contact <span className="text-accent-orange">HUB</span></h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm max-w-2xl mx-auto leading-relaxed underline decoration-accent-orange decoration-4 underline-offset-8 decoration-dashed">Direct Factory access for commercial & industrial procurement.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
           
           {/* Left Column: Business Intel */}
           <div className="space-y-8 animate-in slide-in-from-left duration-700">
              <div className="bg-slate-900 p-8 rounded-xl shadow-2xl relative overflow-hidden text-white border-b-8 border-accent-orange">
                 <Building2 className="absolute top-0 right-0 w-64 h-64 text-slate-800 -mr-20 -mt-10 opacity-30" />
                 <h2 className="text-2xl font-black uppercase tracking-widest mb-8 border-l-4 border-accent-orange pl-4">Headquarters</h2>
                 
                 <div className="space-y-6 relative z-10">
                    <div className="flex items-start gap-4">
                       <MapPin className="w-6 h-6 text-accent-orange shrink-0 mt-1" />
                       <div>
                          <p className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-1 font-mono">Factory Address</p>
                          <p className="text-lg font-black text-white">{settings.address}</p>
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">Electronic Mail</p>
                          <p className="text-white font-black uppercase tracking-wider text-sm">93.shubhampanjiyara@gmail.com</p>
                          <p className="text-slate-500 font-bold uppercase tracking-widest mt-2 bg-slate-800 inline-block px-2 py-1 rounded text-[10px]">GSTIN: {settings.gstin}</p>
                       </div>
                    </div>

                    <div className="flex items-start gap-4">
                       <Phone className="w-6 h-6 text-accent-orange shrink-0 mt-1" />
                       <div>
                          <p className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-1 font-mono">Lines of Communication</p>
                          <p className="text-lg font-black text-white">{settings.phoneOne}</p>
                          <p className="text-lg font-black text-white">{settings.phoneTwo}</p>
                       </div>
                    </div>

                    <div className="flex items-start gap-4">
                       <Mail className="w-6 h-6 text-accent-orange shrink-0 mt-1" />
                       <div>
                          <p className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-1 font-mono">Email Intel</p>
                          <p className="text-lg font-black text-white">{settings.email}</p>
                       </div>
                    </div>
                 </div>

                 <div className="mt-12 pt-8 border-t border-slate-800 relative z-10">
                    <a 
                      href={`https://wa.me/${settings.phoneOne.replace(/\D/g,'')}`}
                      target="_blank"
                      className="bg-[#25D366] text-white font-black uppercase tracking-widest px-8 py-4 rounded-none shadow-xl hover:bg-[#128C7E] transition-all flex items-center justify-center gap-3 w-full sm:w-auto"
                    >
                       <MessageCircle className="w-6 h-6" /> WhatsApp Factory Direct
                    </a>
                 </div>
              </div>

              {/* Decorative block */}
              <div className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-slate-900 border border-slate-200">
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Operations hours</h4>
                 <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                       <div className="font-black text-slate-800">Monday - Saturday</div>
                       <div className="font-bold text-slate-500 uppercase tracking-tighter">10:00 AM - 08:00 PM</div>
                    </div>
                    <div>
                       <div className="font-black text-slate-800">Sunday</div>
                       <div className="font-bold text-accent-orange uppercase tracking-tighter">Emergency Dispatches Only</div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right Column: Transmission Form */}
           <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl border border-slate-200 animate-in slide-in-from-right duration-700">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-12 h-1 bg-accent-orange rounded-full"></div>
                 <h3 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Send Transmission</h3>
              </div>
              <ContactForm />
           </div>

        </div>
      </div>
    </div>
  );
}
