import { Skeleton } from "@/components/ui/skeleton";

type CategoryGridSkeletonProps = {
  count?: number;
};

export function CategoryGridSkeleton({
  count = 10,
}: CategoryGridSkeletonProps) {
  return (
    <div className="grid grid-cols-5 gap-x-1 gap-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <div className="w-full">
            <Skeleton className="aspect-square w-full rounded-full border-2 border-[#3a2e23] bg-[#2b231d]" />
          </div>
          <Skeleton className="h-2.5 w-[70%] rounded-full bg-[#3a3028]" />
        </div>
      ))}
    </div>
  );
}
