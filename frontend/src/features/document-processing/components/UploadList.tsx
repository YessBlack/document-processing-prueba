'use client';

import Link from 'next/link';
import { DataTable } from '@/components/common/DataTable';
import { useUploads } from '@/features/document-processing/api/uploadsApi';
import { ProcessingStatus } from '@/features/document-processing/components/ProcessingStatus';

const PAGE_SIZE = 20;

export function UploadList() {
  const { data, isLoading, isError } = useUploads(1, PAGE_SIZE);

  if (isError) {
    return <p className="text-red-600">No se pudo cargar la lista de uploads.</p>;
  }

  return (
    <div className="space-y-4">
      <DataTable
        data={data?.data ?? []}
        columns={[
          {
            key: 'fileName',
            label: 'Archivo',
          },
          {
            key: 'status',
            label: 'Estado',
            render: (_value, upload) => <ProcessingStatus status={upload.status} />,
          },
          {
            key: 'createdAt',
            label: 'Fecha de subida',
            render: (value) => new Date(String(value)).toLocaleString(),
          },
          {
            key: 'processedRows',
            label: 'Filas procesadas',
            render: (value) => value ?? '-',
          },
          {
            key: 'id',
            label: 'Acciones',
            render: (_value, upload) => (
              <Link
                href={'/uploads/' + upload.id}
                className="font-medium text-violet-700 underline decoration-violet-300 underline-offset-4 hover:text-violet-900 hover:decoration-violet-700 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
              >
                Ver detalle
              </Link>
            ),
          },
        ]}
        pageSize={10}
        isLoading={isLoading}
      />
    </div>
  );
}