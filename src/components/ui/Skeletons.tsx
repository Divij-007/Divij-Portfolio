import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-lg bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%]",
        className
      )}
      aria-hidden="true"
    />
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6 w-full" aria-label="Loading profile…" aria-busy="true">
      <Skeleton className="h-24 w-24 rounded-full mx-auto" />
      <Skeleton className="h-6 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-1/2 mx-auto" />
      <Skeleton className="h-4 w-2/3 mx-auto" />
      <div className="flex gap-2 justify-center mt-2">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-8 w-8 rounded-full" />)}
      </div>
    </div>
  );
}

export function PanelSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-6" aria-label="Loading section…" aria-busy="true">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}
