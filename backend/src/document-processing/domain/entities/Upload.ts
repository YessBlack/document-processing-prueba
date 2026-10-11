import { fail, ok, type Result } from "../../../shared/domain/Result";
import type { FileName } from "../value-objects/FileName";
import type { UploadStatus } from "../value-objects/UploadStatus";

export class Upload {
  private id: string;
  private fileName: FileName;
  private fileUrl: string;
  private status: UploadStatus;
  private userId: string;
  private totalRows: number | null;
  private processedRows: number | null;
  private failedRows: number | null;
  private errorMessage: string | null;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    fileName: FileName,
    fileUrl: string,
    status: UploadStatus,
    userId: string,
    totalRows: number | null,
    processedRows: number | null,
    failedRows: number | null,
    errorMessage: string | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.fileName = fileName;
    this.fileUrl = fileUrl;
    this.status = status;
    this.userId = userId;
    this.totalRows = totalRows;
    this.processedRows = processedRows;
    this.failedRows = failedRows;
    this.errorMessage = errorMessage;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  getId(): string { return this.id; }
  getFileName(): FileName { return this.fileName; }
  getFileUrl(): string { return this.fileUrl; }
  getStatus(): UploadStatus { return this.status; }
  getUserId(): string { return this.userId; }
  getTotalRows(): number | null { return this.totalRows; }
  getProcessedRows(): number | null { return this.processedRows; }
  getFailedRows(): number | null { return this.failedRows; }
  getErrorMessage(): string | null { return this.errorMessage; }
  getCreatedAt(): Date { return this.createdAt; }
  getUpdatedAt(): Date { return this.updatedAt; }

  setStatus(status: UploadStatus): void { this.status = status; }
  setTotalRows(totalRows: number | null): void { this.totalRows = totalRows; }
  setProcessedRows(processedRows: number | null): void { this.processedRows = processedRows; }
  setFailedRows(failedRows: number | null): void { this.failedRows = failedRows; }
  setErrorMessage(errorMessage: string | null): void { this.errorMessage = errorMessage; }

  changeStatus(next: UploadStatus): Result<void> {
    if (!this.status.canTransitionTo(next)) {
      return fail(
        'No se puede pasar de ' + this.status.getValue() + ' a ' + next.getValue(),
      );
    }

    this.status = next;

    return ok(undefined);
  }
}