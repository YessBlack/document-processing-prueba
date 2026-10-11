'use client';

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { useUploadsSummary } from '@/features/document-processing/api/uploadsApi';

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border p-4">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

export function Dashboard() {
  const { data, isLoading, isError } = useUploadsSummary();

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (isError || !data) {
    return <p className="text-red-600">No se pudo cargar el resumen.</p>;
  }

  return (
    <div>
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard label="Total de uploads" value={data.total} />
        <SummaryCard label="Completados" value={data.completed} />
        <SummaryCard label="En proceso" value={data.processing} />
        <SummaryCard label="Fallidos" value={data.failed} />
      </div>

      <div className="flex gap-4">
        <Link
          href="/uploads/new"
          className={buttonVariants({
            className: 'h-11 bg-violet-600 px-4 text-white hover:bg-violet-500',
          })}
        >
          Nuevo upload
        </Link>
        <Link
          href="/uploads"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
        >
          Ver todos los uploads
        </Link>
      </div>
    </div>
  );
}