'use client';

import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export type Column<T> = {
  key: keyof T;
  columnKey?: string;
  label: string;
  align?: 'left' | 'right';
  className?: string;
  headerClassName?: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
};

type Action<T> = {
  label?: string;
  icon?: ReactNode;
  onClick: (row: T) => void;
  className?: string;
};

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  caption?: string;
  pageSize?: number;
  isLoading?: boolean;
  emptyMessage?: string;
  getRowId?: (row: T, index: number) => string | number;
  totalCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({
  data,
  columns,
  actions,
  caption,
  pageSize = 10,
  isLoading = false,
  emptyMessage = 'No hay datos para mostrar',
  getRowId,
  totalCount,
  currentPage,
  onPageChange,
}: DataTableProps<T>) {
  const [internalPage, setInternalPage] = useState(1);
  const safePageSize = Math.max(1, pageSize);
  const page = currentPage ?? internalPage;
  const totalPages = Math.max(1, Math.ceil((totalCount ?? data.length) / safePageSize));
  const visiblePage = Math.min(Math.max(1, page), totalPages);
  const isServerPaginated = totalCount !== undefined && onPageChange !== undefined;
  const rows = isServerPaginated
    ? data
    : data.slice((visiblePage - 1) * safePageSize, visiblePage * safePageSize);
  const columnCount = columns.length + (actions ? 1 : 0);

  function changePage(nextPage: number) {
    const boundedPage = Math.min(Math.max(1, nextPage), totalPages);
    if (onPageChange) {
      onPageChange(boundedPage);
    } else {
      setInternalPage(boundedPage);
    }
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader>
            <TableRow className="border-b border-violet-200 bg-violet-100 hover:bg-violet-100">
              {actions && (
                <TableHead className="h-12 w-10 border-r border-violet-200 px-4 text-violet-950" />
              )}
              {columns.map((column) => (
                <TableHead
                  key={column.columnKey ?? String(column.key)}
                  className={`h-12 border-r border-violet-200 px-4 text-xs font-semibold tracking-wide text-violet-950 uppercase last:border-r-0 ${
                    column.align === 'right' ? 'text-right' : ''
                  } ${column.headerClassName ?? ''}`}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: Math.min(safePageSize, 10) }, (_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`} className="border-b border-gray-200">
                  {Array.from({ length: columnCount }, (_, cellIndex) => (
                    <TableCell key={`skeleton-${rowIndex}-${cellIndex}`} className="px-4 py-3">
                      <div className="h-4 animate-pulse rounded bg-gray-200" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow className="hover:bg-white">
                <TableCell colSpan={Math.max(1, columnCount)} className="h-16 text-center text-gray-500">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, rowIndex) => (
                <TableRow
                  key={getRowId ? getRowId(row, rowIndex) : rowIndex}
                  className="border-b border-gray-200 even:bg-gray-50/70 hover:bg-violet-50/70"
                >
                  {actions && (
                    <TableCell className="border-r border-gray-200 px-4 py-3">
                      <div className="flex gap-2">
                        {actions.map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            type="button"
                            variant="ghost"
                            aria-label={action.label ?? 'Acción'}
                            onClick={() => action.onClick(row)}
                            className={action.className}
                          >
                            {action.icon}
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.columnKey ?? String(column.key)}
                      className={`border-r border-gray-200 px-4 py-3 last:border-r-0 ${
                        column.align === 'right' ? 'text-right' : ''
                      } ${column.className ?? ''}`}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : String(row[column.key] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            className="border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-900"
            onClick={() => changePage(visiblePage - 1)}
            disabled={visiblePage <= 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-gray-600">
            Página {visiblePage} de {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            className="border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-900"
            onClick={() => changePage(visiblePage + 1)}
            disabled={visiblePage >= totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
