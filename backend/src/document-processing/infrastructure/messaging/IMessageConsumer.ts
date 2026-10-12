export interface IMessageConsumer {
  poll(): Promise<{ uploadId: string } | null>;
}
