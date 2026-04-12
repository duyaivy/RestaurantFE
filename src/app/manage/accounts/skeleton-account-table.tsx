import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonAccountTableProps {
  length?: number;
}

export default function SkeletonAccountTable({ length = 5 }: SkeletonAccountTableProps) {
  return (
    <>
      {Array.from({ length }).map((_, index) => (
        <TableRow key={index}>
          {/* ID */}
          <TableCell>
            <Skeleton className="h-4 w-6" />
          </TableCell>

          {/* Avatar */}
          <TableCell>
            <Skeleton className="h-12 w-12 rounded-md" />
          </TableCell>

          {/* Tên */}
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>

          {/* Email */}
          <TableCell>
            <Skeleton className="h-4 w-48" />
          </TableCell>

          {/* Action */}
          <TableCell>
            <Skeleton className="h-8 w-8 rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}