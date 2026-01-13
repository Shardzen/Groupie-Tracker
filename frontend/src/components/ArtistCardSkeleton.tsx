export default function ArtistCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-fadeIn">
      {/* Image Skeleton */}
      <div className="aspect-square bg-slate-800/50 relative overflow-hidden">
        <div className="skeleton absolute inset-0"></div>
        
        {/* Top badges skeleton */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="skeleton h-7 w-24 rounded-full"></div>
          <div className="skeleton h-8 w-8 rounded-full"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-5 space-y-4">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="skeleton h-7 w-3/4 rounded-lg"></div>
        </div>

        {/* Info items skeleton */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="skeleton h-4 w-4 rounded"></div>
            <div className="skeleton h-4 w-32 rounded"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="skeleton h-4 w-4 rounded"></div>
            <div className="skeleton h-4 w-40 rounded"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="skeleton h-4 w-4 rounded"></div>
            <div className="skeleton h-4 w-36 rounded"></div>
          </div>
        </div>

        {/* Badge skeleton */}
        <div className="skeleton h-8 w-full rounded-lg"></div>

        {/* Button skeleton */}
        <div className="skeleton h-12 w-full rounded-xl"></div>
      </div>
    </div>
  );
}
