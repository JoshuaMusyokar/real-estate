export const DetailItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</div>
    <div className="font-semibold text-gray-900 dark:text-white">{value}</div>
  </div>
);
