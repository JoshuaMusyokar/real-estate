/* eslint-disable @typescript-eslint/no-unused-vars */
// hooks/usePropertyImages.ts
import { useState } from "react";
import type { PropertyImageFile } from "../types";

export const usePropertyImages = () => {
  const [imageFiles, setImageFiles] = useState<PropertyImageFile[]>([]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isFloorPlan: boolean = false // ⭐ Add this parameter
  ) => {
    const files = e.target.files;
    if (!files) return;

    // Get the count of existing images of the same type for proper ordering
    const existingImagesOfType = imageFiles.filter(
      (img) => img.isFloorPlan === isFloorPlan
    );

    const newImages: PropertyImageFile[] = Array.from(files).map(
      (file, idx) => ({
        file,
        url: null,
        caption: null,
        key: null,
        order: existingImagesOfType.length + idx,
        isFloorPlan: isFloorPlan, // ⭐ Set the flag based on parameter
        // Only set as cover if it's a property image (not floor plan) and there are no existing property images
        isCover:
          !isFloorPlan &&
          imageFiles.filter((img) => !img.isFloorPlan).length === 0 &&
          idx === 0,
        preview: URL.createObjectURL(file),
      })
    );

    setImageFiles([...imageFiles, ...newImages]);
  };

  const removeImage = (index: number, isFloorPlan: boolean = false) => {
    // ⭐ Add isFloorPlan parameter
    const removed = imageFiles[index];
    if (removed.preview && removed.file) {
      URL.revokeObjectURL(removed.preview);
    }
    const updated = imageFiles.filter((_, i) => i !== index);

    // Ensure at least one cover image among property images (not floor plans)
    if (removed.isCover && !isFloorPlan) {
      const propertyImages = updated.filter((img) => !img.isFloorPlan);
      if (propertyImages.length > 0) {
        // Find the first property image and set it as cover
        const firstPropertyImageIndex = updated.findIndex(
          (img) => !img.isFloorPlan
        );
        if (firstPropertyImageIndex !== -1) {
          updated[firstPropertyImageIndex].isCover = true;
        }
      }
    }

    setImageFiles(updated);
  };

  const setCoverImage = (index: number) => {
    setImageFiles(
      imageFiles.map((img, i) => ({
        ...img,
        // Only property images can be cover images, not floor plans
        isCover: i === index && !img.isFloorPlan,
      }))
    );
  };

  // ⭐ Add a new function to handle caption changes
  const updateCaption = (
    index: number,
    caption: string,
    isFloorPlan: boolean = false
  ) => {
    setImageFiles(
      imageFiles.map((img, i) => (i === index ? { ...img, caption } : img))
    );
  };

  return {
    imageFiles,
    setImageFiles,
    handleImageUpload,
    removeImage,
    setCoverImage,
    updateCaption,
  };
};
