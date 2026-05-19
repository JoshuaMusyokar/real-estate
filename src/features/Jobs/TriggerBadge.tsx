import type { WorkflowTrigger } from "../../types/messaging-management";

const CFG: Record<WorkflowTrigger, { label: string; cls: string }> = {
  LEAD_CREATED: {
    label: "Lead Created",
    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  FORM_SUBMISSION: {
    label: "Form Submission",
    cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  LEAD_STAGE_CHANGED: {
    label: "Stage Changed",
    cls: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200 dark:border-violet-800",
  },
  APPOINTMENT_SCHEDULED: {
    label: "Appt. Scheduled",
    cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  APPOINTMENT_COMPLETED: {
    label: "Appt. Completed",
    cls: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800",
  },
  PROPERTY_INQUIRY: {
    label: "Property Inquiry",
    cls: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  },
  NO_RESPONSE_TIMEOUT: {
    label: "No Response (48h)",
    cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  },
  LEAD_INACTIVE: {
    label: "Lead Inactive (7d)",
    cls: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700",
  },
};

interface Props {
  trigger: WorkflowTrigger;
  size?: "xs" | "sm";
}

export const TriggerBadge: React.FC<Props> = ({ trigger, size = "sm" }) => {
  const { label, cls } = CFG[trigger] ?? CFG.LEAD_CREATED;
  const sz =
    size === "xs" ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-0.5";
  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border ${cls} ${sz}`}
    >
      {label}
    </span>
  );
};
