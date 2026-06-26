"use client"
import { useStudyStore, useHasHydrated } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { dayKey } from "@/lib/utils"
import EmptyState from "@/components/empty-state"
import { PageSkeleton } from "@/components/loading-skeleton"

export default function RevisionsPage() {
  const hydrated = useHasHydrated()
  const revisions = useStudyStore(s=>s.revisions)
  const complete = useStudyStore(s=>s.completeRevision)
  const subjects = useStudyStore(s=>s.subjects)

  const today = dayKey()
  const overdue = revisions.filter(r=> !r.completedAt && r.dueDate.slice(0,10) < today)
  const dueToday = revisions.filter(r=> !r.completedAt && r.dueDate.slice(0,10)===today)
  const upcoming = revisions.filter(r=> !r.completedAt && r.dueDate.slice(0,10) > today).sort((a,b)=>a.dueDate.localeCompare(b.dueDate))
  const done = revisions.filter(r=> !!r.completedAt).sort((a,b)=>(b.completedAt||"").localeCompare(a.completedAt||"")).slice(0,20)

  if(!hydrated) return <PageSkeleton/>

  const RenderList = ({ list, showBtn=true }:{ list: typeof revisions, showBtn?:boolean }) => (
    <div className="space-y-2">
      {list.length===0 && <div className="text-zinc-500 text-sm py-2">None — clean slate!</div>}
      {list.map(r=>{
        const sub = subjects.find(s=>s.id===r.subjectId)
        const ch = sub?.chapters.find(c=>c.id===r.chapterId)
        return (
          <div key={r.id} className="flex items-center justify-between flex-wrap gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 px-3 py-3 text-sm">
            <div className="min-w-0">
              <div className="font-medium truncate">{ch?.name} <span className="text-zinc-500">• R{r.stage}</span></div>
              <div className="text-xs text-zinc-400">{sub?.name} • due {r.dueDate.slice(0,10)}</div>
            </div>
            {showBtn && !r.completedAt && <Button size="sm" className="min-h-[40px]" onClick={()=>complete(r.id)}>Done +10 XP</Button>}
            {r.completedAt && <div className="text-emerald-400 text-xs">completed</div>}
          </div>
        )
      })}
    </div>
  )

  const totalDue = overdue.length + dueToday.length

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">Spaced Revisions</h1>
          <div className="text-sm text-zinc-400">3d → 7d → 21d → 45d</div>
        </div>
        <div className="text-xs text-zinc-400">Total due: <span className={totalDue ? "text-amber-300 font-semibold":""}>{totalDue}</span></div>
      </div>

      {(overdue.length+dueToday.length+upcoming.length===0) && (
        <EmptyState emoji="🔁" title="No revisions scheduled yet" description="Complete a chapter (all 4 resources) to auto-schedule 3/7/21/45 day reviews. +10 XP each." ctaHref="/subjects" ctaLabel="Go study" />
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-red-800/30">
          <CardHeader className="pb-2"><CardTitle className="text-base text-red-300">Overdue — {overdue.length}</CardTitle></CardHeader>
          <CardContent><RenderList list={overdue}/></CardContent>
        </Card>
        <Card className="border-sky-700/30">
          <CardHeader className="pb-2"><CardTitle className="text-base">Due Today — {dueToday.length}</CardTitle></CardHeader>
          <CardContent><RenderList list={dueToday}/></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Upcoming</CardTitle></CardHeader>
        <CardContent><RenderList list={upcoming}/></CardContent>
      </Card>
      {done.length>0 && (
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Recently Completed</CardTitle></CardHeader>
        <CardContent><RenderList list={done} showBtn={false}/></CardContent>
      </Card>
      )}
    </div>
  )
        }
