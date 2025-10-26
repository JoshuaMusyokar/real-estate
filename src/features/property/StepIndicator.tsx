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
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <Fragment key={index}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  index < currentStep
                    ? "bg-green-600 text-white"
                    : index === currentStep
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-6 h-6" />
                ) : (
                  index + 1
                )}
              </div>
              <div
                className={`mt-2 text-sm font-semibold ${
                  index <= currentStep ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {step}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 rounded transition-all ${
                  index < currentStep ? "bg-green-600" : "bg-gray-200"
                }`}
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
