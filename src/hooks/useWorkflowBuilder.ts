import { useState, useCallback } from "react";
import type {
  Workflow,
  WorkflowInput,
  WorkflowAction,
  WorkflowActionInput,
  WorkflowActionType,
  WorkflowActionConfig,
  WorkflowTrigger,
} from "../types/messaging-management";

// ── Workflow metadata form ─────────────────────────────────────────────────
export interface WorkflowFormState {
  name: string;
  description: string;
  trigger: WorkflowTrigger | "";
  isActive: boolean;
}

export interface WorkflowFormErrors {
  name?: string;
  trigger?: string;
}

// ── Action editor state ────────────────────────────────────────────────────
export interface ActionEditorState {
  actionType: WorkflowActionType | "";
  config: Record<string, string>;
  delayMinutes: string;
}

const INITIAL_FORM: WorkflowFormState = {
  name: "",
  description: "",
  trigger: "",
  isActive: false,
};

const INITIAL_ACTION: ActionEditorState = {
  actionType: "",
  config: {},
  delayMinutes: "",
};

export function useWorkflowBuilder(existing?: Workflow) {
  const [form, setForm] = useState<WorkflowFormState>(
    existing
      ? {
          name: existing.name,
          description: existing.description ?? "",
          trigger: existing.trigger,
          isActive: existing.isActive,
        }
      : INITIAL_FORM,
  );
  const [formErrors, setFormErrors] = useState<WorkflowFormErrors>({});

  // Action being edited
  const [actionEditor, setActionEditor] =
    useState<ActionEditorState>(INITIAL_ACTION);
  const [editingActionId, setEditingActionId] = useState<string | null>(null);

  const updateForm = useCallback(
    (patch: Partial<WorkflowFormState>) => setForm((p) => ({ ...p, ...patch })),
    [],
  );

  const updateActionEditor = useCallback(
    (patch: Partial<ActionEditorState>) =>
      setActionEditor((p) => ({ ...p, ...patch })),
    [],
  );

  const validateForm = useCallback((): boolean => {
    const e: WorkflowFormErrors = {};
    if (!form.name.trim()) e.name = "Workflow name is required";
    if (!form.trigger) e.trigger = "Please select a trigger";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const toWorkflowInput = useCallback(
    (): WorkflowInput => ({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      trigger: form.trigger as WorkflowTrigger,
      isActive: form.isActive,
    }),
    [form],
  );

  // Open action editor to create new action
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const openNewAction = useCallback((nextOrder: number) => {
    setEditingActionId(null);
    setActionEditor({ ...INITIAL_ACTION });
  }, []);

  // Open action editor to edit existing action
  const openEditAction = useCallback((action: WorkflowAction) => {
    setEditingActionId(action.id);
    setActionEditor({
      actionType: action.actionType,
      config: Object.fromEntries(
        Object.entries(action.config as Record<string, unknown>).map(
          ([k, v]) => [k, String(v ?? "")],
        ),
      ),
      delayMinutes: action.delayMinutes ? String(action.delayMinutes) : "",
    });
  }, []);

  const closeActionEditor = useCallback(() => {
    setEditingActionId(null);
    setActionEditor(INITIAL_ACTION);
  }, []);

  // Build WorkflowActionInput from current action editor state
  const toActionInput = useCallback(
    (order: number): WorkflowActionInput => ({
      order,
      actionType: actionEditor.actionType as WorkflowActionType,
      config: actionEditor.config as WorkflowActionConfig,
      delayMinutes: actionEditor.delayMinutes
        ? parseInt(actionEditor.delayMinutes)
        : undefined,
    }),
    [actionEditor],
  );

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM);
    setFormErrors({});
    setActionEditor(INITIAL_ACTION);
    setEditingActionId(null);
  }, []);

  return {
    form,
    formErrors,
    updateForm,
    validateForm,
    toWorkflowInput,
    actionEditor,
    editingActionId,
    updateActionEditor,
    openNewAction,
    openEditAction,
    closeActionEditor,
    toActionInput,
    resetForm,
  };
}
