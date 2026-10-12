import { randomUUID } from 'crypto'
import { Upload } from '../../../domain/entities/Upload'
import { ActivityData } from '../../../domain/entities/ActivityData'
import { UploadStatus } from '../../../domain/value-objects/UploadStatus'
import { CsvParserService } from '../../services/CsvParserService'
import { ProcessFileCommand } from '../objects/ProcessFileCommand'
import type { ICommandHandler } from '../../../../shared/application/ICommandHandler'
import type { IUploadRepository } from '../../../domain/repositories/IUploadRepository'
import type { IActivityDataRepository } from '../../../domain/repositories/IActivityDataRepository'
import type { IFileStorage } from '../../../infrastructure/storage/IFileStorage'
import { fail, ok, type Result } from '../../../../shared/domain/Result'

export interface ProcessFileResult {
  uploadId: string;
  status: string;
  totalRows: number;
  processedRows: number;
  failedRows: number;
}

export class ProcessFileCommandHandler implements ICommandHandler<ProcessFileCommand, ProcessFileResult> {
  private uploadRepository: IUploadRepository
  private activityDataRepository: IActivityDataRepository
  private fileStorage: IFileStorage
  private csvParser: CsvParserService

  constructor (uploadRepository: IUploadRepository, activityDataRepository: IActivityDataRepository, fileStorage: IFileStorage, csvParser: CsvParserService) {
    this.uploadRepository = uploadRepository
    this.activityDataRepository = activityDataRepository
    this.fileStorage = fileStorage
    this.csvParser = csvParser
  }

  async execute (command: ProcessFileCommand): Promise<Result<ProcessFileResult>> {
    // 1. Buscar el upload
    const upload = await this.uploadRepository.findById(command.uploadId)

    if (!upload) {
      return fail('Upload no encontrado')
    }

    // 2. PENDING -> PROCESSING
    const startResult = upload.changeStatus(UploadStatus.processing())

    if (!startResult.ok) {
      return fail(startResult.error)
    }

    await this.uploadRepository.update(upload)

    try {
      // 3. Leer el archivo y convertirlo a texto
      const buffer = await this.fileStorage.read(upload.getFileUrl())
      const content = buffer.toString('utf-8')

      // 4. Parsear y validar
      const parsed = this.csvParser.parse(content)

      // 5. Archivo vacío o encabezado inválido -> FAILED
      if (parsed.totalRows === 0) {
        const firstError = parsed.errors[0]
        const message = firstError ? firstError.message : 'El archivo no tiene filas para procesar'
        return await this.markAsFailed(upload, message)
      }

      // 6. Guardar las filas válidas
      const items = parsed.validRows.map((row) =>
        new ActivityData(
          randomUUID(),
          upload.getId(),
          row.category,
          row.amount,
          row.unit,
          row.date,
          new Date()
        )
      )

      if (items.length > 0) {
        await this.activityDataRepository.saveMany(items)
      }

      // 7. PROCESSING -> COMPLETED con los conteos
      upload.setTotalRows(parsed.totalRows)
      upload.setProcessedRows(parsed.validRows.length)
      upload.setFailedRows(parsed.errors.length)
      upload.changeStatus(UploadStatus.completed())

      await this.uploadRepository.update(upload)

      return ok({
        uploadId: upload.getId(),
        status: upload.getStatus().getValue(),
        totalRows: parsed.totalRows,
        processedRows: parsed.validRows.length,
        failedRows: parsed.errors.length,
      })
    } catch (error) {
      // Error inesperado (archivo no encontrado, base caída...)
      const message = error instanceof Error ? error.message : 'Error desconocido'
      return await this.markAsFailed(upload, message)
    }
  }

  private async markAsFailed (
    upload: Upload,
    message: string
  ): Promise<Result<ProcessFileResult>> {
    upload.setErrorMessage(message)
    upload.changeStatus(UploadStatus.failed())
    await this.uploadRepository.update(upload)
    return fail(message)
  }
}
