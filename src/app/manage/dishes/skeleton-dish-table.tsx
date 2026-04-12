import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonDishTableProps {
  length?: number;
}

export default function SkeletonDishTable({ length = 5 }: SkeletonDishTableProps) {
  return (
    <>
      {Array.from({ length }).map((_, index) => (
        <TableRow key={index}>
          {/* ID */}
          <TableCell>
            <Skeleton className="h-4 w-6" />
          </TableCell>

          {/* Ảnh */}
          <TableCell>
            <Skeleton className="h-12 w-12 rounded-md" />
          </TableCell>

          {/* Tên */}
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>

          {/* Giá */}
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>

          {/* Mô tả */}
          <TableCell>
            <Skeleton className="h-4 w-48" />
          </TableCell>

          {/* Danh mục */}
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>

          {/* Trạng thái */}
          <TableCell>
            <Skeleton className="h-4 w-16" />
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