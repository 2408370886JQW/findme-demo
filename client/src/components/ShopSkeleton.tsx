import { cn } from "@/lib/utils";

export function ShopSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {/* Image Gallery Skeleton */}
      <div className="flex gap-1 h-28 overflow-hidden rounded-lg">
        <div className="flex-1 bg-gray-200" />
        <div className="w-1/3 hidden sm:block bg-gray-200 opacity-90" />
        <div className="w-1/3 hidden sm:block bg-gray-200 opacity-80" />
      </div>

      {/* Content Skeleton */}
      <div>
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
        
        {/* Info Row */}
        <div className="flex items-center gap-2 mb-2">
          <div className="h-3 bg-gray-200 rounded w-8" />
          <div className="h-3 bg-gray-200 rounded w-12" />
          <div className="h-3 bg-gray-200 rounded w-10" />
        </div>

        {/* Tags */}
        <div className="flex gap-1 mb-2">
          <div className="h-4 bg-gray-200 rounded w-12" />
          <div className="h-4 bg-gray-200 rounded w-10" />
          <div className="h-4 bg-gray-200 rounded w-14" />
        </div>

        {/* Deals Skeleton */}
        <div className="mb-2 space-y-1">
          <div className="h-8 bg-gray-100 rounded w-full border border-gray-200" />
        </div>

        {/* Review Quote Skeleton */}
        <div className="h-10 bg-gray-100 rounded-lg w-full" />
        
        {/* Bottom Info Skeleton */}
        <div className="flex items-center justify-between mt-2">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      </div>
      
      {/* Divider */}
      <div className="h-px bg-gray-100 w-full mt-2" />
    </div>
  );
}
