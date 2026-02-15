import { useState } from "react";
import { User, Settings, HelpCircle, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleLogout = () => {
    logout();
    closeDropdown();
    navigate("/signin");
  };

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email;
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    return user?.email?.charAt(0).toUpperCase();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
      >
        <div className="relative mr-2 sm:mr-3 overflow-hidden rounded-full w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 flex-shrink-0">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={getDisplayName()}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium text-xs sm:text-sm">
              {getInitials()}
            </div>
          )}
        </div>

        <span className="hidden sm:block mr-1 font-medium text-xs sm:text-sm truncate max-w-[100px] lg:max-w-[150px]">
          {user?.firstName || "User"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-2 sm:mt-3 md:mt-[17px] flex w-[240px] sm:w-[260px] flex-col rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-2.5 sm:p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="pb-2.5 sm:pb-3 border-b border-gray-200 dark:border-gray-800">
          <span className="block font-medium text-gray-700 text-xs sm:text-sm dark:text-white truncate">
            {getDisplayName()}
          </span>
          <span className="mt-0.5 block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
            {user?.email}
          </span>
          <span className="mt-0.5 sm:mt-1 block text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 capitalize">
            {user?.role
              ? user.role.name.toLowerCase().replace("_", " ")
              : "User"}
          </span>
        </div>

        <ul className="flex flex-col gap-0.5 sm:gap-1 pt-3 sm:pt-4 pb-2.5 sm:pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 font-medium text-gray-700 rounded-lg group text-xs sm:text-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 transition-colors"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Edit profile
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/settings"
              className="flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 font-medium text-gray-700 rounded-lg group text-xs sm:text-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 transition-colors"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Account settings
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/support"
              className="flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 font-medium text-gray-700 rounded-lg group text-xs sm:text-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 transition-colors"
            >
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Support
            </DropdownItem>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 mt-2 sm:mt-3 font-medium text-gray-700 rounded-lg group text-xs sm:text-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 transition-colors"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
