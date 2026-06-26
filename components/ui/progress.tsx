"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export function Progress({ value = 0, className, indicatorClassName }: { value?: number; className?: string; indicatorClassName?: string }) {
  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-zinc-800", className)}>
      <div
        className={cn("h-full w-full flex-1 bg-primary transition-all", indicatorClassName)}
        style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0,value))}%)` }}
      />
    </div>
  )
}
