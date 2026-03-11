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

const RATING_CATEGORIES = [
  {
    key: "safety",
    label: "Safety",
    icon: Shield,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 border-emerald-100",
  },
  {
    key: "electricity",
    label: "Electricity",
    icon: Zap,
    color: "text-amber-600",
    bgColor: "bg-amber-50 border-amber-100",
  },
  {
    key: "waterSupply",
    label: "Water Supply",
    icon: Droplet,
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-100",
  },
  {
    key: "internet",
    label: "Internet",
    icon: Wifi,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 border-indigo-100",
  },
  {
    key: "transportation",
    label: "Transport",
    icon: Bus,
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-100",
  },
  {
    key: "cleanliness",
    label: "Cleanliness",
    icon: Sparkles,
    color: "text-sky-600",
    bgColor: "bg-sky-50 border-sky-100",
  },
  {
    key: "noiseLevel",
    label: "Noise Level",
    icon: Volume2,
    color: "text-red-500",
    bgColor: "bg-red-50 border-red-100",
  },
  {
    key: "greenery",
    label: "Greenery",
    icon: Trees,
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-100",
  },
] as const;

const RATING_AS_OPTIONS = [
  { value: "resident", label: "Resident" },
  { value: "visitor", label: "Visitor" },
  { value: "agent", label: "Real Estate Agent" },
  { value: "business_owner", label: "Business Owner" },
];

const initRatings = () => ({
  safety: 0,
  electricity: 0,
  waterSupply: 0,
  internet: 0,
  transportation: 0,
  cleanliness: 0,
  noiseLevel: 0,
  greenery: 0,
});

const Stars = ({
  rating,
  size = "w-4 h-4",
}: {
  rating: number;
  size?: string;
}) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`${size} ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
      />
    ))}
  </div>
);

const InteractiveStars = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        type="button"
        onClick={() => onChange(s)}
        className="transition-transform hover:scale-110"
      >
        <Star
          className={`w-6 h-6 ${s <= value ? "fill-amber-400 text-amber-400" : "text-gray-200 hover:text-amber-200"}`}
        />
      </button>
    ))}
  </div>
);

export const LocalityRatingSection: React.FC<LocalityRatingSectionProps> = ({
  localityId,
  localityName,
  cityName,
  onViewAllClick,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [ratingAs, setRatingAs] = useState("resident");
  const [ratings, setRatings] = useState(initRatings());
  const [comment, setComment] = useState("");

  const { data: statsData, isLoading: statsLoading } =
    useGetLocalityRatingStatsQuery(localityId);
  const { data: ratingsData, isLoading: ratingsLoading } =
    useGetLocalityRatingsQuery(localityId);
  const { data: userRatingData } = useGetUserLocalityRatingQuery(
    { localityId, userId: user?.id || "" },
    { skip: !isAuthenticated || !user?.id },
  );
  const [createRating, { isLoading: creating }] =
    useCreateLocalityRatingMutation();
  const [updateRating, { isLoading: updating }] =
    useUpdateLocalityRatingMutation();
  const [deleteRating, { isLoading: deleting }] =
    useDeleteLocalityRatingMutation();

  const stats = statsData?.data;
  const allRatings = ratingsData?.data || [];
  const userRating = userRatingData?.data;
  const preview = allRatings.slice(0, PREVIEW_LIMIT);
  const hasMore = allRatings.length > PREVIEW_LIMIT;

  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setRatings(initRatings());
    setComment("");
  };

  const handleEdit = () => {
    if (!userRating) return;
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
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      showError("Please login to rate this locality");
      return;
    }
    if (!Object.values(ratings).some((r) => r > 0)) {
      showError("Please provide at least one rating");
      return;
    }
    try {
      const payload = {
        localityId,
        ratingAs,
        ...Object.fromEntries(
          Object.entries(ratings).map(([k, v]) => [k, v > 0 ? v : undefined]),
        ),
        comment: comment.trim() || undefined,
      };
      if (isEditing && userRating) {
        await updateRating({ id: userRating.id, data: payload }).unwrap();
        success("Rating updated!");
      } else {
        await createRating(payload).unwrap();
        success("Rating submitted!");
      }
      resetForm();
    } catch {
      // showError(err?.data?.error || "Failed to submit rating");
    }
  };

  const handleDelete = async () => {
    if (!userRating || !confirm("Delete your rating?")) return;
    try {
      await deleteRating(userRating.id).unwrap();
      success("Rating deleted!");
    } catch {
      // showError(err?.data?.error || "Failed to delete rating");
    }
  };

  if (statsLoading || ratingsLoading)
    return (
      <div className="flex justify-center py-10">
        <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="bg-white">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-blue-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          <div>
            <span className="text-sm font-bold text-gray-900">
              Locality Ratings
            </span>
            <span className="text-[11px] text-gray-400 ml-2">
              {localityName}, {cityName}
            </span>
          </div>
        </div>
        {isAuthenticated && (
          <button
            onClick={userRating ? handleEdit : () => setShowForm((s) => !s)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl transition-colors shadow-sm shadow-blue-200"
          >
            {userRating ? (
              <>
                <Edit className="w-3 h-3" /> Edit
              </>
            ) : (
              <>
                <Star className="w-3 h-3" /> Rate
              </>
            )}
          </button>
        )}
      </div>

      {/* ── Overall stats ──────────────────────────────────────────────────── */}
      {stats && stats.totalRatings > 0 && (
        <div className="px-4 sm:px-5 py-4 border-b border-blue-50">
          {/* Big 3 */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center py-3 bg-blue-50/60 border border-blue-100 rounded-xl">
              <Stars rating={stats.overallAverageRating} size="w-3 h-3" />
              <div className="text-xl font-black text-gray-900 mt-1">
                {stats.overallAverageRating.toFixed(1)}
              </div>
              <div className="text-[10px] text-gray-400 font-medium">
                Overall
              </div>
            </div>
            <div className="text-center py-3 bg-blue-50/60 border border-blue-100 rounded-xl">
              <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <div className="text-xl font-black text-gray-900">
                {stats.totalRatings}
              </div>
              <div className="text-[10px] text-gray-400 font-medium">
                Ratings
              </div>
            </div>
            <div className="text-center py-3 bg-blue-50/60 border border-blue-100 rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <div className="text-xl font-black text-gray-900">
                {stats.ratingDistribution[4]?.percentage || 0}%
              </div>
              <div className="text-[10px] text-gray-400 font-medium">
                5-Star
              </div>
            </div>
          </div>

          {/* Distribution bars */}
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((r) => {
              const pct =
                stats.ratingDistribution.find((d) => d.rating === r)
                  ?.percentage || 0;
              return (
                <div key={r} className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-gray-500 w-8 flex items-center gap-0.5">
                    {r}
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-400 w-8 text-right">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Category ratings ───────────────────────────────────────────────── */}
      {stats && stats.totalRatings > 0 && (
        <div className="px-4 sm:px-5 py-4 border-b border-blue-50">
          <h3 className="text-xs font-bold text-gray-900 mb-3">
            Category Ratings
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {RATING_CATEGORIES.map(
              ({ key, label, icon: Icon, color, bgColor }) => {
                const avg =
                  stats.categoryAverages[
                    key as keyof typeof stats.categoryAverages
                  ];
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${bgColor}`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold text-gray-700 truncate">
                        {label}
                      </div>
                      {avg ? (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Stars rating={avg} size="w-2.5 h-2.5" />
                          <span className="text-[10px] font-bold text-gray-600 ml-0.5">
                            {avg.toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400">
                          Not rated
                        </span>
                      )}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      )}

      {/* ── Rating form ────────────────────────────────────────────────────── */}
      {showForm && isAuthenticated && (
        <div className="px-4 sm:px-5 py-4 bg-blue-50/40 border-b border-blue-100">
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-3">
            {isEditing ? "Edit Your Rating" : "Rate This Locality"}
          </h3>

          {/* Rate as */}
          <div className="mb-3">
            <label className="text-[11px] font-semibold text-gray-600 mb-1 block">
              I am a
            </label>
            <select
              value={ratingAs}
              onChange={(e) => setRatingAs(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-blue-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {RATING_AS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {RATING_CATEGORIES.map(({ key, label, icon: Icon, color }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    <span className="text-[11px] font-semibold text-gray-700">
                      {label}
                    </span>
                  </div>
                  {ratings[key as keyof typeof ratings] > 0 && (
                    <span className="text-[10px] font-bold text-gray-500">
                      {ratings[key as keyof typeof ratings]}/5
                    </span>
                  )}
                </div>
                <InteractiveStars
                  value={ratings[key as keyof typeof ratings]}
                  onChange={(v) => setRatings((r) => ({ ...r, [key]: v }))}
                />
              </div>
            ))}
          </div>

          {/* Comment */}
          <div className="mb-3">
            <label className="text-[11px] font-semibold text-gray-600 mb-1 block">
              Comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              placeholder="Share your experience about this locality…"
              className="w-full px-3 py-2 text-xs border border-blue-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Form actions */}
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={creating || updating}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center"
            >
              {creating || updating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isEditing ? (
                "Update Rating"
              ) : (
                "Submit Rating"
              )}
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2.5 bg-white border border-blue-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {isEditing && userRating && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center"
              >
                {deleting ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Reviews list ───────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
            Community Reviews ({allRatings.length})
          </h3>
          {hasMore && (
            <button
              onClick={onViewAllClick}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 transition-colors"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {allRatings.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-500">
              No ratings yet
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Be the first to rate this locality!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {preview.map((r) => (
                <div
                  key={r.id}
                  className="p-3 bg-gray-50/70 hover:bg-blue-50/30 border border-gray-100 hover:border-blue-100 rounded-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-[11px] font-black flex-shrink-0">
                        {r.user.firstName[0]}
                        {r.user.lastName[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">
                          {r.user.firstName} {r.user.lastName}
                        </div>
                        <div className="text-[10px] text-gray-400 capitalize">
                          {r.ratingAs.replace("_", " ")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {r.overallRating && (
                        <div className="flex items-center gap-0.5 justify-end">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-black text-gray-900">
                            {r.overallRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {r.comment && (
                    <p className="text-[11px] text-gray-600 leading-relaxed mb-2">
                      {r.comment}
                    </p>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                    {RATING_CATEGORIES.map(
                      ({ key, label, icon: Icon, color }) => {
                        const val = r[key as keyof typeof r] as number | null;
                        if (!val) return null;
                        return (
                          <div key={key} className="flex items-center gap-1">
                            <Icon
                              className={`w-2.5 h-2.5 flex-shrink-0 ${color}`}
                            />
                            <span className="text-[10px] text-gray-500 truncate">
                              {label}:
                            </span>
                            <span className="text-[10px] font-bold text-gray-700">
                              {val}/5
                            </span>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>
              ))}
            </div>
            {hasMore && (
              <div className="mt-3 text-center">
                <button
                  onClick={onViewAllClick}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-600 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1"
                >
                  View All {allRatings.length} Ratings{" "}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Login prompt ───────────────────────────────────────────────────── */}
      {!isAuthenticated && (
        <div className="px-4 sm:px-5 py-3.5 bg-blue-50/60 border-t border-blue-100 text-center">
          <p className="text-xs font-semibold text-gray-700 mb-0.5">
            Want to rate this locality?
          </p>
          <p className="text-[11px] text-gray-400 mb-2">
            Sign in to share your experience
          </p>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm shadow-blue-200">
            Sign In to Rate
          </button>
        </div>
      )}
    </div>
  );
};
