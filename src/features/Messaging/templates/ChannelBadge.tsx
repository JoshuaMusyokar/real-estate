import { MessageSquare, Smartphone, Mail } from "lucide-react";
import type { TemplateChannel } from "../../../types/messaging-management";

interface Props {
  channel: TemplateChannel;
  size?: "xs" | "sm" | "md";
}

const CFG = {
  whatsapp: {
    label: "WhatsApp",
    icon: MessageSquare,
    cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  sms: {
    label: "SMS",
    icon: Smartphone,
    cls: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  },
  email: {
    label: "Email",
    icon: Mail,
    cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
} as const;

export const ChannelBadge: React.FC<Props> = ({ channel, size = "sm" }) => {
  const { label, icon: Icon, cls } = CFG[channel] ?? CFG.email;
  const sz =
    size === "xs"
      ? "text-[10px] px-1.5 py-0.5 gap-0.5"
      : size === "sm"
        ? "text-[11px] px-2 py-0.5 gap-1"
        : "text-xs px-2.5 py-1 gap-1";
  const ic = size === "xs" ? "w-2.5 h-2.5" : "w-3 h-3";
  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border ${cls} ${sz}`}
    >
      <Icon className={ic} /> {label}
    </span>
  );
};
