import { FileText } from "lucide-react";

interface AboutPropertyProps {
  description: string;
}

export const AboutProperty: React.FC<AboutPropertyProps> = ({
  description,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            About This Property
          </h2>
          <p className="text-sm text-gray-500">
            Detailed description and features
          </p>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {description}
      </p>
    </div>
  );
};
