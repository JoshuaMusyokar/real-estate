import React, { useState } from "react";
import type { AnalyticsQueryParams } from "../../types";
import {
  useGetPropertiesOverTimeQuery,
  useGetPropertyOverviewQuery,
  useGetPropertyTypeDistributionQuery,
  useGetTopCitiesQuery,
  useGetTopPropertiesQuery,
  useGetTrafficByLocationQuery,
} from "../../services/analyticsApi";
import PropertyTypeBreakdown from "./components/PropertyTypeBreakdown";
import TopPropertiesTable from "./components/TopPropertiesTable";
import PropertyTrendsChart from "./components/PropertyTrendsChart";
import AdvancedFilterPanel from "./components/AdvancedFilterPanel";
import ExportPanel from "./components/ExportPanel";
import LocationHeatmap from "./components/LocationHeatmap";

export default function PropertiesAnalytics() {
  const [filters, setFilters] = useState<AnalyticsQueryParams>({
    period: "30d",
    interval: "daily",
  });

  // Fetch all property-related analytics
  const { data: overviewData } = useGetPropertyOverviewQuery(filters);
  const { data: trendsData } = useGetPropertiesOverTimeQuery({
    ...filters,
    interval: filters.interval || "daily",
  });
  const { data: typeData } = useGetPropertyTypeDistributionQuery(filters);
  const { data: topProperties } = useGetTopPropertiesQuery({
    ...filters,
    limit: 10,
    by: "views",
  });
  const { data: topCities } = useGetTopCitiesQuery({
    ...filters,
    limit: 10,
  });
  const { data: trafficData } = useGetTrafficByLocationQuery(filters);

  const handleFilterChange = (newFilters: Partial<AnalyticsQueryParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Property Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Deep analysis of property performance and trends
          </p>
        </div>

        <ExportPanel filters={filters} format="excel" type="properties" />
      </div>

      {/* Advanced Filters */}
      <AdvancedFilterPanel
        filters={filters}
        onFilterChange={handleFilterChange}
        showPropertyFilters
      />

      {/* Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Overview Metrics */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          {overviewData?.data && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500">Total Properties</p>
                <p className="text-2xl font-bold">
                  {overviewData.data.total.total}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold">
                  {overviewData.data.active.total}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500">Featured</p>
                <p className="text-2xl font-bold">
                  {overviewData.data.featured.total}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold">
                  {overviewData.data.pending.total}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Main Charts */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Trends Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">
              Property Trends Over Time
            </h3>
            <PropertyTrendsChart
              data={trendsData?.data || []}
              interval={filters.interval || "daily"}
            />
          </div>

          {/* Top Properties */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">
              Top Performing Properties
            </h3>
            <TopPropertiesTable
              data={topProperties?.data || []}
              metric="views"
            />
          </div>
        </div>

        {/* Sidebar Charts */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Property Type Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">
              Property Type Distribution
            </h3>
            <PropertyTypeBreakdown data={typeData?.data || []} />
          </div>

          {/* Top Cities */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">
              Top Cities by Activity
            </h3>
            <div className="space-y-3">
              {topCities?.data?.slice(0, 5).map((city, index) => (
                <div
                  key={city.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">
                      #{index + 1}
                    </span>
                    <span className="text-sm">{city.name}</span>
                  </div>
                  <span className="font-semibold">
                    {city.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic by Location */}
          {trafficData?.data && trafficData.data.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">
                Traffic by Location
              </h3>
              <LocationHeatmap data={trafficData.data} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
