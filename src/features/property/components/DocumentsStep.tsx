// DocumentsStep.tsx - Mobile Responsive with Form Components
import {
  Check,
  FileText,
  X,
  Upload,
  Building,
  Shield,
  File,
  Info,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";

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
  const hasRERADocument = documents.some(
    (doc) =>
      doc.name.toLowerCase().includes("rera") ||
      doc.name.toLowerCase().includes("certificate"),
  );

  const hasBrochure = documents.some(
    (doc) =>
      doc.name.toLowerCase().includes("brochure") ||
      doc.name.toLowerCase().includes("catalog"),
  );

  const getFileIcon = (doc: PropertyDocument) => {
    if (doc.name.toLowerCase().includes("rera")) {
      return (
        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-success-600 dark:text-success-400" />
      );
    }
    if (doc.name.toLowerCase().includes("brochure")) {
      return (
        <Building className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
      );
    }
    if (doc.type.includes("pdf")) {
      return (
        <File className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
      );
    }
    return (
      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
    );
  };

  const getFileTypeColor = (doc: PropertyDocument) => {
    if (doc.name.toLowerCase().includes("rera")) {
      return "bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800";
    }
    if (doc.name.toLowerCase().includes("brochure")) {
      return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    }
    return "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700";
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Property Documents
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Upload RERA certificates, property brochures, and other relevant
          documents (optional but recommended)
        </p>
      </div>

      {/* Recommended Documents Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* RERA Certificate Card */}
        <Card
          className={`transition-all ${
            hasRERADocument
              ? "border-success-500 dark:border-success-600 bg-success-50 dark:bg-success-900/20"
              : "hover:border-success-300 dark:hover:border-success-700"
          }`}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3 mb-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-success-600 dark:text-success-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                  RERA Certificate
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                  Legal compliance document
                </p>
              </div>
            </div>
            {hasRERADocument ? (
              <div className="flex items-center gap-1.5 sm:gap-2 text-success-700 dark:text-success-300 text-xs sm:text-sm font-medium">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Uploaded
              </div>
            ) : (
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Increases buyer trust and legal compliance
              </p>
            )}
          </CardContent>
        </Card>

        {/* Property Brochure Card */}
        <Card
          className={`transition-all ${
            hasBrochure
              ? "border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20"
              : "hover:border-blue-300 dark:hover:border-blue-700"
          }`}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3 mb-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                  Property Brochure
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                  Marketing materials
                </p>
              </div>
            </div>
            {hasBrochure ? (
              <div className="flex items-center gap-1.5 sm:gap-2 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-medium">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Uploaded
              </div>
            ) : (
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Professional presentation for buyers
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-4 sm:p-5 md:p-6">
          <label className="block w-full cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center hover:border-brand-500 dark:hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30 transition-colors">
                <Upload className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
              </div>
              <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                Upload Documents
              </div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3">
                Drag & drop or click to browse files
              </div>
              <div className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
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
        </CardContent>
      </Card>

      {/* Uploaded Documents List */}
      {documents.length > 0 && (
        <Card>
          <CardHeader className="p-4 sm:p-5 md:p-6">
            <CardTitle className="text-base sm:text-lg">
              Uploaded Documents ({documents.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
            <div className="space-y-2 sm:space-y-3">
              {documents.map((doc, idx) => (
                <div
                  key={idx}
                  className={`border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center justify-between group transition-all ${getFileTypeColor(
                    doc,
                  )}`}
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-white dark:bg-gray-900/50">
                      {getFileIcon(doc)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                        {doc.name}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="truncate">{doc.type}</span>
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
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center transition-all hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 flex-shrink-0 ml-2 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {documents.length > 0 && (
        <Card className="bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800">
          <CardContent className="p-4 sm:p-5 md:p-6">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-success-600 dark:text-success-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-success-900 dark:text-success-100 mb-1">
                  Great! {documents.length} document
                  {documents.length !== 1 ? "s" : ""} uploaded.
                </h4>
                <p className="text-xs sm:text-sm text-success-800 dark:text-success-300">
                  {hasRERADocument && hasBrochure
                    ? "You've added both RERA certificate and brochure - this significantly increases buyer confidence!"
                    : hasRERADocument
                      ? "Your RERA certificate adds legal credibility to your listing."
                      : hasBrochure
                        ? "Your property brochure helps with professional presentation."
                        : "These documents help build trust with potential buyers."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Information */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="p-4 sm:p-5 md:p-6">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base text-blue-900 dark:text-blue-100">
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            Recommended Documents:
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
          <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-blue-800 dark:text-blue-300">
            {[
              {
                name: "RERA Certificate",
                desc: "Legal compliance and registration",
              },
              {
                name: "Property Brochure",
                desc: "Professional marketing materials",
              },
              { name: "Floor Plans", desc: "Room layouts and dimensions" },
              { name: "Title Deed", desc: "Ownership proof" },
              { name: "NOC", desc: "No Objection Certificate if applicable" },
              { name: "Approval Plans", desc: "Municipal approvals" },
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                <span>
                  <strong>{item.name}</strong> - {item.desc}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
