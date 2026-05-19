import { Clock, Send, CheckCheck, Check, X, AlertCircle } from "lucide-react";

interface Props {
  status: string;
  channel: "whatsapp" | "sms" | "email";
  size?: "xs" | "sm";
}

const CONFIG: Record<
  string,
  { label: string; icon: typeof Clock; color: string }
> = {
  PENDING: { label: "Pending", icon: Clock, color: "text-gray-400" },
  SENT: { label: "Sent", icon: Send, color: "text-blue-500" },
  DELIVERED: { label: "Delivered", icon: Check, color: "text-emerald-500" },
  READ: { label: "Read", icon: CheckCheck, color: "text-sky-500" },
  FAILED: { label: "Failed", icon: X, color: "text-red-500" },
  UNDELIVERED: {
    label: "Undelivered",
    icon: AlertCircle,
    color: "text-amber-500",
  },
};

export const MessageStatusBadge: React.FC<Props> = ({
  status,
  size = "xs",
}) => {
  const cfg = CONFIG[status] ?? CONFIG.PENDING;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${cfg.color} ${size === "xs" ? "text-[10px]" : "text-xs"}`}
    >
      <Icon className={size === "xs" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {cfg.label}
    </span>
  );
};
