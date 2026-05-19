// ─────────────────────────────────────────────────────────────────────────────
// useTemplateEditor.ts
// Form state, validation, and preview logic for create/edit template modal.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useRef } from "react";
import type {
  MessageTemplate,
  MessageTemplateInput,
} from "../types/messaging-management";

export interface TemplateFormState {
  name: string;
  channel: "whatsapp" | "sms";
  category: string;
  content: string;
  isActive: boolean;
}

export interface TemplateFormErrors {
  name?: string;
  content?: string;
}

const INITIAL: TemplateFormState = {
  name: "",
  channel: "whatsapp",
  category: "custom",
  content: "",
  isActive: true,
};

export function useTemplateEditor(initial?: MessageTemplate) {
  const [form, setForm] = useState<TemplateFormState>(
    initial
      ? {
          name: initial.name,
          channel: initial.channel === "email" ? "whatsapp" : initial.channel,
          category: initial.category,
          content: initial.content,
          isActive: initial.isActive,
        }
      : INITIAL,
  );

  const [errors, setErrors] = useState<TemplateFormErrors>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const update = useCallback(
    (patch: Partial<TemplateFormState>) =>
      setForm((prev) => ({ ...prev, ...patch })),
    [],
  );

  const insertToken = useCallback((token: string) => {
    const el = textareaRef.current;
    if (!el) {
      setForm((prev) => ({ ...prev, content: prev.content + token }));
      return;
    }
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const next = el.value.slice(0, start) + token + el.value.slice(end);
    setForm((prev) => ({ ...prev, content: next }));
    // restore cursor after token
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + token.length;
      el.focus();
    });
  }, []);

  const validate = useCallback((): boolean => {
    const e: TemplateFormErrors = {};
    if (!form.name.trim()) e.name = "Template name is required";
    if (!form.content.trim()) e.content = "Message content is required";
    if (form.content.length > 4096)
      e.content = "Content exceeds 4096 character limit";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const toInput = useCallback(
    (): MessageTemplateInput => ({
      name: form.name.trim(),
      channel: form.channel,
      category: form.category,
      content: form.content.trim(),
      isActive: form.isActive,
    }),
    [form],
  );

  const reset = useCallback(() => {
    setForm(INITIAL);
    setErrors({});
  }, []);

  // Live preview — replaces tokens with italic placeholder
  const preview = form.content.replace(/\{\{(\w+)\}\}/g, (_, k) => `[${k}]`);

  // Extract variable names used in current content
  const usedVars = [
    ...new Set(
      (form.content.match(/\{\{(\w+)\}\}/g) ?? []).map((m) =>
        m.replace(/[{}]/g, ""),
      ),
    ),
  ];

  const charCount = form.content.length;

  return {
    form,
    errors,
    preview,
    usedVars,
    charCount,
    textareaRef,
    update,
    insertToken,
    validate,
    toInput,
    reset,
  };
}
