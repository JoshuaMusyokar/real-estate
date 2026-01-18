import { MapPinIcon } from "lucide-react";
import type { TrafficByLocation } from "../../../types";

interface LocationHeatmapProps {
  data: TrafficByLocation[];
  height?: number;
}

export default function LocationHeatmap({
  data,
  height = 300,
}: LocationHeatmapProps) {
  // Sort data by properties count (descending)
  const sortedData = [...data].sort((a, b) => b.properties - a.properties);

  // Find max values for scaling
  const maxProperties = Math.max(...data.map((item) => item.properties));
  const maxViews = Math.max(...data.map((item) => item.views));
  const maxInquiries = Math.max(...data.map((item) => item.inquiries));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-gray-900 dark:text-white">
            Geographic Distribution
          </h4>
        </div>
        <div className="text-sm text-gray-500">{data.length} locations</div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Properties</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Views</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span>Inquiries</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div
        className="grid grid-cols-1 gap-3"
        style={{ height: `${height}px`, overflowY: "auto" }}
      >
        {sortedData.map((location, index) => {
          const propertiesWidth = (location.properties / maxProperties) * 100;
          const viewsWidth = (location.views / maxViews) * 100;
          const inquiriesWidth = (location.inquiries / maxInquiries) * 100;

          return (
            <div key={location.city} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700">
                    <span className="text-xs font-medium">{index + 1}</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {location.city}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {location.properties.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Properties</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {location.views.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Views</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {location.inquiries.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Inquiries</div>
                  </div>
                </div>
              </div>

              {/* Bars */}
              <div className="space-y-1">
                {/* Properties Bar */}
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${propertiesWidth}%` }}
                  />
                </div>

                {/* Views Bar */}
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all duration-500"
                    style={{ width: `${viewsWidth}%` }}
                  />
                </div>

                {/* Inquiries Bar */}
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-purple-500 transition-all duration-500"
                    style={{ width: `${inquiriesWidth}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {data
              .reduce((sum, item) => sum + item.properties, 0)
              .toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total Properties</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {data.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total Views</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {data
              .reduce((sum, item) => sum + item.inquiries, 0)
              .toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total Inquiries</div>
        </div>
      </div>
    </div>
  );
}
