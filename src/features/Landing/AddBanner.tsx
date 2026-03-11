import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export const AdBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-4 sm:py-6">
      <div className="max-w-full mx-auto px-3 sm:px-5 lg:px-8">
        <div
          onClick={() => navigate("/properties/search")}
          className="
            relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700
            rounded-2xl sm:rounded-3xl overflow-hidden
            h-36 sm:h-48 lg:h-56
            cursor-pointer group
            hover:shadow-2xl hover:shadow-blue-500/30
            transition-all duration-300
          "
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1400&h=300&fit=crop"
              alt=""
              aria-hidden
              className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700"
            />
            {/* Subtle grid overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center justify-between px-4 sm:px-8 lg:px-14 gap-4">
            {/* Left — headline + CTA */}
            <div className="flex-1 min-w-0">
              <p className="text-blue-200 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-1 sm:mb-2">
                Exclusive Listings
              </p>
              <h2 className="text-base sm:text-2xl lg:text-3xl font-black text-white leading-tight mb-2 sm:mb-4">
                Find Your
                <br className="hidden sm:block" />
                <span className="text-amber-300"> Dream Home</span> Today
              </h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/properties/search");
                }}
                className="
                  inline-flex items-center gap-1.5 sm:gap-2
                  px-3 sm:px-5 py-1.5 sm:py-2.5
                  bg-white hover:bg-blue-50
                  text-blue-700 font-black
                  text-[10px] sm:text-sm
                  rounded-lg sm:rounded-xl
                  transition-all hover:shadow-lg hover:shadow-white/30
                "
              >
                Explore Properties
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Right — stats (hidden on smallest screens) */}
            <div className="hidden sm:flex items-center gap-5 sm:gap-8 flex-shrink-0">
              {[
                { value: "50K+", label: "Properties" },
                { value: "10K+", label: "Happy Customers" },
                { value: "500+", label: "Verified Builders" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                    {value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-blue-200 font-semibold mt-0.5 whitespace-nowrap">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile-only compact stats strip */}
            <div className="flex sm:hidden flex-col gap-2 flex-shrink-0 text-right">
              {[
                { value: "50K+", label: "Properties" },
                { value: "10K+", label: "Customers" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-base font-black text-white leading-none">
                    {value}
                  </div>
                  <div className="text-[9px] text-blue-200 font-semibold">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>
    </section>
  );
};
