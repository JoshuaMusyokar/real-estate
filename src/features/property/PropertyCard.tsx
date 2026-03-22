import { useState, type FC } from "react";
import type { Property } from "../../types";
import {
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  MapPin,
  Home,
  Calendar,
  Star,
  Bed,
  Bath,
  Car,
  Building,
  Layers,
  ArrowUp,
  Users,
  ParkingCircle,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { QuickReviewActions } from "./QuickReviewAction";
import { getCurrencySymbol } from "../../utils/currency-utils";
import { FeaturedToggle } from "./components/FeaturedToggle";
import { FeaturedBadge } from "./components/FeaturedBadge";
import { Card, CardContent, CardFooter } from "../../components/ui/Card";
import { usePermissions } from "../../hooks/usePermissions";

interface PropertyCardProps {
  property: Property;
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onFeaturedToggle?: (propertyId: string, isFeatured: boolean) => void;
}

// ── Share helpers ─────────────────────────────────────────────────────────────
const shareViaEmail = (property: Property) => {
  const subject = encodeURIComponent(`Property: ${property.title}`);
  const body = encodeURIComponent(
    `Hi,\n\nCheck out this property:\n\n${property.title}\n${property.locality}, ${property.city.name}\nPrice: ${getCurrencySymbol(property.currency)}${property.price.toLocaleString()}\n\n${window.location.origin}/properties/${property.slug}`,
  );
  window.open(`mailto:?subject=${subject}&body=${body}`);
};

const shareViaWhatsApp = (property: Property) => {
  const text = encodeURIComponent(
    `*${property.title}*\n📍 ${property.locality}, ${property.city.name}\n💰 ${getCurrencySymbol(property.currency)}${property.price.toLocaleString()}\n\n${window.location.origin}/properties/${property.slug}`,
  );
  window.open(`https://wa.me/?text=${text}`, "_blank");
};

// ── Tiny spec chip ────────────────────────────────────────────────────────────
const Spec: FC<{
  icon: React.ElementType;
  label: string;
  value: string | number | null | undefined;
}> = ({ icon: Icon, label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-lg px-1.5 py-1 min-w-0">
      <Icon className="w-3 h-3 text-gray-400 flex-shrink-0" />
      <span className="text-[10px] font-semibold text-gray-600 truncate">
        {value}
      </span>
      <span className="text-[9px] text-gray-400 hidden sm:inline truncate">
        {label}
      </span>
    </div>
  );
};

// ── Icon action button ────────────────────────────────────────────────────────
const IconBtn: FC<{
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  variant?: "default" | "blue" | "red" | "green" | "emerald";
}> = ({ icon: Icon, label, onClick, variant = "default" }) => {
  const cls = {
    default: "text-gray-600  hover:bg-gray-100  hover:text-gray-900",
    blue: "text-blue-600  hover:bg-blue-50   hover:text-blue-700",
    red: "text-red-500   hover:bg-red-50    hover:text-red-700",
    green: "text-green-600 hover:bg-green-50  hover:text-green-700",
    emerald: "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700",
  }[variant];
  return (
    <button
      type="button"
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${cls}`}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
export const PropertyCard: FC<PropertyCardProps> = ({
  property,
  onView,
  onEdit,
  onDelete,
  onFeaturedToggle,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { can } = usePermissions();
  const canReview = can("property.approve");
  const canFeature = can("property.feature");
  const hasMenu = !!onEdit || !!onDelete || canReview || canFeature;

  const coverImage =
    property.images?.find((i) => i.isCover)?.viewableUrl ||
    property.images?.[0]?.viewableUrl;

  const handleFeaturedToggle = () =>
    onFeaturedToggle?.(property.id, !property.featured);

  // ── Owner phone (first in array, or fallback to ownerPhone) ───────────────
  const primaryPhone =
    (property.ownerPhones as string[] | null | undefined)?.[0] ||
    property.ownerPhone ||
    null;

  const phones = property.ownerPhones ?? [];

  return (
    <Card className="group overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 flex flex-col">
      {/* ── Image ────────────────────────────────────────────────────────── */}
      <div className="relative h-32 sm:h-40 md:h-44 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0">
        {coverImage ? (
          <img
            src={coverImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home className="w-10 h-10 text-gray-300" />
          </div>
        )}

        {property.featured && (
          <div className="absolute top-2 left-2 z-10">
            <FeaturedBadge compact />
          </div>
        )}

        {/* Three-dot menu */}
        {hasMenu && (
          <div className="absolute top-2 right-2">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 bg-white/95 backdrop-blur-sm rounded-lg hover:bg-white shadow-lg flex items-center justify-center"
            >
              <MoreVertical className="w-4 h-4 text-gray-700" />
            </button>
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-1 z-20 overflow-hidden">
                  {(canReview || canFeature) && (
                    <>
                      <p className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                        Admin
                      </p>
                      {canReview && (
                        <button
                          onClick={() => {
                            setShowReviewModal(true);
                            setShowMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-blue-50 flex items-center gap-2 text-blue-600 font-medium"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Review Property
                        </button>
                      )}
                      {canFeature && (
                        <button
                          onClick={() => {
                            handleFeaturedToggle();
                            setShowMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-amber-50 flex items-center gap-2 text-amber-600 font-medium"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${property.featured ? "fill-current" : ""}`}
                          />
                          {property.featured ? "Unfeature" : "Add to Featured"}
                        </button>
                      )}
                      <div className="border-t border-gray-100 my-0.5" />
                    </>
                  )}
                  <button
                    onClick={() => {
                      onView(property.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2 text-gray-700 font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </button>
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit(property.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs hover:bg-blue-50 flex items-center gap-2 text-blue-600 font-medium"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Property
                    </button>
                  )}
                  {onDelete && (
                    <>
                      <div className="border-t border-gray-100 my-0.5" />
                      <button
                        onClick={() => {
                          onDelete(property.id);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-xs hover:bg-red-50 flex items-center gap-2 text-red-600 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <CardContent className="p-3 sm:p-4 flex-1 flex flex-col gap-2">
        {/* Title + featured toggle */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm sm:text-base text-gray-900 line-clamp-2 flex-1 group-hover:text-blue-600 transition-colors leading-tight">
            {property.title}
          </h3>
          {canFeature && (
            <FeaturedToggle
              propertyId={property.id}
              isFeatured={property.featured}
              compact
              onToggle={handleFeaturedToggle}
            />
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-[11px]">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            {property.locality}, {property.city.name}
          </span>
        </div>

        {/* Price + status */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-black text-gray-900">
              {getCurrencySymbol(property.currency)}
              {property.price.toLocaleString()}
            </div>
            <div className="text-[10px] text-gray-400 uppercase font-semibold">
              {property.purpose}
            </div>
          </div>
          <StatusBadge status={property.status} />
        </div>

        {/* Spec chips grid */}
        <div className="grid grid-cols-3 gap-1">
          <Spec icon={Bed} label="bed" value={property.bedrooms} />
          <Spec icon={Bath} label="bath" value={property.bathrooms} />
          <Spec
            icon={Layers}
            label="floor"
            value={property.floorNumber ?? undefined}
          />
          <Spec
            icon={Building}
            label="floors"
            value={property.totalFloors ?? undefined}
          />
          <Spec
            icon={Users}
            label="flats"
            value={property.totalFlats ?? undefined}
          />
          <Spec
            icon={ArrowUp}
            label="lift"
            value={property.passengerLifts ?? undefined}
          />
          <Spec
            icon={Car}
            label="cvrd"
            value={property.coveredParking ?? undefined}
          />
          <Spec
            icon={ParkingCircle}
            label="open"
            value={property.openParking ?? undefined}
          />
          <Spec
            icon={Calendar}
            label="built"
            value={property.yearBuilt ?? undefined}
          />
          {property.facingDirection && (
            <Spec
              icon={MapPin}
              label="facing"
              value={property.facingDirection?.replace("_", "-")}
            />
          )}
        </div>

        {/* Owner contact — unmasked (admin panel) */}
        <div className="bg-blue-50/60 border border-blue-100 rounded-lg px-2.5 py-2 space-y-1">
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide">
            Owner
          </p>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-800 truncate">
            <Home className="w-3 h-3 text-blue-400 flex-shrink-0" />
            <span className="truncate">{property.ownerName || "—"}</span>
          </div>
          {primaryPhone && (
            <div className="flex items-center gap-1.5 text-[11px] text-gray-600 truncate">
              <Phone className="w-3 h-3 text-blue-400 flex-shrink-0" />
              <a
                href={`tel:${primaryPhone}`}
                onClick={(e) => e.stopPropagation()}
                className="truncate hover:text-blue-600 transition-colors"
              >
                {primaryPhone}
              </a>
              {/* show additional phones count */}
              {phones.length > 1 && (
                <span className="text-[10px] text-blue-500 font-semibold flex-shrink-0">
                  +{(property.ownerPhones as string[]).length - 1} more
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {/* ── Footer: action icon row ───────────────────────────────────────── */}
      <CardFooter className="px-3 sm:px-4 py-2.5 border-t border-gray-100 flex items-center justify-between gap-1">
        {/* Left: stats */}
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <span className="flex items-center gap-0.5">
            <Eye className="w-3 h-3" />
            {property.viewCount}
          </span>
          <span className="hidden sm:flex items-center gap-0.5">
            <Calendar className="w-3 h-3" />
            {new Date(property.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "2-digit",
            })}
          </span>
        </div>

        {/* Right: icon action buttons */}
        <div className="flex items-center gap-0.5">
          {/* Share */}
          <IconBtn
            icon={Mail}
            label="Share via Email"
            onClick={() => shareViaEmail(property)}
            variant="default"
          />
          <IconBtn
            icon={MessageCircle}
            label="Share via WhatsApp"
            onClick={() => shareViaWhatsApp(property)}
            variant="emerald"
          />

          <div className="w-px h-4 bg-gray-200 mx-0.5" />

          {/* CRUD */}
          <IconBtn
            icon={Eye}
            label="View"
            onClick={() => onView(property.id)}
            variant="blue"
          />
          {onEdit && (
            <IconBtn
              icon={Edit2}
              label="Edit"
              onClick={() => onEdit(property.id)}
              variant="blue"
            />
          )}
          {onDelete && (
            <IconBtn
              icon={Trash2}
              label="Delete"
              onClick={() => onDelete(property.id)}
              variant="red"
            />
          )}

          {/* Admin */}
          {canFeature && (
            <IconBtn
              icon={Star}
              label={property.featured ? "Unfeature" : "Feature"}
              onClick={handleFeaturedToggle}
              variant="default"
            />
          )}
        </div>
      </CardFooter>

      {/* Quick review (admin) */}
      {canReview && (
        <div className="px-3 sm:px-4 pb-3 pt-1 border-t border-gray-100">
          <QuickReviewActions property={property} onSuccess={() => {}} />
        </div>
      )}
    </Card>
  );
};
