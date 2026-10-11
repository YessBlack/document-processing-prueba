'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DataTable } from '@/components/common/Table/DataTable';
import { useUploads } from '@/features/document-processing/api/uploadsApi';
import { ProcessingStatus } from '@/features/document-processing/components/ProcessingStatus';

const PAGE_SIZE = 10;

export function UploadList() {
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, isError } = useUploads(page, PAGE_SIZE);

  if (isError) {
    return <p className="text-red-600">No se pudo cargar la lista de uploads.</p>;
  }

  return (
    <DataTable
      data={data?.data ?? []}
      columns={[
        {
          key: 'fileName',
          label: 'Archivo',
          className: 'max-w-72 font-medium text-gray-900',
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
          className: 'text-gray-600',
        },
        {
          key: 'processedRows',
          label: 'Filas procesadas',
          render: (value) => value ?? '-',
          className: 'text-gray-700 tabular-nums',
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
      getRowId={(upload) => upload.id}
      pageSize={PAGE_SIZE}
      isLoading={isLoading}
      totalCount={data?.total ?? 0}
      currentPage={page}
      onPageChange={setPage}
    />
  );
}