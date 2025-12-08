// hooks/usePropertyImages.ts
import { useState } from "react";
import type { PropertyImageFile } from "../types";

export const usePropertyImages = () => {
  const [imageFiles, setImageFiles] = useState<PropertyImageFile[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: PropertyImageFile[] = Array.from(files).map(
      (file, idx) => ({
        file,
        url: null,
        caption: null,
        key: null,
        order: imageFiles.length + idx,
        isCover: imageFiles.length === 0 && idx === 0,
        preview: URL.createObjectURL(file),
      })
    );

    setImageFiles([...imageFiles, ...newImages]);
  };

  const removeImage = (index: number) => {
    const removed = imageFiles[index];
    if (removed.preview && removed.file) {
      URL.revokeObjectURL(removed.preview);
    }
    const updated = imageFiles.filter((_, i) => i !== index);
    // Ensure at least one cover image
    if (removed.isCover && updated.length > 0) {
      updated[0].isCover = true;
    }
    setImageFiles(updated);
  };

  const setCoverImage = (index: number) => {
    setImageFiles(
      imageFiles.map((img, i) => ({
        ...img,
        isCover: i === index,
      }))
    );
  };

  return {
    imageFiles,
    setImageFiles,
    handleImageUpload,
    removeImage,
    setCoverImage,
  };
};
