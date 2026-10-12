import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from './AppError'

export function errorHandler (
  error: FastifyError | AppError,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  if (error instanceof AppError) {
    reply.status(error.statusCode).send({ error: error.message })
    return
  }

  request.log.error(error)
  reply.status(500).send({ error: 'Error interno del servidor' })
}
