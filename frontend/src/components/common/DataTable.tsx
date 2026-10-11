import { Button } from '@/components/ui/button'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useState } from 'react'
import { SkeletonRows } from '../shared/SkeletonRows'

type KeysOfUnion<T> = T extends T ? keyof T : never
interface Column<T> {
  key: KeysOfUnion<T>
  columnKey?: string
  label: string
  align?: 'left' | 'right'
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

interface Action<T> {
  label?: string
  icon?: React.ReactNode
  onClick: (row: T) => void
  className?: string
}

interface DataTableProps<T extends { id: string }> {
  data: T[]
  columns: Column<T>[]
  actions?: Action<T>[]
  caption?: string
  pageSize?: number
  isLoading?: boolean
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  actions,
  caption,
  pageSize = 10,
  isLoading = false
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(data.length / pageSize)
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const getPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, 4]
    if (currentPage >= totalPages - 2) return [totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [currentPage - 1, currentPage, currentPage + 1]
  }

  const pages = getPages()

  return (
    <div className='space-y-4'>
      <div className='rounded-md border'>
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader className='bg-muted/50'>
            <TableRow>
              {actions && (
                <TableHead className='font-semibold text-foreground w-10'></TableHead>
              )}
              {columns.map(col => (
                <TableHead
                  key={col.columnKey ?? String(col.key)}
                  className={`font-semibold text-foreground ${col.align === 'right' ? 'text-right' : ''}`}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              isLoading
                ? <SkeletonRows rows={pageSize} columns={columns.length} hasActions={!!actions} />
                : data.length === 0
                  ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length + (actions ? 1 : 0)}
                        className='h-10 text-center text-muted-foreground'
                      >
                        No hay datos para mostrar
                      </TableCell>
                    </TableRow>
                    )
                : paginatedData.map(row => (
                  <TableRow key={row.id} className='hover:bg-muted/30'>
                    {actions && (
                      <TableCell>
                        <div className='flex gap-2'>
                          {actions.map((action, i) => (
                            <Button
                              key={i}
                              onClick={() => action.onClick(row)}
                              className={action.className}
                              variant={'secondary'}
                            >
                              {action.icon}
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    )}
                    {columns.map(col => (
                      <TableCell
                        key={col.columnKey ?? String(col.key)}
                        className={col.align === 'right' ? 'text-right' : ''}
                      >
                        {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href='#'
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {pages[0] > 1 && (
              <>
                <PaginationItem>
                  <PaginationLink href='#' onClick={() => setCurrentPage(1)}>1</PaginationLink>
                </PaginationItem>
                {pages[0] > 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
              </>
            )}

            {pages.map(page => (
              <PaginationItem key={page}>
                <PaginationLink
                  href='#'
                  isActive={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {pages[pages.length - 1] < totalPages && (
              <>
                {pages[pages.length - 1] < totalPages - 1 && (
                  <PaginationItem><PaginationEllipsis /></PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink href='#' onClick={() => setCurrentPage(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                href='#'
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
