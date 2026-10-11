export type UploadStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

// Una fila de GET /uploads
export interface UploadListItem {
  id: string;
  status: UploadStatus;
  fileName: string;
  processedRows: number | null;
  createdAt: string;
}

// Respuesta de GET /uploads
export interface UploadListResponse {
  data: UploadListItem[];
  total: number;
  page: number;
  limit: number;
}

// Respuesta de GET /uploads/:id
export interface UploadDetail {
  id: string;
  status: UploadStatus;
  fileName: string;
  totalRows: number | null;
  processedRows: number | null;
  failedRows: number | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

// Una fila de GET /uploads/:id/results
export interface ActivityDataItem {
  category: string;
  amount: number;
  unit: string;
  date: string;
}

// Respuesta de GET /uploads/:id/results
export interface UploadResultsResponse {
  data: ActivityDataItem[];
}

// Respuesta de GET /uploads/summary
export interface UploadsSummary {
  total: number;
  completed: number;
  processing: number;
  failed: number;
}

// Respuesta de POST /uploads
export interface CreateUploadResponse {
  id: string;
  status: UploadStatus;
  fileName: string;
  createdAt: string;
}