import type { IMessageConsumer } from "./IMessageConsumer";
import type { IMessagePublisher } from "./IMessagePublisher";

export class MockMessageQueue implements IMessagePublisher, IMessageConsumer {
  private queue: { uploadId: string }[] = [];

  async publish(message: { uploadId: string }): Promise<void> {
    this.queue.push(message);
  }

  async poll(): Promise<{ uploadId: string } | null> {
    return this.queue.shift() || null;
  }
}
