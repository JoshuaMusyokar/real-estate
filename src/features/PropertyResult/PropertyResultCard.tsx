// PropertyResultCard.tsx
import React, { useState } from "react";
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize,
  User,
  Phone,
  Shield,
  CheckCircle,
  ParkingCircle,
  MoveVertical,
  Calendar,
  Eye,
} from "lucide-react";
import type { Property } from "../../types";
import { PropertyImageCarousel } from "./PropertyImageCarousel";
import { InquiryFormModal } from "../../components/form/InquiryForm";
import { ScheduleViewingModal } from "../../components/form/ScheduleViewingForm";

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (propertyId: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isFavorite,
  onToggleFavorite,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);

  const formatPrice = (price: number) => {
    if (price >= 10_000_000) return `₹${(price / 10_000_000).toFixed(2)} Cr`;
    if (price >= 100_000) return `₹${(price / 100_000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  const avgPricePerSqFt = property.carpetArea
    ? (property.price / property.carpetArea / 1000).toFixed(2)
    : null;

  const possessionText =
    property.possessionStatus === "READY_TO_MOVE"
      ? "Ready to Move"
      : property.possessionStatus === "UNDER_CONSTRUCTION"
        ? `Possession: ${
            property.possessionDate
              ? new Date(property.possessionDate).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "Upcoming"
          }`
        : "";

  const postedDate = property.postedDate
    ? new Date(property.postedDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const rera = property.reraNumber
    ? { label: "RERA Approved Property", number: property.reraNumber }
    : property.advertiserReraNumber
      ? {
          label:
            property.postedBy === "DEVELOPER" ? "RERA Developer" : "RERA Agent",
          number: property.advertiserReraNumber,
        }
      : null;

  return (
    <>
      <div
        className="
          bg-white border border-blue-100 hover:border-blue-300
          rounded-xl sm:rounded-2xl overflow-hidden
          shadow-sm hover:shadow-lg hover:shadow-blue-100/60
          transition-all duration-300
          flex flex-col sm:flex-row
        "
      >
        {/* ── Image ──────────────────────────────────────────────────────── */}
        <div
          className="
            relative flex-shrink-0
            w-full h-36
            sm:w-52 sm:h-auto
            lg:w-64
            bg-blue-50
          "
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <PropertyImageCarousel
            images={property.images}
            showThumbnails={false}
            autoPlay={isHovered}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {property.reraNumber ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-md shadow">
                <Shield className="w-2.5 h-2.5" /> RERA
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/60 text-white text-[10px] font-medium rounded-md">
                {property.verified ? "Verified" : "Zero Brokerage"}
              </span>
            )}
          </div>

          {/* Favourite */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(property.id);
            }}
            className={`
              absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-sm shadow transition-all z-10
              ${
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-white/90 text-gray-500 hover:text-red-500 hover:bg-white"
              }
            `}
          >
            <Heart
              className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`}
            />
          </button>

          {/* Image dots */}
          {property.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {property.images.slice(0, 5).map((_, idx) => (
                <div
                  key={idx}
                  className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white/80"
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Content ────────────────────────────────────────────────────── */}
        <div
          className="flex-1 p-3 sm:p-4 flex flex-col justify-between cursor-pointer min-w-0"
          onClick={() =>
            window.open(`/property-detail/${property.slug}`, "_blank")
          }
        >
          <div>
            {/* Price */}
            <div className="text-lg sm:text-2xl font-black text-blue-700 mb-0.5">
              {formatPrice(property.price)}
            </div>

            {/* Title */}
            <p className="text-sm sm:text-base font-bold text-gray-900 line-clamp-1 mb-1">
              {property.title}
            </p>

            {/* Location */}
            <div className="flex items-center gap-1 text-gray-500 mb-2.5 sm:mb-3">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-blue-400" />
              <span className="text-[11px] sm:text-sm truncate">
                {property.locality}, {property.city.name}
              </span>
            </div>

            {/* Feature chips */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
              {property.bedrooms && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-md text-[10px] sm:text-xs font-semibold text-blue-700">
                  <Bed className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {property.bedrooms} BHK
                </span>
              )}
              {property.bathrooms && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-md text-[10px] sm:text-xs font-semibold text-blue-700">
                  <Bath className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {property.bathrooms} Bath
                </span>
              )}
              {(property.superBuiltArea || property.carpetArea) && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-md text-[10px] sm:text-xs font-semibold text-blue-700">
                  <Maximize className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {property.superBuiltArea || property.carpetArea} sq.ft
                </span>
              )}
              {possessionText && (
                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-md text-[10px] sm:text-xs font-semibold text-emerald-700">
                  {possessionText}
                </span>
              )}
            </div>

            {/* RERA strip */}
            {rera && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5 mb-2.5 sm:mb-3">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-emerald-700 font-bold truncate">
                    {rera.label}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-emerald-600 font-mono truncate">
                    {rera.number}
                  </p>
                </div>
              </div>
            )}

            {/* Avg price per sqft */}
            {avgPricePerSqFt && (
              <p className="text-[10px] sm:text-xs text-gray-400 border-t border-dashed border-blue-100 pt-2 mb-2.5">
                Avg.{" "}
                <span className="font-bold text-gray-600">
                  ₹{avgPricePerSqFt}K/sq.ft
                </span>
              </p>
            )}
          </div>

          {/* ── Footer row ────────────────────────────────────────────── */}
          <div
            className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 pt-2.5 sm:pt-3 border-t border-blue-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Posted by */}
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] text-gray-400">
                  Posted by
                </p>
                <p className="text-[10px] sm:text-xs font-bold text-gray-800 truncate">
                  {property.postedBy}
                  {property.advertiserName ?? ""}
                </p>
              </div>
            </div>

            {/* Parking + lifts — hidden on small mobile, shows on sm+ */}
            <div className="hidden sm:flex items-center flex-wrap gap-3 text-[10px] sm:text-xs text-gray-500">
              {property.coveredParking && (
                <span className="flex items-center gap-0.5">
                  <ParkingCircle className="w-3 h-3" />
                  {property.coveredParking} Covered
                </span>
              )}
              {property.openParking && (
                <span className="flex items-center gap-0.5">
                  <ParkingCircle className="w-3 h-3" />
                  {property.openParking} Open
                </span>
              )}
              {property.passengerLifts && (
                <span className="flex items-center gap-0.5">
                  <MoveVertical className="w-3 h-3" />
                  {property.passengerLifts} Lift
                </span>
              )}
            </div>

            {/* Date — hidden on xs */}
            {postedDate && (
              <div className="hidden sm:flex items-center gap-1 text-[10px] text-gray-400 flex-shrink-0">
                <Calendar className="w-3 h-3" />
                <span>{postedDate}</span>
              </div>
            )}

            {/* Contact CTA */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowContactOptions(true);
              }}
              className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-xs font-bold rounded-lg sm:rounded-xl transition-colors shadow-sm flex-shrink-0"
            >
              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* ── Contact bottom sheet ──────────────────────────────────────── */}
      {showContactOptions && (
        <div
          onClick={() => setShowContactOptions(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-sm rounded-t-2xl shadow-2xl p-5 animate-slide-up"
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <h3 className="text-sm font-black text-gray-900 mb-1">
              {property.title}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              {property.locality}, {property.city.name}
            </p>

            <button
              onClick={() => {
                setShowContactOptions(false);
                setShowInquiry(true);
              }}
              className="w-full py-2.5 mb-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Quick Contact
            </button>
            <button
              onClick={() => {
                setShowContactOptions(false);
                setShowSchedule(true);
              }}
              className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" /> Schedule Site Visit
            </button>
            <button
              onClick={() => setShowContactOptions(false)}
              className="w-full py-2 text-xs text-gray-400 mt-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <InquiryFormModal
        property={property}
        isOpen={showInquiry}
        onClose={() => setShowInquiry(false)}
      />
      <ScheduleViewingModal
        property={property}
        isOpen={showSchedule}
        onClose={() => setShowSchedule(false)}
      />

      <style>{`
        @keyframes slide-up { from{transform:translateY(100%)}to{transform:translateY(0)} }
        .animate-slide-up { animation: slide-up 0.25s ease-out; }
      `}</style>
    </>
  );
};
