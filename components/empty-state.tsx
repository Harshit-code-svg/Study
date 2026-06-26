"use client"
import { Button } from "./ui/button"
import Link from "next/link"

export default function EmptyState({
  emoji = "📭",
  title,
  description,
  ctaHref,
  ctaLabel,
}: {
  emoji?: string
  title: string
  description?: string
  ctaHref?: string
  ctaLabel?: string
}) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 px-6 py-10 text-center">
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="font-semibold">{title}</div>
      {description && <div className="text-sm text-zinc-400 mt-1 max-w-sm mx-auto">{description}</div>}
      {ctaHref && ctaLabel && (
        <div className="mt-4">
          <Link href={ctaHref}><Button size="sm">{ctaLabel}</Button></Link>
        </div>
      )}
    </div>
  )
}
