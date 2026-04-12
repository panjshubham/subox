"use client";

import { useState } from "react";
import { ShoppingCart, MessageSquare, X, Loader2, Plus, Minus, CheckCircle2 } from "lucide-react";
import { useCart } from "./CartProvider";
import toast from "react-hot-toast";

type Product = {
  id: number;
  name: string;
  price: number;
  mrp: number;
  inStock: boolean;
  bulkDiscount: number;
  material: string;
  moduleSize: string;
};

export function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ name: "", phone: "", qty: "", company: "" });
  const [quoteStatus, setQuoteStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem({
      id: `${product.id}-${Date.now()}`,
      sizeId: product.id,
      sizeName: product.name,
      price: product.price,
      quantity,
      bulkDiscount: product.bulkDiscount,
    });
    toast.success(`${quantity}x ${product.name} added to cart!`, {
      icon: "🛒",
      style: { fontWeight: "bold", fontSize: "14px" },
    });
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(quoteForm.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    setQuoteStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: quoteForm.name,
          phone: quoteForm.phone,
          company: quoteForm.company || "Not specified",
          message: `BULK QUOTE REQUEST\nProduct: ${product.name} (${product.material} • ${product.moduleSize})\nUnit Price: ₹${product.price}\nQuantity Required: ${quoteForm.qty} units\nEstimated Value: ₹${(product.price * Number(quoteForm.qty)).toLocaleString('en-IN')}\n\nPlease contact for bulk pricing.`,
        }),
      });
      if (res.ok) {
        setQuoteStatus("success");
        toast.success("Bulk quote request sent! We'll contact you within 24 hours.", { duration: 5000 });
      } else {
        setQuoteStatus("error");
        toast.error("Failed to send quote request. Please try WhatsApp.");
      }
    } catch {
      setQuoteStatus("error");
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <>
      {/* Quantity Selector + Add to Cart */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6">
        {/* Quantity */}
        <div className="flex items-center border-2 border-slate-200 rounded-md overflow-hidden shrink-0">
          <button
            type="button"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="px-3 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-800 font-bold"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-3 font-black text-slate-900 text-lg tabular-nums min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(q => q + 1)}
            className="px-3 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-800 font-bold"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="flex-1 flex items-center justify-center gap-2 bg-accent-orange hover:bg-accent-orange-hover disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black py-3 px-6 rounded-md uppercase tracking-widest text-sm transition-colors shadow-lg shadow-orange-500/20"
        >
          <ShoppingCart className="w-5 h-5" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>

      {/* Bulk Quote Button */}
      <button
        type="button"
        onClick={() => { setShowModal(true); setQuoteStatus("idle"); }}
        className="mt-3 w-full flex items-center justify-center gap-2 border-2 border-slate-800 hover:bg-slate-800 hover:text-white text-slate-800 font-black py-3 px-6 rounded-md uppercase tracking-widest text-sm transition-all"
      >
        <MessageSquare className="w-5 h-5" />
        Request Bulk Quote (100+ units)
      </button>

      {/* Bulk Quote Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b-4 border-accent-orange">
              <div>
                <h3 className="text-white font-black uppercase tracking-widest">Bulk Quote Request</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">{product.name}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {quoteStatus === "success" ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-black text-slate-800 uppercase tracking-widest mb-2">Quote Sent!</h4>
                <p className="text-slate-500 text-sm font-medium mb-6">
                  Our team will contact you within 24 hours with the best bulk pricing.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-slate-900 text-white font-black uppercase tracking-widest px-6 py-2 rounded text-sm"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Name *</label>
                    <input
                      required
                      type="text"
                      value={quoteForm.name}
                      onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full border border-slate-300 rounded px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone *</label>
                    <input
                      required
                      type="tel"
                      value={quoteForm.phone}
                      onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                      placeholder="10-digit number"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      className="w-full border border-slate-300 rounded px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Company (Optional)</label>
                  <input
                    type="text"
                    value={quoteForm.company}
                    onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                    placeholder="Enterprise name"
                    className="w-full border border-slate-300 rounded px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quantity Required *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={quoteForm.qty}
                    onChange={(e) => setQuoteForm({ ...quoteForm, qty: e.target.value })}
                    placeholder="e.g. 500 units"
                    className="w-full border border-slate-300 rounded px-3 py-2 text-sm font-black focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-accent-orange"
                  />
                  {quoteForm.qty && Number(quoteForm.qty) > 0 && (
                    <p className="text-[10px] font-bold text-accent-orange mt-1 uppercase tracking-wider">
                      Estimated value: ₹{(product.price * Number(quoteForm.qty)).toLocaleString('en-IN')} (before bulk discount)
                    </p>
                  )}
                </div>

                {quoteStatus === "error" && (
                  <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center">
                    Failed to send. Try WhatsApp instead.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={quoteStatus === "submitting"}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-black uppercase tracking-widest py-3 rounded transition-colors flex items-center justify-center gap-2"
                >
                  {quoteStatus === "submitting" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : (
                    "Send Bulk Quote Request"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
