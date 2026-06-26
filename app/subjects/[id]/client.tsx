"use client"
import { useStudyStore, useHasHydrated } from "@/lib/store"
import ChapterCard from "@/components/chapter-card"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Skull } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { dayKey } from "@/lib/utils"
import EmptyState from "@/components/empty-state"
import { PageSkeleton } from "@/components/loading-skeleton"
import Link from "next/link"

export default function SubjectDetailClient({ id }: { id: string }) {
  const hydrated = useHasHydrated()
  const subject = useStudyStore(s=> s.subjects.find(x=>x.id===id))
  const toggleResource = useStudyStore(s=>s.toggleResource)
  const setConfidence = useStudyStore(s=>s.setConfidence)
  const revisions = useStudyStore(s=>s.revisions)

  const [bossOnly, setBossOnly] = useState(false)

  const revMap = useMemo(()=>{
    const map = new Map<string, boolean>()
    revisions.filter(r=> !r.completedAt && r.dueDate.slice(0,10) <= dayKey())
      .forEach(r=> map.set(r.chapterId, true))
    return map
  }, [revisions])

  if (!hydrated) return <PageSkeleton/>
  if (!subject) return <div className="p-6"><EmptyState emoji="🔍" title="Subject not found" ctaHref="/subjects" ctaLabel="Back to subjects" /></div>

  const bossChapters = subject.chapters.filter(c=>c.isBoss)
  const bossSlain = bossChapters.filter(c=>!!c.bossSlainAt).length
  const list = bossOnly ? subject.chapters.filter(c=>c.isBoss) : subject.chapters

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/subjects" className="text-xs text-zinc-500">← Subjects</Link>
          <h1 className="text-2xl font-bold flex items-center gap-2 mt-1">{subject.icon} {subject.name}</h1>
          <div className="text-zinc-400 text-sm">Level {subject.level} • {subject.xp} XP</div>
        </div>
        <Button variant={bossOnly ? "boss" : "secondary"} size="sm" onClick={()=>setBossOnly(!bossOnly)} className="min-h-[40px]">
          <Skull className="w-4 h-4 mr-1.5" /> Boss {bossOnly ? "✓" : `(${bossChapters.length})`}
        </Button>
      </div>

      {bossChapters.length>0 && (
        <div className="rounded-2xl border border-red-900/40 bg-red-950/10 p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-red-300 font-semibold flex items-center gap-2"><Skull className="w-4 h-4"/> Boss Progress</span>
            <span className="text-zinc-300">{bossSlain}/{bossChapters.length} slain</span>
          </div>
          <Progress value={bossChapters.length? bossSlain/bossChapters.length*100 : 0} indicatorClassName="bg-red-500" />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {list.map(ch=>(
          <ChapterCard
            key={ch.id}
            chapter={ch}
            subjectColor={subject.color}
            revisionDue={revMap.get(ch.id) || false}
            onToggle={(t)=>toggleResource(subject.id, ch.id, t)}
            onConfidence={(lvl)=>setConfidence(subject.id, ch.id, lvl)}
          />
        ))}
      </div>
      {list.length===0 && <EmptyState emoji="💀" title="No boss chapters here" description="Toggle boss filter off to see all chapters." />}
    </div>
  )
      }
    
