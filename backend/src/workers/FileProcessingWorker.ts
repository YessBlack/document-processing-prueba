import type { IMessageConsumer } from "../document-processing/infrastructure/messaging/IMessageConsumer";
import type { ProcessFileCommandHandler } from "../document-processing/application/commands/handlers/ProcessFileCommandHandler";
import { ProcessFileCommand } from "../document-processing/application/commands/objects/ProcessFileCommand";


export class FileProcessingWorker {
  private messageConsumer: IMessageConsumer;
  private processFileHandler: ProcessFileCommandHandler;
  private intervalMs: number;
  private timer: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor(messageConsumer: IMessageConsumer, processFileHandler: ProcessFileCommandHandler, intervalMs: number,) {
    this.messageConsumer = messageConsumer;
    this.processFileHandler = processFileHandler;
    this.intervalMs = intervalMs;
  }

  start(): void {
    console.log('Worker iniciado, consultando la cola cada ' + this.intervalMs + ' ms');
    this.timer = setInterval(() => {
      this.tick();
    }, this.intervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async tick(): Promise<void> {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;

    try {
      const message = await this.messageConsumer.poll();
      if (message) {
        console.log('Procesando upload ' + message.uploadId);
        const result = await this.processFileHandler.execute(
          new ProcessFileCommand(message.uploadId),
        );
        if (!result.ok) {
          console.error('Falló el upload ' + message.uploadId + ': ' + result.error);
        }
      }
    } catch (error) {
      console.error('Error inesperado en el worker:', error);
    } finally {
      this.isRunning = false;
    }
  }
}