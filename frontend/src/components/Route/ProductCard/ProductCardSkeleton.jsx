import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/70 p-3.5 sm:p-5 relative flex flex-col justify-between overflow-hidden animate-pulse">
      {/* Top Badge Skeleton */}
      <div className="flex items-center justify-between mb-2">
        <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
        <div className="h-8 w-8 bg-slate-200 rounded-2xl"></div>
      </div>

      {/* Image Stage Skeleton */}
      <div className="w-full h-[140px] sm:h-[190px] rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200/60 mb-3 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-slate-300/50"></div>
      </div>

      {/* Meta Skeleton */}
      <div className="space-y-2 mb-2">
        <div className="h-3 w-20 bg-slate-200 rounded"></div>
        <div className="h-4 w-full bg-slate-200 rounded"></div>
        <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
      </div>

      {/* Stock & Sales Pill Skeleton */}
      <div className="flex items-center justify-between my-2">
        <div className="h-4 w-16 bg-slate-100 rounded-full"></div>
        <div className="h-4 w-14 bg-slate-100 rounded-full"></div>
      </div>

      {/* Bottom Price & Button Skeleton */}
      <div className="pt-2.5 sm:pt-3 border-t border-slate-100 flex items-center justify-between mt-auto gap-2">
        <div className="space-y-1">
          <div className="h-2.5 w-8 bg-slate-200 rounded"></div>
          <div className="h-5 w-14 bg-slate-300 rounded"></div>
        </div>
        <div className="h-9 w-16 sm:w-20 bg-slate-300 rounded-2xl"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
