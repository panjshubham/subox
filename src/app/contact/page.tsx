import { prisma } from "@/lib/prisma";
import { Phone, Mail, MapPin } from "lucide-react";

export default async function ContactPage() {
  const settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });
  
  if (!settings) return null;

  return (
    <div className="bg-slate-50 min-h-[80vh] py-16 px-4 flex items-center justify-center">
       <div className="max-w-3xl w-full bg-white p-12 rounded-xl shadow border-t-8 border-accent-orange">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-widest mb-2 text-center">Contact Hub</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-center mb-12 text-sm">Direct Factory Access</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-slate-50 p-8 rounded border border-slate-200 flex flex-col items-center text-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4"><Phone className="w-8 h-8 text-accent-orange" /></div>
                <h3 className="font-black text-slate-800 uppercase tracking-widest mb-2">Sales & Support</h3>
                <p className="font-bold text-slate-600">{settings.phoneOne}</p>
                <p className="font-bold text-slate-600">{settings.phoneTwo}</p>
             </div>

             <div className="bg-slate-50 p-8 rounded border border-slate-200 flex flex-col items-center text-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4"><Mail className="w-8 h-8 text-accent-orange" /></div>
                <h3 className="font-black text-slate-800 uppercase tracking-widest mb-2">Email Queries</h3>
                <p className="font-bold text-slate-600">{settings.email}</p>
             </div>

             <div className="md:col-span-2 bg-slate-900 p-8 rounded border border-slate-200 flex flex-col md:flex-row items-center justify-center text-center md:text-left gap-6 overflow-hidden relative">
                <div className="text-white z-10">
                   <h3 className="font-black text-white uppercase tracking-widest mb-2 text-xl">Headquarters</h3>
                   <p className="font-bold text-slate-400">{settings.address}</p>
                   <p className="mt-4 text-xs font-bold text-green-500 uppercase tracking-widest">Registered via GSTIN: {settings.gstin}</p>
                </div>
                <div className="absolute right-0 opacity-10 text-slate-100 pointer-events-none">
                   <MapPin className="w-64 h-64 -mr-16" />
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
