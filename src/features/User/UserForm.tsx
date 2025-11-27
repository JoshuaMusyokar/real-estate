/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { X, Save, Eye, EyeOff, Loader2, MapPin, Building } from "lucide-react";
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
  Role,
  UserStatus,
  City,
  Locality,
} from "../../types";

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
}

const STATUS_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "PENDING_VERIFICATION", label: "Pending Verification" },
];

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
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [selectedCityForLocalities, setSelectedCityForLocalities] =
    useState<string>("");

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
      limit: 100,
    }
  );
  const { data: citiesData, isLoading: isLoadingCities } = useGetCitiesQuery({
    page: 1,
    limit: 100,
  });

  const { data: localitiesData, isLoading: isLoadingLocalities } =
    useGetLocalitiesQuery(
      { cityId: selectedCityForLocalities },
      { skip: !selectedCityForLocalities }
    );

  const roles = rolesData?.data || [];
  const cities = citiesData?.data || [];
  const localities = localitiesData?.data || [];
  const managers = managersData?.users || [];

  useEffect(() => {
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
        cities: user.cities?.map((city) => city.id) || [],
        localities: user.localities?.map((locality) => locality.id) || [],
      });

      // Set first city as selected for localities dropdown
      if (user.cities && user.cities.length > 0) {
        setSelectedCityId(user.cities[0].id);
      }
    } else {
      // Reset form for new user
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
      });
      setSelectedCityId("");
    }
    setErrors({});
    setTouched(new Set());
  }, [user, isOpen]);

  // Validation functions
  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (value.length < 2) return "First name must be at least 2 characters";
        if (value.length > 50)
          return "First name must be less than 50 characters";
        if (!/^[a-zA-Z\s'-]+$/.test(value))
          return "First name can only contain letters, spaces, hyphens, and apostrophes";
        break;

      case "lastName":
        if (!value.trim()) return "Last name is required";
        if (value.length < 2) return "Last name must be at least 2 characters";
        if (value.length > 50)
          return "Last name must be less than 50 characters";
        if (!/^[a-zA-Z\s'-]+$/.test(value))
          return "Last name can only contain letters, spaces, hyphens, and apostrophes";
        break;

      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please enter a valid email address";
        if (value.length > 255) return "Email must be less than 255 characters";
        break;

      case "phone":
        if (value && !/^\+?[\d\s\-()]{10,}$/.test(value.replace(/\s/g, ""))) {
          return "Please enter a valid phone number";
        }
        break;

      case "password":
        if (!user && !value) return "Password is required for new users";
        if (value && value.length < 8)
          return "Password must be at least 8 characters";
        if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
        }
        break;

      case "confirmPassword":
        if (formData.password && value !== formData.password)
          return "Passwords do not match";
        break;

      case "roleId":
        if (!value) return "Role is required";
        break;

      case "cityIds":
        if (value.length === 0) return "At least one city must be selected";
        break;

      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (key === "confirmPassword" && !formData.password) return; // Skip confirm password if no password set

      const error = validateField(key, formData[key as keyof FormData]);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleFieldChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched.has(field)) {
      const error = validateField(field, value);
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }

    if (field === "cities") {
      setFormData((prev) => ({ ...prev, localities: [] }));
      if (value.length > 0) {
        setSelectedCityId(value[0]); // Use first selected city for localities
      } else {
        setSelectedCityId("");
      }
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched((prev) => new Set(prev).add(field));
    const error = validateField(field, formData[field as keyof FormData]);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleArrayToggle = (field: "cities" | "localities", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));

    if (touched.has(field)) {
      const error = validateField(field, formData[field]);
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }

    console.log(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = Object.keys(formData);
    setTouched(new Set(allFields));

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData: any = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        roleId: formData.roleId,
        status: formData.status,
        cities: formData.cities,
        localities: formData.localities,
        managerId: formData.managerId,
      };

      if (formData.avatar) {
        submitData.avatar = formData.avatar;
      }

      // Only include password for new users or when changing password
      if (!user && formData.password) {
        submitData.password = formData.password;
      }

      if (user) {
        await updateUser({
          id: user.id,
          data: submitData as UpdateUserRequest,
        }).unwrap();

        // Assign cities and localities separately
        if (formData.cities.length > 0) {
          // You would call assignCitiesToUser mutation here
        }
        if (formData.localities.length > 0) {
          // You would call assignLocalitiesToUser mutation here
        }
      } else {
        if (onSubmit) {
          onSubmit(submitData as CreateUserRequest);
        } else {
          await createUser(submitData as CreateUserRequest).unwrap();

          // Assign cities and localities separately after user creation
          if (formData.cities.length > 0) {
            // You would call assignCitiesToUser mutation here
          }
          if (formData.localities.length > 0) {
            // You would call assignLocalitiesToUser mutation here
          }
        }
      }

      onClose();
    } catch (error: any) {
      console.error("Failed to save user:", error);
      // Handle API errors
      if (error.data?.error?.includes("email")) {
        setErrors((prev) => ({ ...prev, email: "Email already exists" }));
      } else if (error.data?.error?.includes("phone")) {
        setErrors((prev) => ({
          ...prev,
          phone: "Phone number already exists",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          _form: "Failed to save user. Please try again.",
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldClassName = (fieldName: keyof FormErrors) => {
    const baseClass =
      "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white";
    return errors[fieldName]
      ? `${baseClass} border-red-500 dark:border-red-400`
      : `${baseClass} border-gray-300 dark:border-gray-600`;
  };

  if (!isOpen) return null;

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
          {/* Basic Information */}
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
                  className={getFieldClassName("firstName")}
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
                  className={getFieldClassName("lastName")}
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

          {/* Contact Information */}
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
                  className={getFieldClassName("email")}
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
                  className={getFieldClassName("phone")}
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

          {/* Password Section */}
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
                      className={getFieldClassName("password")}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                      className={getFieldClassName("confirmPassword")}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
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

          {/* Role and Status */}
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
                    className={getFieldClassName("roleId")}
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
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                  )}
                </div>
                {errors.roleId && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.roleId}
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Manager
            </label>
            <div className="relative">
              <select
                value={formData.managerId || ""}
                onChange={(e) => handleFieldChange("managerId", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={isLoadingManagers || managers.length === 0}
              >
                <option value="">Select a manager</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.firstName} {manager.lastName} ({manager.email})
                  </option>
                ))}
              </select>
              {isLoadingManagers && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
              )}
            </div>
          </div>

          {/* Access Control */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Access Control
            </h3>

            <div className="space-y-6">
              {/* Cities Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Allowed Cities *
                </label>
                {isLoadingCities ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600 mr-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Loading cities...
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-600 rounded-lg">
                    {cities.map((city) => (
                      <label
                        key={city.id}
                        className="flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.cities.includes(city.id)}
                          onChange={() => handleArrayToggle("cities", city.id)}
                          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            {city.name}
                          </div>
                          {(city.state || city.country) && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {city.state && `${city.state}, `}
                              {city.country}
                            </p>
                          )}
                          {city._count && (
                            <div className="flex items-center mt-1 text-xs text-gray-400">
                              <span className="bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 rounded">
                                {city._count.properties || 0} properties
                              </span>
                            </div>
                          )}
                        </div>
                      </label>
                    ))}

                    {cities.length === 0 && (
                      <div className="col-span-full text-center py-4 text-sm text-gray-500 dark:text-gray-400">
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

              {/* Localities Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Allowed Localities
                </label>

                {formData.cities.length === 0 ? (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select City for Localities
                    </label>
                    <select
                      value={selectedCityForLocalities}
                      onChange={(e) =>
                        setSelectedCityForLocalities(e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select a city to view localities</option>
                      {cities
                        .filter((city) => formData.cities.includes(city.id))
                        .map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                    </select>
                  </div>
                ) : isLoadingLocalities ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600 mr-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Loading localities...
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-600 rounded-lg">
                    {localities.map((locality) => (
                      <label
                        key={locality.id}
                        className="flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.localities.includes(locality.id)}
                          onChange={() =>
                            handleArrayToggle("localities", locality.id)
                          }
                          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                            <Building className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                            {locality.name}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {locality.city.name}
                          </p>
                          {locality._count && (
                            <div className="flex items-center mt-1 text-xs text-gray-400">
                              <span className="bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 rounded">
                                {locality._count.users || 0} users
                              </span>
                            </div>
                          )}
                        </div>
                      </label>
                    ))}

                    {localities.length === 0 && (
                      <div className="col-span-full text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                        No localities available for selected cities
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {user ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save size={20} />
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
