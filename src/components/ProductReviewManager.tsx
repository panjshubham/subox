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
      <div className="space-y-4">
         {reviews.length === 0 ? (
            <p className="text-slate-500 text-sm italic">Be the first to review this component.</p>
         ) : (
            reviews.map((r: any) => (
               <div key={r.id} className="bg-white p-6 rounded shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0 flex flex-col items-center sm:items-start w-32 border-b sm:border-b-0 sm:border-r border-slate-100 pb-4 sm:pb-0 sm:pr-4">
                     <UserCircle2 className="w-10 h-10 text-slate-300 mb-2" />
                     <span className="font-bold text-xs uppercase tracking-wider text-slate-800 text-center sm:text-left">{r.user?.fullName || "Verified Buyer"}</span>
                     <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest text-center sm:text-left truncate max-w-full">{r.user?.companyName || "Contractor"}</span>
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center gap-1 mb-2">
                        {[1,2,3,4,5].map((s) => (
                           <Star key={s} className={`w-4 h-4 ${s <= r.rating ? 'fill-accent-orange text-accent-orange' : 'text-slate-200'}`} />
                        ))}
                        <span className="ml-2 text-xs text-slate-400 font-bold">{new Date(r.createdAt).toLocaleDateString()}</span>
                     </div>
                     <p className="text-sm text-slate-600 leading-relaxed font-medium">"{r.comment}"</p>
                  </div>
               </div>
            ))
         )}
      </div>
    </div>
  );
}
