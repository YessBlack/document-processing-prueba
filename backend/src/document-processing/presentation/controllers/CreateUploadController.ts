import { CreateUploadCommandHandler } from '../../application/commands/handlers/CreateUploadCommandHandler';
import { CreateUploadCommand } from '../../application/commands/objects/CreateUploadCommand';
import { AppError } from '../../../shared/infrastructure/http/AppError';
import { unwrapResult } from '../../../shared/infrastructure/http/resultToHttp';
import type { FastifyReply, FastifyRequest } from 'fastify';
import '@fastify/multipart';

export class CreateUploadController {
  private handler: CreateUploadCommandHandler;

  constructor(handler: CreateUploadCommandHandler) {
    this.handler = handler;
  }

  async handle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const file = await request.file();

    if (!file) {
      throw new AppError('Debes enviar un archivo CSV', 400);
    }

    const buffer = await file.toBuffer();
    const command = new CreateUploadCommand(file.filename, buffer, 'user-123');

    const result = await this.handler.execute(command);
    const data = unwrapResult(result, 400);

    reply.status(201).send(data);
  }
}