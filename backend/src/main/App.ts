import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';

import { errorHandler } from '../shared/infrastructure/http/errorHandler';

// Infraestructura
import { PrismaUploadRepository } from '../document-processing/infrastructure/persistence/repositories/PrismaUploadRepository';
import { PrismaActivityDataRepository } from '../document-processing/infrastructure/persistence/repositories/PrismaActivityDataRepository';
import { LocalFileStorage } from '../document-processing/infrastructure/storage/LocalFileStorage';
import { MockMessageQueue } from '../document-processing/infrastructure/messaging/MockMessageQueue';

// Aplicación
import { CsvParserService } from '../document-processing/application/services/CsvParserService';
import { CreateUploadCommandHandler } from '../document-processing/application/commands/handlers/CreateUploadCommandHandler';
import { ProcessFileCommandHandler } from '../document-processing/application/commands/handlers/ProcessFileCommandHandler';
import { GetUploadByIdQueryHandler } from '../document-processing/application/queries/handlers/GetUploadByIdQueryHandler';
import { ListUploadsQueryHandler } from '../document-processing/application/queries/handlers/ListUploadsQueryHandler';
import { GetUploadResultsQueryHandler } from '../document-processing/application/queries/handlers/GetUploadResultsQueryHandler';
import { GetUploadsSummaryQueryHandler } from '../document-processing/application/queries/handlers/GetUploadsSummaryQueryHandler';

// Presentación
import { CreateUploadController } from '../document-processing/presentation/controllers/CreateUploadController';
import { GetUploadByIdController } from '../document-processing/presentation/controllers/GetUploadByIdController';
import { ListUploadsController } from '../document-processing/presentation/controllers/ListUploadsController';
import { GetUploadResultsController } from '../document-processing/presentation/controllers/GetUploadResultsController';
import { GetUploadsSummaryController } from '../document-processing/presentation/controllers/GetUploadsSummaryController';
import { registerDocumentProcessingRoutes } from '../document-processing/presentation/routes/DocumentProcessingRoutes';
import { prisma } from '../lib/prisma';
import { FileProcessingWorker } from '../workers/FileProcessingWorker';

// Worker

export class App {
  private server: FastifyInstance;
  private worker: FileProcessingWorker;

  constructor() {
    // 1. Infraestructura (UNA sola instancia de cada una)
    const uploadRepository = new PrismaUploadRepository(prisma);
    const activityDataRepository = new PrismaActivityDataRepository(prisma);
    const fileStorage = new LocalFileStorage(process.env.UPLOADS_DIR || './uploads');
    const messageQueue = new MockMessageQueue();

    // 2. Servicios y handlers
    const csvParser = new CsvParserService();

    const createUploadHandler = new CreateUploadCommandHandler(
      uploadRepository,
      fileStorage,
      messageQueue,
    );

    const processFileHandler = new ProcessFileCommandHandler(
      uploadRepository,
      activityDataRepository,
      fileStorage,
      csvParser,
    );

    const getUploadByIdHandler = new GetUploadByIdQueryHandler(uploadRepository);
    const listUploadsHandler = new ListUploadsQueryHandler(uploadRepository);
    const getUploadResultsHandler = new GetUploadResultsQueryHandler(
      uploadRepository,
      activityDataRepository,
    );
    const getUploadsSummaryHandler = new GetUploadsSummaryQueryHandler(uploadRepository);

    // 3. Servidor HTTP
    this.server = Fastify({ logger: true });
    this.server.register(cors, { origin: true });
    this.server.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });
    this.server.setErrorHandler(errorHandler);

    registerDocumentProcessingRoutes(this.server, {
      createUpload: new CreateUploadController(createUploadHandler),
      getUploadById: new GetUploadByIdController(getUploadByIdHandler),
      listUploads: new ListUploadsController(listUploadsHandler),
      getUploadResults: new GetUploadResultsController(getUploadResultsHandler),
      getUploadsSummary: new GetUploadsSummaryController(getUploadsSummaryHandler),
    });

    // 4. Worker: recibe la MISMA cola en la que publica la API
    this.worker = new FileProcessingWorker(messageQueue, processFileHandler, 3000);
  }

  async start(port: number): Promise<void> {
    await this.server.listen({ port: port, host: '0.0.0.0' });
    this.worker.start();
  }
}