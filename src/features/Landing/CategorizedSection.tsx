/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArrowRight,
  Filter,
  Home,
  Search,
  X,
  Building2,
  Sparkles,
  TrendingUp,
  Shield,
  Users,
  Award,
  MapPin,
  ChevronRight,
  Bath,
  Bed,
  Check,
  Eye,
  Heart,
  Share2,
  Square,
  Menu,
  Star,
  Clock,
  ChevronDown,
  Zap,
  Phone,
  Mail,
  Trophy,
  User,
  Briefcase,
  Building,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FilterPanel } from "./FilterPanel";
import { LandingPropertyCard } from "./LandingPropertyCard";
import {
  type PropertySearchFilters,
  type PropertySubType,
  type PropertyType,
} from "../../types";
import {
  useGetCategorizedPropertiesQuery,
  useGetUserFavoritesQuery,
  useSearchPropertiesQuery,
} from "../../services/propertyApi";
import { Link, useNavigate } from "react-router-dom";
import { PublicHeader } from "../../layout/PublicHeader";
import { useAuth } from "../../hooks/useAuth";
import { Footer } from "../../layout/Footer";
import { useDefaultCity } from "../../hooks/useDefaultCity";
import { SearchComponent } from "./SearchComponent";
import { CategorizedPropertyCard } from "./CategorizedPropertyCard";

interface CategorizedSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  properties: any[];
  color: string;
  index: number;
}

export const CategorizedSection: React.FC<CategorizedSectionProps> = ({
  title,
  description,
  icon,
  properties,
  color,
  index,
}) => {
  const navigate = useNavigate();

  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <section className={`py-16 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg`}
            >
              {icon}
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-black text-gray-900">
                {title}
              </h2>
              <p className="text-gray-600 mt-1">{description}</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/properties")}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors group"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.slice(0, 8).map((property, idx) => (
            <div
              key={property.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <CategorizedPropertyCard
                property={property}
                category=""
                index={0}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {properties.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No properties available
            </h3>
            <p className="text-gray-600">
              Check back soon for new listings in this category
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
