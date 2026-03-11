// AdCard.tsx
import React from "react";
import {
  ArrowRight,
  Sparkles,
  BadgeCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdCardProps {
  position?: number;
}

export const AdCard: React.FC<AdCardProps> = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
        flex-shrink-0
        rounded-xl sm:rounded-2xl overflow-hidden
        bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700
        border border-blue-500
        shadow-lg shadow-blue-500/20
        relative group cursor-pointer
        transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.01]
      "
      onClick={() => navigate("/list-property")}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right,rgba(255,255,255,.08) 1px,transparent 1px)," +
            "linear-gradient(to bottom,rgba(255,255,255,.08) 1px,transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Amber glow blob */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-400/30 rounded-full blur-2xl pointer-events-none" />

      <div className="relative p-4 sm:p-5 flex flex-col h-full min-h-[320px] sm:min-h-[360px]">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 bg-amber-400/20 border border-amber-300/30 rounded-full mb-4">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span className="text-[10px] sm:text-xs font-bold text-amber-200 uppercase tracking-wide">
            FREE Listing
          </span>
        </div>

        {/* Headline */}
        <h3 className="text-base sm:text-lg font-black text-white leading-snug mb-1.5">
          List Your Property
          <span className="text-amber-300"> Today</span>
        </h3>
        <p className="text-[11px] sm:text-xs text-blue-200 font-medium mb-4 leading-relaxed">
          Reach lakhs of genuine buyers on Property4India.com
        </p>

        {/* Mini stats */}
        <div className="space-y-2 mb-5">
          {[
            { icon: Users, label: "73K+ active buyers" },
            { icon: TrendingUp, label: "3× faster sales" },
            { icon: BadgeCheck, label: "Verified listing badge" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/10 rounded-md flex items-center justify-center flex-shrink-0">
                <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-200" />
              </div>
              <span className="text-[10px] sm:text-xs text-blue-100 font-medium">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate("/list-property");
          }}
          className="
            w-full flex items-center justify-center gap-1.5
            py-2 sm:py-2.5
            bg-white hover:bg-blue-50
            text-blue-700 font-black
            text-[11px] sm:text-xs
            rounded-lg sm:rounded-xl
            transition-all hover:shadow-lg
          "
        >
          Post Property Free
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>

        {/* Fine print */}
        <p className="text-[9px] sm:text-[10px] text-blue-300/70 text-center mt-2">
          No credit card required
        </p>
      </div>
    </div>
  );
};
