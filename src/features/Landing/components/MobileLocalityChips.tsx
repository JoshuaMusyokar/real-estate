import { createPortal } from "react-dom";
import type { SuggestionItem } from "../../../types/search";
import { useState } from "react";
import { X } from "lucide-react";

const VISIBLE_CHIPS = 3;

export const MobileLocalityChips: React.FC<{
  localities: SuggestionItem[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}> = ({ localities, onRemove, onClearAll }) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const visible = localities.slice(0, VISIBLE_CHIPS);
  const overflow = localities.length - VISIBLE_CHIPS;

  return (
    <>
      {/* ── Inline strip — always one line ───────────────────────────── */}
      <div className="px-1 pt-2 flex items-center gap-1.5 flex-wrap">
        {visible.map((loc) => (
          <span
            key={loc.id}
            className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"
          >
            {loc.name}
            <button
              onClick={() => onRemove(loc.id)}
              className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-blue-200 transition-colors"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}

        {/* "+N more" opens the sheet */}
        {overflow > 0 && (
          <button
            onClick={() => setSheetOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white rounded-full text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            +{overflow} more
          </button>
        )}

        {localities.length >= 2 && (
          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-auto"
          >
            <X className="w-2.5 h-2.5" /> Clear all
          </button>
        )}
      </div>

      {/* ── Bottom sheet — full selected list ────────────────────────── */}
      {sheetOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex flex-col justify-end"
            style={{
              background: "rgba(15,23,42,0.55)",
              backdropFilter: "blur(3px)",
            }}
            onClick={() => setSheetOpen(false)}
          >
            <div
              className="bg-white rounded-t-2xl shadow-2xl overflow-hidden"
              style={{ maxHeight: "70vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sheet header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
                <div>
                  <p className="text-sm font-black text-gray-900">
                    Selected Localities
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {localities.length} area{localities.length !== 1 ? "s" : ""}{" "}
                    selected
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {localities.length >= 2 && (
                    <button
                      onClick={() => {
                        onClearAll();
                        setSheetOpen(false);
                      }}
                      className="text-xs font-semibold text-red-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setSheetOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Scrollable list */}
              <div
                className="overflow-y-auto"
                style={{ maxHeight: "calc(70vh - 64px)" }}
              >
                {localities.map((loc, i) => (
                  <div
                    key={loc.id}
                    className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-black text-blue-600">
                          {i + 1}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {loc.name}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        onRemove(loc.id);
                        // auto-close if last one removed
                        if (localities.length === 1) setSheetOpen(false);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0 ml-2"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Done button */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => setSheetOpen(false)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
