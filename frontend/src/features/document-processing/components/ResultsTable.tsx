'use client';

import { DataTable } from '@/components/common/Table/DataTable';
import { useUploadResults } from '@/features/document-processing/api/uploadsApi';

export function ResultsTable({ uploadId }: { uploadId: string }) {
  const { data, isLoading, isError } = useUploadResults(uploadId, true);

  if (isError || !data) {
    return <p className="text-red-600">No se pudieron cargar los resultados.</p>;
  }

  return (
    <DataTable
      data={data.data}
      columns={[
        {
          key: 'category',
          label: 'Categoría',
          className: 'font-medium text-gray-900',
        },
        {
          key: 'amount',
          label: 'Cantidad',
          className: 'text-gray-700 tabular-nums',
        },
        { key: 'unit', label: 'Unidad', className: 'text-gray-700' },
        {
          key: 'date',
          label: 'Fecha',
          render: (_value, row) => row.date.slice(0, 10),
          className: 'text-gray-600',
        },
      ]}
      getRowId={(item, index) => `${item.category}-${item.date}-${index}`}
      pageSize={10}
      emptyMessage="No hay filas válidas para mostrar."
      isLoading={isLoading}
    />
  );
}