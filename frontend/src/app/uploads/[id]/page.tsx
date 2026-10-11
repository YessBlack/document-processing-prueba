import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { UploadDetail } from '@/features/document-processing/components/UploadDetail';

export default async function UploadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="space-y-5 p-8 flex flex-col gap-2">
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
      <h1 className="text-2xl font-bold">Detalle del upload</h1>
      <UploadDetail id={id} />
    </main>
  );
}