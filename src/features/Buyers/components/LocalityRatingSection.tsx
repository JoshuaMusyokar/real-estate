import { useState } from "react";
import {
  Star,
  MapPin,
  Shield,
  Zap,
  Droplet,
  Wifi,
  Bus,
  Sparkles,
  Volume2,
  Trees,
  TrendingUp,
  Users,
  MessageSquare,
  Edit,
  Trash2,
  Loader2,
  ChevronRight,
} from "lucide-react";
import {
  useGetLocalityRatingStatsQuery,
  useGetLocalityRatingsQuery,
  useGetUserLocalityRatingQuery,
  useCreateLocalityRatingMutation,
  useUpdateLocalityRatingMutation,
  useDeleteLocalityRatingMutation,
} from "../../../services/locationApi";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../hooks/useToast";

interface LocalityRatingSectionProps {
  localityId: string;
  localityName: string;
  cityName: string;
  onViewAllClick?: () => void;
}

const PREVIEW_LIMIT = 3;

// Rating categories with icons and colors
const RATING_CATEGORIES = [
  {
    key: "safety",
    label: "Safety",
    icon: Shield,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    key: "electricity",
    label: "Electricity",
    icon: Zap,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    key: "waterSupply",
    label: "Water Supply",
    icon: Droplet,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    key: "internet",
    label: "Internet",
    icon: Wifi,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    key: "transportation",
    label: "Transportation",
    icon: Bus,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    key: "cleanliness",
    label: "Cleanliness",
    icon: Sparkles,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
  {
    key: "noiseLevel",
    label: "Noise Level",
    icon: Volume2,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    key: "greenery",
    label: "Greenery",
    icon: Trees,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
] as const;

const RATING_AS_OPTIONS = [
  { value: "resident", label: "Resident" },
  { value: "visitor", label: "Visitor" },
  { value: "agent", label: "Real Estate Agent" },
  { value: "business_owner", label: "Business Owner" },
];

export const LocalityRatingSection: React.FC<LocalityRatingSectionProps> = ({
  localityId,
  localityName,
  cityName,
  onViewAllClick,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { success, error: showError } = useToast();
  // Form state
  const [ratingAs, setRatingAs] = useState("resident");
  const [ratings, setRatings] = useState({
    safety: 0,
    electricity: 0,
    waterSupply: 0,
    internet: 0,
    transportation: 0,
    cleanliness: 0,
    noiseLevel: 0,
    greenery: 0,
  });
  const [comment, setComment] = useState("");

  // Queries
  const { data: statsData, isLoading: statsLoading } =
    useGetLocalityRatingStatsQuery(localityId);
  const { data: ratingsData, isLoading: ratingsLoading } =
    useGetLocalityRatingsQuery(localityId);
  const { data: userRatingData } = useGetUserLocalityRatingQuery(
    {
      localityId,
      userId: user?.id || "",
    },
    { skip: !isAuthenticated || !user?.id }
  );

  // Mutations
  const [createRating, { isLoading: creating }] =
    useCreateLocalityRatingMutation();
  const [updateRating, { isLoading: updating }] =
    useUpdateLocalityRatingMutation();
  const [deleteRating, { isLoading: deleting }] =
    useDeleteLocalityRatingMutation();

  const stats = statsData?.data;
  const allRatings = ratingsData?.data || [];
  const userRating = userRatingData?.data;

  // Limit ratings for preview
  const displayedRatings = allRatings.slice(0, PREVIEW_LIMIT);
  const hasMoreRatings = allRatings.length > PREVIEW_LIMIT;

  // Initialize form with user's existing rating
  const handleEdit = () => {
    if (userRating) {
      setRatingAs(userRating.ratingAs);
      setRatings({
        safety: userRating.safety || 0,
        electricity: userRating.electricity || 0,
        waterSupply: userRating.waterSupply || 0,
        internet: userRating.internet || 0,
        transportation: userRating.transportation || 0,
        cleanliness: userRating.cleanliness || 0,
        noiseLevel: userRating.noiseLevel || 0,
        greenery: userRating.greenery || 0,
      });
      setComment(userRating.comment || "");
      setIsEditing(true);
      setShowRatingForm(true);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      showError("Please login to rate this locality");
      return;
    }

    // Check if at least one rating is provided
    const hasRating = Object.values(ratings).some((r) => r > 0);
    if (!hasRating) {
      showError("Please provide at least one rating");
      return;
    }

    try {
      const ratingData = {
        localityId,
        ratingAs,
        ...Object.fromEntries(
          Object.entries(ratings).map(([key, value]) => [
            key,
            value > 0 ? value : undefined,
          ])
        ),
        comment: comment.trim() || undefined,
      };

      if (isEditing && userRating) {
        await updateRating({
          id: userRating.id,
          data: ratingData,
        }).unwrap();
        success("Rating updated successfully!");
      } else {
        await createRating(ratingData).unwrap();
        success("Rating submitted successfully!");
      }

      // Reset form
      setShowRatingForm(false);
      setIsEditing(false);
      setRatings({
        safety: 0,
        electricity: 0,
        waterSupply: 0,
        internet: 0,
        transportation: 0,
        cleanliness: 0,
        noiseLevel: 0,
        greenery: 0,
      });
      setComment("");
    } catch (error: any) {
      showError(error?.data?.error || "Failed to submit rating");
    }
  };

  const handleDelete = async () => {
    if (!userRating) return;
    if (!confirm("Are you sure you want to delete your rating?")) return;

    try {
      await deleteRating(userRating.id).unwrap();
      success("Rating deleted successfully!");
    } catch (error: any) {
      showError(error?.data?.error || "Failed to delete rating");
    }
  };

  const renderStars = (rating: number, size = "w-5 h-5") => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= Math.round(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderInteractiveStars = (
    category: keyof typeof ratings,
    size = "w-6 h-6"
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRatings({ ...ratings, [category]: star })}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`${size} ${
                star <= ratings[category]
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-200"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (statsLoading || ratingsLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5" />
              <h2 className="text-2xl font-bold">Locality Ratings</h2>
            </div>
            <p className="text-blue-100">
              {localityName}, {cityName}
            </p>
          </div>
          {isAuthenticated && (
            <button
              onClick={() => {
                if (userRating) {
                  handleEdit();
                } else {
                  setShowRatingForm(!showRatingForm);
                }
              }}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              {userRating ? (
                <>
                  <Edit className="w-4 h-4" />
                  Edit Your Rating
                </>
              ) : (
                <>
                  <Star className="w-4 h-4" />
                  Rate Locality
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Overall Stats */}
      {stats && stats.totalRatings > 0 && (
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {renderStars(stats.overallAverageRating, "w-7 h-7")}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.overallAverageRating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Overall Rating</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.totalRatings}
              </div>
              <div className="text-sm text-gray-600">Total Ratings</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.ratingDistribution[4]?.percentage || 0}%
              </div>
              <div className="text-sm text-gray-600">5-Star Ratings</div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Rating Distribution
            </h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const data = stats.ratingDistribution.find(
                  (d) => d.rating === rating
                );
                const percentage = data?.percentage || 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-12">
                      {rating} star
                    </span>
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Category Ratings */}
      {stats && stats.totalRatings > 0 && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">
            Category Ratings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RATING_CATEGORIES.map((category) => {
              const avgRating =
                stats.categoryAverages[
                  category.key as keyof typeof stats.categoryAverages
                ];
              const Icon = category.icon;
              return (
                <div
                  key={category.key}
                  className={`${category.bgColor} rounded-lg p-4`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${category.color}`} />
                      <span className="font-semibold text-gray-900">
                        {category.label}
                      </span>
                    </div>
                    {avgRating && (
                      <span className="text-lg font-bold text-gray-900">
                        {avgRating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  {avgRating ? (
                    renderStars(avgRating, "w-4 h-4")
                  ) : (
                    <span className="text-sm text-gray-500">Not rated yet</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rating Form */}
      {showRatingForm && isAuthenticated && (
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">
            {isEditing ? "Edit Your Rating" : "Rate This Locality"}
          </h3>

          {/* Rating As Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rate as
            </label>
            <select
              value={ratingAs}
              onChange={(e) => setRatingAs(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {RATING_AS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Ratings */}
          <div className="space-y-4 mb-6">
            {RATING_CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.key}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${category.color}`} />
                      <span className="font-medium text-gray-900">
                        {category.label}
                      </span>
                    </div>
                    {ratings[category.key as keyof typeof ratings] > 0 && (
                      <span className="text-sm font-semibold text-gray-700">
                        {ratings[category.key as keyof typeof ratings]}/5
                      </span>
                    )}
                  </div>
                  {renderInteractiveStars(category.key as keyof typeof ratings)}
                </div>
              );
            })}
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Share your experience about this locality..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={creating || updating}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {creating || updating ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : isEditing ? (
                "Update Rating"
              ) : (
                "Submit Rating"
              )}
            </button>
            <button
              onClick={() => {
                setShowRatingForm(false);
                setIsEditing(false);
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            {isEditing && userRating && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 transition-colors"
              >
                {deleting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* User Ratings List */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Community Reviews ({allRatings.length})
          </h3>
          {hasMoreRatings && (
            <button
              onClick={onViewAllClick}
              className="text-blue-600 font-semibold text-sm hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              View All {allRatings.length} Ratings
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {allRatings.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No ratings yet</p>
            <p className="text-sm text-gray-500">
              Be the first to rate this locality!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {displayedRatings.map((rating) => (
                <div
                  key={rating.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                        {rating.user.firstName[0]}
                        {rating.user.lastName[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {rating.user.firstName} {rating.user.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {rating.ratingAs.replace("_", " ")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {rating.overallRating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-gray-900">
                            {rating.overallRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {rating.comment && (
                    <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                      {rating.comment}
                    </p>
                  )}

                  {/* Individual Category Ratings */}
                  <div className="grid grid-cols-2 gap-2">
                    {RATING_CATEGORIES.map((category) => {
                      const value = rating[
                        category.key as keyof typeof rating
                      ] as number | null;
                      if (!value) return null;
                      const Icon = category.icon;
                      return (
                        <div
                          key={category.key}
                          className="flex items-center gap-2 text-xs"
                        >
                          <Icon className={`w-3 h-3 ${category.color}`} />
                          <span className="text-gray-600">
                            {category.label}:
                          </span>
                          <span className="font-semibold text-gray-900">
                            {value}/5
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button - Bottom */}
            {hasMoreRatings && (
              <div className="mt-6 text-center">
                <button
                  onClick={onViewAllClick}
                  className="px-6 py-3 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-colors inline-flex items-center gap-2"
                >
                  View All {allRatings.length} Ratings
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Login Prompt */}
      {!isAuthenticated && (
        <div className="p-6 bg-blue-50 border-t border-blue-100">
          <div className="text-center">
            <p className="text-blue-900 font-medium mb-2">
              Want to rate this locality?
            </p>
            <p className="text-sm text-blue-700 mb-4">
              Sign in to share your experience with the community
            </p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Sign In to Rate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
