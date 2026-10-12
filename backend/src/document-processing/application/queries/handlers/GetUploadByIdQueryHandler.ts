import type { IQueryHandler } from '../../../../shared/application/IQueryHandler'
import { fail, ok, type Result } from '../../../../shared/domain/Result'
import type { IUploadRepository } from '../../../domain/repositories/IUploadRepository'
import { GetUploadByIdQuery } from '../objects/GetUploadByIdQuery'

export interface GetUploadByIdResult {
  id: string;
  status: string;
  fileName: string;
  totalRows: number | null;
  processedRows: number | null;
  failedRows: number | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class GetUploadByIdQueryHandler implements IQueryHandler<GetUploadByIdQuery, GetUploadByIdResult> {
  private uploadRepository: IUploadRepository

  constructor (uploadRepository: IUploadRepository) {
    this.uploadRepository = uploadRepository
  }

  async execute (query: GetUploadByIdQuery): Promise<Result<GetUploadByIdResult>> {
    const upload = await this.uploadRepository.findById(query.id)

    if (!upload) {
      return fail('Upload no encontrado')
    }

    return ok({
      id: upload.getId(),
      status: upload.getStatus().getValue(),
      fileName: upload.getFileName().getValue(),
      totalRows: upload.getTotalRows(),
      processedRows: upload.getProcessedRows(),
      failedRows: upload.getFailedRows(),
      errorMessage: upload.getErrorMessage(),
      createdAt: upload.getCreatedAt(),
      updatedAt: upload.getUpdatedAt(),
    })
  }
}
