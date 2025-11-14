export const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  change?: string;
}> = ({ icon, label, value, change }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
          {value}
        </p>
        {change && (
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            {change} from last week
          </p>
        )}
      </div>
      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">{icon}</div>
    </div>
  </div>
);
