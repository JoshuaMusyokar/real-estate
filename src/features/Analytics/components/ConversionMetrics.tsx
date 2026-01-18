import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import type { ConversionMetrics } from "../../../types";

interface ConversionMetricsProps {
  data: ConversionMetrics;
}

export default function ConversionMetrics({ data }: ConversionMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 mb-2">Total Leads</p>
        <p className="text-2xl font-bold">
          {data.leads.total.toLocaleString()}
        </p>
        {data.leads.change && (
          <div className="flex items-center gap-1 mt-1">
            {data.leads.change > 0 ? (
              <TrendingUpIcon className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDownIcon className="w-4 h-4 text-red-600" />
            )}
            <span
              className={`text-sm ${data.leads.change > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {data.leads.change > 0 ? "+" : ""}
              {data.leads.change}%
            </span>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 mb-2">Appointments</p>
        <p className="text-2xl font-bold">
          {data.appointments.total.toLocaleString()}
        </p>
        {data.appointments.change && (
          <div className="flex items-center gap-1 mt-1">
            {data.appointments.change > 0 ? (
              <TrendingUpIcon className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDownIcon className="w-4 h-4 text-red-600" />
            )}
            <span
              className={`text-sm ${data.appointments.change > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {data.appointments.change > 0 ? "+" : ""}
              {data.appointments.change}%
            </span>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 mb-2">Closed Deals</p>
        <p className="text-2xl font-bold">
          {data.closed.total.toLocaleString()}
        </p>
        {data.closed.change && (
          <div className="flex items-center gap-1 mt-1">
            {data.closed.change > 0 ? (
              <TrendingUpIcon className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDownIcon className="w-4 h-4 text-red-600" />
            )}
            <span
              className={`text-sm ${data.closed.change > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {data.closed.change > 0 ? "+" : ""}
              {data.closed.change}%
            </span>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 mb-2">Lead to Closed Rate</p>
        <p className="text-2xl font-bold">
          {data.conversionRates.leadToClosed.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
