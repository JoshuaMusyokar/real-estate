interface AboutPropertyProps {
  description: string;
}

export const AboutProperty: React.FC<AboutPropertyProps> = ({
  description,
}) => (
  <div className="bg-white border border-blue-100 rounded-xl p-4 sm:p-5">
    <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3">
      About This Property
    </h2>
    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
      {description}
    </p>
  </div>
);
