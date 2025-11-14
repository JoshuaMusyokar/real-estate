import { CheckCircle, XCircle } from "lucide-react";
import type { Property } from "../../types";
import { useReviewPropertyMutation } from "../../services/propertyApi";
import { useState } from "react";

// Quick Review Action Component (for inline reviews)
interface QuickReviewActionsProps {
  property: Property;
  onSuccess: () => void;
}

export const QuickReviewActions: React.FC<QuickReviewActionsProps> = ({
  property,
  onSuccess,
}) => {
  const [reviewProperty, { isLoading }] = useReviewPropertyMutation();
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleQuickApprove = async () => {
    if (!confirm("Are you sure you want to approve this property?")) return;

    try {
      await reviewProperty({
        id: property.id,
        status: "AVAILABLE",
      }).unwrap();
      onSuccess();
    } catch (error) {
      console.error("Failed to approve property:", error);
    }
  };

  const handleQuickReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    try {
      await reviewProperty({
        id: property.id,
        status: "REJECTED",
        rejectionReason,
      }).unwrap();
      setShowRejectInput(false);
      setRejectionReason("");
      onSuccess();
    } catch (error) {
      console.error("Failed to reject property:", error);
    }
  };

  if (showRejectInput) {
    return (
      <div className="flex gap-2 items-start">
        <input
          type="text"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Rejection reason..."
          className="flex-1 px-3 py-2 border-2 border-red-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
          autoFocus
        />
        <button
          onClick={handleQuickReject}
          disabled={isLoading}
          className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Reject"}
        </button>
        <button
          onClick={() => {
            setShowRejectInput(false);
            setRejectionReason("");
          }}
          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleQuickApprove}
        disabled={isLoading}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
        title="Approve property"
      >
        <CheckCircle className="w-4 h-4" />
        Approve
      </button>
      <button
        onClick={() => setShowRejectInput(true)}
        disabled={isLoading}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
        title="Reject property"
      >
        <XCircle className="w-4 h-4" />
        Reject
      </button>
    </div>
  );
};
