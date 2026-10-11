'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCreateUpload } from '@/features/document-processing/api/uploadsApi';

export function UploadForm() {
  const router = useRouter();
  const createUpload = useCreateUpload();

  const [file, setFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];

    if (!selected) {
      setFile(null);
      return;
    }

    // Validación de formato: solo .csv
    if (!selected.name.toLowerCase().endsWith('.csv')) {
      setFile(null);
      setValidationError('Solo se permiten archivos .csv');
      return;
    }

    setValidationError(null);
    setFile(selected);
  }

  function handleUpload() {
    if (!file) {
      return;
    }

    setProgress(0);
    
    createUpload.mutate(
      { file: file, onProgress: (percent) => setProgress(percent) },
      {
        onSuccess: (data) => {
          router.push('/uploads/' + data.id);
        },
      },
    );
  }

  return (
    <div className="max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <label htmlFor="csv-file" className="mb-2 block text-sm font-semibold text-gray-900">
        Archivo CSV
      </label>
      <input
        id="csv-file"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-700 file:mr-4 file:cursor-pointer file:border-0 file:bg-violet-100 file:px-4 file:py-3 file:font-semibold file:text-violet-800 hover:file:bg-violet-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
      />
      <p className="mt-2 text-xs text-gray-500">Formato permitido: .csv</p>

      {validationError && (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {validationError}
        </p>
      )}

      {file && (
        <p className="mt-4 rounded-lg bg-violet-50 p-3 text-sm text-violet-900">
          <span className="font-medium">Archivo seleccionado:</span> {file.name}
        </p>
      )}

      {createUpload.isPending && (
        <div className="mt-5">
          <div className="h-3 w-full rounded bg-gray-200">
            <div
              className="h-3 rounded bg-violet-600 transition-[width]"
              style={{ width: progress + '%' }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">Subiendo... {progress}%</p>
        </div>
      )}

      {createUpload.isError && (
        <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          No se pudo subir el archivo. Intenta de nuevo.
        </p>
      )}

      <Button
        type="button"
        onClick={handleUpload}
        disabled={!file || createUpload.isPending}
        className="mt-6 h-11 bg-violet-600 px-4 text-white hover:bg-violet-500"
      >
        Subir archivo
      </Button>
    </div>
  );
}