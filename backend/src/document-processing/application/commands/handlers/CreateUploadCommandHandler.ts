import { randomUUID } from 'crypto';

import { Upload } from '../../../domain/entities/Upload';
import { FileName } from '../../../domain/value-objects/FileName';
import { UploadStatus } from '../../../domain/value-objects/UploadStatus';
import { CreateUploadCommand } from '../objects/CreateUploadCommand';
import type { ICommandHandler } from '../../../../shared/application/ICommandHandler';
import type { IUploadRepository } from '../../../domain/repositories/IUploadRepository';
import type { IFileStorage } from '../../../infrastructure/storage/IFileStorage';
import type { IMessagePublisher } from '../../../infrastructure/messaging/IMessagePublisher';
import { fail, ok, type Result } from '../../../../shared/domain/Result';

export interface CreateUploadResult {
  id: string;
  status: string;
  fileName: string;
  createdAt: Date;
}

export class CreateUploadCommandHandler implements ICommandHandler<CreateUploadCommand, CreateUploadResult> {
  private uploadRepository: IUploadRepository;
  private fileStorage: IFileStorage;
  private messagePublisher: IMessagePublisher;

  constructor(
    uploadRepository: IUploadRepository,
    fileStorage: IFileStorage,
    messagePublisher: IMessagePublisher,
  ) {
    this.uploadRepository = uploadRepository;
    this.fileStorage = fileStorage;
    this.messagePublisher = messagePublisher;
  }

  async execute(command: CreateUploadCommand): Promise<Result<CreateUploadResult>> {
    const fileNameResult = FileName.create(command.fileName);

    if (!fileNameResult.ok) {
      return fail(fileNameResult.error);
    }

    const fileUrl = await this.fileStorage.save(command.fileName, command.content);

    const now = new Date();
    const upload = new Upload(
      randomUUID(),
      fileNameResult.value,
      fileUrl,
      UploadStatus.pending(),
      command.userId,
      null,
      null,
      null,
      null,
      now,
      now,
    );

    await this.uploadRepository.save(upload);

    await this.messagePublisher.publish({ uploadId: upload.getId() });

    return ok({
      id: upload.getId(),
      status: upload.getStatus().getValue(),
      fileName: upload.getFileName().getValue(),
      createdAt: upload.getCreatedAt(),
    });
  }
}