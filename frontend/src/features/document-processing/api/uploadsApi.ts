import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/lib/api-client';
import type {
  CreateUploadResponse,
  UploadDetail,
  UploadListResponse,
  UploadResultsResponse,
  UploadsSummary,
} from '@/features/document-processing/types/upload.types';

export function useUploads(page: number, limit: number) {
  return useQuery({
    queryKey: ['uploads', 'list', page, limit],
    queryFn: async () => {
      const response = await apiClient.get<UploadListResponse>('/uploads', {
        params: { page: page, limit: limit },
      });
      return response.data;
    },
  });
}

export function useUpload(id: string) {
  return useQuery({
    queryKey: ['uploads', 'detail', id],
    queryFn: async () => {
      const response = await apiClient.get<UploadDetail>('/uploads/' + id);
      return response.data;
    },

    // Polling: vuelve a pedir cada 3 segundos mientras no haya terminado
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'PENDING' || status === 'PROCESSING') {
        return 3000;
      }
      return false;
    },
  });
}

export function useUploadResults(id: string, enabled: boolean) {
  return useQuery({
    queryKey: ['uploads', 'results', id],
    queryFn: async () => {
      const response = await apiClient.get<UploadResultsResponse>(
        '/uploads/' + id + '/results',
      );
      return response.data;
    },
    enabled: enabled,
  });
}

export function useUploadsSummary() {
  return useQuery({
    queryKey: ['uploads', 'summary'],
    queryFn: async () => {
      const response = await apiClient.get<UploadsSummary>('/uploads/summary');
      return response.data;
    },
  });
}

interface CreateUploadInput {
  file: File;
  onProgress: (percent: number) => void;
}

export function useCreateUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateUploadInput) => {
      const formData = new FormData();
      formData.append('file', input.file);

      const response = await apiClient.post<CreateUploadResponse>('/uploads', formData, {
        onUploadProgress: (event) => {
          if (event.total) {
            input.onProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      });
      
      return response.data;
    },
    onSuccess: () => {
      // Los datos en caché ya quedaron viejos: se vuelven a pedir
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
    },
  });
}