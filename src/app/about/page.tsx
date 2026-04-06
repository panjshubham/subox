import { ShieldCheck, Target, Factory, Cog, Truck, Award } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { FactoryGallery } from "@/components/FactoryGallery";
import { AboutCTAs } from "@/components/AboutCTAs";

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
            <div className="relative h-96 bg-slate-900 rounded-lg overflow-hidden shadow-inner border border-slate-800 group">
               <iframe 
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.6666912341075!2d88.38486927481081!3d22.554155233647034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02768e7141be81%3A0x8e20cd80186f856c!2s41%2C%20New%20Tangra%20Rd%2C%20Tangra%2C%20Kolkata%2C%20West%20Bengal%20700046!5e0!3m2!1sen!2sin!4v1775398030945!5m2!2sen!2sin" 
                 width="100%" 
                 height="100%" 
                 style={{border:0, filter: 'grayscale(1) contrast(1.2) opacity(0.7)'}} 
                 allowFullScreen 
                 loading="lazy" 
                 referrerPolicy="no-referrer-when-downgrade"
                 className="absolute inset-0 transition-all duration-700 group-hover:opacity-100 group-hover:filter-none"
               ></iframe>
               <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur text-white px-4 py-2 rounded-none font-black tracking-widest text-[10px] uppercase border-l-4 border-accent-orange z-20">
                 Precision Manufacturing Hub
               </div>
               <div className="absolute bottom-4 right-4 bg-accent-orange text-white px-4 py-2 rounded-none font-black tracking-widest text-[10px] uppercase shadow-2xl z-20">
                 41, TANGRA ROAD, KOLKATA
               </div>
            </div>
         </div>

         <FactoryGallery />

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
            <AboutCTAs />
         </div>

      </div>
    </div>
  );
}
