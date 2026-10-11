import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { UploadList } from '@/features/document-processing/components/UploadList';

export default function UploadsPage() {
  return (
    <main className="space-y-5 p-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1 py-2 sm:pr-6">
          <h1 className="m-0 text-2xl font-bold">Archivos CSV</h1>
          <p className="m-0 text-sm italic text-gray-500">
            Consulta los archivos que has subido, revisa su estado de procesamiento y accede a sus resultados.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className={buttonVariants({
              variant: 'outline',
              className:
                'h-11 border-violet-200 px-4 text-violet-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-900',
            })}
          >
            <ArrowLeft className="mr-2 size-4" />
            Volver al inicio
          </Link>
          <Link
            href="/uploads/new"
            className={buttonVariants({
              className: 'h-11 bg-violet-600 px-4 text-white hover:bg-violet-500',
            })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo upload
          </Link>
        </div>
      </div>
      <UploadList />
    </main>
  );
}