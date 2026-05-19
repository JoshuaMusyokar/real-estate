import { useState, useCallback } from "react";
import type { Campaign, CampaignInput } from "../types/messaging-management";

export interface CampaignFormState {
  name: string;
  templateId: string;
  subject: string;
  scheduledAt: string; // ISO string or ""
  scheduleMode: "now" | "later";
}

export interface CampaignFormErrors {
  name?: string;
  templateId?: string;
  subject?: string;
  scheduledAt?: string;
}

const INITIAL: CampaignFormState = {
  name: "",
  templateId: "",
  subject: "",
  scheduledAt: "",
  scheduleMode: "now",
};

export function useCampaignBuilder(existing?: Campaign) {
  const [form, setForm] = useState<CampaignFormState>(
    existing
      ? {
          name: existing.name,
          templateId: existing.templateId,
          subject: existing.subject,
          scheduledAt: existing.scheduledAt ?? "",
          scheduleMode: existing.scheduledAt ? "later" : "now",
        }
      : INITIAL,
  );

  const [errors, setErrors] = useState<CampaignFormErrors>({});

  const update = useCallback(
    (patch: Partial<CampaignFormState>) => setForm((p) => ({ ...p, ...patch })),
    [],
  );

  const validate = useCallback((): boolean => {
    const e: CampaignFormErrors = {};
    if (!form.name.trim()) e.name = "Campaign name is required";
    if (!form.templateId.trim()) e.templateId = "Please select a template";
    if (!form.subject.trim()) e.subject = "Subject line is required";
    if (form.scheduleMode === "later" && !form.scheduledAt)
      e.scheduledAt = "Please select a scheduled date and time";
    if (form.scheduleMode === "later" && form.scheduledAt) {
      if (new Date(form.scheduledAt) <= new Date())
        e.scheduledAt = "Scheduled time must be in the future";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const toInput = useCallback(
    (): CampaignInput => ({
      name: form.name.trim(),
      templateId: form.templateId,
      subject: form.subject.trim(),
      scheduledAt: form.scheduleMode === "later" ? form.scheduledAt : undefined,
    }),
    [form],
  );

  const reset = useCallback(() => {
    setForm(INITIAL);
    setErrors({});
  }, []);

  return { form, errors, update, validate, toInput, reset };
}
