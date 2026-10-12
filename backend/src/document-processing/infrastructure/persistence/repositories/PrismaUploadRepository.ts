import { PrismaClient } from '../../../../../generated/prisma/client'
import { Upload } from '../../../domain/entities/Upload'
import type { IUploadRepository } from '../../../domain/repositories/IUploadRepository'
import { PrismaUploadMapper } from '../mappers/PrismaUploadMapper'

export class PrismaUploadRepository implements IUploadRepository {
  private prisma: PrismaClient

  constructor (prisma: PrismaClient) {
    this.prisma = prisma
  }

  async save (upload: Upload): Promise<void> {
    const data = PrismaUploadMapper.toPersistence(upload)
    await this.prisma.upload.create({ data })
  }

  async update (upload: Upload): Promise<void> {
    const data = PrismaUploadMapper.toPersistence(upload)

    await this.prisma.upload.update({
      where: { id: upload.getId() },
      data,
    })
  }

  async findById (id: string): Promise<Upload | null> {
    const row = await this.prisma.upload.findUnique({ where: { id } })

    if (!row) {
      return null
    }

    return PrismaUploadMapper.toDomain(row)
  }

  async findAll (page: number, limit: number): Promise<{ data: Upload[]; total: number }> {
    const rows = await this.prisma.upload.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    const total = await this.prisma.upload.count()

    const data = rows.map((row) => PrismaUploadMapper.toDomain(row))
    return { data, total }
  }

  async countByStatus (): Promise<Record<string, number>> {
    const groups = await this.prisma.upload.groupBy({
      by: ['status'],
      _count: { status: true },
    })

    const result: Record<string, number> = {}

    for (const group of groups) {
      result[group.status] = group._count.status
    }

    return result
  }
}
