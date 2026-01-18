import React from "react";
import type { ContentCategory } from "../../types";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";

interface CategoryFilterProps {
  categories: ContentCategory[];
  selectedCategory?: string;
  onCategoryChange: (categoryId?: string) => void;
  showCount?: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  showCount = false,
}) => {
  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="font-semibold mb-3">Categories</h3>
      <div className="space-y-2">
        <Button
          variant={!selectedCategory ? "primary" : "ghost"}
          className="w-full justify-start"
          onClick={() => onCategoryChange(undefined)}
        >
          All Articles
          {showCount && (
            <Badge variant="solid" color="info">
              All
            </Badge>
          )}
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "primary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
            {/* {showCount && category.metadata?.count && (
              <Badge variant="solid" color="info">
                {category.metadata.count}
              </Badge>
            )} */}
          </Button>
        ))}
      </div>
    </div>
  );
};
