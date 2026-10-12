import type { IQueryHandler } from '../../../../shared/application/IQueryHandler'
import { fail, ok, type Result } from '../../../../shared/domain/Result'
import type { IUploadRepository } from '../../../domain/repositories/IUploadRepository'
import type { ListUploadsQuery } from '../objects/ListUploadsQuery'

export interface UploadListItem {
  id: string;
  status: string;
  fileName: string;
  processedRows: number | null;
  createdAt: Date;
}

export interface ListUploadsResult {
  data: UploadListItem[];
  total: number;
  page: number;
  limit: number;
}

export class ListUploadsQueryHandler
implements IQueryHandler<ListUploadsQuery, ListUploadsResult> {
  private uploadRepository: IUploadRepository

  constructor (uploadRepository: IUploadRepository) {
    this.uploadRepository = uploadRepository
  }

  async execute (query: ListUploadsQuery): Promise<Result<ListUploadsResult>> {
    if (query.page < 1 || query.limit < 1) {
      return fail('page y limit deben ser mayores a 0')
    }

    const result = await this.uploadRepository.findAll(query.page, query.limit)

    const data: UploadListItem[] = result.data.map((upload) => ({
      id: upload.getId(),
      status: upload.getStatus().getValue(),
      fileName: upload.getFileName().getValue(),
      processedRows: upload.getProcessedRows(),
      createdAt: upload.getCreatedAt(),
    }))

    return ok({
      data,
      total: result.total,
      page: query.page,
      limit: query.limit,
    })
  }
}
