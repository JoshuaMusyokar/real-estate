import { Check, FileText, X, Upload, Building, Shield } from "lucide-react";

interface PropertyDocument {
  file?: File;
  url?: string;
  name: string;
  type: string;
  size?: number;
}

interface DocumentsStepProps {
  documents: PropertyDocument[];
  onDocumentUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveDocument: (index: number) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export const DocumentsStep: React.FC<DocumentsStepProps> = ({
  documents,
  onDocumentUpload,
  onRemoveDocument,
}) => {
  // Check if specific document types are uploaded
  const hasRERADocument = documents.some(
    (doc) =>
      doc.name.toLowerCase().includes("rera") ||
      doc.name.toLowerCase().includes("certificate")
  );

  const hasBrochure = documents.some(
    (doc) =>
      doc.name.toLowerCase().includes("brochure") ||
      doc.name.toLowerCase().includes("catalog")
  );

  const getFileIcon = (doc: PropertyDocument) => {
    if (doc.name.toLowerCase().includes("rera")) {
      return <Shield className="w-5 h-5 text-green-600" />;
    }
    if (doc.name.toLowerCase().includes("brochure")) {
      return <Building className="w-5 h-5 text-blue-600" />;
    }
    return <FileText className="w-5 h-5 text-gray-600" />;
  };

  const getFileTypeColor = (doc: PropertyDocument) => {
    if (doc.name.toLowerCase().includes("rera")) {
      return "bg-green-100 border-green-200";
    }
    if (doc.name.toLowerCase().includes("brochure")) {
      return "bg-blue-100 border-blue-200";
    }
    return "bg-gray-100 border-gray-200";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Property Documents
        </h3>
        <p className="text-gray-600">
          Upload RERA certificates, property brochures, and other relevant
          documents (optional but recommended)
        </p>
      </div>

      {/* Recommended Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RERA Certificate Card */}
        <div
          className={`border-2 rounded-xl p-4 transition-all ${
            hasRERADocument
              ? "border-green-200 bg-green-50"
              : "border-gray-200 bg-gray-50 hover:border-green-300"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">RERA Certificate</h4>
              <p className="text-xs text-gray-600">Legal compliance document</p>
            </div>
          </div>
          {hasRERADocument ? (
            <div className="flex items-center gap-2 text-green-700 text-sm">
              <Check className="w-4 h-4" />
              Uploaded
            </div>
          ) : (
            <p className="text-xs text-gray-500">
              Increases buyer trust and legal compliance
            </p>
          )}
        </div>

        {/* Property Brochure Card */}
        <div
          className={`border-2 rounded-xl p-4 transition-all ${
            hasBrochure
              ? "border-blue-200 bg-blue-50"
              : "border-gray-200 bg-gray-50 hover:border-blue-300"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Property Brochure</h4>
              <p className="text-xs text-gray-600">Marketing materials</p>
            </div>
          </div>
          {hasBrochure ? (
            <div className="flex items-center gap-2 text-blue-700 text-sm">
              <Check className="w-4 h-4" />
              Uploaded
            </div>
          ) : (
            <p className="text-xs text-gray-500">
              Professional presentation for buyers
            </p>
          )}
        </div>
      </div>

      {/* Upload Area */}
      <div>
        <label className="block w-full cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4 group-hover:text-blue-500" />
            <div className="text-lg font-semibold text-gray-900 mb-2">
              Upload Documents
            </div>
            <div className="text-sm text-gray-500 mb-3">
              Drag & drop or click to browse files
            </div>
            <div className="text-xs text-gray-400">
              PDF, DOC, DOCX, JPG, PNG up to 10MB each
            </div>
          </div>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,image/jpeg,image/png"
            onChange={onDocumentUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Uploaded Documents List */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">
            Uploaded Documents ({documents.length})
          </h4>

          {documents.map((doc, idx) => (
            <div
              key={idx}
              className={`border rounded-xl p-4 flex items-center justify-between group transition-all ${getFileTypeColor(
                doc
              )}`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  {getFileIcon(doc)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {doc.name}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{doc.type}</span>
                    {doc.size && (
                      <>
                        <span>•</span>
                        <span>{formatFileSize(doc.size)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemoveDocument(idx)}
                className="w-8 h-8 bg-white text-red-600 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 border border-red-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Help Information */}
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Recommended Documents:
          </h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • <strong>RERA Certificate</strong> - Legal compliance and
              registration
            </li>
            <li>
              • <strong>Property Brochure</strong> - Professional marketing
              materials
            </li>
            <li>
              • <strong>Floor Plans</strong> - Room layouts and dimensions
            </li>
            <li>
              • <strong>Title Deed</strong> - Ownership proof
            </li>
            <li>
              • <strong>NOC</strong> - No Objection Certificate if applicable
            </li>
            <li>
              • <strong>Approval Plans</strong> - Municipal approvals
            </li>
          </ul>
        </div>

        {documents.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="text-sm text-green-800">
              <strong>Great! {documents.length} document(s) uploaded.</strong>
              {hasRERADocument && hasBrochure
                ? " You've added both RERA certificate and brochure - this significantly increases buyer confidence!"
                : hasRERADocument
                ? " Your RERA certificate adds legal credibility to your listing."
                : hasBrochure
                ? " Your property brochure helps with professional presentation."
                : " These documents help build trust with potential buyers."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
