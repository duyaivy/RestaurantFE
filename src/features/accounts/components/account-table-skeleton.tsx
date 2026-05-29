import { Skeleton } from "@/shared/ui/skeleton";
import { TableCell, TableRow } from "@/shared/ui/table";

interface AccountTableSkeletonProps {
  rows?: number;
}

const ACCOUNT_TABLE_SKELETON_ROWS = 10;

export default function AccountTableSkeleton({
  rows = ACCOUNT_TABLE_SKELETON_ROWS,
}: AccountTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="hover:bg-transparent">
          <TableCell>
            <Skeleton className="h-5 w-5" />
          </TableCell>
          <TableCell>
            <Skeleton className="size-25 rounded-md" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="size-8 rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
