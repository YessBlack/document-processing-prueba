export interface IMessagePublisher {
  publish(message: unknown): Promise<void>;
}
