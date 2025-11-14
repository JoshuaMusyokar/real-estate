import { useState } from "react";
import { FileText, Upload, X } from "lucide-react";

interface PropertyDocument {
  url: string;
  name: string;
  type: string;
  size: number;
}

interface DocumentUploadProps {
  documents: PropertyDocument[];
  onChange: (documents: PropertyDocument[]) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documents,
  onChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach((file) => {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload only PDF or Word documents");
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newDocument: PropertyDocument = {
          url: reader.result as string,
          name: file.name,
          type: file.type,
          size: file.size,
        };
        onChange([...documents, newDocument]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeDocument = (index: number) => {
    const updated = documents.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-500"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          multiple
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          className="hidden"
          id="document-upload"
        />
        <label htmlFor="document-upload" className="cursor-pointer">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Click to upload documents or drag and drop
          </p>
          <p className="text-sm text-gray-500">
            PDF, DOC, DOCX up to 10MB each
          </p>
        </label>
      </div>

      {documents.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">
              Uploaded Documents ({documents.length}/10)
            </h4>
            {documents.length >= 10 && (
              <span className="text-sm text-red-600">
                Maximum documents reached
              </span>
            )}
          </div>

          {documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    {(doc.size / 1024 / 1024).toFixed(2)} MB •{" "}
                    {doc.type.split("/")[1].toUpperCase()}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeDocument(index)}
                className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      {documents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No documents uploaded yet</p>
        </div>
      )}
    </div>
  );
};
