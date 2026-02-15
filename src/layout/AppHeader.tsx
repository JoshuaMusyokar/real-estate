import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { Home, Search, Menu, X, AlignLeft, Command } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../hooks/useAuth";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import UserDropdown from "../components/header/UserDropdown";
import NotificationDropdown from "../components/header/NotificationDropdown";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { isAuthenticated } = useAuth();

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Public header for unauthenticated users
  if (!isAuthenticated) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <nav className="px-3 mx-auto max-w-7xl sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-0 group flex-shrink-0"
            >
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-blue-600 dark:text-blue-500">
                BENGALPROPERTY
              </span>
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-700 dark:text-gray-300">
                .COM
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="items-center hidden gap-4 md:gap-6 lg:gap-8 md:flex">
              <Link
                to="/"
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
              >
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Home
              </Link>
              <Link
                to="/properties"
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
              >
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Browse
              </Link>
              <Link
                to="/about"
                className="text-xs sm:text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-xs sm:text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
              >
                Contact
              </Link>
            </div>

            {/* Desktop Auth Actions */}
            <div className="items-center hidden gap-2 sm:gap-3 md:flex">
              <ThemeToggleButton />

              <Link
                to="/login"
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-gray-700 transition-colors rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-gray-700 rounded-lg md:hidden hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="py-3 sm:py-4 border-t border-gray-200 md:hidden dark:border-gray-800">
              <div className="flex flex-col space-y-3 sm:space-y-4">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
                  onClick={toggleMobileMenu}
                >
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                  Home
                </Link>
                <Link
                  to="/properties"
                  className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
                  onClick={toggleMobileMenu}
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  Browse Properties
                </Link>
                <Link
                  to="/about"
                  className="text-sm sm:text-base font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
                  onClick={toggleMobileMenu}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-sm sm:text-base font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
                  onClick={toggleMobileMenu}
                >
                  Contact
                </Link>

                <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Theme:
                    </span>
                    <ThemeToggleButton />
                  </div>

                  <div className="flex flex-col gap-2 sm:gap-3">
                    <Link
                      to="/login"
                      className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-center text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={toggleMobileMenu}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-center text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                      onClick={toggleMobileMenu}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
    );
  }

  // Authenticated user header
  return (
    <header className="sticky top-0 flex w-full bg-white border-b border-gray-200 z-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-4 xl:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-2.5 sm:py-3 lg:justify-normal lg:px-0 lg:py-3 xl:py-4">
          {/* Sidebar Toggle */}
          <button
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 text-gray-500 border border-gray-200 rounded-lg dark:border-gray-800 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <AlignLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          {/* Mobile Logo */}
          <Link
            to="/"
            className="flex items-center gap-0 lg:hidden flex-shrink-0"
          >
            <span className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-500">
              BENGALPROPERTY
            </span>
            <span className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300">
              .COM
            </span>
          </Link>

          {/* Mobile App Menu Toggle */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden transition-colors"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Desktop Search */}
          <div className="hidden lg:block">
            <form>
              <div className="relative">
                <span className="absolute -translate-y-1/2 pointer-events-none left-3 sm:left-4 top-1/2">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search or type command..."
                  className="h-10 sm:h-11 w-full lg:w-[350px] xl:w-[430px] rounded-lg border border-gray-200 bg-transparent py-2 sm:py-2.5 pl-10 sm:pl-12 pr-12 sm:pr-14 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-600"
                />
                <button className="absolute right-2 sm:right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-1.5 sm:px-2 py-1 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400">
                  <Command className="w-3 h-3" />
                  <span className="text-[10px] sm:text-xs">K</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* User Actions */}
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 lg:flex lg:justify-end lg:px-0 lg:py-0 border-t border-gray-200 dark:border-gray-800 lg:border-t-0`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggleButton />
            <NotificationDropdown />
          </div>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
