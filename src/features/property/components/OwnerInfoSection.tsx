import { User } from "lucide-react";
import type { Property } from "../../../types";
import { DetailItem } from "./DetailItem";

export const OwnerInfoSection: React.FC<{ property: Property }> = ({
  property,
}) => (
  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 lg:p-8">
    <div className="flex items-center gap-3 mb-6">
      <User className="w-6 h-6 text-amber-600 dark:text-amber-400" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Owner Information
      </h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DetailItem label="Name" value={property.ownerName} />
      <DetailItem label="Email" value={property.ownerEmail} />
      <DetailItem label="Phone" value={property.ownerPhone} />
      <DetailItem label="Owner ID" value={property.ownerId} />
    </div>
  </div>
);
