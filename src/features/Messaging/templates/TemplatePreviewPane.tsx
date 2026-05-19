/* eslint-disable @typescript-eslint/no-unused-vars */
import { MessageSquare, Smartphone } from "lucide-react";

interface Props {
  channel: "whatsapp" | "sms";
  preview: string;
  usedVars: string[];
  charCount: number;
}

export const TemplatePreviewPane: React.FC<Props> = ({
  channel,
  preview,
  usedVars,
  charCount,
}) => {
  const isWA = channel === "whatsapp";
  const Icon = isWA ? MessageSquare : Smartphone;
  const iconCls = isWA ? "text-green-500" : "text-purple-500";
  const bubbleCls = isWA
    ? "bg-[#dcf8c6] text-gray-900"
    : "bg-blue-600 text-white";

  const segments = charCount === 0 ? 0 : Math.ceil(charCount / 160);

  return (
    <div className="flex flex-col h-full">
      {/* Phone header */}
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-t-2xl
        ${isWA ? "bg-[#075e54]" : "bg-gray-700"}`}
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-white">
            {isWA ? "WhatsApp Preview" : "SMS Preview"}
          </p>
          <p className="text-[9px] text-white/70">
            {isWA ? "Sandbox" : "From: +1XXXXXXXXXX"}
          </p>
        </div>
      </div>

      {/* Chat area */}
      <div
        className={`flex-1 min-h-[160px] px-3 py-4 rounded-b-2xl
        ${isWA ? "bg-[#e5ddd5]" : "bg-gray-100 dark:bg-gray-800"}`}
      >
        {preview ? (
          <div className="flex justify-end">
            <div
              className={`max-w-[85%] rounded-2xl rounded-br-sm px-3 py-2 shadow-sm ${bubbleCls}`}
            >
              <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">
                {/* Bold/italic markers visible in WA */}
                {isWA
                  ? preview
                      .replace(/\*(.+?)\*/g, "$1")
                      .replace(/_(.+?)_/g, "$1")
                  : preview}
              </p>
              <p
                className={`text-[9px] text-right mt-1 ${isWA ? "text-gray-500" : "text-white/70"}`}
              >
                12:00 ✓✓
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-[11px] text-gray-400 italic">
              Start typing to see preview…
            </p>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-gray-400">Characters</span>
          <span
            className={`font-mono font-bold ${charCount > 4096 ? "text-red-500" : "text-gray-600 dark:text-gray-400"}`}
          >
            {charCount} / 4096
          </span>
        </div>
        {!isWA && (
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-gray-400">SMS Segments</span>
            <span
              className={`font-mono font-bold ${segments > 3 ? "text-amber-500" : "text-gray-600 dark:text-gray-400"}`}
            >
              {segments} {segments > 1 ? `(${segments} × cost)` : ""}
            </span>
          </div>
        )}
        {usedVars.length > 0 && (
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-gray-400">Tokens used</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {usedVars.length}
            </span>
          </div>
        )}
        {isWA && (
          <p className="text-[10px] text-gray-400">
            *bold* _italic_ supported in WhatsApp
          </p>
        )}
      </div>
    </div>
  );
};
