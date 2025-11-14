/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import type { Property } from "../../../types";
// import { InquiryForm } from "../../../components/form/InquiryForm";
// import { ScheduleViewingForm } from "../../../components/form/ScheduleViewingForm";

interface PropertySidebarProps {
  property: Property;
}

type ActiveTab = "inquiry" | "schedule";

export const PropertySidebar: React.FC<PropertySidebarProps> = ({
  property,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("inquiry");

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="bg-white border border-gray-200 rounded-xl p-1">
        <div className="flex">
          <button
            onClick={() => setActiveTab("inquiry")}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "inquiry"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Make Inquiry
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "schedule"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Schedule Viewing
          </button>
        </div>
      </div>

      {/* Form Content */}
      {/* <div>
        {activeTab === "inquiry" ? (
          <InquiryForm
            property={property}
            onSubmitSuccess={() => {
              console.log("Inquiry submitted successfully");
            }}
          />
        ) : (
          <ScheduleViewingForm
            property={property}
            onSubmitSuccess={() => {
              console.log("Viewing scheduled successfully");
            }}
          />
        )}
      </div> */}
    </div>
  );
};
