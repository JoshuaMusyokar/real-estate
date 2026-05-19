import { MessageSquare, Smartphone, Plus } from "lucide-react";
import { TemplateCard } from "./TemplateCard";
import type { MessageTemplate } from "../../../types/messaging-management";

interface Props {
  templates: MessageTemplate[];
  isLoading: boolean;
  channel: "whatsapp" | "sms";
  onEdit: (t: MessageTemplate) => void;
  onDelete: (t: MessageTemplate) => void;
  onToggle: (id: string) => void;
  onDuplicate: (t: MessageTemplate) => void;
  onCreateNew: () => void;
}

const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5 animate-pulse">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3" />
    <div className="flex gap-1.5 mb-3">
      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
    </div>
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl h-16 mb-3" />
    <div className="flex gap-1 mb-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"
        />
      ))}
    </div>
    <div className="h-px bg-gray-100 dark:bg-gray-800 mb-2" />
    <div className="flex justify-between">
      <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-lg"
          />
        ))}
      </div>
    </div>
  </div>
);

export const TemplateList: React.FC<Props> = ({
  templates,
  isLoading,
  channel,
  onEdit,
  onDelete,
  onToggle,
  onDuplicate,
  onCreateNew,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    const Icon = channel === "whatsapp" ? MessageSquare : Smartphone;
    const color = channel === "whatsapp" ? "text-green-400" : "text-purple-400";
    const bg =
      channel === "whatsapp"
        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
        : "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800";

    return (
      <div
        className={`flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed ${bg}`}
      >
        <Icon className={`w-12 h-12 ${color} mb-4`} />
        <p className="text-sm font-black text-gray-900 dark:text-white mb-1">
          No {channel === "whatsapp" ? "WhatsApp" : "SMS"} templates yet
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 text-center max-w-xs">
          Create your first template to start sending personalised messages
        </p>
        <button
          onClick={onCreateNew}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors
            ${channel === "whatsapp" ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"}`}
        >
          <Plus className="w-3.5 h-3.5" />
          Create {channel === "whatsapp" ? "WhatsApp" : "SMS"} Template
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
      {templates.map((t) => (
        <TemplateCard
          key={t.id}
          template={t}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
};
