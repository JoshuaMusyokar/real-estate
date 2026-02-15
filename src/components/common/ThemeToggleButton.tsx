import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export const ThemeToggleButton: React.FC = () => {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      aria-label="Toggle theme"
    >
      <Sun className="w-4 h-4 sm:w-5 sm:h-5 dark:hidden" />
      <Moon className="hidden w-4 h-4 sm:w-5 sm:h-5 dark:block" />
    </button>
  );
};
