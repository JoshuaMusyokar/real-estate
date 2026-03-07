import React, { useState, useEffect } from "react";
import { X, Loader2, ShieldCheck } from "lucide-react";
import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
} from "../../services/rbacApi";
import type { Role } from "../../types";
import { parseApiError } from "../../utils/Apierror";

interface RoleModalProps {
  isOpen: boolean;
  role: Role | null; // null = create mode
  onClose: () => void;
  onToast: (message: string, type: "success" | "error") => void;
  onSaved: (role: Role) => void; // called after save so parent can open permissions panel
}

export const RoleModal: React.FC<RoleModalProps> = ({
  isOpen,
  role,
  onClose,
  onToast,
  onSaved,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [createRole, { isLoading: creating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: updating }] = useUpdateRoleMutation();
  const isLoading = creating || updating;

  useEffect(() => {
    if (!isOpen) return;
    setName(role?.name ?? "");
    setDescription(role?.description ?? "");
    setFieldErrors({});
  }, [isOpen, role]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      let saved: Role;
      if (role) {
        saved = await updateRole({
          id: role.id,
          data: { name, description },
        }).unwrap();
        onToast("Role updated", "success");
      } else {
        saved = await createRole({ name, description }).unwrap();
        onToast("Role created — now assign permissions", "success");
      }
      onSaved(saved);
      onClose();
    } catch (err: any) {
      const parsed = parseApiError(err);

      if (parsed.fieldErrors) {
        const fieldErrorMap = parsed.fieldErrors.reduce(
          (acc, err) => ({ ...acc, [err.field]: err.message }),
          {} as Record<string, string>,
        );
        setFieldErrors(fieldErrorMap);
      } else {
        onToast(parsed.detail ?? "Failed to save role", "error");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {role ? "Edit Role" : "New Role"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Role name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFieldErrors((p) => ({ ...p, name: "" }));
              }}
              placeholder="e.g. SALES_MANAGER"
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors
                ${
                  fieldErrors.name
                    ? "border-red-400 dark:border-red-500"
                    : "border-slate-300 dark:border-slate-600"
                }`}
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
            )}
            <p className="mt-1 text-xs text-slate-400">
              Will be stored as uppercase. Use underscores for spaces.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What can users with this role do?"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-colors"
            />
          </div>

          {!role && (
            <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2">
              After creating the role you can assign permissions to it.
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {role ? "Save Changes" : "Create Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
