import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Shield, TrendingUp, Users } from "lucide-react";
import appLogo from "../../assets/p4i.png";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const stats = [
  { icon: Users, value: "73K+", label: "Active Buyers" },
  { icon: TrendingUp, value: "3×", label: "Faster Sales" },
  { icon: Shield, value: "100%", label: "RERA Verified" },
];

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* ── Left panel — branding (hidden on mobile) ──────────────────────── */}
      <div
        className="
        hidden lg:flex lg:w-[52%] xl:w-[55%]
        relative flex-col justify-between overflow-hidden
        bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700
        p-10 xl:p-14
      "
      >
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo */}
        <Link to="/" className="relative z-10 flex items-center gap-2 w-fit">
          <img
            src={appLogo}
            alt="property4india"
            className="h-8 brightness-0 invert"
          />
        </Link>

        {/* Centre copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full w-fit mb-6">
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-white/80 text-xs font-medium tracking-wide">
              India's Trusted Property Platform
            </span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-4">
            Find Your
            <span className="block text-amber-300">Dream Home.</span>
          </h1>

          <p className="text-white/70 text-base leading-relaxed max-w-sm">
            Browse verified listings, connect with trusted agents, and make your
            next move with confidence.
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-6 mt-10">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-amber-300" />
                  <span className="text-white font-black text-xl">{value}</span>
                </div>
                <span className="text-white/60 text-[11px] font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 border-t border-white/10 pt-6">
          <p className="text-white/50 text-xs leading-relaxed italic max-w-xs">
            "Found our perfect 3BHK in just 4 days. The verified listings saved
            us so much time."
          </p>
          <p className="text-white/40 text-[11px] mt-2 font-medium">
            — Priya S., Mumbai
          </p>
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-blue-50">
          <Link to="/">
            <img
              src="/src/assets/p4i.png"
              alt="property4india"
              className="h-7"
            />
          </Link>
          <Link
            to="/"
            className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            ← Back to home
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10 lg:py-0">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>

        {/* Footer */}
        <div className="lg:hidden text-center px-4 pb-6">
          <p className="text-[11px] text-gray-400">
            © {new Date().getFullYear()} Property4India. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
