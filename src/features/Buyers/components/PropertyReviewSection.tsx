import { useState } from "react";
import {
  Star,
  MessageSquare,
  TrendingUp,
  Users,
  Edit,
  Trash2,
  ChevronRight,
} from "lucide-react";
import {
  useGetPropertyReviewsQuery,
  useGetUserPropertyReviewQuery,
  useGetPropertyReviewStatsQuery,
  useCreatePropertyReviewMutation,
  useUpdatePropertyReviewMutation,
  useDeletePropertyReviewMutation,
  useCanReviewPropertyQuery,
} from "../../../services/propertyReviewApi";
import { useAuth } from "../../../hooks/useAuth";

interface PropertyReviewSectionProps {
  propertyId: string;
  propertyTitle: string;
  onViewAllClick?: () => void;
}

const PREVIEW_LIMIT = 3;

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
  size = "w-7 h-7",
}: {
  value: number;
  onChange: (v: number) => void;
  size?: string;
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
          className={`${size} ${s <= value ? "fill-amber-400 text-amber-400" : "text-gray-200 hover:text-amber-200"}`}
        />
      </button>
    ))}
  </div>
);

export const PropertyReviewSection: React.FC<PropertyReviewSectionProps> = ({
  propertyId,
  propertyTitle,
  onViewAllClick,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: statsData, isLoading: statsLoading } =
    useGetPropertyReviewStatsQuery(propertyId);
  const { data: reviewsData, isLoading: reviewsLoading } =
    useGetPropertyReviewsQuery({
      propertyId,
      limit: PREVIEW_LIMIT,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  const { data: userReviewData } = useGetUserPropertyReviewQuery(
    { propertyId, userId: user?.id || "" },
    { skip: !isAuthenticated || !user?.id },
  );
  const { data: canReviewData } = useCanReviewPropertyQuery(propertyId, {
    skip: !isAuthenticated,
  });

  const [createReview, { isLoading: creating }] =
    useCreatePropertyReviewMutation();
  const [updateReview, { isLoading: updating }] =
    useUpdatePropertyReviewMutation();
  const [deleteReview, { isLoading: deleting }] =
    useDeletePropertyReviewMutation();

  const stats = statsData?.data;
  const reviews = reviewsData?.data || [];
  const userReview = userReviewData?.data;
  const canReview = canReviewData?.data?.canReview;

  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setRating(0);
    setComment("");
  };

  const handleEdit = () => {
    if (!userReview) return;
    setRating(userReview.rating);
    setComment(userReview.comment || "");
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      alert("Please login to review");
      return;
    }
    if (!rating) {
      alert("Please select a rating");
      return;
    }
    try {
      if (isEditing && userReview) {
        await updateReview({
          id: userReview.id,
          data: { rating, comment: comment.trim() || undefined },
        }).unwrap();
        alert("Review updated!");
      } else {
        await createReview({
          propertyId,
          rating,
          comment: comment.trim() || undefined,
        }).unwrap();
        alert("Review submitted!");
      }
      resetForm();
    } catch {
      // alert(err?.data?.error || "Failed to submit review");
    }
  };

  const handleDelete = async () => {
    if (!userReview || !confirm("Delete your review?")) return;
    try {
      await deleteReview({ id: userReview.id, propertyId }).unwrap();
      alert("Review deleted!");
      resetForm();
    } catch {
      // alert(err?.data?.error || "Failed to delete review");
    }
  };

  if (statsLoading || reviewsLoading)
    return (
      <div className="flex justify-center py-10">
        <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!stats?.totalReviews && !canReview && !userReview) return null;

  return (
    <div className="bg-white">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-blue-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          <div>
            <span className="text-sm font-bold text-gray-900">
              Property Reviews
            </span>
            <span className="text-[11px] text-gray-400 ml-2 truncate hidden sm:inline">
              {propertyTitle}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated && canReview && !userReview && (
            <button
              onClick={() => setShowForm((s) => !s)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl transition-colors shadow-sm shadow-blue-200"
            >
              <Star className="w-3 h-3" /> Write Review
            </button>
          )}
          {userReview && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-[11px] font-bold rounded-xl transition-colors"
            >
              <Edit className="w-3 h-3" /> Edit
            </button>
          )}
        </div>
      </div>

      {/* ── Overall stats ──────────────────────────────────────────────────── */}
      {stats && stats.totalReviews > 0 && (
        <div className="px-4 sm:px-5 py-4 border-b border-blue-50">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center py-3 bg-blue-50/60 border border-blue-100 rounded-xl">
              <Stars rating={stats.averageRating} size="w-3 h-3" />
              <div className="text-xl font-black text-gray-900 mt-1">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="text-[10px] text-gray-400 font-medium">
                Average
              </div>
            </div>
            <div className="text-center py-3 bg-blue-50/60 border border-blue-100 rounded-xl">
              <Users className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <div className="text-xl font-black text-gray-900">
                {stats.totalReviews}
              </div>
              <div className="text-[10px] text-gray-400 font-medium">
                Reviews
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

      {/* ── Review form ────────────────────────────────────────────────────── */}
      {showForm && isAuthenticated && (
        <div className="px-4 sm:px-5 py-4 bg-blue-50/40 border-b border-blue-100">
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-3">
            {isEditing ? "Edit Your Review" : "Write a Review"}
          </h3>

          {/* Star picker */}
          <div className="mb-3">
            <label className="text-[11px] font-semibold text-gray-600 mb-1.5 block">
              Your Rating
            </label>
            <InteractiveStars value={rating} onChange={setRating} />
            {rating > 0 && (
              <span className="text-[11px] text-gray-500 mt-1 block">
                {rating}/5 Stars
              </span>
            )}
          </div>

          {/* Comment */}
          <div className="mb-3">
            <label className="text-[11px] font-semibold text-gray-600 mb-1 block">
              Your Review (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Share your experience with this property…"
              className="w-full px-3 py-2 text-xs border border-blue-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="text-[10px] text-gray-400 text-right mt-0.5">
              {comment.length}/500
            </div>
          </div>

          {/* Form actions */}
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={creating || updating || !rating}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center"
            >
              {creating || updating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isEditing ? (
                "Update Review"
              ) : (
                "Submit Review"
              )}
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2.5 bg-white border border-blue-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            {isEditing && userReview && (
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
            Recent Reviews
          </h3>
          {stats && stats.totalReviews > PREVIEW_LIMIT && (
            <button
              onClick={onViewAllClick}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-xs font-semibold text-gray-500">
              No reviews yet
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Be the first to review this property!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-3 bg-gray-50/70 hover:bg-blue-50/30 border border-gray-100 hover:border-blue-100 rounded-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-[11px] font-black flex-shrink-0">
                        {review.user.firstName[0]}
                        {review.user.lastName[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">
                          {review.user.firstName} {review.user.lastName}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Stars rating={review.rating} size="w-3 h-3" />
                          <span className="text-[10px] text-gray-500">
                            {review.rating}/5
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {stats && stats.totalReviews > PREVIEW_LIMIT && (
              <div className="mt-3 text-center">
                <button
                  onClick={onViewAllClick}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-600 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1"
                >
                  View All {stats.totalReviews} Reviews{" "}
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
            Want to review this property?
          </p>
          <p className="text-[11px] text-gray-400 mb-2">
            Sign in to share your experience
          </p>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm shadow-blue-200">
            Sign In to Review
          </button>
        </div>
      )}
    </div>
  );
};
