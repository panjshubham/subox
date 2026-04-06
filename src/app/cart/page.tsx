"use client";

import { useState, useEffect } from 'react';
import { useCart } from "@/components/CartProvider";
import { Trash2, ShieldCheck, CreditCard, Building2, Package } from "lucide-react";
import Link from "next/link";
import { PressButton } from "@/components/PressButton";
import { motion } from "framer-motion";

export default function CartPage() {
  const { items, removeItem, totalItems, baseTotal, totalDiscount, cartTotal } = useCart();
  const [session, setSession] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/user/profile').then(res => { if(res.ok) res.json().then(setSession); });
    fetch('/api/admin/settings').then(res => { if(res.ok) res.json().then(setSettings); });
  }, []);

  const cgst = cartTotal * 0.09;
  const sgst = cartTotal * 0.09;
  const grandTotal = cartTotal + cgst + sgst;

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayCheckout = async () => {
    if (!session) return alert('Please login to place an order.');
    const isLoaded = await loadRazorpay();
    if (!isLoaded) return alert('Razorpay SDK failed to load. Are you online?');

    const res = await fetch('/api/payment/create-order', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ amount: grandTotal })
    });
    
    if (!res.ok) return alert('Failed to initiate Razorpay order.');
    const data = await res.json();

    const options = {
       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '', // We'll supply this
       amount: Math.round(grandTotal * 100),
       currency: "INR",
       name: settings?.businessName || 'ShuBox Industrial',
       description: 'Premium Industrial Boxes',
       order_id: data.order_id,
       handler: async function (response: any) {
          // Verify with Backend
          const verifyRes = await fetch('/api/payment/verify', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items,
                totalAmount: grandTotal
             })
          });
          if (verifyRes.ok) {
             const verifyData = await verifyRes.json();
             window.location.href = `/order-success?orderId=${verifyData.orderId}`;
          } else {
             alert('Payment verification failed. Please contact support.');
          }
       },
       prefill: {
          name: session.fullName,
          email: session.email || '',
          contact: session.mobile || ''
       },
       theme: {
          color: '#f97316' // accent-orange
       }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Your Cart is Empty</h2>
        <p className="text-slate-500 mb-8">Looks like you haven't added any premium boxes to your cart yet.</p>
        <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }}>
          <Link 
            href="/"
            className="bg-accent-orange text-white px-8 py-3 rounded-lg font-bold hover:bg-accent-orange-hover transition-colors inline-block tracking-wider uppercase text-sm text-center"
          >
            Return to Catalog
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-slate-800 mb-8 uppercase tracking-wide border-b-4 border-accent-orange inline-block pb-2">
        Industrial Checkout
      </h1>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase text-xs tracking-wider border-b border-slate-300">
                  <th className="p-4 font-bold">Product Core</th>
                  <th className="p-4 font-bold text-center">Qty / Tier</th>
                  <th className="p-4 font-bold text-right">Ext. Price</th>
                  <th className="p-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => {
                  const isEligible = item.quantity >= 100;
                  const extPrice = item.price * item.quantity;
                  const discAmt = isEligible ? extPrice * (item.bulkDiscount / 100) : 0;
                  return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-lg">{item.sizeName}</div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">₹{item.price.toFixed(2)} / unit</div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="font-black text-lg text-slate-800 mb-1">{item.quantity}</div>
                      {isEligible ? (
                        <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest block">
                          Tier unlocked ({item.bulkDiscount}% Off)
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">
                          Add {100 - item.quantity} for {item.bulkDiscount}% bulk
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {isEligible && <div className="text-sm text-slate-400 line-through">₹{extPrice.toFixed(2)}</div>}
                      <div className={`font-bold ${isEligible ? 'text-green-700 text-xl' : 'text-slate-800 text-lg'}`}>
                         ₹{(extPrice - discAmt).toFixed(2)}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5 mx-auto" />
                      </button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full lg:w-96">
          <div className="bg-white p-6 rounded-lg shadow border border-slate-200 border-t-8 border-t-slate-800">
            <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-wider">Order Summary</h3>
            
            <div className="space-y-4 text-sm mb-6 border-b border-slate-200 pb-6">
              <div className="flex justify-between text-slate-600 font-bold">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{baseTotal.toFixed(2)}</span>
              </div>
              
              {totalDiscount > 0 && (
                <div className="flex justify-between text-green-700 font-black bg-green-50 p-2 rounded border border-green-200">
                  <span>Bulk Discounts Applied</span>
                  <span>-₹{totalDiscount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-slate-600 font-medium pt-2">
                <span>CGST (9%)</span>
                <span>₹{cgst.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-slate-600 font-medium">
                <span>SGST (9%)</span>
                <span>₹{sgst.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-sm font-black text-slate-800 uppercase tracking-widest">Grand Total</span>
              <span className="text-4xl font-black text-slate-900 tracking-tighter">₹{grandTotal.toFixed(2)}</span>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-200 space-y-4">
              {settings ? (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-accent-orange" />
                    Direct Bank Transfer
                  </h3>
                  <div className="space-y-1 text-xs text-slate-600 font-medium">
                    <p><span className="text-slate-400 inline-block w-20">Bank:</span> {settings.bankName} ({settings.bankBranch})</p>
                    <p><span className="text-slate-400 inline-block w-20">A/C No:</span> <span className="font-bold text-slate-800">{settings.accountNo}</span></p>
                    <p><span className="text-slate-400 inline-block w-20">IFSC:</span> <span className="font-bold text-slate-800 uppercase">{settings.ifscCode}</span></p>
                  </div>
                </div>
              ) : null}

              <PressButton
                 onClick={async () => {
                    if (!session) return alert('Please login to place an order.');
                    const res = await fetch('/api/checkout', {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify({ items, totalAmount: grandTotal, paymentMode: 'BANK_TRANSFER' })
                    });
                    if (res.ok) {
                       const { orderId } = await res.json();
                       window.location.href = `/invoice/${orderId}`;
                    } else {
                       alert('Failed to generate order.');
                    }
                 }}
                 className="w-full bg-slate-900 text-white font-black py-4 rounded flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow uppercase tracking-widest text-sm"
              >
                <Package className="w-5 h-5" />
                Place Order via Bank Transfer
              </PressButton>
              
              <div className="relative flex py-2 items-center">
                 <div className="flex-grow border-t border-slate-200"></div>
                 <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">OR</span>
                 <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <PressButton
                 onClick={handleRazorpayCheckout}
                 className="w-full bg-accent-orange text-white font-black py-4 rounded flex items-center justify-center gap-2 hover:bg-accent-orange-hover transition-colors shadow uppercase tracking-widest text-sm"
              >
                <CreditCard className="w-5 h-5" />
                Secure Checkout (UPI/Cards)
              </PressButton>
              <p className="text-[10px] text-center text-slate-400 mt-4 flex items-center justify-center gap-1 font-bold tracking-widest uppercase">
                <ShieldCheck className="w-3 h-3 text-green-500" />
                256-Bit Encrypted Secure Transaction
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
