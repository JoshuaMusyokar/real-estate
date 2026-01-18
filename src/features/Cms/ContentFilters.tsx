import React from "react";

import type { ContentStatus, ContentType } from "../../types";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

const CONTENT_TYPES: Array<{ value: ContentType; label: string }> = [
  { value: "ARTICLE", label: "Articles" },
  { value: "PAGE", label: "Pages" },
  { value: "TOOL", label: "Tools" },
  { value: "PODCAST", label: "Podcasts" },
  { value: "WEB_STORY", label: "Web Stories" },
];

const STATUS_OPTIONS: Array<{ value: ContentStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "All Status" },
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "ARCHIVED", label: "Archived" },
];

export interface ContentFilterValues {
  type: ContentType;
  status: ContentStatus | "ALL";
  search: string;
}

interface Props {
  values: ContentFilterValues;
  onChange: (values: ContentFilterValues) => void;
  onApply?: () => void;
  onReset?: () => void;
  showApplyButton?: boolean;
}

export const ContentFilters: React.FC<Props> = ({
  values,
  onChange,
  onApply,
  onReset,
  showApplyButton = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Content Type */}
      <div>
        <label className="block text-sm font-medium mb-1">Content Type</label>
        <Select
          defaultValue={values.type}
          onChange={(value) =>
            onChange({ ...values, type: value as ContentType })
          }
          options={CONTENT_TYPES}
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <Select
          defaultValue={values.status}
          onChange={(value) =>
            onChange({
              ...values,
              status: value as ContentStatus | "ALL",
            })
          }
          options={STATUS_OPTIONS}
        />
      </div>

      {/* Search */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Search</label>
        <Input
          type="search"
          placeholder="Search by title or content..."
          value={values.search}
          onChange={(e) => onChange({ ...values, search: e.target.value })}
        />
      </div>

      {/* Mobile Actions */}
      {showApplyButton && (
        <div className="col-span-full flex gap-2 pt-2">
          <Button variant="outline" className="w-full" onClick={onReset}>
            Reset
          </Button>
          <Button className="w-full" onClick={onApply}>
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
};
