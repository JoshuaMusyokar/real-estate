import React from "react";
import { Award } from "lucide-react";

interface AdCardProps {
  position: number;
}

export const AdCard: React.FC<AdCardProps> = ({ position }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-200 rounded-lg p-6 text-center">
      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
        <Award className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-bold text-lg text-gray-900 mb-2">
        List Your Property FREE
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Get genuine leads & sell faster on Property4India.com
      </p>
      <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
        Post Property
      </button>
    </div>
  );
};
