export const CategorySkeletonLoader = () => (
  <section className="py-12 bg-white">
    <div className="max-w-full mx-auto px-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl animate-pulse" />
          <div>
            <div className="w-48 h-8 bg-gray-200 rounded-lg animate-pulse mb-2" />
            <div className="w-64 h-4 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
          <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
          <div className="w-32 h-12 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Properties Skeleton */}
      <div className="flex gap-6 overflow-hidden pb-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="flex-shrink-0 w-[320px] bg-white rounded-3xl border border-gray-200 overflow-hidden animate-pulse"
          >
            {/* Image Skeleton */}
            <div className="w-full h-[200px] bg-gray-200" />

            <div className="p-6">
              {/* Title Skeleton */}
              <div className="w-3/4 h-6 bg-gray-200 rounded-lg mb-3" />

              {/* Location Skeleton */}
              <div className="w-1/2 h-4 bg-gray-200 rounded-lg mb-4" />

              {/* Price Skeleton */}
              <div className="w-2/3 h-8 bg-gray-200 rounded-lg mb-4" />

              {/* Features Skeleton */}
              <div className="flex gap-4 mb-6">
                <div className="w-16 h-6 bg-gray-200 rounded-lg" />
                <div className="w-16 h-6 bg-gray-200 rounded-lg" />
                <div className="w-16 h-6 bg-gray-200 rounded-lg" />
              </div>

              {/* Button Skeleton */}
              <div className="w-full h-12 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
