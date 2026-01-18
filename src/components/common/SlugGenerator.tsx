/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { RefreshCw } from "lucide-react";
import Button from "../ui/button/Button";

interface SlugGeneratorProps {
  text: string;
  onGenerate: (slug: string) => void;
  disabled?: boolean;
}

export const SlugGenerator: React.FC<SlugGeneratorProps> = ({
  text,
  onGenerate,
  disabled = false,
}) => {
  const generateSlug = () => {
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    onGenerate(slug);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={generateSlug}
      disabled={disabled || !text.trim()}
      //   icon={<RefreshCw className="h-4 w-4" />}
      className="whitespace-nowrap"
    >
      Generate Slug
    </Button>
  );
};
