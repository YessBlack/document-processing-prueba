import { ok, fail, type Result } from '../../../shared/domain/Result'

export class FileName {
  private readonly value: string

  private constructor (value: string) {
    this.value = value
  }

  static create (name: string): Result<FileName> {
    const trimmed = name?.trim()

    if (!trimmed) {
      return fail('El nombre del archivo es obligatorio')
    }

    if (!trimmed.toLowerCase().endsWith('.csv')) {
      return fail('Solo se permiten archivos .csv')
    }

    if (trimmed.length > 255) {
      return fail('El nombre del archivo es demasiado largo')
    }

    return ok(new FileName(trimmed))
  }

  getValue (): string {
    return this.value
  }

  equals (other: FileName): boolean {
    return this.value === other.value
  }
}
