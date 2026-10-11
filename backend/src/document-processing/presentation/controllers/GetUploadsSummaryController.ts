import { GetUploadsSummaryQueryHandler } from '../../application/queries/handlers/GetUploadsSummaryQueryHandler';
import { GetUploadsSummaryQuery } from '../../application/queries/objects/GetUploadsSummaryQuery';
import { unwrapResult } from '../../../shared/infrastructure/http/resultToHttp';
import type { FastifyReply, FastifyRequest } from 'fastify';

export class GetUploadsSummaryController {
  private handler: GetUploadsSummaryQueryHandler;

  constructor(handler: GetUploadsSummaryQueryHandler) {
    this.handler = handler;
  }

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const result = await this.handler.execute(new GetUploadsSummaryQuery());
    const data = unwrapResult(result, 500);

    reply.status(200).send(data);
  }
}