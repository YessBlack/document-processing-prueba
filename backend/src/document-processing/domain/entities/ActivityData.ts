export class ActivityData {
  private id: string
  private uploadId: string
  private category: string
  private amount: number
  private unit: string
  private date: Date
  private createdAt: Date

  constructor (id: string, uploadId: string, category: string, amount: number, unit: string, date: Date, createdAt: Date) {
    this.id = id
    this.uploadId = uploadId
    this.category = category
    this.amount = amount
    this.unit = unit
    this.date = date
    this.createdAt = createdAt
  }

  getId (): string {
    return this.id
  }

  getUploadId (): string {
    return this.uploadId
  }

  getCategory (): string {
    return this.category
  }

  getAmount (): number {
    return this.amount
  }

  getUnit (): string {
    return this.unit
  }

  getDate (): Date {
    return this.date
  }

  getCreatedAt (): Date {
    return this.createdAt
  }
}
