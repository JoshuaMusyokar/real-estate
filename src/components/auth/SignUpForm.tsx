// SignUpForm.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Home,
  Building2,
  Users,
  ShoppingCart,
  Mail,
  Lock,
  User,
  Phone,
  Loader2,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

type Role = "OWNER" | "AGENT" | "BUILDER" | "BUYER";

interface RegisterRequest {
  email: string;
  phone: string | null;
  password: string;
  companyName: string | null;
  reraNumber: string | null;
  gstNumber: string | null;
  firstName: string;
  lastName: string;
  roleName: string;
}
type FormErrors = {
  [K in keyof RegisterRequest]?: string;
} & {
  terms?: string;
  companyName?: string;
  reraNumber?: string;
  gstNumber?: string;
};

const USER_TYPES = [
  {
    value: "OWNER" as Role,
    label: "Owner",
    icon: Home,
    description: "Property Owner",
    details: "Post and manage your properties",
    needsCompanyInfo: false,
  },
  {
    value: "AGENT" as Role,
    label: "Broker",
    icon: Users,
    description: "Real Estate Broker",
    details: "List properties on behalf of clients",
    needsCompanyInfo: true,
  },
  {
    value: "BUILDER" as Role,
    label: "Builder",
    icon: Building2,
    description: "Builder / Developer",
    details: "Showcase new construction projects",
    needsCompanyInfo: true,
  },
  {
    value: "BUYER" as Role,
    label: "Buyer",
    icon: ShoppingCart,
    description: "Property Buyer",
    details: "Browse and purchase properties",
    needsCompanyInfo: false,
  },
];

const inputBase =
  "w-full pl-9 pr-4 py-3 bg-blue-50/60 border border-blue-100 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
const inputErr = "border-red-300 bg-red-50/40 focus:ring-red-400";

export default function SignUpForm() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const { success, error: showError } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showCompanyInfo, setShowCompanyInfo] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<RegisterRequest>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: null,
    roleName: "" as Role,
    companyName: null,
    reraNumber: null,
    gstNumber: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterRequest])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleRoleSelect = (role: Role) => {
    setFormData((prev) => ({
      ...prev,
      roleName: role,
      ...(prev.roleName !== role && {
        companyName: null,
        reraNumber: null,
        gstNumber: null,
      }),
    }));
    setShowCompanyInfo(
      USER_TYPES.find((t) => t.value === role)?.needsCompanyInfo || false,
    );
    if (errors.roleName)
      setErrors((prev) => ({ ...prev, roleName: undefined }));
  };

  const validateForm = (): boolean => {
    const e: FormErrors = {};
    if (!formData.roleName) e.roleName = "Please select your account type";
    if (!formData.firstName?.trim()) e.firstName = "First name is required";
    if (!formData.lastName?.trim()) e.lastName = "Last name is required";
    if (!formData.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Email is invalid";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (showCompanyInfo && !formData.companyName?.trim())
      e.companyName = "Company/Organization name is required";
    if (!isChecked) e.terms = "You must agree to the terms and conditions";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validateForm()) return;
    try {
      const result = await register(formData);
      const isPosterRole = ["PROPERTY_OWNER", "AGENT", "BUILDER"].includes(
        formData.roleName,
      );
      if (isPosterRole)
        success(
          "Account created successfully!",
          "Your property listings will require admin approval before going live.",
        );
      else success("Account created successfully!", "Welcome to the platform.");
      navigate("/", { replace: true });
    } catch (err) {
      showError("Registration failed", "Please try again.");
    }
  };

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-7">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-1">
          Create your account
        </h2>
        <p className="text-sm text-gray-500">
          Join our real estate platform and start your journey today
        </p>
      </div>

      {/* ── Role selection ──────────────────────────────────────────────────── */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-gray-700 mb-3">
          I am a <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {USER_TYPES.map(
            ({ value, label, icon: Icon, description, needsCompanyInfo }) => {
              const selected = formData.roleName === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRoleSelect(value)}
                  className={`
                  relative p-3.5 rounded-xl border-2 text-left transition-all duration-200
                  ${
                    selected
                      ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                      : "border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50/40"
                  }
                `}
                >
                  {selected && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg
                        className="w-2.5 h-2.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                  )}
                  <Icon
                    className={`w-6 h-6 mb-2 ${selected ? "text-blue-600" : "text-gray-400"}`}
                  />
                  <div
                    className={`text-sm font-bold ${selected ? "text-blue-700" : "text-gray-800"}`}
                  >
                    {label}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                    {description}
                  </div>
                  {needsCompanyInfo && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <Building2 className="w-2.5 h-2.5 text-blue-400" />
                      <span className="text-[10px] text-blue-500 font-medium">
                        Company info required
                      </span>
                    </div>
                  )}
                </button>
              );
            },
          )}
        </div>
        {errors.roleName && (
          <p className="mt-2 text-[11px] text-red-600 font-medium">
            {errors.roleName}
          </p>
        )}
      </div>

      {/* ── Form fields ─────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First + Last */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              First name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400 pointer-events-none" />
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Rahul"
                value={formData.firstName}
                onChange={handleInputChange}
                autoComplete="given-name"
                className={`${inputBase} ${errors.firstName ? inputErr : ""}`}
              />
            </div>
            {errors.firstName && (
              <p className="mt-1 text-[11px] text-red-600">
                {errors.firstName}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Last name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400 pointer-events-none" />
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Sharma"
                value={formData.lastName}
                onChange={handleInputChange}
                autoComplete="family-name"
                className={`${inputBase} ${errors.lastName ? inputErr : ""}`}
              />
            </div>
            {errors.lastName && (
              <p className="mt-1 text-[11px] text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Email address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400 pointer-events-none" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
              className={`${inputBase} ${errors.email ? inputErr : ""}`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-[11px] text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Phone <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400 pointer-events-none" />
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="+91 98765 43210"
              value={formData.phone || ""}
              onChange={handleInputChange}
              autoComplete="tel"
              className={inputBase}
            />
          </div>
        </div>

        {/* Company info — conditional */}
        {showCompanyInfo && (
          <>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Company / Organisation <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400 pointer-events-none" />
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  placeholder="Your company name"
                  value={formData.companyName || ""}
                  onChange={handleInputChange}
                  className={`${inputBase} ${errors.companyName ? inputErr : ""}`}
                />
              </div>
              {errors.companyName && (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors.companyName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                RERA Registration No.{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                id="reraNumber"
                name="reraNumber"
                placeholder="AP/TS/12345/67890"
                value={formData.reraNumber || ""}
                onChange={handleInputChange}
                className={`${inputBase} pl-4 ${errors.reraNumber ? inputErr : ""}`}
              />
              {errors.reraNumber ? (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors.reraNumber}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-gray-400">
                  Format: State/State/Reg.No/Year
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                GST Number{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                id="gstNumber"
                name="gstNumber"
                placeholder="22AAAAA0000A1Z5"
                value={formData.gstNumber || ""}
                onChange={handleInputChange}
                className={`${inputBase} pl-4 ${errors.gstNumber ? inputErr : ""}`}
              />
              {errors.gstNumber ? (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors.gstNumber}
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-gray-400">
                  15-digit alphanumeric GSTIN
                </p>
              )}
            </div>
          </>
        )}

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-400 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="new-password"
              className={`${inputBase} pr-10 ${errors.password ? inputErr : ""}`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {/* Strength bar */}
          {formData.password.length > 0 && (
            <div className="flex gap-1 mt-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-0.5 rounded-full transition-colors duration-300 ${
                    formData.password.length >= i * 3
                      ? formData.password.length >= 10
                        ? "bg-emerald-400"
                        : formData.password.length >= 6
                          ? "bg-amber-400"
                          : "bg-red-400"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          )}
          {errors.password ? (
            <p className="mt-1 text-[11px] text-red-600">{errors.password}</p>
          ) : (
            <p className="mt-1 text-[11px] text-gray-400">
              Must be at least 8 characters long
            </p>
          )}
        </div>

        {/* Terms */}
        <div>
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={isChecked}
              onChange={(e) => {
                setIsChecked(e.target.checked);
                if (errors.terms)
                  setErrors((prev) => ({ ...prev, terms: undefined }));
              }}
              className="w-4 h-4 mt-0.5 text-blue-600 border-blue-200 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
            />
            <label
              htmlFor="terms"
              className="text-xs text-gray-600 leading-relaxed cursor-pointer"
            >
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="mt-1 text-[11px] text-red-600">{errors.terms}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Creating your
              account…
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Create Account
            </>
          )}
        </button>
      </form>

      {/* Sign in link */}
      <p className="text-center text-xs text-gray-500 mt-6">
        Already have an account?{" "}
        <Link
          to="/signin"
          className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
