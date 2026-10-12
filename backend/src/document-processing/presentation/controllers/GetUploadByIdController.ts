import { GetUploadByIdQueryHandler } from '../../application/queries/handlers/GetUploadByIdQueryHandler'
import { GetUploadByIdQuery } from '../../application/queries/objects/GetUploadByIdQuery'
import { unwrapResult } from '../../../shared/infrastructure/http/resultToHttp'
import type { FastifyReply, FastifyRequest } from 'fastify'

export class GetUploadByIdController {
  private handler: GetUploadByIdQueryHandler

  constructor (handler: GetUploadByIdQueryHandler) {
    this.handler = handler
  }

  async handle (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const params = request.params as { id: string }

    const result = await this.handler.execute(new GetUploadByIdQuery(params.id))
    const data = unwrapResult(result, 404)

    reply.status(200).send(data)
  }
}
