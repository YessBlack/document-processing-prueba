import { ok, fail, type Result } from '../../../shared/domain/Result'

type StatusValue = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export class UploadStatus {
  private static readonly VALID: StatusValue[] = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']

  private static readonly TRANSITIONS: Record<StatusValue, StatusValue[]> = {
    PENDING: ['PROCESSING', 'FAILED'],
    PROCESSING: ['COMPLETED', 'FAILED'],
    COMPLETED: [],
    FAILED: [],
  }

  private readonly value: StatusValue

  private constructor (value: StatusValue) {
    this.value = value
  }

  static create (value: string): Result<UploadStatus> {
    if (!UploadStatus.VALID.includes(value as StatusValue)) {
      return fail(`Estado inválido: ${value}`)
    }

    return ok(new UploadStatus(value as StatusValue))
  }

  static processing (): UploadStatus {
    return new UploadStatus('PROCESSING')
  }

  static completed (): UploadStatus {
    return new UploadStatus('COMPLETED')
  }

  static failed (): UploadStatus {
    return new UploadStatus('FAILED')
  }

  static pending (): UploadStatus {
    return new UploadStatus('PENDING')
  }

  canTransitionTo (next: UploadStatus): boolean {
    return UploadStatus.TRANSITIONS[this.value].includes(next.value)
  }

  getValue (): string {
    return this.value
  }

  equals (other: UploadStatus): boolean {
    return this.value === other.value
  }
}
