// hooks/usePropertyDocuments.ts
import { useState } from "react";

export interface PropertyDocument {
  file?: File;
  url?: string;
  name: string;
  type: string;
  size?: number;
}

export const usePropertyDocuments = (
  showError?: (title: string, message: string) => void
) => {
  const [documents, setDocuments] = useState<PropertyDocument[]>([]);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];

    const newDocs: PropertyDocument[] = Array.from(files)
      .filter((file) => {
        if (!allowedTypes.includes(file.type)) {
          showError?.(
            "Unsupported!",
            `File ${file.name} is not a supported format`
          );
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          showError?.("Invalid!", `File ${file.name} exceeds 10MB limit`);
          return false;
        }
        return true;
      })
      .map((file) => ({
        file,
        name: file.name,
        type: file.type,
        size: file.size,
      }));

    setDocuments([...documents, ...newDocs]);
  };

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return {
    documents,
    setDocuments,
    handleDocumentUpload,
    removeDocument,
    formatFileSize,
  };
};
