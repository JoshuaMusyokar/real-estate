import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  Eye,
  MoreVertical,
  ExternalLink,
  Star,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import type { Content } from "../../types";
import Button from "../../components/ui/button/Button";
import { StatusBadge } from "../../components/common/StatusBadge";
import Badge from "../../components/ui/badge/Badge";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem";

interface ContentHeaderProps {
  content: Content;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleStatus: () => void;
  onToggleFeatured: () => void;
  isLoading?: boolean;
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
  content,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onToggleFeatured,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const formattedDate = content.publishedAt
    ? format(new Date(content.publishedAt), "MMM d, yyyy 'at' h:mm a")
    : format(new Date(content.createdAt), "MMM d, yyyy 'at' h:mm a");

  return (
    <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {content.title}
                </h1>
                {content.isFeatured && (
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                <StatusBadge status={content.status} />
                <Badge variant="light">{content.type}</Badge>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/news/${content.slug}`, "_blank")}
              className="hidden sm:flex"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={onEdit}
              disabled={isLoading}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>

            {/* More Actions Dropdown */}
            <div className="relative">
              {/* Trigger */}
              <button
                className="dropdown-toggle inline-flex items-center justify-center rounded-md border border-gray-200 bg-white p-2 text-sm hover:bg-gray-50"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {/* Dropdown */}
              <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <DropdownItem
                  className="sm:hidden flex items-center"
                  onClick={() => {
                    window.open(`/news/${content.slug}`, "_blank");
                    setIsOpen(false);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </DropdownItem>

                <DropdownItem
                  className="flex items-center"
                  onClick={() => {
                    onToggleFeatured();
                    setIsOpen(false);
                  }}
                >
                  <Star className="mr-2 h-4 w-4" />
                  {content.isFeatured
                    ? "Remove from Featured"
                    : "Mark as Featured"}
                </DropdownItem>

                <DropdownItem
                  className="flex items-center"
                  onClick={() => {
                    onToggleStatus();
                    setIsOpen(false);
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Toggle Status
                </DropdownItem>

                <DropdownItem
                  className="flex items-center"
                  onClick={() => {
                    onDuplicate();
                    setIsOpen(false);
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownItem>

                <div className="my-1 h-px bg-gray-200" />

                <DropdownItem
                  className="flex items-center text-red-600 hover:bg-red-50"
                  onClick={() => {
                    onDelete();
                    setIsOpen(false);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownItem>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
