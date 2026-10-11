import { Upload } from '../../../domain/entities/Upload';
import { FileName } from '../../../domain/value-objects/FileName';
import { UploadStatus } from '../../../domain/value-objects/UploadStatus';
import type { Upload as PrismaUpload } from '../../../../../generated/prisma/client';

export class PrismaUploadMapper {
  static toDomain(row: PrismaUpload): Upload {
    const fileNameResult = FileName.create(row.fileName);
    if (!fileNameResult.ok) {
      throw new Error('Dato inválido en la base de datos: ' + fileNameResult.error);
    }

    const statusResult = UploadStatus.create(row.status);
    if (!statusResult.ok) {
      throw new Error('Dato inválido en la base de datos: ' + statusResult.error);
    }

    return new Upload(
      row.id,
      fileNameResult.value,
      row.fileUrl,
      statusResult.value,
      row.userId,
      row.totalRows,
      row.processedRows,
      row.failedRows,
      row.errorMessage,
      row.createdAt,
      row.updatedAt,
    );
  }

  static toPersistence(upload: Upload) {
    return {
      id: upload.getId(),
      fileName: upload.getFileName().getValue(),
      fileUrl: upload.getFileUrl(),
      status: upload.getStatus().getValue(),
      userId: upload.getUserId(),
      totalRows: upload.getTotalRows(),
      processedRows: upload.getProcessedRows(),
      failedRows: upload.getFailedRows(),
      errorMessage: upload.getErrorMessage(),
    };
  }
}