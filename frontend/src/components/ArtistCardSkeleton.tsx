export default function ArtistCardSkeleton() {
  return (
    <div className="card-artistic animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[3/4] skeleton-artistic rounded-t-artistic relative overflow-hidden">
        <div className="animate-shimmer-artistic absolute inset-0"></div>
        
        {/* Top badges skeleton */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="skeleton-artistic h-8 w-20 rounded-full"></div>
          <div className="skeleton-artistic h-9 w-9 rounded-full"></div>
        </div>

        {/* Bottom title skeleton */}
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <div className="skeleton-artistic h-7 w-3/4 rounded-xl"></div>
          <div className="skeleton-artistic h-4 w-1/2 rounded-lg"></div>
        </div>
      </div>

      {/* No bottom content for skeleton since card only shows on hover */}
    </div>
  );
}
