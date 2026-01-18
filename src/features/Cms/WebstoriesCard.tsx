import React from "react";
import { Link } from "react-router-dom";
import { Play, Sparkles, Eye, Clock } from "lucide-react";
import type { Content } from "../../types";
import { Card } from "../../components/ui/Card";

export const WebStoryCard: React.FC<{ article: Content }> = ({ article }) => {
  return (
    <Link to={`/stories/${article.slug}`} className="block group">
      <Card className="relative overflow-hidden h-80 rounded-2xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {article.featuredImage ? (
            <img
              src={article.featuredImage.url}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 animate-gradient" />
          )}

          {/* Multi-layer Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />

          {/* Animated Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        {/* Top Badge with Glow Effect */}
        <div className="absolute top-5 left-5 z-10">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-4 py-2 shadow-lg group-hover:shadow-pink-500/50 transition-shadow duration-300">
            <Play className="w-4 h-4 text-white fill-white animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wider">
              WEB STORY
            </span>
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Stats Bar - Top Right */}
        <div className="absolute top-5 right-5 z-10 flex items-center space-x-3">
          {article.metadata?.views && (
            <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5">
              <Eye className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-medium text-white">
                {article.metadata.views}
              </span>
            </div>
          )}
          {article.metadata?.readTime && (
            <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5">
              <Clock className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-medium text-white">
                {article.metadata.readTime}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Content with Slide-up Animation */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-500 group-hover:translate-y-[-8px]">
          {/* Category Pills */}
          {article.categories && article.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {article.categories.slice(0, 2).map((cat, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}

          {/* Title with Enhanced Typography */}
          <h3 className="text-white font-black text-xl md:text-2xl mb-3 line-clamp-2 leading-tight drop-shadow-2xl group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-pink-200 transition-all duration-300">
            {article.title}
          </h3>

          {/* Excerpt with Fade In on Hover */}
          {article.excerpt && (
            <p className="text-white/80 text-sm line-clamp-2 mb-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
              {article.excerpt}
            </p>
          )}

          {/* Animated Progress Bar */}
          <div className="w-0 group-hover:w-full h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-full transition-all duration-700 ease-out" />
        </div>

        {/* Decorative Corner Accent */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-pink-500/20 to-transparent rounded-tl-full transform translate-x-16 translate-y-16 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
      </Card>
    </Link>
  );
};
