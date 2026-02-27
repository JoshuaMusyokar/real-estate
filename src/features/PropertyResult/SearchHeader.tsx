import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart } from "lucide-react";

interface SearchHeaderProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  onSearch: () => void;
  isAuthenticated: boolean;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchInput,
  setSearchInput,
  onSearch,
  isAuthenticated,
}) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-purple-600">
            Property4India
          </Link>

          <div className="flex-1 relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSearch()}
              placeholder="Search locality, landmark or property"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={() => navigate("/saved-properties")}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-purple-600"
          >
            <Heart className="w-5 h-5" />
            <span className="hidden md:inline">Saved</span>
          </button>

          {!isAuthenticated && (
            <Link
              to="/login"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
