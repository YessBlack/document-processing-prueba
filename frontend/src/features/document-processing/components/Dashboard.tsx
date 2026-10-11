'use client';

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { useUploadsSummary } from '@/features/document-processing/api/uploadsApi';

function SummaryCard({
  label,
  description,
  value,
  accentClass,
}: {
  label: string;
  description: string;
  value: number;
  accentClass: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 pb-7 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-gray-800">{label}</h2>
        <p className="shrink-0 text-3xl font-bold tabular-nums text-gray-950">{value}</p>
      </div>
      <p className="mt-2 text-sm leading-5 text-gray-500">{description}</p>
      <div aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-1 ${accentClass}`} />
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
        <SummaryCard
          label="Total de archivos"
          description="Todos los archivos CSV que has subido."
          value={data.total}
          accentClass="bg-violet-500"
        />
        <SummaryCard
          label="Completados"
          description="Archivos procesados correctamente y listos para consultar."
          value={data.completed}
          accentClass="bg-emerald-500"
        />
        <SummaryCard
          label="En proceso"
          description="Archivos que se están validando o procesando."
          value={data.processing}
          accentClass="bg-blue-500"
        />
        <SummaryCard
          label="Fallidos"
          description="Archivos cuyo procesamiento terminó con errores."
          value={data.failed}
          accentClass="bg-red-500"
        />
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