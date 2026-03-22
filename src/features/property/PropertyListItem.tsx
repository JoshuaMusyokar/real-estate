import { useState, type FC } from "react";
import type { Property } from "../../types";
import {
  Eye,
  Home,
  MapPin,
  Star,
  MoreVertical,
  Edit2,
  Trash2,
  Bed,
  Bath,
  Car,
  Building,
  Layers,
  ArrowUp,
  Users,
  ParkingCircle,
  Calendar,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { QuickReviewActions } from "./QuickReviewAction";
import { getCurrencySymbol } from "../../utils/currency-utils";
import { FeaturedToggle } from "./components/FeaturedToggle";
import { Card } from "../../components/ui/Card";
import { usePermissions } from "../../hooks/usePermissions";

interface PropertyListItemProps {
  property: Property;
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onFeaturedToggle?: (propertyId: string, isFeatured: boolean) => void;
}

// ── Share helpers (same as card) ──────────────────────────────────────────────
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
    <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-md px-1.5 py-0.5">
      <Icon className="w-3 h-3 text-gray-400 flex-shrink-0" />
      <span className="text-[10px] font-semibold text-gray-600">{value}</span>
      <span className="text-[9px] text-gray-400 hidden sm:inline">{label}</span>
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
export const PropertyListItem: FC<PropertyListItemProps> = ({
  property,
  onView,
  onEdit,
  onDelete,
  onFeaturedToggle,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const { can } = usePermissions();
  const canReview = can("property.approve");
  const canFeature = can("property.feature");
  const hasMenu = !!onEdit || !!onDelete || canReview || canFeature;

  const coverImage =
    property.images?.find((i) => i.isCover)?.viewableUrl ||
    property.images?.[0]?.viewableUrl;

  const handleFeaturedToggle = () =>
    onFeaturedToggle?.(property.id, !property.featured);

  const primaryPhone =
    (property.ownerPhones as string[] | null | undefined)?.[0] ||
    property.ownerPhone ||
    null;
  const phones = property.ownerPhones ?? [];

  // ── Shared spec + action row (used in both mobile and desktop) ────────────

  const SpecRow = () => (
    <div className="flex flex-wrap gap-1">
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
  );

  const ActionRow = () => (
    <div className="flex items-center gap-0.5">
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
      {canFeature && (
        <IconBtn
          icon={Star}
          label={property.featured ? "Unfeature" : "Feature"}
          onClick={handleFeaturedToggle}
          variant="default"
        />
      )}
    </div>
  );

  const OwnerBox = () => (
    <div className="bg-blue-50/60 border border-blue-100 rounded-lg px-2.5 py-2 space-y-1">
      <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide">
        Owner
      </p>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-800 truncate">
        <Home className="w-3 h-3 text-blue-400 flex-shrink-0" />
        <span className="truncate">{property.ownerName || "—"}</span>
      </div>
      {primaryPhone && (
        <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
          <Phone className="w-3 h-3 text-blue-400 flex-shrink-0" />
          <a
            href={`tel:${primaryPhone}`}
            onClick={(e) => e.stopPropagation()}
            className="truncate hover:text-blue-600 transition-colors"
          >
            {primaryPhone}
          </a>
          {phones.length > 1 && (
            <span className="text-[10px] text-blue-500 font-semibold flex-shrink-0">
              +{phones.length - 1} more
            </span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Card className="hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden">
      {/* ── Mobile layout (< md) ─────────────────────────────────────────── */}
      <div className="md:hidden">
        <div className="flex gap-3 p-3">
          {/* Thumbnail */}
          <div className="relative w-24 h-24 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
            {coverImage ? (
              <img
                src={coverImage}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Home className="w-8 h-8 text-gray-300" />
              </div>
            )}
            {property.featured && (
              <div className="absolute top-1 left-1">
                <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded text-[9px] font-bold">
                  <Star className="w-2.5 h-2.5 fill-current" />
                </div>
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-1.5">
              <h3
                onClick={() => onView(property.id)}
                className="font-bold text-sm text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer flex-1 leading-tight"
              >
                {property.title}
              </h3>

              {/* Mobile three-dot */}
              {hasMenu && (
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                  {showMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                      />
                      <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-20">
                        <button
                          onClick={() => {
                            onView(property.id);
                            setShowMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        {onEdit && (
                          <button
                            onClick={() => {
                              onEdit(property.id);
                              setShowMenu(false);
                            }}
                            className="w-full px-3 py-2 text-left text-xs hover:bg-blue-50 flex items-center gap-2 text-blue-600"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => {
                              onDelete(property.id);
                              setShowMenu(false);
                            }}
                            className="w-full px-3 py-2 text-left text-xs hover:bg-red-50 flex items-center gap-2 text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        )}
                        <div className="border-t border-gray-100 my-0.5" />
                        <button
                          onClick={() => {
                            shareViaEmail(property);
                            setShowMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                        >
                          <Mail className="w-3.5 h-3.5" /> Share by Email
                        </button>
                        <button
                          onClick={() => {
                            shareViaWhatsApp(property);
                            setShowMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-green-50 flex items-center gap-2 text-emerald-600"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> Share on
                          WhatsApp
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 text-gray-500 text-[11px]">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">
                {property.locality}, {property.city.name}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-black text-gray-900">
                  {getCurrencySymbol(property.currency)}
                  {property.price.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-400 uppercase ml-1">
                  {property.purpose}
                </span>
              </div>
              <StatusBadge status={property.status} />
            </div>
          </div>
        </div>

        {/* Spec chips */}
        <div className="px-3 pb-2">
          <SpecRow />
        </div>

        {/* Owner box */}
        <div className="px-3 pb-2.5">
          <OwnerBox />
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100">
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <Eye className="w-3 h-3" /> {property.viewCount}
          </span>
          <div className="flex items-center gap-0.5">
            {canFeature && (
              <FeaturedToggle
                propertyId={property.id}
                isFeatured={property.featured}
                compact
                onToggle={handleFeaturedToggle}
              />
            )}
            <ActionRow />
          </div>
        </div>

        {canReview && (
          <div className="px-3 pb-3 pt-1 border-t border-gray-100">
            <QuickReviewActions property={property} onSuccess={() => {}} />
          </div>
        )}
      </div>

      {/* ── Desktop layout (md+) ──────────────────────────────────────────── */}
      <div className="hidden md:block">
        <div className="flex gap-4 lg:gap-5 p-4 lg:p-5">
          {/* Thumbnail */}
          <div className="relative w-40 lg:w-52 h-32 lg:h-40 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
            {coverImage ? (
              <img
                src={coverImage}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Home className="w-10 h-10 text-gray-300" />
              </div>
            )}
            {property.featured && (
              <div className="absolute top-2 left-2">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded text-[10px] font-bold">
                  <Star className="w-3 h-3 fill-current" /> FEATURED
                </div>
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0 flex flex-col gap-2.5">
            {/* Title row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3
                    onClick={() => onView(property.id)}
                    className="font-bold text-lg lg:text-xl text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors cursor-pointer"
                  >
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
                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">
                    {property.locality}, {property.city.name}
                  </span>
                </div>
              </div>
              <StatusBadge status={property.status} />
            </div>

            {/* Spec chips */}
            <SpecRow />

            {/* Owner box */}
            <OwnerBox />

            {/* Bottom row: price + actions */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100 mt-auto">
              <div className="flex items-baseline gap-2">
                <span className="text-xl lg:text-2xl font-black text-gray-900">
                  {getCurrencySymbol(property.currency)}
                  {property.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 uppercase font-semibold">
                  {property.purpose}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <span className="flex items-center gap-1 text-[11px] text-gray-400 mr-1.5">
                  <Eye className="w-3 h-3" /> {property.viewCount}
                </span>
                <ActionRow />
                {canReview && (
                  <>
                    <div className="w-px h-4 bg-gray-200 mx-0.5" />
                    <QuickReviewActions
                      property={property}
                      onSuccess={() => {}}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
