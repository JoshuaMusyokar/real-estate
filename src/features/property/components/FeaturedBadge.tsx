import { Star } from "lucide-react";
import type { FC } from "react";

interface FeaturedBadgeProps {
  compact?: boolean;
}

export const FeaturedBadge: FC<FeaturedBadgeProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded text-xs font-bold">
        <Star className="w-3 h-3 fill-current" />
        <span>FEATURED</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-bold shadow-lg">
      <Star className="w-4 h-4 fill-current" />
      <span>FEATURED PROPERTY</span>
    </div>
  );
};
