import { ChevronRight } from "lucide-react";
import type { Property } from "../../../types";

export const Breadcrumb: React.FC<{ property: Property }> = ({ property }) => (
  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
    <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
      Home
    </span>
    <ChevronRight className="w-4 h-4" />
    <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
      Properties
    </span>
    <ChevronRight className="w-4 h-4" />
    <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
      {property.city}
    </span>
    <ChevronRight className="w-4 h-4" />
    <span className="text-gray-900 dark:text-white font-medium truncate">
      {property.title}
    </span>
  </div>
);
