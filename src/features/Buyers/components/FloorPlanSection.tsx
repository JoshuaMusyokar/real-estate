import React, { useState, useRef, useEffect } from "react";
import {
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
  Download,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
} from "lucide-react";

interface PropertyImage {
  url: string;
  order: number | null;
  caption: string | null;
  isFloorPlan: boolean | null;
  key: string | null;
  isCover: boolean | null;
}

interface FloorPlanSectionProps {
  images: PropertyImage[];
}

export const FloorPlanSection: React.FC<FloorPlanSectionProps> = ({
  images,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const floorPlans = images
    .filter((img) => img.isFloorPlan === true)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") {
        setSelectedIndex(null);
        setZoomLevel(1);
      }
      if (e.key === "ArrowLeft" && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
        setZoomLevel(1);
      }
      if (e.key === "ArrowRight" && selectedIndex < floorPlans.length - 1) {
        setSelectedIndex(selectedIndex + 1);
        setZoomLevel(1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIndex, floorPlans.length]);

  const scrollToSlide = (i: number) => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollTo({
      left: carouselRef.current.offsetWidth * i,
      behavior: "smooth",
    });
    setCurrentSlide(i);
  };

  const handleScroll = () => {
    if (!carouselRef.current) return;
    setCurrentSlide(
      Math.round(
        carouselRef.current.scrollLeft / carouselRef.current.offsetWidth,
      ),
    );
  };

  const handleDownload = async (url: string, i: number) => {
    try {
      const blob = await fetch(url).then((r) => r.blob());
      const a = Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(blob),
        download: `floor-plan-${i + 1}.jpg`,
      });
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch {
      console.error("Download failed");
    }
  };

  if (!floorPlans.length) return null;

  return (
    <div className="bg-white border border-blue-100 rounded-xl overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-blue-50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200 flex-shrink-0">
            <Grid3x3 className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              Floor Plans
            </h2>
            <p className="text-[11px] text-gray-400">
              {floorPlans.length}{" "}
              {floorPlans.length === 1 ? "layout" : "layouts"} available
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
          {floorPlans.length} plan{floorPlans.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Carousel ───────────────────────────────────────────────────────── */}
      <div className="relative bg-slate-50/60 px-3 sm:px-4 py-4 sm:py-5">
        {/* Nav arrows */}
        {currentSlide > 0 && (
          <button
            onClick={() => scrollToSlide(currentSlide - 1)}
            className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white hover:bg-blue-50 border border-blue-100 shadow-sm rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-blue-600" />
          </button>
        )}
        {currentSlide < floorPlans.length - 1 && (
          <button
            onClick={() => scrollToSlide(currentSlide + 1)}
            className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white hover:bg-blue-50 border border-blue-100 shadow-sm rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-blue-600" />
          </button>
        )}

        {/* Slides */}
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {floorPlans.map((img, i) => (
            <div
              key={img.key || i}
              className="flex-shrink-0 w-full snap-center px-1 sm:px-2"
            >
              <div className="bg-white border border-blue-100 rounded-xl overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-3/5 relative bg-blue-50/40 group">
                    <div className="aspect-[16/10] relative">
                      <img
                        src={img.url}
                        alt={img.caption || `Floor Plan ${i + 1}`}
                        className="w-full h-full object-contain p-3 sm:p-5 cursor-pointer"
                        onClick={() => {
                          setSelectedIndex(i);
                          setZoomLevel(1);
                        }}
                      />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => {
                            setSelectedIndex(i);
                            setZoomLevel(1);
                          }}
                          className="bg-white text-blue-600 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg hover:bg-blue-600 hover:text-white transition-colors"
                        >
                          <Maximize2 className="w-3.5 h-3.5" /> Full Screen
                        </button>
                      </div>

                      {/* Plan badge */}
                      <div className="absolute top-2.5 left-2.5 bg-blue-600 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm">
                        Plan {i + 1}/{floorPlans.length}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="sm:w-2/5 p-4 sm:p-5 flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-blue-50">
                    <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full text-[11px] font-bold mb-3">
                      <Grid3x3 className="w-3 h-3" /> Floor Plan
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5">
                      {img.caption || `Layout ${i + 1}`}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed mb-4">
                      Architectural floor plan showing the complete layout, room
                      dimensions, and spatial arrangement.
                    </p>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setSelectedIndex(i);
                          setZoomLevel(1);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm shadow-blue-200"
                      >
                        <Maximize2 className="w-3.5 h-3.5" /> View Full Screen
                      </button>
                      <button
                        onClick={() => handleDownload(img.url, i)}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-white hover:bg-blue-50 text-blue-600 text-xs font-bold rounded-xl border border-blue-200 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        {floorPlans.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {floorPlans.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "w-5 bg-blue-600" : "w-1.5 bg-gray-200 hover:bg-blue-300"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center">
          {/* Close */}
          <button
            onClick={() => {
              setSelectedIndex(null);
              setZoomLevel(1);
            }}
            className="fixed top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center z-[110] transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Zoom + download bar */}
          <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-2 flex items-center gap-2 z-[110]">
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.5))}
              disabled={zoomLevel <= 0.5}
              className="w-7 h-7 text-white hover:bg-white/20 rounded-full flex items-center justify-center disabled:opacity-40 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-white text-xs font-bold w-10 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
              disabled={zoomLevel >= 3}
              className="w-7 h-7 text-white hover:bg-white/20 rounded-full flex items-center justify-center disabled:opacity-40 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-white/30 mx-1" />
            <button
              onClick={() =>
                handleDownload(floorPlans[selectedIndex].url, selectedIndex)
              }
              className="w-7 h-7 text-white hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Counter */}
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 z-[110]">
            <span className="text-white text-xs font-bold">
              {selectedIndex + 1} / {floorPlans.length}
            </span>
          </div>

          {/* Nav arrows */}
          {selectedIndex > 0 && (
            <button
              onClick={() => {
                setSelectedIndex(selectedIndex - 1);
                setZoomLevel(1);
              }}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center z-[110] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          )}
          {selectedIndex < floorPlans.length - 1 && (
            <button
              onClick={() => {
                setSelectedIndex(selectedIndex + 1);
                setZoomLevel(1);
              }}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center justify-center z-[110] transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          )}

          {/* Image */}
          <div className="max-w-[92vw] max-h-[82vh] overflow-auto flex items-center justify-center p-4 sm:p-10">
            <img
              src={floorPlans[selectedIndex].url}
              alt={
                floorPlans[selectedIndex].caption ||
                `Floor Plan ${selectedIndex + 1}`
              }
              className="transition-transform duration-300 rounded-lg max-w-full"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "center center",
              }}
            />
          </div>

          {/* Caption */}
          {floorPlans[selectedIndex].caption && (
            <div className="fixed bottom-14 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 max-w-sm z-[110]">
              <p className="text-white text-xs font-medium text-center">
                {floorPlans[selectedIndex].caption}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
