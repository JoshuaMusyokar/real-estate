// WorkflowBuilderPage  —  /crm/messaging/workflows/:id
// Full page editor: metadata + ordered action list + test trigger

import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FlaskConical,
} from "lucide-react";
import { TriggerBadge } from "./TriggerBadge";
import { ActionCard } from "./ActionCard";
import { ActionEditorModal } from "./ActionEditorModal";
import { WorkflowBuilderModal } from "./WorkflowBuilderModal";
import { useWorkflowBuilder } from "../../hooks/useWorkflowBuilder";
import {
  useGetWorkflowByIdQuery,
  useUpdateWorkflowMutation,
  useToggleWorkflowMutation,
  useDeleteWorkflowMutation,
  useAddWorkflowActionMutation,
  useUpdateWorkflowActionMutation,
  useDeleteWorkflowActionMutation,
  useReorderWorkflowActionsMutation,
  useTestTriggerWorkflowMutation,
  useGetExecutionsQuery,
} from "../../services/messagingManagementApi";
import { useToast } from "../../hooks/useToast";

export const WorkflowBuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [metaOpen, setMetaOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [testLeadId, setTestLeadId] = useState("");
  const [showTestBox, setShowTestBox] = useState(false);

  const { data, isLoading, refetch } = useGetWorkflowByIdQuery(id!, {
    skip: !id,
  });
  const { data: execData } = useGetExecutionsQuery(
    { workflowId: id, limit: 5 },
    { skip: !id },
  );

  const workflow = data?.data;
  const recentExecs = execData?.data ?? [];

  const {
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
  } = useWorkflowBuilder(workflow ?? undefined);

  const [updateWorkflow, { isLoading: updatingMeta }] =
    useUpdateWorkflowMutation();
  const [toggleWorkflow, { isLoading: toggling }] = useToggleWorkflowMutation();
  const [deleteWorkflow] = useDeleteWorkflowMutation();
  const [addAction, { isLoading: addingAction }] =
    useAddWorkflowActionMutation();
  const [updateAction, { isLoading: updatingAction }] =
    useUpdateWorkflowActionMutation();
  const [deleteAction] = useDeleteWorkflowActionMutation();
  const [reorderActions] = useReorderWorkflowActionsMutation();
  const [testTrigger, { isLoading: testing }] =
    useTestTriggerWorkflowMutation();

  const actions = workflow?.actions ?? [];

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleMetaSave = useCallback(async () => {
    if (!id || !validateForm()) return;
    try {
      await updateWorkflow({ id, data: toWorkflowInput() }).unwrap();
      toast.success?.("Workflow updated");
      setMetaOpen(false);
    } catch (err: unknown) {
      toast.error?.(err instanceof Error ? err.message : "Failed to save");
    }
  }, [id, validateForm, updateWorkflow, toWorkflowInput, toast]);

  const handleToggle = useCallback(async () => {
    if (!id) return;
    try {
      const result = await toggleWorkflow(id).unwrap();
      toast.success?.(
        result.data.isActive ? "Workflow activated" : "Workflow deactivated",
      );
    } catch (err: unknown) {
      toast.error?.(err instanceof Error ? err.message : "Failed to toggle");
    }
  }, [id, toggleWorkflow, toast]);

  const handleDeleteWorkflow = useCallback(async () => {
    if (!id || !workflow) return;
    if (
      !window.confirm(
        `Delete "${workflow.name}"? This will also delete all execution history.`,
      )
    )
      return;
    try {
      await deleteWorkflow(id).unwrap();
      toast.success?.("Workflow deleted");
      navigate(-1);
    } catch (err: unknown) {
      toast.error?.(err instanceof Error ? err.message : "Failed to delete");
    }
  }, [id, workflow, deleteWorkflow, navigate, toast]);

  const handleSaveAction = useCallback(async () => {
    if (!id || !actionEditor.actionType) return;
    const nextOrder = actions.length + 1;
    try {
      if (editingActionId) {
        await updateAction({
          workflowId: id,
          actionId: editingActionId,
          data: toActionInput(nextOrder),
        }).unwrap();
        toast.success?.("Action updated");
      } else {
        await addAction({
          workflowId: id,
          data: toActionInput(nextOrder),
        }).unwrap();
        toast.success?.("Action added");
      }
      closeActionEditor();
      setActionOpen(false);
    } catch (err: unknown) {
      toast.error?.(
        err instanceof Error ? err.message : "Failed to save action",
      );
    }
  }, [
    id,
    actionEditor,
    editingActionId,
    actions.length,
    addAction,
    updateAction,
    toActionInput,
    closeActionEditor,
    toast,
  ]);

  const handleDeleteAction = useCallback(
    async (actionId: string) => {
      if (!id) return;
      try {
        await deleteAction({ workflowId: id, actionId }).unwrap();
      } catch (err: unknown) {
        toast.error?.(
          err instanceof Error ? err.message : "Failed to delete action",
        );
      }
    },
    [id, deleteAction, toast],
  );

  const handleMoveAction = useCallback(
    async (index: number, direction: "up" | "down") => {
      if (!id) return;
      const newActions = [...actions];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      [newActions[index], newActions[swapIndex]] = [
        newActions[swapIndex],
        newActions[index],
      ];
      const orderedIds = newActions.map((a) => a.id);
      try {
        await reorderActions({ workflowId: id, orderedIds }).unwrap();
      } catch {
        //
      }
    },
    [id, actions, reorderActions],
  );

  const handleTest = useCallback(async () => {
    if (!id || !testLeadId.trim()) return;
    try {
      await testTrigger({ id, leadId: testLeadId.trim() }).unwrap();
      toast.success?.("Test triggered — check execution history");
    } catch (err: unknown) {
      toast.error?.(err instanceof Error ? err.message : "Test failed");
    }
  }, [id, testLeadId, testTrigger, toast]);

  if (isLoading) {
    return (
      <div className="max-w-full mx-auto space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="lg:col-span-2 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!workflow)
    return (
      <div className="text-center py-20">
        <p className="text-sm font-semibold text-gray-500">
          Workflow not found
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-xs text-blue-500 hover:underline"
        >
          Go back
        </button>
      </div>
    );

  const fmtDate = (d: string) =>
    new Date(d).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="max-w-full mx-auto space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 mt-0.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-2xl font-black text-gray-900 dark:text-white truncate">
              {workflow.name}
            </h1>
            <TriggerBadge trigger={workflow.trigger} size="xs" />
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full
              ${
                workflow.isActive
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {workflow.isActive ? (
                <>
                  <CheckCircle2 className="w-2.5 h-2.5" /> Active
                </>
              ) : (
                "Inactive"
              )}
            </span>
          </div>
          {workflow.description && (
            <p className="text-[11px] sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {workflow.description}
            </p>
          )}
        </div>
        <button
          onClick={() => refetch()}
          className="p-2 mt-0.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* LEFT — Info + controls */}
        <div className="space-y-4">
          {/* Settings card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5">
            <h2 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
              Settings
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">
                  Trigger
                </p>
                <div className="mt-1">
                  <TriggerBadge trigger={workflow.trigger} size="sm" />
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">
                  Actions
                </p>
                <p className="font-semibold text-gray-900 dark:text-white mt-0.5">
                  {actions.length}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">
                  Total runs
                </p>
                <p className="font-semibold text-gray-900 dark:text-white mt-0.5">
                  {workflow._count.executions.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
              <button
                onClick={() => {
                  resetForm();
                  setMetaOpen(true);
                }}
                className="w-full py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Edit settings
              </button>
              <button
                onClick={handleToggle}
                disabled={
                  toggling || (actions.length === 0 && !workflow.isActive)
                }
                className={`w-full py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5
                  ${
                    workflow.isActive
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200"
                  }`}
              >
                {toggling ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : workflow.isActive ? (
                  "Deactivate"
                ) : (
                  "Activate"
                )}
              </button>
              <button
                onClick={handleDeleteWorkflow}
                className="w-full py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold transition-colors"
              >
                Delete workflow
              </button>
            </div>
          </div>

          {/* Test trigger */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5">
            <button
              onClick={() => setShowTestBox((v) => !v)}
              className="w-full flex items-center justify-between"
            >
              <h2 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Test Trigger
              </h2>
              <FlaskConical className="w-3.5 h-3.5 text-amber-500" />
            </button>
            {showTestBox && (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  value={testLeadId}
                  onChange={(e) => setTestLeadId(e.target.value)}
                  placeholder="Paste a lead UUID…"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  onClick={handleTest}
                  disabled={testing || !testLeadId.trim()}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  {testing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Running…
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" /> Run test
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Recent executions */}
          {recentExecs.length > 0 && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5">
              <h2 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
                Recent runs
              </h2>
              <div className="space-y-2">
                {recentExecs.map((ex) => (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-1.5">
                      {ex.status === "completed" ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      ) : ex.status === "failed" ? (
                        <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
                      ) : (
                        <Loader2 className="w-3 h-3 text-amber-500 animate-spin flex-shrink-0" />
                      )}
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[80px]">
                        {ex.leadId ? `Lead …${ex.leadId.slice(-6)}` : "—"}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">
                      {fmtDate(ex.startedAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Actions builder */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                Actions
                {actions.length > 0 && (
                  <span className="ml-2 text-[10px] font-black px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {actions.length}
                  </span>
                )}
              </h2>
              <button
                onClick={() => {
                  openNewAction(actions.length);
                  setActionOpen(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Action
              </button>
            </div>

            <div className="p-4 sm:p-5">
              {actions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <Zap className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    No actions yet
                  </p>
                  <p className="text-xs text-gray-400 mt-1 mb-4 text-center max-w-xs">
                    Add actions to define what happens when this workflow
                    triggers
                  </p>
                  <button
                    onClick={() => {
                      openNewAction(0);
                      setActionOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add first action
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {actions.map((action, index) => (
                    <ActionCard
                      key={action.id}
                      action={action}
                      index={index}
                      total={actions.length}
                      canEdit
                      onEdit={() => {
                        openEditAction(action);
                        setActionOpen(true);
                      }}
                      onDelete={() => handleDeleteAction(action.id)}
                      onMoveUp={() => handleMoveAction(index, "up")}
                      onMoveDown={() => handleMoveAction(index, "down")}
                    />
                  ))}

                  {/* Add more */}
                  <button
                    onClick={() => {
                      openNewAction(actions.length);
                      setActionOpen(true);
                    }}
                    className="w-full py-2.5 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-xs font-bold text-gray-400 hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-600 dark:hover:text-blue-400 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add another action
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <WorkflowBuilderModal
        isOpen={metaOpen}
        editing={workflow}
        form={form}
        errors={formErrors}
        isLoading={updatingMeta}
        onUpdate={updateForm}
        onSave={handleMetaSave}
        onClose={() => setMetaOpen(false)}
      />

      <ActionEditorModal
        isOpen={actionOpen}
        isEditing={!!editingActionId}
        state={actionEditor}
        isLoading={addingAction || updatingAction}
        onUpdate={updateActionEditor}
        onSave={handleSaveAction}
        onClose={() => {
          setActionOpen(false);
          closeActionEditor();
        }}
      />
    </div>
  );
};
