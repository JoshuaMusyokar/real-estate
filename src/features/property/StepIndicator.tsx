import { Check } from "lucide-react";
import { Fragment, type FC } from "react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export const StepIndicator: FC<StepIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="mb-6 sm:mb-8">
      {/* Desktop View - Horizontal */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => (
          <Fragment key={index}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  index < currentStep
                    ? "bg-success-600 dark:bg-success-500 text-white shadow-lg"
                    : index === currentStep
                      ? "bg-brand-600 dark:bg-brand-500 text-white shadow-lg ring-4 ring-brand-100 dark:ring-brand-900/30"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <span className="text-sm sm:text-base">{index + 1}</span>
                )}
              </div>
              <div
                className={`mt-2 text-xs sm:text-sm font-semibold text-center transition-colors ${
                  index <= currentStep
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 sm:mx-4 rounded transition-all ${
                  index < currentStep
                    ? "bg-success-600 dark:bg-success-500"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            )}
          </Fragment>
        ))}
      </div>

      {/* Mobile View - Compact */}
      <div className="md:hidden">
        {/* Current Step Display */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg ${
                currentStep === steps.length - 1
                  ? "bg-success-600 text-white"
                  : "bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-900/30"
              }`}
            >
              {currentStep === steps.length - 1 ? (
                <Check className="w-5 h-5" />
              ) : (
                currentStep + 1
              )}
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Step {currentStep + 1} of {steps.length}
              </div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                {steps[currentStep]}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-brand-500 transition-all duration-300 ease-out"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
          {/* Step Dots */}
          <div className="absolute top-0 left-0 right-0 flex justify-between px-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all -mt-px ${
                  index <= currentStep
                    ? "bg-brand-600 dark:bg-brand-400 scale-125"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mini Step List - Collapsible */}
        <details className="mt-4">
          <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 font-medium">
            View all steps
          </summary>
          <div className="mt-3 space-y-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    index < currentStep
                      ? "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400"
                      : index === currentStep
                        ? "bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-[10px] font-bold">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`${
                    index <= currentStep
                      ? "text-gray-900 dark:text-white font-medium"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
};
