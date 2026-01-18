import React from "react";
import { Link } from "react-router-dom";
import { Calculator, ArrowRight, Zap } from "lucide-react";
import type { Content } from "../../types";
import { Card } from "../../components/ui/Card";

export const ToolCard: React.FC<{ article: Content }> = ({ article }) => {
  return (
    <Link to={`/tools/${article.slug}`} className="block group">
      <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-blue-100">
            <Calculator className="w-6 h-6 text-blue-600" />
          </div>
          <Zap className="w-5 h-5 text-yellow-500" />
        </div>
        <h3 className="font-bold text-xl mb-3 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>
        <p className="text-gray-600 mb-6">{article.excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
            Use this tool →
          </span>
          <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-2 transition-transform" />
        </div>
      </Card>
    </Link>
  );
};
