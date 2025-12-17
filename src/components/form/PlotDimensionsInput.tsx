import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

interface PlotDimensionsInputProps {
  value: string | null | undefined;
  onChange: (value: string | null) => void;
  onBlur?: () => void;
  error?: string;
  label?: string;
  required?: boolean;
}

export const PlotDimensionsInput: React.FC<PlotDimensionsInputProps> = ({
  value,
  onChange,
  onBlur,
  error,
  label = "Plot Dimensions",
  required = false,
}) => {
  // Parse existing value
  const parseDimensions = (dimensionString: string | null | undefined) => {
    if (!dimensionString) return { length: "", width: "", unit: "ft" };

    // Match patterns like "50x100 ft", "50 x 100 m", "50x100ft"
    const match = dimensionString.match(
      /^(\d+\.?\d*)\s*[xX×]\s*(\d+\.?\d*)\s*([a-zA-Z]+)?$/
    );

    if (match) {
      return {
        length: match[1],
        width: match[2],
        unit: match[3] || "ft",
      };
    }

    return { length: "", width: "", unit: "ft" };
  };

  const [dimensions, setDimensions] = useState(parseDimensions(value));

  // Update parent when dimensions change
  useEffect(() => {
    const { length, width, unit } = dimensions;

    if (length && width && unit) {
      onChange(`${length}x${width} ${unit}`);
    } else if (!length && !width) {
      onChange(null);
    }
  }, [dimensions.length, dimensions.width, dimensions.unit]);

  const handleLengthChange = (newLength: string) => {
    // Allow only numbers and decimal point
    if (newLength === "" || /^\d*\.?\d*$/.test(newLength)) {
      setDimensions((prev) => ({ ...prev, length: newLength }));
    }
  };

  const handleWidthChange = (newWidth: string) => {
    // Allow only numbers and decimal point
    if (newWidth === "" || /^\d*\.?\d*$/.test(newWidth)) {
      setDimensions((prev) => ({ ...prev, width: newWidth }));
    }
  };

  const handleUnitChange = (newUnit: string) => {
    setDimensions((prev) => ({ ...prev, unit: newUnit }));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex items-center gap-2">
        {/* Length Input */}
        <div className="flex-1">
          <input
            type="text"
            inputMode="decimal"
            value={dimensions.length}
            onChange={(e) => handleLengthChange(e.target.value)}
            onBlur={onBlur}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
              error ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="Length"
          />
          <p className="mt-1 text-xs text-gray-500">Length</p>
        </div>

        {/* × Symbol */}
        <div className="text-2xl font-bold text-gray-400 pb-5">×</div>

        {/* Width Input */}
        <div className="flex-1">
          <input
            type="text"
            inputMode="decimal"
            value={dimensions.width}
            onChange={(e) => handleWidthChange(e.target.value)}
            onBlur={onBlur}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
              error ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="Width"
          />
          <p className="mt-1 text-xs text-gray-500">Width</p>
        </div>

        {/* Unit Selector */}
        <div className="w-24">
          <select
            value={dimensions.unit}
            onChange={(e) => handleUnitChange(e.target.value)}
            className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          >
            <option value="ft">ft</option>
            <option value="m">m</option>
            <option value="yd">yd</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">Unit</p>
        </div>
      </div>

      {/* Preview */}
      {dimensions.length && dimensions.width && dimensions.unit && (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
          <div className="text-xs font-medium text-blue-700">
            Preview: {dimensions.length} × {dimensions.width} {dimensions.unit}
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}

      <p className="text-xs text-gray-500">
        Enter the plot dimensions (e.g., 50 × 100 ft)
      </p>
    </div>
  );
};
