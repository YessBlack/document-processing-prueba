import { ListUploadsQueryHandler } from '../../application/queries/handlers/ListUploadsQueryHandler'
import { ListUploadsQuery } from '../../application/queries/objects/ListUploadsQuery'
import { unwrapResult } from '../../../shared/infrastructure/http/resultToHttp'
import type { FastifyReply, FastifyRequest } from 'fastify'

export class ListUploadsController {
  private handler: ListUploadsQueryHandler

  constructor (handler: ListUploadsQueryHandler) {
    this.handler = handler
  }

  async handle (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const queryParams = request.query as { page?: string; limit?: string }

    const page = Number(queryParams.page) || 1
    const limit = Number(queryParams.limit) || 10

    const result = await this.handler.execute(new ListUploadsQuery(page, limit))
    const data = unwrapResult(result, 400)

    reply.status(200).send(data)
  }
}
