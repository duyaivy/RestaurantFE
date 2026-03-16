import { Skeleton } from "@/components/ui/skeleton";

type MenuListSkeletonProps = {
  count?: number;
};

function MenuCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-[28px] border border-[#2b221b] bg-[#15110e] p-3 shadow-sm">
      <Skeleton className="size-24 rounded-[20px] bg-[#3a3028]" />

      <div className="flex min-h-24 flex-1 flex-col justify-between">
        <div className="space-y-3">
          <Skeleton className="h-6 w-40 rounded-md bg-[#3a3028]" />
          <Skeleton className="h-5 w-56 rounded-md bg-[#2f2721]" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-32 rounded-md bg-[#3a3028]" />
          <Skeleton className="h-9 w-9 rounded-xl bg-[#6b541c]" />
        </div>
      </div>
    </div>
  );
}

export default function MenuListSkeleton({ count = 4 }: MenuListSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <MenuCardSkeleton key={index} />
      ))}
    </div>
  );
}
