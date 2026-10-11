'use client';

import { DataTable } from '@/components/common/DataTable';
import { useUploadResults } from '@/features/document-processing/api/uploadsApi';

interface ResultRow {
  id: string;
  category: string;
  amount: number;
  unit: string;
  date: string;
}

export function ResultsTable({ uploadId }: { uploadId: string }) {
  const { data, isLoading, isError } = useUploadResults(uploadId, true);

  if (isError) {
    return <p className="text-red-600">No se pudieron cargar los resultados.</p>;
  }

  const rows: ResultRow[] = (data?.data ?? []).map((item, index) => ({
    ...item,
    id: `${item.category}-${item.date}-${index}`,
  }));

  return (
    <DataTable
      data={rows}
      columns={[
        {
          key: 'category',
          label: 'Categoría',
        },
        {
          key: 'amount',
          label: 'Cantidad',
        },
        { key: 'unit', label: 'Unidad' },
        {
          key: 'date',
          label: 'Fecha',
          render: (_value, row) => row.date.slice(0, 10),
        },
      ]}
      pageSize={15}
      isLoading={isLoading}
    />
  );
}