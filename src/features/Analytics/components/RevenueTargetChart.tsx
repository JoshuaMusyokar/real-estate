import { TargetIcon, TrendingUpIcon } from "lucide-react";

interface RevenueTargetChartProps {
  current: number;
  target: number;
}

export default function RevenueTargetChart({
  current,
  target,
}: RevenueTargetChartProps) {
  const progress = Math.min((current / target) * 100, 100);
  const remaining = target - current;
  const daysInMonth = 30; // Current month
  const avgDaily = current / daysInMonth;
  const projectedEnd =
    current +
    avgDaily * (daysInMonth - Math.floor(daysInMonth * (progress / 100)));

  const getStatusColor = (progress: number) => {
    if (progress >= 100) return "text-green-600";
    if (progress >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusText = (progress: number) => {
    if (progress >= 100) return "Target Achieved!";
    if (progress >= 75) return "On Track";
    if (progress >= 50) return "Needs Improvement";
    return "Behind Schedule";
  };

  return (
    <div className="space-y-6">
      {/* Circular Progress */}
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
          />

          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#465FFF"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${progress * 2.83} 283`}
            transform="rotate(-90 50 50)"
          />

          {/* Center text */}
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dy=".3em"
            className="text-2xl font-bold fill-gray-900 dark:fill-white"
          >
            {progress.toFixed(0)}%
          </text>
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-gray-500">Progress</div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="text-center">
        <div className={`text-lg font-bold ${getStatusColor(progress)}`}>
          {getStatusText(progress)}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {progress >= 100
            ? "Congratulations!"
            : `${(100 - progress).toFixed(1)}% to go`}
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <TargetIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Target
            </span>
          </div>
          <span className="font-medium">${target.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUpIcon className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Current
            </span>
          </div>
          <span className="font-medium">${current.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Remaining
            </span>
          </div>
          <span
            className={`font-medium ${remaining > 0 ? "text-red-600" : "text-green-600"}`}
          >
            ${Math.abs(remaining).toLocaleString()}
            {remaining > 0 ? " needed" : " over target"}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Projected End
            </span>
          </div>
          <span className="font-medium">${projectedEnd.toLocaleString()}</span>
        </div>
      </div>

      {/* Daily Target Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Daily Progress
          </span>
          <span className="text-sm font-medium">
            ${avgDaily.toFixed(0)}/day
          </span>
        </div>
        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {progress.toFixed(1)}% of monthly target
        </div>
      </div>
    </div>
  );
}
