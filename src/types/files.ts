// ============================================
// FILE UPLOADS
// ============================================

export interface Upload {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy?: string;
  entityType?: string;
  entityId?: string;
  createdAt: Date;
}
