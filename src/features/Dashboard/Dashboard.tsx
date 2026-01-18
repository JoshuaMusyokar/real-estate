import React, { useState } from "react";
import {
  useGetDashboardSummaryQuery,
  useExportAnalyticsReportMutation,
} from "../../services/analyticsApi";
import PageMeta from "../../components/common/PageMeta";
import type { AnalyticsQueryParams } from "../../types";
import FilterBar from "./components/Filterbar";
import DashboardMetrics from "./components/DashboardMetrix";
import PropertyTrendsChart from "./components/PropertyTrendChart";
import LeadAnalyticsChart from "./components/LeadAnalyticsChart";
import RevenueMetricsCard from "./components/RevenueMetrixChart";
import TopCitiesChart from "./components/TopcitiesChart";
import TopPropertiesTable from "./components/TopPropertiesTable";
import AgentPerformanceTable from "./components/AgentPerformanceTable";

export default function Dashboard() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(
    [],
  );

  // Build query parameters
  const queryParams: AnalyticsQueryParams = {
    period,
    cityIds: selectedCities,
    propertyType: selectedPropertyTypes,
  };

  // Fetch dashboard data
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useGetDashboardSummaryQuery(queryParams);

  // Export mutation
  const [exportReport, { isLoading: isExporting }] =
    useExportAnalyticsReportMutation();

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    try {
      const blob = await exportReport({
        format,
        type: "properties",
        filters: queryParams,
      }).unwrap();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `real_estate_report_${
        new Date().toISOString().split("T")[0]
      }.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleFilterChange = (filters: Partial<AnalyticsQueryParams>) => {
    // Update query params and refetch
    Object.assign(queryParams, filters);
    refetchDashboard();
  };

  if (isDashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Error loading dashboard data</div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Real Estate Analytics Dashboard"
        description="Comprehensive analytics dashboard for real estate property management"
      />

      <div className="space-y-6">
        {/* Filter Bar */}
        <FilterBar
          period={period}
          onPeriodChange={setPeriod}
          selectedCities={selectedCities}
          onCitiesChange={setSelectedCities}
          selectedPropertyTypes={selectedPropertyTypes}
          onPropertyTypesChange={setSelectedPropertyTypes}
          onExport={handleExport}
          isExporting={isExporting}
        />

        {/* Dashboard Content */}
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Key Metrics Row */}
          <div className="col-span-12">
            <DashboardMetrics data={dashboardData?.data} />
          </div>

          {/* Charts Row */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <PropertyTrendsChart period={period} />
            <LeadAnalyticsChart period={period} />
          </div>

          {/* Sidebar Metrics */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <RevenueMetricsCard data={dashboardData?.data?.revenue} />
            <TopCitiesChart limit={5} period={period} />
          </div>

          {/* Bottom Tables */}
          <div className="col-span-12 lg:col-span-7">
            <TopPropertiesTable limit={10} period={period} by="views" />
          </div>

          <div className="col-span-12 lg:col-span-5">
            <AgentPerformanceTable limit={5} period={period} />
          </div>
        </div>
      </div>
    </>
  );
}
