import type { Result } from '../../domain/Result';
import { AppError } from './AppError';

export function unwrapResult<T>(result: Result<T>, statusCode: number): T {
  if (!result.ok) {
    throw new AppError(result.error, statusCode);
  }
  return result.value;
}