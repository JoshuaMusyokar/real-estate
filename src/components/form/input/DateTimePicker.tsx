import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import type { DateOption, Hook } from "flatpickr/dist/types/options";
import Label from "../Label";
import { CalendarIcon } from "lucide-react";

type FlatpickrInstance = ReturnType<typeof flatpickr>;

interface Props {
  id: string;
  label?: string;
  placeholder?: string;
  defaultDate?: DateOption;
  minDate?: DateOption | "today";
  maxDate?: DateOption;
  disabled?: boolean;
  onChange?: Hook | Hook[];
  enableTime?: boolean;
  time24hr?: boolean;
  minuteIncrement?: number;
}

export const DateTimePicker: React.FC<Props> = ({
  id,
  label,
  placeholder,
  defaultDate,
  minDate,
  maxDate,
  disabled,
  onChange,
  enableTime = true,
  time24hr = false,
  minuteIncrement = 15,
}) => {
  const instanceRef = useRef<FlatpickrInstance | null>(null);

  useEffect(() => {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (!el) return;

    instanceRef.current = flatpickr(el, {
      mode: "single",
      static: true,
      monthSelectorType: "static",
      enableTime,
      time_24hr: time24hr,
      minuteIncrement,
      dateFormat: enableTime ? "Y-m-d H:i" : "Y-m-d",
      altInput: true,
      altFormat: enableTime
        ? time24hr
          ? "D, d M Y — H:i"
          : "D, d M Y — h:i K"
        : "D, d M Y",
      defaultDate,
      minDate,
      maxDate,
      onChange,
      defaultHour: defaultDate ? undefined : new Date().getHours(),
      defaultMinute: defaultDate ? undefined : 0,
    });

    return () => {
      // ReturnType<typeof flatpickr> can be an array when selector used —
      // guard against that before calling destroy()
      const inst = instanceRef.current;
      if (inst && !Array.isArray(inst)) {
        inst.destroy();
      }
      instanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Update minDate dynamically without destroying instance
  useEffect(() => {
    const inst = instanceRef.current;
    if (inst && !Array.isArray(inst) && minDate !== undefined) {
      inst.set("minDate", minDate);
    }
  }, [minDate]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <input
          id={id}
          placeholder={
            placeholder ??
            (enableTime ? "Select date and time…" : "Select date…")
          }
          disabled={disabled}
          className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs
            placeholder:text-gray-400 focus:outline-hidden focus:ring-3
            dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30
            bg-transparent text-gray-800
            border-gray-300 focus:border-brand-300 focus:ring-brand-500/20
            dark:border-gray-700 dark:focus:border-brand-800
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        />
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalendarIcon className="size-6" />
        </span>
      </div>
    </div>
  );
};

export default DateTimePicker;
