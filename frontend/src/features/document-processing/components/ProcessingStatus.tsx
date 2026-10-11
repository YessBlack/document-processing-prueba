import { Badge } from '@/components/ui/badge';
import type { UploadStatus } from '@/features/document-processing/types/upload.types';

const STATUS_STYLES: Record<UploadStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  PROCESSING: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  COMPLETED: 'bg-green-100 text-green-800 hover:bg-green-100',
  FAILED: 'bg-red-100 text-red-800 hover:bg-red-100',
};

export function ProcessingStatus({ status }: { status: UploadStatus }) {
  return <Badge className={STATUS_STYLES[status]}>{status}</Badge>;
}