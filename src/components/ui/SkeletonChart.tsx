import { Skeleton } from "./skeleton"

export const SkeletonChart = () => {
    return (
        <div className="w-full h-full space-y-4 animate-pulse">
            <div className="flex items-end space-x-2 h-48 w-full pt-10">
                <Skeleton className="h-[40%] w-full" />
                <Skeleton className="h-[70%] w-full" />
                <Skeleton className="h-[50%] w-full" />
                <Skeleton className="h-[90%] w-full" />
                <Skeleton className="h-[60%] w-full" />
                <Skeleton className="h-[80%] w-full" />
                <Skeleton className="h-[45%] w-full" />
                <Skeleton className="h-[75%] w-full" />
                <Skeleton className="h-[55%] w-full" />
                <Skeleton className="h-[85%] w-full" />
                <Skeleton className="h-[65%] w-full" />
                <Skeleton className="h-[95%] w-full" />
            </div>
            <div className="flex justify-between w-full">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
            </div>
        </div>
    )
}
