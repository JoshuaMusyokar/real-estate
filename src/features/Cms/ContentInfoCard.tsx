import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import {
  Calendar,
  User,
  Eye,
  Link as LinkIcon,
  Hash,
  FolderOpen,
  Menu,
  Star,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import type { Content } from "../../types";
import Badge from "../../components/ui/badge/Badge";

interface ContentInfoCardProps {
  content: Content;
}

export const ContentInfoCard: React.FC<ContentInfoCardProps> = ({
  content,
}) => {
  const InfoItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
  }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 py-3 border-b last:border-b-0">
      <div className="text-gray-400 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <div className="text-sm font-medium text-gray-900">{value}</div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Content Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        <InfoItem
          icon={<LinkIcon className="w-4 h-4" />}
          label="Slug"
          value={
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              /{content.slug}
            </code>
          }
        />

        <InfoItem
          icon={<Hash className="w-4 h-4" />}
          label="Content ID"
          value={<code className="text-xs text-gray-600">{content.id}</code>}
        />

        <InfoItem
          icon={<Calendar className="w-4 h-4" />}
          label="Created"
          value={format(new Date(content.createdAt), "MMM d, yyyy 'at' h:mm a")}
        />

        <InfoItem
          icon={<Clock className="w-4 h-4" />}
          label="Last Updated"
          value={format(new Date(content.updatedAt), "MMM d, yyyy 'at' h:mm a")}
        />

        {content.publishedAt && (
          <InfoItem
            icon={<Eye className="w-4 h-4" />}
            label="Published"
            value={format(
              new Date(content.publishedAt),
              "MMM d, yyyy 'at' h:mm a"
            )}
          />
        )}

        {content.authorId && (
          <InfoItem
            icon={<User className="w-4 h-4" />}
            label="Author"
            value={content.metadata?.authorName || content.authorId}
          />
        )}

        <InfoItem
          icon={<FolderOpen className="w-4 h-4" />}
          label="Categories"
          value={
            content.categories.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {content.categories.map((cat) => (
                  <Badge key={cat.id} variant="light">
                    {cat.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-gray-400">No categories</span>
            )
          }
        />

        <InfoItem
          icon={<Menu className="w-4 h-4" />}
          label="Navigation"
          value={
            content.showInMenu ? (
              <Badge variant="solid" color="success">
                Shown in Menu
              </Badge>
            ) : (
              <Badge variant="light">Hidden from Menu</Badge>
            )
          }
        />

        <InfoItem
          icon={<Star className="w-4 h-4" />}
          label="Featured"
          value={
            content.isFeatured ? (
              <Badge variant="solid" color="warning">
                Featured Content
              </Badge>
            ) : (
              <Badge variant="light">Not Featured</Badge>
            )
          }
        />

        {content.order !== undefined && (
          <InfoItem
            icon={<Hash className="w-4 h-4" />}
            label="Display Order"
            value={content.order}
          />
        )}
      </CardContent>
    </Card>
  );
};
