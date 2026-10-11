import type { ActivityData as PrismaActivityData } from '../../../../../generated/prisma/client';
import { ActivityData } from '../../../domain/entities/ActivityData';

export class PrismaActivityDataMapper {
  static toDomain(row: PrismaActivityData): ActivityData {
    return new ActivityData(
      row.id,
      row.uploadId,
      row.category,
      row.amount,
      row.unit,
      row.date,
      row.createdAt,
    );
  }

  static toPersistence(item: ActivityData) {
    return {
      id: item.getId(),
      uploadId: item.getUploadId(),
      category: item.getCategory(),
      amount: item.getAmount(),
      unit: item.getUnit(),
      date: item.getDate(),
    };
  }
}