import { PrismaClient } from '../../../../../generated/prisma/client'
import { ActivityData } from '../../../domain/entities/ActivityData'
import type { IActivityDataRepository } from '../../../domain/repositories/IActivityDataRepository'
import { PrismaActivityDataMapper } from '../mappers/PrismaActivityDataMapper'

export class PrismaActivityDataRepository implements IActivityDataRepository {
  private prisma: PrismaClient

  constructor (prisma: PrismaClient) {
    this.prisma = prisma
  }

  async saveMany (items: ActivityData[]): Promise<void> {
    const data = items.map((item) => PrismaActivityDataMapper.toPersistence(item))
    await this.prisma.activityData.createMany({ data })
  }

  async findByUploadId (uploadId: string): Promise<ActivityData[]> {
    const rows = await this.prisma.activityData.findMany({
      where: { uploadId },
      orderBy: { date: 'asc' },
    })

    return rows.map((row) => PrismaActivityDataMapper.toDomain(row))
  }
}
