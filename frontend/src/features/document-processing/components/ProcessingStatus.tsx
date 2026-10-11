import { Badge } from '@/components/ui/badge';
import type { UploadStatus } from '@/features/document-processing/types/upload.types';

type BadgeVariant =
  | "default"
  | "success"
  | "secondary"
  | "destructive";

const STATUS_STYLES: Record<UploadStatus, BadgeVariant> = {
  PENDING: "success",
  PROCESSING: "default",
  COMPLETED: "success",
  FAILED: "destructive",
};

export function ProcessingStatus({ status }: { status: UploadStatus }) {
  return <Badge variant={STATUS_STYLES[status]}>{status}</Badge>;
}