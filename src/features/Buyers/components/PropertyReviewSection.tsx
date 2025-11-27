import { useState } from "react";
import {
  Star,
  MessageSquare,
  TrendingUp,
  Users,
  Edit,
  Trash2,
  Loader2,
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
  onViewAllClick?: () => void; // Navigate to full reviews page
}

const PREVIEW_LIMIT = 3; // Show only 3 reviews in preview

export const PropertyReviewSection: React.FC<PropertyReviewSectionProps> = ({
  propertyId,
  propertyTitle,
  onViewAllClick,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Queries
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
    {
      propertyId,
      userId: user?.id || "",
    },
    { skip: !isAuthenticated || !user?.id }
  );

  const { data: canReviewData } = useCanReviewPropertyQuery(propertyId, {
    skip: !isAuthenticated,
  });

  // Mutations
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

  // Initialize form with user's existing review
  const handleEdit = () => {
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment || "");
      setIsEditing(true);
      setShowReviewForm(true);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      alert("Please login to review this property");
      return;
    }

    if (rating === 0) {
      alert("Please provide a rating");
      return;
    }

    try {
      const reviewData = {
        propertyId,
        rating,
        comment: comment.trim() || undefined,
      };

      if (isEditing && userReview) {
        await updateReview({
          id: userReview.id,
          data: { rating, comment: comment.trim() || undefined },
        }).unwrap();
        alert("Review updated successfully!");
      } else {
        await createReview(reviewData).unwrap();
        alert("Review submitted successfully!");
      }

      // Reset form
      setShowReviewForm(false);
      setIsEditing(false);
      setRating(0);
      setComment("");
    } catch (error: any) {
      alert(error?.data?.error || "Failed to submit review");
    }
  };

  const handleDelete = async () => {
    if (!userReview) return;
    if (!confirm("Are you sure you want to delete your review?")) return;

    try {
      await deleteReview({
        id: userReview.id,
        propertyId,
      }).unwrap();
      alert("Review deleted successfully!");
      setShowReviewForm(false);
      setIsEditing(false);
    } catch (error: any) {
      alert(error?.data?.error || "Failed to delete review");
    }
  };

  const renderStars = (
    rating: number,
    size = "w-5 h-5",
    interactive = false
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={interactive ? () => setRating(star) : undefined}
            disabled={!interactive}
            className={
              interactive ? "transition-transform hover:scale-110" : ""
            }
          >
            <Star
              className={`${size} ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : interactive
                  ? "text-gray-300 hover:text-yellow-200"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const renderStaticStars = (rating: number, size = "w-5 h-5") => {
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

  if (statsLoading || reviewsLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  // Don't show section if no reviews and user can't review
  if (!stats?.totalReviews && !canReview && !userReview) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5" />
              <h2 className="text-2xl font-bold">Property Reviews</h2>
            </div>
            <p className="text-purple-100">{propertyTitle}</p>
          </div>
          {isAuthenticated && canReview && !userReview && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
            >
              <Star className="w-4 h-4" />
              Write Review
            </button>
          )}
          {userReview && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Review
            </button>
          )}
        </div>
      </div>

      {/* Overall Stats */}
      {stats && stats.totalReviews > 0 && (
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {renderStaticStars(stats.averageRating, "w-7 h-7")}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.totalReviews}
              </div>
              <div className="text-sm text-gray-600">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.ratingDistribution[4]?.percentage || 0}%
              </div>
              <div className="text-sm text-gray-600">5-Star Reviews</div>
            </div>
          </div>

          {/* Rating Distribution - Compact */}
          <div className="mt-6">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((ratingValue) => {
                const data = stats.ratingDistribution.find(
                  (d) => d.rating === ratingValue
                );
                const percentage = data?.percentage || 0;
                return (
                  <div key={ratingValue} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium text-gray-700">
                        {ratingValue}
                      </span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
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

      {/* Review Form */}
      {showReviewForm && isAuthenticated && (
        <div className="p-6 bg-purple-50 border-b border-purple-100">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">
            {isEditing ? "Edit Your Review" : "Write a Review"}
          </h3>

          {/* Rating Stars */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating
            </label>
            {renderStars(rating, "w-8 h-8", true)}
            {rating > 0 && (
              <span className="text-sm text-gray-600 mt-2 block">
                {rating}/5 Stars
              </span>
            )}
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Share your experience with this property..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {comment.length}/500 characters
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={creating || updating || rating === 0}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
            >
              {creating || updating ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : isEditing ? (
                "Update Review"
              ) : (
                "Submit Review"
              )}
            </button>
            <button
              onClick={() => {
                setShowReviewForm(false);
                setIsEditing(false);
                setRating(0);
                setComment("");
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            {isEditing && userReview && (
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

      {/* Reviews List - Preview (Limited) */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Recent Reviews
          </h3>
          {stats && stats.totalReviews > PREVIEW_LIMIT && (
            <button
              onClick={onViewAllClick}
              className="text-purple-600 font-semibold text-sm hover:text-purple-700 flex items-center gap-1 transition-colors"
            >
              View All {stats.totalReviews} Reviews
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No reviews yet</p>
            <p className="text-sm text-gray-500">
              Be the first to review this property!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      {review.user.firstName[0]}
                      {review.user.lastName[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {review.user.firstName} {review.user.lastName}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {renderStaticStars(review.rating, "w-4 h-4")}
                        <span className="text-sm text-gray-600">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>

                {review.comment && (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* View All Button - Bottom */}
        {stats && stats.totalReviews > PREVIEW_LIMIT && (
          <div className="mt-6 text-center">
            <button
              onClick={onViewAllClick}
              className="px-6 py-3 bg-purple-50 text-purple-600 rounded-lg font-semibold hover:bg-purple-100 transition-colors inline-flex items-center gap-2"
            >
              View All {stats.totalReviews} Reviews
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Login Prompt */}
      {!isAuthenticated && (
        <div className="p-6 bg-purple-50 border-t border-purple-100">
          <div className="text-center">
            <p className="text-purple-900 font-medium mb-2">
              Want to review this property?
            </p>
            <p className="text-sm text-purple-700 mb-4">
              Sign in to share your experience
            </p>
            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
              Sign In to Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
