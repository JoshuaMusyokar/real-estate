/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  Home,
  Building2,
  Users,
  ShoppingCart,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

// Mock types - replace with your actual types
type Role = "OWNER" | "AGENT" | "BUILDER" | "BUYER";

interface RegisterRequest {
  email: string;
  phone: string | null;
  password: string;
  firstName: string;
  lastName: string;
  roleName: string;
}
type FormErrors = {
  [K in keyof RegisterRequest]?: string;
} & {
  terms?: string;
};

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState<RegisterRequest>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: null,
    roleName: "" as Role,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const { register, isLoading, error } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  // User type options with detailed information
  const userTypes = [
    {
      value: "OWNER" as Role,
      label: "Owner",
      icon: Home,
      description: "Property Owner",
      details: "Post and manage your properties for sale or rent",
      color: "blue",
    },
    {
      value: "AGENT" as Role,
      label: "Broker",
      icon: Users,
      description: "Real Estate Broker",
      details: "List properties on behalf of clients",
      color: "purple",
    },
    {
      value: "BUILDER" as Role,
      label: "Builder",
      icon: Building2,
      description: "Property Builder/Developer",
      details: "Showcase new construction and development projects",
      color: "orange",
    },
    {
      value: "BUYER" as Role,
      label: "Buyer",
      icon: ShoppingCart,
      description: "Property Buyer",
      details: "Browse and purchase properties",
      color: "green",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof RegisterRequest]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleRoleSelect = (role: Role) => {
    setFormData((prev) => ({ ...prev, roleName: role }));
    if (errors.roleName) {
      setErrors((prev) => ({ ...prev, roleName: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.roleName) {
      newErrors.roleName = "Please select your account type";
    }

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!isChecked) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await register(formData);

      // Show success message based on role
      const isPosterRole = ["PROPERTY_OWNER", "AGENT", "BUILDER"].includes(
        formData.roleName
      );

      // if (result.success) {

      // }
      if (isPosterRole) {
        success(
          "Account created successfully!",
          "Your property listings will require admin approval before going live."
        );
      } else {
        success("Account created successfully!", "Welcome to the platform.");
      }
      navigate("/", { replace: true });
      // Navigate to dashboard
      // navigate("/", { replace: true });
    } catch (err) {
      showError("Registration failed", "Please try again.");
    }
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      blue: {
        border: isSelected
          ? "border-blue-500"
          : "border-gray-200 dark:border-gray-700",
        bg: isSelected
          ? "bg-blue-50 dark:bg-blue-900/20"
          : "bg-white dark:bg-gray-800",
        hover: "hover:border-blue-300 dark:hover:border-blue-700",
        icon: isSelected ? "text-blue-500" : "text-gray-400",
      },
      purple: {
        border: isSelected
          ? "border-purple-500"
          : "border-gray-200 dark:border-gray-700",
        bg: isSelected
          ? "bg-purple-50 dark:bg-purple-900/20"
          : "bg-white dark:bg-gray-800",
        hover: "hover:border-purple-300 dark:hover:border-purple-700",
        icon: isSelected ? "text-purple-500" : "text-gray-400",
      },
      orange: {
        border: isSelected
          ? "border-orange-500"
          : "border-gray-200 dark:border-gray-700",
        bg: isSelected
          ? "bg-orange-50 dark:bg-orange-900/20"
          : "bg-white dark:bg-gray-800",
        hover: "hover:border-orange-300 dark:hover:border-orange-700",
        icon: isSelected ? "text-orange-500" : "text-gray-400",
      },
      green: {
        border: isSelected
          ? "border-green-500"
          : "border-gray-200 dark:border-gray-700",
        bg: isSelected
          ? "bg-green-50 dark:bg-green-900/20"
          : "bg-white dark:bg-gray-800",
        hover: "hover:border-green-300 dark:hover:border-green-700",
        icon: isSelected ? "text-green-500" : "text-gray-400",
      },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to home
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Create Your Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join our real estate platform and start your journey today
            </p>
          </div>

          {/* Role Selection - Most Important Step */}
          <div className="mb-8">
            <label className="block mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              I am a<span className="ml-1 text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {userTypes.map((type) => {
                const isSelected = formData.roleName === type.value;
                const colorClasses = getColorClasses(type.color, isSelected);
                const Icon = type.icon;

                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleRoleSelect(type.value)}
                    className={`p-4 text-left border-2 rounded-lg transition-all ${
                      colorClasses.border
                    } ${colorClasses.bg} ${
                      !isSelected && colorClasses.hover
                    } hover:shadow-md`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`mb-3 ${colorClasses.icon}`}>
                        <Icon className="w-10 h-10" />
                      </div>
                      <div className="text-base font-semibold text-gray-900 dark:text-white">
                        {type.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.roleName && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.roleName}
              </p>
            )}
          </div>

          {/* Social Sign Up Options */}
          {/* <div className="mb-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                    fill="#EB4335"
                  />
                </svg>
                Sign up with Google
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-3 px-6 py-3 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M15.6705 1.875H18.4272L12.4047 8.75833L19.4897 18.125H13.9422L9.59717 12.4442L4.62554 18.125H1.86721L8.30887 10.7625L1.51221 1.875H7.20054L11.128 7.0675L15.6705 1.875ZM14.703 16.475H16.2305L6.37054 3.43833H4.73137L14.703 16.475Z" />
                </svg>
                Sign up with X
              </button>
            </div>

           
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400">
                  Or continue with email
                </span>
              </div>
            </div>
          </div> */}

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    First Name<span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 text-gray-900 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Last Name<span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 text-gray-900 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address<span className="ml-1 text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 text-gray-900 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Phone Number <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password<span className="ml-1 text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 pr-12 text-gray-900 bg-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-gray-400 transition-colors transform -translate-y-1/2 right-4 top-1/2 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.password}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Must be at least 8 characters long
                </p>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={isChecked}
                  onChange={(e) => {
                    setIsChecked(e.target.checked);
                    if (errors.terms) {
                      setErrors((prev) => ({ ...prev, terms: undefined }));
                    }
                  }}
                  className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.terms && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.terms}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-blue-800"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating your account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
