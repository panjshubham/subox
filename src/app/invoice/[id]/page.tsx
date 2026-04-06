import { Printer, ShieldCheck, Download, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { InvoiceActions } from "@/components/InvoiceActions";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const orderId = Number(resolvedParams.id);
  
  const session = await getSession();
  if (!session) return <div className="p-12 text-center font-bold">Unauthorized</div>;

  const order = await prisma.order.findUnique({
    where: { id: orderId, userId: session.userId },
    include: {
      user: true,
      items: true
    }
  });

  if (!order) return notFound();

  const settings = await prisma.storeSettings.findUnique({ where: { id: 1 } });
  
  if (!settings) return <div className="p-12 text-center font-bold">Settings loading...</div>;

  const cgst = order.totalAmount * 0.09;
  const sgst = order.totalAmount * 0.09;
  const finalTotal = order.totalAmount + cgst + sgst;

  const waNumber = settings.phoneOne ? settings.phoneOne.replace(/\D/g, '') : "910000000000";
  const strId = order.id.toString().padStart(6, '0');
  const waMessage = `🚀 New B2B Order Alert!\nOrder ID: #INV-${strId}\nTotal: Rs. ${finalTotal.toFixed(2)}\nCustomer: ${order.user.companyName || order.user.fullName}\nPlease check the Admin Dashboard.`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 flex flex-col items-center print:bg-white print:py-0 print:px-0">
       
       <InvoiceActions waLink={waLink} />

       {/* INVOICE A4 WRAPPER */}
       <div className="w-full max-w-[21cm] min-h-[29.7cm] bg-white shadow-xl print:shadow-none border border-slate-200 print:border-none p-12 flex flex-col relative printable-invoice text-slate-800">
         
         {/* HEADER */}
         <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8">
            <div className="flex flex-col">
               <div className="bg-slate-900 text-white w-12 h-12 flex items-center justify-center font-black text-xl tracking-wider mb-2">
                  SB
               </div>
               <h1 className="text-2xl font-black uppercase tracking-widest">{settings.businessName}</h1>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 border-l-2 border-accent-orange pl-2">{settings.brandName} - Industrial Grade</p>
               <p className="text-xs text-slate-600 w-64">{settings.address}</p>
               <p className="text-xs text-slate-600 mt-2"><span className="font-bold">Phone:</span> {settings.phoneOne}</p>
            </div>
            <div className="text-right flex flex-col items-end">
               <h2 className="text-4xl font-black text-slate-200 uppercase tracking-widest mb-4">Invoice</h2>
               <div className="bg-slate-100 p-3 rounded text-left min-w-[200px]">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-1 mb-1">Invoice Info</p>
                  <p className="text-sm font-black text-slate-800 uppercase tracking-wider">#INV-{order.id.toString().padStart(6, '0')}</p>
                  <p className="text-xs text-slate-600"><span className="font-bold">Date:</span> {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                  <p className="text-xs text-slate-600"><span className="font-bold">Status:</span> {order.status}</p>
               </div>
            </div>
         </div>

         {/* BILLING DETIALS */}
         <div className="grid grid-cols-2 gap-8 mb-10">
            <div className="border border-slate-200 p-4 rounded">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><ShieldCheck className="w-3 h-3 text-accent-orange" /> Billed By</p>
               <h3 className="font-black text-slate-800 uppercase text-sm mb-1">{settings.businessName}</h3>
               <p className="text-xs text-slate-700 font-bold tracking-widest">GSTIN: {settings.gstin}</p>
               <p className="text-xs text-slate-600 mt-1">{settings.address}</p>
            </div>
            <div className="border border-slate-200 p-4 rounded bg-slate-50">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Billed To</p>
               <h3 className="font-black text-slate-800 uppercase text-sm mb-1">{order.user.companyName || order.user.fullName}</h3>
               <p className="text-xs text-slate-700 font-bold tracking-widest">GSTIN: {order.user.gstNumber || 'Unregistered'}</p>
               <p className="text-xs text-slate-600 mt-1">{order.user.address || 'Address not provided'}</p>
               <p className="text-xs text-slate-600 mt-1">Mobile: {order.user.mobile}</p>
            </div>
         </div>

         {/* ITEMS TABLE */}
         <div className="flex-grow">
            <table className="w-full text-left border-collapse mb-8 text-sm">
               <thead>
                  <tr className="bg-slate-800 text-white uppercase tracking-widest text-[10px]">
                     <th className="p-3 font-bold border-r border-slate-700">Description</th>
                     <th className="p-3 font-bold text-center border-r border-slate-700 w-24">HSN</th>
                     <th className="p-3 font-bold text-center border-r border-slate-700 w-20">Qty</th>
                     <th className="p-3 font-bold text-right border-r border-slate-700 w-28">Rate</th>
                     <th className="p-3 font-bold text-right w-32">Total</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200 border-b-2 border-slate-800">
                  {order.items.map((item: any, idx: number) => (
                     <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="p-3 border-x border-slate-200">
                           <span className="font-bold text-slate-800 uppercase tracking-wider text-xs">{item.productName}</span>
                        </td>
                        <td className="p-3 text-center text-slate-600 border-r border-slate-200">8538</td>
                        <td className="p-3 text-center font-bold border-r border-slate-200">{item.quantity}</td>
                        <td className="p-3 text-right text-slate-800 border-r border-slate-200">₹{(item.price / item.quantity).toFixed(2)}</td>
                        <td className="p-3 text-right font-black text-slate-900 border-r border-slate-200">₹{item.price.toFixed(2)}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* TOTALS & PAYMENT INFO */}
         <div className="flex justify-between items-end border-t border-slate-200 pt-8 mt-auto">
            <div className="w-1/2 p-4 bg-slate-50 border border-slate-200 rounded text-xs leading-relaxed">
               <h4 className="font-black text-slate-800 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1">Bank Details for Wire Transfer</h4>
               <p><span className="text-slate-500 w-24 inline-block font-bold">Bank Name:</span> <span className="font-bold text-slate-800 uppercase">{settings.bankName}</span></p>
               <p><span className="text-slate-500 w-24 inline-block font-bold">A/C Number:</span> <span className="font-black text-slate-900">{settings.accountNo}</span></p>
               <p><span className="text-slate-500 w-24 inline-block font-bold">IFSC Code:</span> <span className="font-bold text-slate-800 uppercase">{settings.ifscCode}</span></p>
               <p><span className="text-slate-500 w-24 inline-block font-bold">Branch:</span> <span className="font-medium text-slate-800">{settings.bankBranch}</span></p>
               <div className="mt-4 p-2 bg-yellow-50 text-yellow-800 text-[10px] font-bold uppercase tracking-widest border border-yellow-200 rounded">
                  Please attach UTR reference #INV-{order.id.toString().padStart(6, '0')} during NEFT/RTGS transfer.
               </div>
            </div>
            
            <div className="w-1/3 bg-slate-800 text-white p-6 rounded shadow-lg">
               <div className="flex justify-between text-xs mb-2 text-slate-300">
                  <span className="uppercase tracking-widest font-bold">Taxable Amount</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-xs mb-2 text-slate-400">
                  <span className="uppercase tracking-widest">CGST (9%)</span>
                  <span>+ ₹{cgst.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-xs mb-4 text-slate-400 border-b border-slate-600 pb-2">
                  <span className="uppercase tracking-widest">SGST (9%)</span>
                  <span>+ ₹{sgst.toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-end">
                  <span className="uppercase tracking-widest font-black text-sm text-accent-orange">Total Due</span>
                  <span className="font-black text-2xl tracking-tighter">₹{finalTotal.toFixed(2)}</span>
               </div>
            </div>
         </div>

         {/* FOOTER SIGNATURE */}
         <div className="mt-12 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest border-t border-slate-200 pt-4">
            This is a computer generated document. No signature is required. <br/>
            Thank you for doing business with {settings.businessName}.
         </div>

       </div>

     </div>
  );
}
