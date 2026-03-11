"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";

export function DashboardSkeleton() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
        {/* Section Cards */}
        <div className="grid grid-cols-4 gap-4 @md/main:grid-cols-2 @sm/main:grid-cols-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border h-44 p-4 flex flex-col gap-3"
            >
              <Skeleton className="h-36 w-full" />
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="rounded-xl border p-4 flex flex-col gap-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-72" />
          <Skeleton className="h-52 w-full" />
        </div>

        {/* Chart 2 */}
        <div className="rounded-xl border p-4 flex flex-col gap-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-72" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Chart 3 */}
        <div className="rounded-xl border p-4 flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </>
  );
}
