"use client";

import { useState } from 'react';
import { Star, UserCircle2 } from 'lucide-react';

export function ProductReviewManager({ productId, initialReviews, sessionUser }: any) {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUser) return setError("You must be logged in to review.");
    
    setSubmitting(true);
    setError("");

    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment })
    });

    if (res.ok) {
      const newReview = await res.json();
      setReviews([newReview, ...reviews]);
      setComment("");
    } else {
      const data = await res.json();
      setError(data.error || "Failed to submit review.");
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0 
     ? (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1)
     : "No ratings yet";

  return (
    <div className="mt-12">
      <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest mb-6 border-b-2 border-slate-200 pb-2">
         Industrial Reviews & Ratings ({avgRating}{reviews.length > 0 && " / 5.0"})
      </h3>

      {/* Review Submission Form */}
      {sessionUser ? (
         <form onSubmit={handleSubmit} className="mb-10 bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h4 className="font-bold uppercase tracking-widest text-sm mb-4 text-slate-700">Write a Review</h4>
            {error && <p className="text-red-500 text-xs font-bold mb-2 uppercase tracking-wide">{error}</p>}
            
            <div className="flex items-center gap-2 mb-4">
               <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Rating:</span>
               {[1,2,3,4,5].map((star) => (
                  <button type="button" key={star} onClick={() => setRating(star)}>
                     <Star className={`w-6 h-6 ${star <= rating ? 'fill-accent-orange text-accent-orange' : 'text-slate-300'}`} />
                  </button>
               ))}
            </div>

            <textarea 
               value={comment}
               onChange={(e) => setComment(e.target.value)}
               placeholder="Quality of steel? Delivery speed? Let other contractors know..."
               className="w-full p-4 text-sm border border-slate-300 rounded focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none bg-white mb-4"
               rows={3}
            />

            <button disabled={submitting} type="submit" className="bg-slate-900 text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded shadow hover:bg-slate-800 transition">
               {submitting ? "Submitting..." : "Post Review"}
            </button>
         </form>
      ) : (
         <div className="mb-10 bg-orange-50 text-orange-800 p-4 rounded text-sm font-bold uppercase tracking-widest border border-orange-200">
            Please log in to leave a review.
         </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
         {reviews.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center group hover:bg-white transition-all">
               <Star className="w-12 h-12 text-slate-200 mx-auto mb-4 group-hover:text-accent-orange transition-colors" />
               <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No project feedback yet</p>
               <p className="text-[10px] text-slate-400 mt-1 uppercase">Be the first to certify the quality of this enclosure</p>
            </div>
         ) : (
            reviews.map((r: any) => (
               <div key={r.id} className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 flex flex-row md:flex-col items-center md:items-start gap-4 md:w-40 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                     <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg border border-slate-700 uppercase">
                        {r.user?.fullName?.charAt(0) || "U"}
                     </div>
                     <div className="flex flex-col">
                        <span className="font-black text-xs uppercase tracking-wider text-slate-800 leading-tight">
                           {r.user?.fullName || "Verified Buyer"}
                        </span>
                        <span className="text-[10px] uppercase text-accent-orange font-black tracking-widest mt-1">
                           {r.user?.companyName || "Certified Contractor"}
                        </span>
                     </div>
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center gap-1 mb-3">
                        {[1,2,3,4,5].map((s) => (
                           <Star key={s} className={`w-4 h-4 ${s <= r.rating ? 'fill-accent-orange text-accent-orange' : 'text-slate-200'}`} />
                        ))}
                        <span className="ml-3 text-xs text-slate-400 font-bold uppercase tracking-widest">
                           {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                     </div>
                     <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                        "{r.comment}"
                     </p>
                  </div>
               </div>
            ))
         )}
      </div>
    </div>
  );
}
