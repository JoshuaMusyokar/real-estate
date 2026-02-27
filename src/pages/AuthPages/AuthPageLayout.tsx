import React from "react";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import appLogo from "../../assets/logo.png";

export default function AuthLayout({
  children,
  theme = "vibrant",
}: {
  children: React.ReactNode;
  theme?: "vibrant" | "clean" | "dark";
}) {
  const getThemeStyles = () => {
    switch (theme) {
      case "clean":
        return {
          bg: "bg-white border-b border-gray-200",
          accent: "blue",
          logoText: "text-gray-900",
          logoSubtext: "text-blue-600",
          navLink: "text-gray-700 hover:text-blue-600 hover:bg-blue-50",
          button: "bg-blue-600 hover:bg-blue-700 text-white",
          buttonSecondary: "text-gray-700 hover:bg-gray-100",
          iconButton: "text-gray-700 hover:text-blue-600 hover:bg-blue-50",
          cityButton:
            "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200",
          dropdown: "bg-white border-gray-200",
          searchBg: "bg-white",
          searchBorder: "border-gray-300",
        };
      case "dark":
        return {
          bg: "bg-slate-900 border-b border-slate-800",
          accent: "red",
          logoText: "text-white",
          logoSubtext: "text-red-400",
          navLink: "text-slate-300 hover:text-red-400 hover:bg-slate-800",
          button:
            "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white",
          buttonSecondary: "text-slate-300 hover:bg-slate-800",
          iconButton: "text-slate-300 hover:text-red-400 hover:bg-slate-800",
          cityButton:
            "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700",
          dropdown: "bg-slate-800 border-slate-700",
          searchBg: "bg-slate-700",
          searchBorder: "border-slate-600",
        };
      default: // 'vibrant' theme
        return {
          bg: "bg-purple-700 shadow-xl",
          logoText: "text-yellow-400 font-extrabold",
          logoSubtext: "text-dark",
          accent: "purple",
          navLink: "text-white/80 hover:text-white hover:bg-purple-800/50",
          button: "bg-white hover:bg-gray-100 text-purple-700",
          buttonAccent: "bg-pink-600 hover:bg-pink-700 text-white",
          iconButton: "text-white hover:bg-purple-800 rounded-full",
          searchBarBg: "bg-white",
          cityButton:
            "bg-purple-500 hover:bg-purple-600 text-white border-none",
          dropdown: "bg-white border-gray-200",
        };
    }
  };

  const styles = getThemeStyles();
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-gradient-to-r from-blue-200 to-purple-300 rounded-full opacity-20 blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-gradient-to-r from-indigo-200 to-pink-300 rounded-full opacity-15 blur-3xl animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-200 to-blue-300 rounded-full opacity-10 blur-3xl animate-float-fast"></div>

        {/* Geometric Patterns */}
        <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-blue-200/30 dark:border-blue-500/20"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-purple-200/30 dark:border-purple-500/20"></div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      <div className="relative flex flex-col lg:flex-row w-full min-h-screen">
        {/* Left Panel - Form Section */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-8 xl:p-12">
          <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-2xl shadow-blue-500/10 dark:shadow-gray-900/20 p-8 lg:p-10">
              {/* Logo */}
              <div className="flex justify-center mb-0 rounded-lg p-4">
                <Link
                  to="/"
                  className="flex items-center gap-0 group flex-shrink-0"
                >
                  <img
                    src={appLogo}
                    alt="Property4India"
                    className="h-42 w-58 object-contain"
                  />
                  {/* <span className={`text-2xl font-black ${styles.logoText}`}>
                    BENGALPROPERTY
                  </span>
                  <span className={`text-xl font-bold ${styles.logoSubtext}`}>
                    .COM
                  </span> */}
                </Link>
              </div>

              {/* Content */}
              {children}
            </div>
          </div>
        </div>

        {/* Right Panel - Brand Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.05)_0%,transparent_50%)]"></div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-20 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-32 w-6 h-6 bg-white/15 rounded-full animate-pulse delay-75"></div>
            <div className="absolute bottom-32 left-32 w-3 h-3 bg-white/25 rounded-full animate-pulse delay-150"></div>
            <div className="absolute bottom-20 right-20 w-5 h-5 bg-white/10 rounded-full animate-pulse delay-300"></div>
          </div>

          <div className="relative z-10 flex items-center justify-center w-full p-12">
            <div className="max-w-md text-center text-white">
              {/* Icon */}
              <div className="mb-8">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                  <Link
                    to="/"
                    className="flex items-center gap-0 group flex-shrink-0"
                  >
                    <img src={appLogo} alt="Property4India" className="h-12" />
                    {/* <span className={`text-2xl font-black ${styles.logoText}`}>
                      BENGALPROPERTY
                    </span>
                    <span className={`text-xl font-bold ${styles.logoSubtext}`}>
                      .COM
                    </span> */}
                  </Link>
                </div>
              </div>

              {/* Heading */}
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Welcome to <span>Property4india.com Properties</span>{" "}
              </h1>

              {/* Description */}
              <p className="text-lg text-blue-100 leading-relaxed mb-8">
                Transform your real estate business with our cutting-edge CRM
                platform. Streamline operations, enhance client relationships,
                and drive growth with intelligent property management solutions.
              </p>

              {/* Features List */}
              <div className="grid grid-cols-1 gap-4 text-left max-w-xs mx-auto">
                <div className="flex items-center space-x-3 text-blue-100">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm">Smart Property Management</span>
                </div>
                <div className="flex items-center space-x-3 text-blue-100">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm">Advanced Lead Tracking</span>
                </div>
                <div className="flex items-center space-x-3 text-blue-100">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm">Automated Workflows</span>
                </div>
                <div className="flex items-center space-x-3 text-blue-100">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm">Real-time Analytics</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="w-full h-12 text-white"
            >
              <path
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                opacity=".25"
                fill="currentColor"
              ></path>
              <path
                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                opacity=".5"
                fill="currentColor"
              ></path>
              <path
                d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Theme Toggler */}
      <div className="fixed z-50 bottom-6 right-6">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-2xl shadow-blue-500/10 dark:shadow-gray-900/20 p-3">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
