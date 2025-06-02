import { Skeleton } from "@/components/ui/skeleton"

export default function ChatsLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Chat sidebar skeleton */}
      <div className="w-full md:w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="overflow-y-auto flex-1">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="p-3 border-b border-border flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-5 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex flex-col items-end">
                  <Skeleton className="h-4 w-12 mb-1" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Chat area skeleton */}
      <div className="hidden md:flex flex-col flex-1">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className={`flex mb-4 ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full mr-2 mt-1" />}
                <div className={`max-w-[70%] ${i % 2 === 0 ? "" : "ml-auto"}`}>
                  <Skeleton
                    className={`h-auto p-3 rounded-lg ${i % 2 === 0 ? "rounded-tl-none" : "rounded-tr-none"}`}
                    style={{
                      width: `${Math.floor(Math.random() * 150) + 100}px`,
                      height: `${Math.floor(Math.random() * 40) + 40}px`,
                    }}
                  />
                  <Skeleton className="h-3 w-16 mt-1 ml-auto" />
                </div>
              </div>
            ))}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-12" />
          </div>
        </div>
      </div>

      {/* Empty state for mobile */}
      <div className="hidden md:flex-1 md:hidden items-center justify-center">
        <div className="text-center p-8">
          <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-6 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    </div>
  )
}
