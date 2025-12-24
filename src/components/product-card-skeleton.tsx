"use client";

/**
 * Skeleton loading component for ProductCard
 * Displays animated placeholder while products are loading
 */
export default function ProductCardSkeleton() {
  return (
    <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="relative aspect-square p-4 bg-white">
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          <div className="h-5 w-12 bg-gray-200 rounded" />
        </div>
        <div className="w-full h-full bg-gray-200 rounded" />
      </div>

      {/* Content skeleton */}
      <div className="p-3">
        {/* Product name */}
        <div className="space-y-1.5 min-h-[40px]">
          <div className="h-3.5 bg-gray-200 rounded w-full" />
          <div className="h-3.5 bg-gray-200 rounded w-3/4" />
        </div>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <div className="h-5 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>

        {/* Specs */}
        <div className="mt-2 flex gap-1">
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-5 bg-gray-200 rounded w-14" />
        </div>

        {/* Buttons */}
        <div className="mt-3 flex gap-2">
          <div className="flex-1 h-9 bg-gray-200 rounded-lg" />
          <div className="flex-1 h-9 bg-gray-200 rounded-lg" />
        </div>

        {/* Rating row */}
        <div className="mt-3 pt-2 flex items-center justify-between border-t border-gray-100">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-14" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton grid for multiple loading cards
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
