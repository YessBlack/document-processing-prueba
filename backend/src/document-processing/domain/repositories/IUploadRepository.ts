import { Upload } from '../entities/Upload';

export interface IUploadRepository {
  save(upload: Upload): Promise<void>;
  update(upload: Upload): Promise<void>;
  findById(id: string): Promise<Upload | null>;
  findAll(page: number, limit: number): Promise<{ data: Upload[]; total: number }>;
  countByStatus(): Promise<Record<string, number>>;
}