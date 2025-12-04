import { ArrowRight } from "lucide-react";

// Full Width Ad Banner
export const AdBanner: React.FC = () => {
  return (
    <section className="py-6">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl overflow-hidden h-64 group cursor-pointer hover:shadow-2xl transition-all">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1400&h=300&fit=crop"
              alt="Banner"
              className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="relative h-full flex items-center justify-between px-16">
            <div>
              <h2 className="text-4xl font-black text-white mb-4">
                Find Your Dream Home Today
              </h2>
              <p className="text-white/90 text-lg mb-6">
                Exclusive properties with verified listings
              </p>
              <button className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-black hover:scale-105 transition-transform flex items-center gap-2">
                <span>Explore Properties</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-5xl font-black text-white mb-2">50K+</div>
                <div className="text-white/90 font-bold">Properties</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-white mb-2">10K+</div>
                <div className="text-white/90 font-bold">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-white mb-2">500+</div>
                <div className="text-white/90 font-bold">Verified Builders</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
