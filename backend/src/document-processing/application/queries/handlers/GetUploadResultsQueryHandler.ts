import type { IQueryHandler } from '../../../../shared/application/IQueryHandler'
import { fail, ok, type Result } from '../../../../shared/domain/Result'
import type { IActivityDataRepository } from '../../../domain/repositories/IActivityDataRepository'
import type { IUploadRepository } from '../../../domain/repositories/IUploadRepository'
import type { GetUploadResultsQuery } from '../objects/GetUploadResultsQuery'

export interface ActivityDataItem {
  category: string;
  amount: number;
  unit: string;
  date: Date;
}

export interface GetUploadResultsResult {
  data: ActivityDataItem[];
}

export class GetUploadResultsQueryHandler implements IQueryHandler<GetUploadResultsQuery, GetUploadResultsResult> {
  private uploadRepository: IUploadRepository
  private activityDataRepository: IActivityDataRepository

  constructor (uploadRepository: IUploadRepository, activityDataRepository: IActivityDataRepository) {
    this.uploadRepository = uploadRepository
    this.activityDataRepository = activityDataRepository
  }

  async execute (query: GetUploadResultsQuery): Promise<Result<GetUploadResultsResult>> {
    const upload = await this.uploadRepository.findById(query.uploadId)

    if (!upload) {
      return fail('Upload no encontrado')
    }

    const items = await this.activityDataRepository.findByUploadId(query.uploadId)

    const data: ActivityDataItem[] = items.map((item) => ({
      category: item.getCategory(),
      amount: item.getAmount(),
      unit: item.getUnit(),
      date: item.getDate(),
    }))

    return ok({ data })
  }
}
