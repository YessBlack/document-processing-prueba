import { CreateUploadController } from '../controllers/CreateUploadController'
import { GetUploadByIdController } from '../controllers/GetUploadByIdController'
import { ListUploadsController } from '../controllers/ListUploadsController'
import { GetUploadResultsController } from '../controllers/GetUploadResultsController'
import { GetUploadsSummaryController } from '../controllers/GetUploadsSummaryController'
import type { FastifyInstance } from 'fastify'

export interface DocumentProcessingControllers {
  createUpload: CreateUploadController;
  getUploadById: GetUploadByIdController;
  listUploads: ListUploadsController;
  getUploadResults: GetUploadResultsController;
  getUploadsSummary: GetUploadsSummaryController;
}

export function registerDocumentProcessingRoutes (app: FastifyInstance, controllers: DocumentProcessingControllers): void {
  app.post('/api/v1/uploads', (request, reply) =>
    controllers.createUpload.handle(request, reply)
  )

  app.get('/api/v1/uploads/summary', (request, reply) =>
    controllers.getUploadsSummary.handle(request, reply)
  )

  app.get('/api/v1/uploads', (request, reply) =>
    controllers.listUploads.handle(request, reply)
  )

  app.get('/api/v1/uploads/:id', (request, reply) =>
    controllers.getUploadById.handle(request, reply)
  )

  app.get('/api/v1/uploads/:id/results', (request, reply) =>
    controllers.getUploadResults.handle(request, reply)
  )
}
