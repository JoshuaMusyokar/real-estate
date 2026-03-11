export const CategorySkeletonLoader = () => (
  <section className="py-6 sm:py-10 bg-white border-b border-blue-50">
    <div className="max-w-full mx-auto px-3 sm:px-5 lg:px-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Icon badge */}
          <div className="w-9 h-9 sm:w-14 sm:h-14 bg-blue-100 rounded-xl sm:rounded-2xl animate-pulse flex-shrink-0" />
          <div>
            <div className="w-28 sm:w-48 h-4 sm:h-6 bg-blue-100 rounded-lg animate-pulse mb-1.5 sm:mb-2" />
            <div className="w-36 sm:w-64 h-3 sm:h-4 bg-blue-50 rounded-lg animate-pulse hidden sm:block" />
          </div>
        </div>
        {/* Nav buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-7 h-7 sm:w-10 sm:h-10 bg-blue-50 border border-blue-100 rounded-lg sm:rounded-xl animate-pulse" />
          <div className="w-7 h-7 sm:w-10 sm:h-10 bg-blue-50 border border-blue-100 rounded-lg sm:rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Card skeletons row */}
      <div className="flex gap-3 sm:gap-4 overflow-hidden pb-3 sm:pb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[230px] sm:w-[270px] lg:w-[300px] bg-white rounded-xl sm:rounded-2xl border border-blue-100 overflow-hidden"
          >
            {/* Image */}
            <div className="w-full h-36 sm:h-44 bg-blue-50 animate-pulse" />

            <div className="p-3 sm:p-4">
              {/* Price pill */}
              <div className="w-24 sm:w-28 h-5 sm:h-6 bg-blue-100 rounded-lg animate-pulse mb-2.5" />
              {/* Title */}
              <div className="w-4/5 h-3.5 sm:h-4 bg-blue-50 rounded animate-pulse mb-1.5" />
              <div className="w-3/5 h-3.5 sm:h-4 bg-blue-50 rounded animate-pulse mb-3" />
              {/* Location */}
              <div className="w-2/3 h-3 sm:h-3.5 bg-blue-50 rounded animate-pulse mb-3" />
              {/* Feature chips */}
              <div className="flex gap-1.5 mb-3">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="w-14 sm:w-16 h-5 sm:h-6 bg-blue-50 rounded-md animate-pulse"
                  />
                ))}
              </div>
              {/* CTA */}
              <div className="w-full h-7 sm:h-9 bg-blue-100 rounded-lg sm:rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
