import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTableTableProps {
  length?: number;
}

export default function SkeletonTableTable({ length = 5 }: SkeletonTableTableProps) {
  return (
    <>
      {Array.from({ length }).map((_, index) => (
        <TableRow key={index}>
          {/* Số bàn */}
          <TableCell>
            <Skeleton className="h-4 w-8" />
          </TableCell>

          {/* Sức chứa */}
          <TableCell>
            <Skeleton className="h-4 w-12" />
          </TableCell>

          {/* Trạng thái */}
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>

          {/* QR Code */}
          <TableCell>
            <Skeleton className="h-12 w-12 rounded-md" />
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