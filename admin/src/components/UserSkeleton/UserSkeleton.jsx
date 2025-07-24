import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <Card key={i} className="p-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[160px]" />
          </div>
          <div className="space-x-2">
            <Skeleton className="h-8 w-20 inline-block" />
            <Skeleton className="h-8 w-20 inline-block" />
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export default LoadingSkeleton;
