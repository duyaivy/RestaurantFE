import { Skeleton } from "@/shared/ui/skeleton";
import { TableCell, TableRow } from "@/shared/ui/table";

interface DishTableSkeletonProps {
  rows?: number;
}

const DISH_TABLE_SKELETON_ROWS = 10;

export default function DishTableSkeleton({
  rows = DISH_TABLE_SKELETON_ROWS,
}: DishTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="hover:bg-transparent">
          <TableCell>
            <Skeleton className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <Skeleton className="size-[100px] rounded-md" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-20" />
          </TableCell>
          <TableCell>
            <div className="space-y-2">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-14" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-14 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="size-8 rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
