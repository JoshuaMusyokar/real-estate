// // src/components/users/ImportModal.tsx
// import React, { useState, useRef } from "react";
// import {
//   X,
//   Upload,
//   FileText,
//   AlertCircle,
//   CheckCircle2,
//   Download,
// } from "lucide-react";
// import { useImportUsersMutation } from "../../services/userApi";

// interface ImportModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// interface ImportResult {
//   processed: number;
//   successful: number;
//   errors?: string[];
//   failedRows: number[];
// }

// export const ImportModal: React.FC<ImportModalProps> = ({
//   isOpen,
//   onClose,
//   onSuccess,
// }) => {
//   const [importStep, setImportStep] = useState<"upload" | "review" | "results">(
//     "upload"
//   );
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [importResults, setImportResults] = useState<ImportResult | null>(null);
//   const [isImporting, setIsImporting] = useState(false);
//   const [dragActive, setDragActive] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [importUsers] = useImportUsersMutation();

//   const handleDrag = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);

//     const files = e.dataTransfer.files;
//     if (files && files[0]) {
//       handleFileSelect(files[0]);
//     }
//   };

//   const handleFileSelect = (file: File) => {
//     // Validate file type
//     const validTypes = [
//       "text/csv",
//       "application/vnd.ms-excel",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       "application/json",
//     ];

//     if (!validTypes.includes(file.type)) {
//       alert("Please select a CSV, Excel, or JSON file");
//       return;
//     }

//     // Validate file size (10MB max)
//     if (file.size > 10 * 1024 * 1024) {
//       alert("File size must be less than 10MB");
//       return;
//     }

//     setSelectedFile(file);
//     setImportStep("review");
//   };

//   const handleImport = async () => {
//     if (!selectedFile) return;

//     try {
//       setIsImporting(true);
//       const formData = new FormData();
//       formData.append("file", selectedFile);

//       const result = await importUsers(formData).unwrap();
//       setImportResults(result.data);
//       setImportStep("results");

//       if (result.data.processed > 0) {
//         onSuccess();
//       }
//     } catch (error) {
//       console.error("Import failed:", error);
//       setImportResults({
//         processed: 0,
//         successful: 0,
//         errors: [
//           "Failed to import users. Please check your file format and try again.",
//         ],
//         failedRows: [],
//       });
//       setImportStep("results");
//     } finally {
//       setIsImporting(false);
//     }
//   };

//   const downloadTemplate = () => {
//     // Create CSV template
//     const template = `firstName,lastName,email,phone,role,status,allowedCities,allowedLocalities
// John,Doe,john.doe@example.com,+1234567890,SALES_AGENT,ACTIVE,"New York,Los Angeles","Manhattan,Beverly Hills"
// Jane,Smith,jane.smith@example.com,+0987654321,ADMIN,ACTIVE,"Chicago","Downtown"
// Bob,Johnson,bob.johnson@example.com,,BUYER,PENDING_VERIFICATION,,""`;

//     const blob = new Blob([template], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "users-import-template.csv");
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     window.URL.revokeObjectURL(url);
//   };

//   const resetImport = () => {
//     setSelectedFile(null);
//     setImportResults(null);
//     setImportStep("upload");
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
//               <Upload className="text-blue-600 dark:text-blue-400" size={24} />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-gray-900 dark:text-white">
//                 {importStep === "upload" && "Import Users"}
//                 {importStep === "review" && "Review Import"}
//                 {importStep === "results" && "Import Results"}
//               </h2>
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 {importStep === "upload" && "Upload a file to import users"}
//                 {importStep === "review" && "Review the file before importing"}
//                 {importStep === "results" && "Import process completed"}
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           {/* Step 1: Upload */}
//           {importStep === "upload" && (
//             <div className="space-y-6">
//               <div className="text-center">
//                 <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
//                   <Upload className="text-gray-400" size={32} />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                   Upload User Data
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   Supported formats: CSV, Excel (.xlsx), JSON
//                 </p>
//               </div>

//               {/* Drag & Drop Area */}
//               <div
//                 className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
//                   dragActive
//                     ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
//                     : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
//                 }`}
//                 onDragEnter={handleDrag}
//                 onDragLeave={handleDrag}
//                 onDragOver={handleDrag}
//                 onDrop={handleDrop}
//               >
//                 <Upload className="mx-auto text-gray-400 mb-4" size={48} />
//                 <p className="text-gray-600 dark:text-gray-400 mb-2">
//                   <span className="font-semibold text-blue-600 dark:text-blue-400">
//                     Click to upload
//                   </span>{" "}
//                   or drag and drop
//                 </p>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   CSV, XLSX, or JSON (Max 10MB)
//                 </p>
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   className="hidden"
//                   accept=".csv,.xlsx,.xls,.json"
//                   onChange={(e) =>
//                     e.target.files?.[0] && handleFileSelect(e.target.files[0])
//                   }
//                 />
//                 <button
//                   onClick={() => fileInputRef.current?.click()}
//                   className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Select File
//                 </button>
//               </div>

//               {/* Template Download */}
//               <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h4 className="font-medium text-gray-900 dark:text-white">
//                       Need a template?
//                     </h4>
//                     <p className="text-sm text-gray-600 dark:text-gray-400">
//                       Download our CSV template to get started
//                     </p>
//                   </div>
//                   <button
//                     onClick={downloadTemplate}
//                     className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                   >
//                     <Download size={16} />
//                     Download Template
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Step 2: Review */}
//           {importStep === "review" && selectedFile && (
//             <div className="space-y-6">
//               <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//                 <div className="flex items-center gap-3">
//                   <FileText
//                     className="text-blue-600 dark:text-blue-400"
//                     size={20}
//                   />
//                   <div>
//                     <p className="font-medium text-blue-900 dark:text-blue-100">
//                       {selectedFile.name}
//                     </p>
//                     <p className="text-sm text-blue-700 dark:text-blue-300">
//                       {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
//                 <div className="flex items-start gap-3">
//                   <AlertCircle
//                     className="text-yellow-600 dark:text-yellow-400 mt-0.5"
//                     size={20}
//                   />
//                   <div>
//                     <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
//                       Before You Import
//                     </h4>
//                     <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
//                       <li>• Ensure email addresses are unique</li>
//                       <li>• Use valid role and status values</li>
//                       <li>• Passwords will be auto-generated and emailed</li>
//                       <li>• Review the template for required fields</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={resetImport}
//                   className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                 >
//                   Choose Different File
//                 </button>
//                 <button
//                   onClick={handleImport}
//                   disabled={isImporting}
//                   className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
//                 >
//                   {isImporting ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       Importing...
//                     </>
//                   ) : (
//                     <>
//                       <Upload size={20} />
//                       Start Import
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Step 3: Results */}
//           {importStep === "results" && importResults && (
//             <div className="space-y-6">
//               {/* Summary */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
//                   <CheckCircle2
//                     className="mx-auto text-green-600 dark:text-green-400 mb-2"
//                     size={32}
//                   />
//                   <div className="text-2xl font-bold text-green-900 dark:text-green-100">
//                     {importResults.successful}
//                   </div>
//                   <div className="text-sm text-green-700 dark:text-green-300">
//                     Successful
//                   </div>
//                 </div>
//                 <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
//                   <FileText
//                     className="mx-auto text-gray-600 dark:text-gray-400 mb-2"
//                     size={32}
//                   />
//                   <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
//                     {importResults.processed}
//                   </div>
//                   <div className="text-sm text-gray-700 dark:text-gray-300">
//                     Processed
//                   </div>
//                 </div>
//                 <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
//                   <AlertCircle
//                     className="mx-auto text-red-600 dark:text-red-400 mb-2"
//                     size={32}
//                   />
//                   <div className="text-2xl font-bold text-red-900 dark:text-red-100">
//                     {importResults.processed - importResults.successful}
//                   </div>
//                   <div className="text-sm text-red-700 dark:text-red-300">
//                     Failed
//                   </div>
//                 </div>
//               </div>

//               {/* Errors */}
//               {importResults.errors.length > 0 && (
//                 <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
//                   <h4 className="font-medium text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
//                     <AlertCircle size={20} />
//                     Import Errors
//                   </h4>
//                   <div className="space-y-2 max-h-32 overflow-y-auto">
//                     {importResults.errors.map((error, index) => (
//                       <div
//                         key={index}
//                         className="text-sm text-red-700 dark:text-red-300"
//                       >
//                         • {error}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Failed Rows */}
//               {importResults.failedRows.length > 0 && (
//                 <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
//                   <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
//                     Failed Rows
//                   </h4>
//                   <p className="text-sm text-yellow-700 dark:text-yellow-300">
//                     Rows {importResults.failedRows.join(", ")} failed to import.
//                     Please check these rows in your file.
//                   </p>
//                 </div>
//               )}

//               {/* Success Message */}
//               {importResults.successful > 0 && (
//                 <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
//                   <div className="flex items-center gap-3">
//                     <CheckCircle2
//                       className="text-green-600 dark:text-green-400"
//                       size={24}
//                     />
//                     <div>
//                       <p className="font-medium text-green-900 dark:text-green-100">
//                         Import Completed Successfully
//                       </p>
//                       <p className="text-sm text-green-700 dark:text-green-300">
//                         {importResults.successful} users have been imported.
//                         Password reset emails have been sent to new users.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="flex gap-3">
//                 <button
//                   onClick={resetImport}
//                   className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                 >
//                   Import More Users
//                 </button>
//                 <button
//                   onClick={onClose}
//                   className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Done
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
// TODO: BOILERPLATE WHEN THIS FEATURE IS REQUESTED
export const ImportModal = () => {
  return <></>;
};
