"use client"
import { Chapter, ResourceType } from "@/lib/types"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Skull, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

const RES_LABEL: Record<ResourceType,string> = {
  video: "🎥 Video",
  notes: "📝 Notes",
  pyq: "❓ PYQ",
  revise: "🔁 Revise"
}

export default function ChapterCard({
  chapter, subjectColor, onToggle, onConfidence, revisionDue
}: {
  chapter: Chapter
  subjectColor: string
  onToggle: (type: ResourceType)=>void
  onConfidence: (lvl:0|1|2|3)=>void
  revisionDue?: boolean
}) {
  const doneCount = chapter.resources.filter(r=>r.done).length
  const pct = Math.round(doneCount/4*100)
  const boss = !!chapter.isBoss

  return (
    <Card className={cn(
      "p-4 relative",
      boss && "boss-card border-red-800/40 bg-red-950/10",
      revisionDue && "rev-pulse border-sky-700/40"
    )}>
      <div className="flex items-start justify-between gap-3 mb-3 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {boss && <Skull className="w-4 h-4 text-red-400 shrink-0" />}
            {revisionDue && <RotateCcw className="w-4 h-4 text-sky-400 shrink-0" />}
            <h3 className={cn("font-semibold truncate", boss && "text-red-300")}>{chapter.name}</h3>
          </div>
          <div className="text-xs text-zinc-400 mt-1">{chapter.difficulty} • confidence {chapter.confidence}/3{chapter.bossSlainAt && " • 💀 slain"}</div>
        </div>
        <div className="text-[11px] px-2 py-1 rounded-full bg-zinc-800 shrink-0">{pct}%</div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {chapter.resources.map(r=>(
          <Button
            key={r.type}
            size="sm"
            variant={r.done ? "neon" : "outline"}
            onClick={()=>onToggle(r.type)}
            className={cn("min-h-[44px] text-xs", boss && !r.done && "border-red-700/40")}
          >
            {RES_LABEL[r.type]}{r.done ? " ✓":""}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {[0,1,2,3].map(n=>(
          <button
            key={n}
            onClick={()=>onConfidence(n as 0|1|2|3)}
            className={cn(
              "w-9 h-9 rounded-full text-xs border touch-manipulation",
              chapter.confidence >= n ? "text-black border-transparent" : "border-zinc-700 text-zinc-400 bg-zinc-900"
            )}
            style={chapter.confidence >= n ? { background: subjectColor } : {}}
            aria-label={`confidence ${n}`}
          >{n}</button>
        ))}
        <span className="ml-1 text-xs text-zinc-500">confidence</span>
      </div>

      {boss && (
        <div className="mt-3 text-[11px] text-red-300/90 tracking-wide leading-relaxed">
          BOSS CHAPTER — complete all resources + confidence ≥2 to slay
        </div>
      )}
      {revisionDue && (
        <div className="mt-2 text-[11px] text-sky-300">🔁 Revision due</div>
      )}
    </Card>
  )
}
