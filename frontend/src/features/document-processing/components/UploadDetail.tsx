'use client';

import type { ReactNode } from 'react';
import { DataTable } from '@/components/common/Table/DataTable';
import { useUpload } from '@/features/document-processing/api/uploadsApi';
import { ProcessingStatus } from '@/features/document-processing/components/ProcessingStatus';
import { ResultsTable } from '@/features/document-processing/components/ResultsTable';

interface DetailRow {
  id: string;
  label: string;
  value: ReactNode;
}

export function UploadDetail({ id }: { id: string }) {
  const { data, isLoading, isError } = useUpload(id);

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (isError || !data) {
    return <p className="text-red-600">No se encontró el upload.</p>;
  }

  const detailRows: DetailRow[] = [
    { id: 'file', label: 'Archivo', value: data.fileName },
    { id: 'date', label: 'Fecha', value: new Date(data.createdAt).toLocaleString() },
    { id: 'status', label: 'Estado', value: <ProcessingStatus status={data.status} /> },
  ];

  if (data.totalRows !== null) {
    detailRows.push({
      id: 'rows',
      label: 'Filas',
      value: (
        <span className="tabular-nums">
          {data.processedRows} procesadas de {data.totalRows}
          {data.failedRows ? ` (${data.failedRows} con error)` : ''}
        </span>
      ),
    });
  }

  return (
    <div>
      <div className="mb-6">
        <DataTable
          data={detailRows}
          columns={[
            { key: 'label', label: 'Campo', className: 'w-1/3 font-semibold text-gray-700' },
            {
              key: 'value',
              label: 'Detalle',
              render: (_value, row) => row.value,
              className: 'text-gray-700',
            },
          ]}
          getRowId={(row) => row.id}
        />
      </div>

      {(data.status === 'PENDING' || data.status === 'PROCESSING') && (
        <div className="mb-6">
          <div className="h-3 w-full overflow-hidden rounded bg-gray-200">
            <div className="h-3 w-full animate-pulse bg-blue-600" />
          </div>
          <p className="mt-1 text-sm">Procesando archivo...</p>
        </div>
      )}

      {data.status === 'FAILED' && (
        <div className="mb-6 rounded border border-red-300 bg-red-50 p-4 text-red-800">
          <p className="font-medium">El procesamiento falló</p>
          <p>{data.errorMessage ?? 'Error desconocido'}</p>
        </div>
      )}

      {data.status === 'COMPLETED' && (
        <section>
          <h2 className="mb-3 text-xl font-semibold text-gray-900">Datos procesados</h2>
          <ResultsTable uploadId={data.id} />
        </section>
      )}
    </div>
  );
}