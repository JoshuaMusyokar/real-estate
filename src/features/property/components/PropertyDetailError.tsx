import { Home } from "lucide-react";

export const PropertyDetailError: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 flex items-center justify-center">
    <div className="text-center">
      <Home className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Property Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        The property you're looking for doesn't exist or has been removed.
      </p>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
        Back to Properties
      </button>
    </div>
  </div>
);
