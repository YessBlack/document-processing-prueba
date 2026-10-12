import { GetUploadResultsQueryHandler } from '../../application/queries/handlers/GetUploadResultsQueryHandler'
import { GetUploadResultsQuery } from '../../application/queries/objects/GetUploadResultsQuery'
import { unwrapResult } from '../../../shared/infrastructure/http/resultToHttp'
import type { FastifyReply, FastifyRequest } from 'fastify'

export class GetUploadResultsController {
  private handler: GetUploadResultsQueryHandler

  constructor (handler: GetUploadResultsQueryHandler) {
    this.handler = handler
  }

  async handle (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const params = request.params as { id: string }

    const result = await this.handler.execute(new GetUploadResultsQuery(params.id))
    const data = unwrapResult(result, 404)

    reply.status(200).send(data)
  }
}
