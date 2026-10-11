
import { Buffer } from 'node:buffer'

export interface IFileStorage {
  save(fileName: string, content: Buffer): Promise<string>;
  read(fileUrl: string): Promise<Buffer>;
}
