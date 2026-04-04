import { ShieldCheck, Target, Factory, Cog, Truck, Award } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Factory Profile | ShuBox Industrial Manufacturing",
  description: "Learn about ShuBox's advanced manufacturing capabilities, core values, and our commitment to producing India's best industrial electrical enclosures.",
};

export default async function AboutPage() {
  const settings = await prisma.storeSettings.findFirst();

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-slate-900 border-b-4 border-accent-orange text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-900 to-black pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="text-accent-orange font-black tracking-widest uppercase text-xs mb-4 inline-block bg-accent-orange/10 px-3 py-1 rounded border border-accent-orange/20">
            ShuBox Factory Profile
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tight uppercase">
            Manufacturing <span className="text-slate-400">Excellence</span>.
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            From raw steel to heavy-duty modular enclosures. We engineer industrial-grade safety into every box that leaves our Kolkata facility.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <div>
               <h2 className="text-3xl font-black text-slate-800 uppercase tracking-widest mb-6 border-l-4 border-accent-orange pl-4">Who We Are</h2>
               <p className="text-slate-600 mb-6 leading-relaxed">
                 {settings?.businessName || 'Shubham Enterprise'} is a premier manufacturer of M.S. and G.I. modular boxes, operating under our flagship brand <strong>{settings?.brandName || 'ShuBox'}</strong>. Born out of a need for robust, reliable, and standardized electrical enclosures in the heavy infrastructure sector, our products are the backbone of secure wiring systems.
               </p>
               <p className="text-slate-600 mb-6 leading-relaxed">
                 We bypass the middlemen, offering our clients—contractors, builders, and large-scale wholesalers—direct factory rates without compromising on the metallurgy or coating standards critical for longevity.
               </p>
               <div className="bg-slate-100 p-6 rounded border border-slate-200">
                  <h3 className="font-bold text-slate-800 uppercase tracking-widest mb-2 text-sm">Official Registered Address</h3>
                  <p className="text-slate-600">{settings?.address}</p>
                  <p className="text-slate-600 mt-2"><span className="font-bold">GSTIN:</span> {settings?.gstin}</p>
               </div>
            </div>
            <div className="relative h-96 bg-slate-200 rounded-lg overflow-hidden shadow-inner flex items-center justify-center border border-slate-300">
               {/* Factory Placeholder */}
               <div className="absolute inset-0 pattern-dots pattern-slate-300 pattern-bg-white pattern-size-4 pattern-opacity-100" />
               <Factory className="w-32 h-32 text-slate-400 relative z-10" />
               <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded font-bold text-slate-800 tracking-widest text-sm shadow-lg border border-slate-200">
                 KOLKATA FACILITY
               </div>
            </div>
         </div>

         <div className="mb-24">
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-widest mb-12 text-center">The ShuBox Advantage</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               
               <div className="bg-white p-8 rounded border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="w-12 h-12 bg-accent-orange/10 text-accent-orange rounded flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><ShieldCheck className="w-6 h-6" /></div>
                  <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wider mb-3">Weldless Fabrication</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">We utilize precision-folded structural engineering. By eliminating welds, we remove the primary weak points where rust sets in during high-humidity cycles.</p>
               </div>

               <div className="bg-white p-8 rounded border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="w-12 h-12 bg-accent-orange/10 text-accent-orange rounded flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Cog className="w-6 h-6" /></div>
                  <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wider mb-3">Thick-Gauge Steel</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Safety is non-negotiable. Our standard loadouts use 1.0mm thicknesses, expanding to 1.2mm Heavy Duty variants for commercial load handling.</p>
               </div>

               <div className="bg-white p-8 rounded border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="w-12 h-12 bg-accent-orange/10 text-accent-orange rounded flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Award className="w-6 h-6" /></div>
                  <h3 className="text-xl font-bold text-slate-800 uppercase tracking-wider mb-3">Powder Coated Finish</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Our M.S. variants undergo rigorous automated powder coating, ensuring 100-hour salt spray resistance and a flawless premium aesthetic.</p>
               </div>

            </div>
         </div>

         <div className="bg-slate-900 rounded-xl p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-accent-orange/20 blur-3xl rounded-full" />
            <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-widest relative z-10">Start Procuring Direct</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 relative z-10 font-medium">
               Set up your business account today to view wholesale pricing, manage invoices natively, and track bulk logistics directly from your dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
               <Link href="/register" className="bg-accent-orange hover:bg-orange-600 font-bold uppercase tracking-widest text-sm px-8 py-4 rounded transition-colors shadow-lg">
                 Create Business Account
               </Link>
               <Link href="/" className="bg-white/10 hover:bg-white/20 font-bold uppercase tracking-widest text-sm px-8 py-4 rounded transition-colors backdrop-blur">
                 View Catalog
               </Link>
            </div>
         </div>

      </div>
    </div>
  );
}
