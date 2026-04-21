export function ProductSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
      <div className="aspect-square skeleton-shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 skeleton-shimmer rounded" />
        <div className="h-3 w-1/2 skeleton-shimmer rounded" />
        <div className="h-6 w-1/3 skeleton-shimmer rounded mt-2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => <ProductSkeleton key={i} />)}
    </div>
  );
}
