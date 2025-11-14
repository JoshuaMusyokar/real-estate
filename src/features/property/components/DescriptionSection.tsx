export const DescriptionSection: React.FC<{ description: string }> = ({
  description,
}) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 lg:p-8">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      About This Property
    </h2>
    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
      {description}
    </p>
  </div>
);
