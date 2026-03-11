/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Save,
  Eye,
  EyeOff,
  Loader2,
  MapPin,
  Building,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from "lucide-react";
import {
  useCreateUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../services/userApi";
import { useGetRolesQuery } from "../../services/rbacApi";
import {
  useGetCitiesQuery,
  useGetLocalitiesQuery,
} from "../../services/locationApi";
import type {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UserStatus,
  UserPermissionOverrides,
} from "../../types";
import { UserPermissionOverridesSection } from "./UserPermissionOverridesSection";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserResponse | null;
  onSubmit?: (data: CreateUserRequest) => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  roleId: string;
  status: UserStatus;
  avatar?: string;
  cities: string[];
  localities: string[];
  managerId?: string;
  permissions: UserPermissionOverrides;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  roleId?: string;
  cities?: string;
  _form?: string;
}

const STATUS_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "PENDING_VERIFICATION", label: "Pending Verification" },
];

const EMPTY_OVERRIDES: UserPermissionOverrides = { grant: [], revoke: [] };

export const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  user,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    roleId: "",
    status: "PENDING_VERIFICATION",
    cities: [],
    localities: [],
    permissions: EMPTY_OVERRIDES,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [selectedCityForLocalities, setSelectedCityForLocalities] =
    useState<string>("");
  const [showPermissions, setShowPermissions] = useState(false);

  // API Hooks
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const { data: rolesData, isLoading: isLoadingRoles } = useGetRolesQuery({
    page: 1,
    limit: 100,
  });
  const { data: managersData, isLoading: isLoadingManagers } = useGetUsersQuery(
    {
      roleNames: ["BUILDER", "AGENT", "OWNER"],
      status: ["ACTIVE"],
      page: 1,
      limit: 1000,
    },
  );
  const { data: citiesData, isLoading: isLoadingCities } = useGetCitiesQuery({
    page: 1,
    limit: 10000,
  });
  const { data: localitiesData, isLoading: isLoadingLocalities } =
    useGetLocalitiesQuery(
      { cityId: selectedCityForLocalities },
      { skip: !selectedCityForLocalities },
    );

  const roles = rolesData?.roles ?? [];
  const cities = citiesData?.data ?? [];
  const localities = localitiesData?.data ?? [];
  const managers = managersData?.users ?? [];

  // Resolve role permissions for the currently-selected role
  const selectedRole = useMemo(
    () => roles.find((r) => r.id === formData.roleId),
    [roles, formData.roleId],
  );
  const rolePermissions: string[] = useMemo(
    () => (selectedRole?.permissions ?? []).map((p) => p.name),
    [selectedRole],
  );

  // ─── Seed form on open ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;

    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        confirmPassword: "",
        roleId: user.role?.id || "",
        status: user.status,
        avatar: user.avatar ?? undefined,
        cities: user.cities?.map((c) => c.id) || [],
        localities: user.localities?.map((l) => l.id) || [],
        managerId: user.manager?.id,
        permissions: user.permissions ?? EMPTY_OVERRIDES,
      });
      if (user.cities?.length) {
        setSelectedCityForLocalities(user.cities[0].id);
      }
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        roleId: "",
        status: "PENDING_VERIFICATION",
        cities: [],
        localities: [],
        permissions: EMPTY_OVERRIDES,
      });
      setSelectedCityForLocalities("");
    }
    setErrors({});
    setTouched(new Set());
    setShowPermissions(false);
  }, [user, isOpen]);

  useEffect(() => {
    if (formData.cities.length > 0) {
      setSelectedCityForLocalities(formData.cities[0]);
    } else {
      setSelectedCityForLocalities("");
    }
  }, [formData.cities]);

  // ─── Validation ──────────────────────────────────────────────────────────────

  const validateField = (name: string, value: unknown): string | undefined => {
    switch (name) {
      case "firstName":
        if (typeof value !== "string" || !value.trim())
          return "First name is required";
        if (value.length < 2) return "Must be at least 2 characters";
        if (value.length > 50) return "Must be less than 50 characters";
        if (!/^[a-zA-Z\s'-]+$/.test(value))
          return "Letters, spaces, hyphens and apostrophes only";
        break;
      case "lastName":
        if (typeof value !== "string" || !value.trim())
          return "Last name is required";
        if (value.length < 2) return "Must be at least 2 characters";
        if (value.length > 50) return "Must be less than 50 characters";
        if (!/^[a-zA-Z\s'-]+$/.test(value))
          return "Letters, spaces, hyphens and apostrophes only";
        break;
      case "email":
        if (typeof value !== "string" || !value.trim())
          return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Enter a valid email address";
        break;
      case "phone":
        if (
          typeof value === "string" &&
          value &&
          !/^\+?[\d\s\-()]{10,}$/.test(value.replace(/\s/g, ""))
        )
          return "Enter a valid phone number";
        break;
      case "password":
        if (!user && !value) return "Password is required for new users";
        if (typeof value === "string" && value && value.length < 8)
          return "At least 8 characters";
        if (
          typeof value === "string" &&
          value &&
          !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)
        )
          return "Must include uppercase, lowercase, and a number";
        break;
      case "confirmPassword":
        if (formData.password && value !== formData.password)
          return "Passwords do not match";
        break;
      case "roleId":
        if (!value) return "Role is required";
        break;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      const formKey = key as keyof FormData;
      if (formKey === "confirmPassword" && !formData.password) return;
      if (
        ["cities", "localities", "permissions", "avatar", "managerId"].includes(
          key,
        )
      )
        return;
      const error = validateField(key, formData[formKey]);
      if (error) {
        (newErrors as FormErrors)[key as keyof FormErrors] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  };

  const handleFieldChange = (
    field: keyof FormData,
    value: FormData[keyof FormData],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched.has(field)) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
    // When role changes, clear overrides — they might reference permissions that no longer apply
    if (field === "roleId") {
      setFormData((prev) => ({
        ...prev,
        roleId: value as string,
        permissions: EMPTY_OVERRIDES,
      }));
    }
    if (field === "cities") {
      setFormData((prev) => ({ ...prev, localities: [] }));
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched((prev) => new Set(prev).add(field));
    const error = validateField(field, formData[field as keyof FormData]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleArrayToggle = (field: "cities" | "localities", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  // ─── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allFields = Object.keys(formData);
    setTouched(new Set(allFields));

    if (!validateForm()) return;

    // Check grant/revoke conflict
    const grantSet = new Set(formData.permissions.grant ?? []);
    const conflict = (formData.permissions.revoke ?? []).filter((n) =>
      grantSet.has(n),
    );

    if (conflict.length) {
      setErrors((prev) => ({
        ...prev,
        _form: `Permission conflict: "${conflict[0]}" is both granted and revoked.`,
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      const permissionsPayload: UserPermissionOverrides | undefined =
        formData.permissions.grant?.length ||
        formData.permissions.revoke?.length
          ? formData.permissions
          : undefined;

      const basePayload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        roleId: formData.roleId,
        status: formData.status,
        cities: formData.cities,
        localities: formData.localities,
        managerId: formData.managerId || null,
        permissions: permissionsPayload,
      };

      if (user) {
        const updatePayload: UpdateUserRequest = {
          ...basePayload,
          ...(formData.avatar && { avatar: formData.avatar }),
        };

        await updateUser({
          id: user.id,
          data: updatePayload,
        }).unwrap();
      } else {
        const createPayload: CreateUserRequest = {
          ...basePayload,
          password: formData.password,
          ...(formData.avatar && { avatar: formData.avatar }),
        };

        if (onSubmit) {
          onSubmit(createPayload);
        } else {
          await createUser(createPayload).unwrap();
        }
      }

      onClose();
    } catch (error) {
      const err = error as { data?: { message?: string } };
      const msg = err?.data?.message ?? "";

      if (msg.toLowerCase().includes("email")) {
        setErrors((prev) => ({ ...prev, email: "Email already exists" }));
      } else if (msg.toLowerCase().includes("phone")) {
        setErrors((prev) => ({
          ...prev,
          phone: "Phone number already exists",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          _form: msg || "Failed to save user. Please try again.",
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (fieldName: keyof FormErrors) =>
    `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm
    ${errors[fieldName] ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-600"}`;

  if (!isOpen) return null;

  const overrideCount =
    (formData.permissions.grant?.length ?? 0) +
    (formData.permissions.revoke?.length ?? 0);

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user ? "Edit User" : "Create New User"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* ── Basic Information ── */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleFieldChange("firstName", e.target.value)
                  }
                  onBlur={() => handleFieldBlur("firstName")}
                  className={fieldClass("firstName")}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleFieldChange("lastName", e.target.value)
                  }
                  onBlur={() => handleFieldBlur("lastName")}
                  className={fieldClass("lastName")}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Contact ── */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  onBlur={() => handleFieldBlur("email")}
                  className={fieldClass("email")}
                  placeholder="user@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  onBlur={() => handleFieldBlur("phone")}
                  className={fieldClass("phone")}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Password (create only) ── */}
          {!user && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Password
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleFieldChange("password", e.target.value)
                      }
                      onBlur={() => handleFieldBlur("password")}
                      className={fieldClass("password")}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleFieldChange("confirmPassword", e.target.value)
                      }
                      onBlur={() => handleFieldBlur("confirmPassword")}
                      className={fieldClass("confirmPassword")}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Role & Status ── */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Role & Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role *
                </label>
                <div className="relative">
                  <select
                    value={formData.roleId}
                    onChange={(e) =>
                      handleFieldChange("roleId", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("roleId")}
                    className={fieldClass("roleId")}
                    disabled={isLoadingRoles}
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                  {isLoadingRoles && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                  )}
                </div>
                {errors.roleId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.roleId}
                  </p>
                )}
                {selectedRole && (
                  <p className="mt-1 text-xs text-gray-400">
                    This role has {rolePermissions.length} permission
                    {rolePermissions.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    handleFieldChange("status", e.target.value as UserStatus)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Manager */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Manager
              </label>
              <div className="relative">
                <select
                  value={formData.managerId || ""}
                  onChange={(e) =>
                    handleFieldChange("managerId", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={isLoadingManagers || managers.length === 0}
                >
                  <option value="">No manager</option>
                  {managers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} ({m.email})
                    </option>
                  ))}
                </select>
                {isLoadingManagers && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* ── Permission Overrides (collapsible) ── */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPermissions((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Permission Overrides
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {overrideCount > 0
                      ? `${formData.permissions.grant?.length ?? 0} granted, ${formData.permissions.revoke?.length ?? 0} revoked`
                      : "No overrides — user will rely on role permissions only"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {overrideCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 font-medium">
                    {overrideCount} override{overrideCount !== 1 ? "s" : ""}
                  </span>
                )}
                {showPermissions ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </div>
            </button>

            {showPermissions && (
              <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700">
                <UserPermissionOverridesSection
                  value={formData.permissions}
                  onChange={(overrides) =>
                    handleFieldChange("permissions", overrides)
                  }
                  roleName={selectedRole?.name}
                  rolePermissions={rolePermissions}
                />
              </div>
            )}
          </div>

          {/* ── Access Control ── */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Access Control
            </h3>
            <div className="space-y-6">
              {/* Cities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Allowed Cities
                </label>
                {isLoadingCities ? (
                  <div className="flex items-center gap-2 py-4 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading
                    cities...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-600 rounded-lg">
                    {cities.map((city) => (
                      <label
                        key={city.id}
                        className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.cities.includes(city.id)}
                          onChange={() => handleArrayToggle("cities", city.id)}
                          className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            {city.name}
                          </div>
                          {(city.state || city.country) && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {city.state && `${city.state}, `}
                              {city.country}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                    {cities.length === 0 && (
                      <div className="col-span-full text-center py-4 text-sm text-gray-500">
                        No cities available
                      </div>
                    )}
                  </div>
                )}
                {errors.cities && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.cities}
                  </p>
                )}
              </div>

              {/* Localities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Allowed Localities
                </label>
                {formData.cities.length === 0 ? (
                  <p className="text-sm text-gray-400 italic py-2">
                    Select at least one city to browse localities
                  </p>
                ) : isLoadingLocalities ? (
                  <div className="flex items-center gap-2 py-4 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading
                    localities...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-600 rounded-lg">
                    {localities.map((locality) => (
                      <label
                        key={locality.id}
                        className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.localities.includes(locality.id)}
                          onChange={() =>
                            handleArrayToggle("localities", locality.id)
                          }
                          className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                            <Building className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            {locality.name}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {locality.city?.name}
                          </p>
                        </div>
                      </label>
                    ))}
                    {localities.length === 0 && (
                      <div className="col-span-full text-center py-4 text-sm text-gray-500">
                        No localities for selected cities
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Form-level error ── */}
          {errors._form && (
            <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
              {errors._form}
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {user ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save size={18} />
                  {user ? "Update User" : "Create User"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
