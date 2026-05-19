import type { TemplateCategory } from "../../../types/messaging-management";

const COLORS: Record<string, string> = {
  appointment:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  follow_up: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  welcome:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  reminder:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  campaign:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  custom: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};
const LABEL: Record<string, string> = {
  appointment: "Appointment",
  follow_up: "Follow-up",
  welcome: "Welcome",
  reminder: "Reminder",
  campaign: "Campaign",
  custom: "Custom",
};

export const CategoryBadge: React.FC<{
  category: TemplateCategory | string;
}> = ({ category }) => (
  <span
    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${COLORS[category] ?? COLORS.custom}`}
  >
    {LABEL[category] ?? category}
  </span>
);
