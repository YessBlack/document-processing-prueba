
import type { IQueryHandler } from '../../../../shared/application/IQueryHandler';
import { ok, type Result } from '../../../../shared/domain/Result';
import type { IUploadRepository } from '../../../domain/repositories/IUploadRepository';
import { GetUploadsSummaryQuery } from '../objects/GetUploadsSummaryQuery';

export interface GetUploadsSummaryResult {
  total: number;
  completed: number;
  processing: number;
  failed: number;
}

export class GetUploadsSummaryQueryHandler
  implements IQueryHandler<GetUploadsSummaryQuery, GetUploadsSummaryResult>
{
  private uploadRepository: IUploadRepository;

  constructor(uploadRepository: IUploadRepository) {
    this.uploadRepository = uploadRepository;
  }

  async execute(query: GetUploadsSummaryQuery): Promise<Result<GetUploadsSummaryResult>> {
    const counts = await this.uploadRepository.countByStatus();

    const pending = counts['PENDING'] || 0;
    const processing = counts['PROCESSING'] || 0;
    const completed = counts['COMPLETED'] || 0;
    const failed = counts['FAILED'] || 0;

    return ok({
      total: pending + processing + completed + failed,
      completed: completed,
      processing: processing,
      failed: failed,
    });
  }
}