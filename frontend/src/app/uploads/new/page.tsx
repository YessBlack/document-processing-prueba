import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { UploadForm } from '@/features/document-processing/components/UploadForm';

export default function NewUploadPage() {
  return (
    <main className="mx-auto w-full max-w-3xl space-y-5 p-6 sm:p-8 flex flex-col gap-3">
      <Link
        href="/uploads"
        className={buttonVariants({
          variant: 'outline',
          className:
            'h-10 w-fit gap-2 border-violet-200 px-4 text-violet-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-900',
        })}
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Volver a la lista
      </Link>

      <div className='flex flex-col gap-2'>
        <h1 className="m-0 text-2xl font-bold">Archivos CSV</h1>
        <p className="m-0 text-sm italic text-gray-500">
          Consulta los archivos que has subido, revisa su estado de procesamiento y accede a sus resultados.
        </p>
      </div>

      <UploadForm />
    </main>
  );
}