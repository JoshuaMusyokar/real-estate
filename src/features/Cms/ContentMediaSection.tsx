import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Image as ImageIcon, Grid } from "lucide-react";
import type { Content } from "../../types";
import Badge from "../../components/ui/badge/Badge";

interface ContentMediaSectionProps {
  content: Content;
}

export const ContentMediaSection: React.FC<ContentMediaSectionProps> = ({
  content,
}) => {
  return (
    <div className="space-y-6">
      {/* Featured Image */}
      {content.featuredImage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ImageIcon className="w-5 h-5" />
              Featured Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-lg overflow-hidden border border-gray-200">
              <img
                src={content.featuredImage.url}
                alt={content.title}
                className="w-full h-auto"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm font-medium">
                  {content.featuredImage.originalName}
                </p>
                <p className="text-white/80 text-xs">
                  {content.featuredImage.mimeType}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gallery */}
      {content.gallery && content.gallery.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Grid className="w-5 h-5" />
              Gallery
              <Badge variant="light">{content.gallery.length} images</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {content.gallery.map((item, index) => (
                <div
                  key={item.id}
                  className="relative group rounded-lg overflow-hidden border border-gray-200 hover:border-primary transition-colors"
                >
                  <div className="aspect-square">
                    <img
                      src={item.media.url}
                      alt={item.caption || `Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                      <p className="text-white text-xs truncate">
                        {item.caption}
                      </p>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant="solid" color="light">
                      {index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {content.contentMedia && content.contentMedia.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Grid className="w-5 h-5" />
              Gallery
              <Badge variant="light">
                {content.contentMedia.length} images
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {content.contentMedia.map((item, index) => (
                <div
                  key={item.id}
                  className="relative group rounded-lg overflow-hidden border border-gray-200 hover:border-primary transition-colors"
                >
                  <div className="aspect-square">
                    <img
                      src={item.media.url}
                      alt={item.caption || `Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                      <p className="text-white text-xs truncate">
                        {item.caption}
                      </p>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant="solid" color="light">
                      {index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
