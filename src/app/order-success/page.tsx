import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderSuccessPage({ searchParams }: { searchParams: { orderId?: string } }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full p-8 rounded-xl shadow-xl border border-slate-200 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6 border-4 border-green-50">
          <ShieldCheck className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-widest mb-2">Order Placed Successfully!</h1>
        <p className="text-slate-500 font-bold mb-6">Check your email for confirmation and invoice details.</p>
        
        {searchParams.orderId && (
          <div className="bg-slate-50 p-4 rounded mb-8 border border-slate-200 shadow-inner">
             <div className="text-xs uppercase font-bold text-slate-400 tracking-widest mb-1">Order Reference ID</div>
             <div className="text-lg font-black text-slate-800 font-mono">{searchParams.orderId}</div>
          </div>
        )}

        <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }}>
          <Link 
            href="/" 
            className="bg-accent-orange text-white px-8 py-4 rounded font-black uppercase tracking-widest text-sm shadow hover:bg-orange-600 transition-colors inline-block w-full text-center"
          >
            Return to Products
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
