import { Skeleton } from '@/components/ui/skeleton'

interface SkeletonRowsProps {
  rows?: number
  columns: number
  hasActions?: boolean
}

export const SkeletonRows = ({ rows = 5, columns, hasActions }: SkeletonRowsProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {hasActions && (
            <td className='p-4'>
              <Skeleton className='h-4 w-8 rounded-md bg-slate-200/80 dark:bg-slate-800/70' />
            </td>
          )}
          {Array.from({ length: columns }).map((_, j) => {
            const width = 40 + ((i * 17 + j * 13) % 30);

            return (
              <td key={j} className='p-4'>
                <Skeleton
                  className='h-4 rounded-md bg-slate-200/80 dark:bg-slate-800/70'
                  style={{ width: `${width}%` }}
                />
              </td>
            );
          })}
        </tr>
      ))}
    </>
  )
}
