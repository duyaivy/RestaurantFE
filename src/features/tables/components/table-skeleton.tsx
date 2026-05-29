import { Skeleton } from "@/shared/ui/skeleton";
import { TableCell, TableRow } from "@/shared/ui/table";

interface TableSkeletonProps {
  rows?: number;
}

const TABLE_SKELETON_ROWS = 5;

export default function TableSkeleton({
  rows = TABLE_SKELETON_ROWS,
}: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="hover:bg-transparent">
          <TableCell>
            <Skeleton className="h-5 w-12" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-24 rounded-full" />
          </TableCell>
          <TableCell>
            <div className="space-y-3">
              <Skeleton className="aspect-square w-[250px] max-w-[42vw] rounded-md" />
              <div className="space-y-2">
                <Skeleton className="mx-auto h-4 w-20" />
                <Skeleton className="mx-auto h-4 w-40 max-w-full" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex justify-end">
              <Skeleton className="size-8 rounded-md" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
